const User = require('../models/User');
const MembershipApplication = require('../models/MembershipApplication');
const CoordinatorApplication = require('../models/CoordinatorApplication');
const applicationService = require('../services/applicationService');
const { sendCoordinatorApprovalEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');

/**
 * 1. Admin: Get all Coordinators with stats of members they enrolled
 */
const getCoordinators = async (req, res) => {
  try {
    const coordinators = await User.find({
      $or: [
        { role: 'Coordinator' },
        { isCoordinator: true },
        { coordinatorId: { $exists: true, $ne: null } }
      ]
    }).select('-password').sort({ createdAt: -1 });

    const results = await Promise.all(
      coordinators.map(async (c) => {
        const cObj = c.toObject();
        const [totalAdded, approvedCount, pendingCount] = await Promise.all([
          MembershipApplication.countDocuments({ addedByCoordinator: c._id }),
          MembershipApplication.countDocuments({ addedByCoordinator: c._id, status: 'approved' }),
          MembershipApplication.countDocuments({ addedByCoordinator: c._id, status: 'pending' })
        ]);

        return {
          ...cObj,
          membersCount: totalAdded,
          approvedCount,
          pendingCount
        };
      })
    );

    return res.json({ success: true, coordinators: results, total: results.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Admin & Coordinator: Get all members enrolled by a specific coordinator
 */
const getCoordinatorMembers = async (req, res) => {
  try {
    const { id } = req.params;

    // Security check: If not admin, verify coordinator is requesting own data
    if (req.user && req.user.role?.toLowerCase() !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view other coordinators members.' });
    }

    const coordinator = await User.findById(id).select('name email phone coordinatorId');
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordinator not found' });
    }

    const members = await MembershipApplication.find({
      $or: [
        { addedByCoordinator: id },
        { coordinatorId: coordinator.coordinatorId }
      ]
    }).populate('plan').sort({ createdAt: -1 });

    return res.json({
      success: true,
      coordinator,
      members,
      total: members.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Logged-in Coordinator: Get members enrolled by self
 */
const getMyEnrolledMembers = async (req, res) => {
  try {
    const coordinatorId = req.user?.id;
    if (!coordinatorId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const coordinator = await User.findById(coordinatorId);
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordinator profile not found' });
    }

    const members = await MembershipApplication.find({
      $or: [
        { addedByCoordinator: coordinatorId },
        { coordinatorId: coordinator.coordinatorId }
      ]
    }).populate('plan').sort({ createdAt: -1 });

    return res.json({
      success: true,
      coordinator: {
        name: coordinator.name,
        coordinatorId: coordinator.coordinatorId,
        email: coordinator.email,
        phone: coordinator.phone,
        area: coordinator.coordinatorArea
      },
      members,
      total: members.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Coordinator / Admin: Add a new member (pending Admin final approval)
 */
const addMemberByCoordinator = async (req, res) => {
  try {
    const coordinatorUser = await User.findById(req.user.id);
    if (!coordinatorUser) {
      return res.status(404).json({ success: false, message: 'Coordinator account not found' });
    }

    // Attach coordinator attribution
    const memberData = {
      ...req.body,
      addedByCoordinator: coordinatorUser._id,
      coordinatorName: coordinatorUser.name,
      coordinatorId: coordinatorUser.coordinatorId || coordinatorUser.memberId || 'COORDINATOR',
      isAddedByCoordinator: true
    };

    const application = await applicationService.applyMembership(null, memberData);

    return res.status(201).json({
      success: true,
      message: `Member application for ${memberData.name} registered successfully! Status is pending final Admin review and approval.`,
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 5. Admin: Promote existing user to Coordinator
 */
const promoteExistingUserToCoordinator = async (req, res) => {
  try {
    const { userId, designation, coordinatorArea } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required to assign Coordinator role.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const coordinatorId = (user.coordinatorId && user.coordinatorId.startsWith('APVAF-CRD-'))
      ? user.coordinatorId
      : await applicationService.generateUniqueCoordinatorId();

    user.role = 'Coordinator';
    user.isCoordinator = true;
    user.coordinatorId = coordinatorId;
    user.coordinatorStatus = 'active';
    user.status = 'active';
    user.coordinatorArea = coordinatorArea || user.coordinatorArea || user.district || 'Regional Operations';
    user.designation = designation || user.designation || 'District / Field Coordinator';
    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;
    user.verifiedAt = new Date();
    user.verifiedBy = req.user?.name || 'Trustee Admin';

    let generatedPassword = null;
    if (!user.password) {
      const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
      user.password = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;
    }

    const qrData = `https://apnaparivarvriddhaashram.org/verify/coordinator/${coordinatorId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }

    await user.save();

    // Auto send official appointment letter, ID card & email asynchronously
    try {
      const emailPayload = user.toObject();
      if (generatedPassword) emailPayload.temporaryPassword = generatedPassword;
      sendCoordinatorApprovalEmail(emailPayload).catch(err => {
        console.warn('Coordinator appointment email notice:', err.message);
      });
    } catch (e) {
      console.warn('Coordinator appointment email dispatch warning:', e.message);
    }

    const { password: _, ...userSafe } = user.toObject();
    return res.json({
      success: true,
      message: `${user.name} has been assigned Coordinator role (${coordinatorId})! Appointment Letter & ID Card generated and emailed.`,
      user: userSafe
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 6. Admin: Create brand new Coordinator from scratch
 */
const createNewCoordinator = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      designation,
      coordinatorArea,
      bloodGroup,
      dob,
      address,
      district,
      state,
      photoUrl,
      documentType,
      documentFront,
      documentBack
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, Email and Mobile Number are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address or phone number already exists in the system.'
      });
    }

    const rawPassword = password || ('APVAF@' + Math.floor(100000 + Math.random() * 900000));
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const coordinatorId = await applicationService.generateUniqueCoordinatorId();

    const qrData = `https://apnaparivarvriddhaashram.org/verify/coordinator/${coordinatorId}`;
    let qrCodeUrl = '';
    try {
      qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      qrCodeUrl = '';
    }

    const newCoordinator = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'Coordinator',
      status: 'active',
      isCoordinator: true,
      coordinatorId,
      coordinatorStatus: 'active',
      coordinatorArea: coordinatorArea || district || 'Regional Operations',
      designation: designation || 'District / Field Coordinator',
      bloodGroup: bloodGroup || 'O+',
      dob: dob || '1995-01-01',
      address: address || '',
      district: district || 'Aligarh',
      state: state || 'Uttar Pradesh',
      photoUrl: photoUrl || '',
      documentType: documentType || 'Aadhaar Card',
      documentFront: documentFront || '',
      documentBack: documentBack || '',
      idCardGenerated: true,
      appointmentLetterGenerated: true,
      qrCodeUrl,
      verifiedAt: new Date(),
      verifiedBy: req.user?.name || 'Trustee Admin'
    });

    // Auto send official appointment letter, ID card & login credentials via email asynchronously
    try {
      const emailPayload = newCoordinator.toObject();
      emailPayload.temporaryPassword = rawPassword;
      sendCoordinatorApprovalEmail(emailPayload).catch(err => {
        console.warn('Coordinator onboarding email warning:', err.message);
      });
    } catch (e) {
      console.warn('Coordinator onboarding email dispatch warning:', e.message);
    }

    const { password: _, ...userSafe } = newCoordinator.toObject();

    return res.status(201).json({
      success: true,
      message: `New Coordinator ${newCoordinator.name} created successfully with ID ${coordinatorId}! Appointment letter and credentials sent to ${cleanEmail}.`,
      user: userSafe,
      temporaryPassword: rawPassword
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 7. Admin: Update Coordinator Details
 */
const updateCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, designation, coordinatorArea, coordinatorStatus, status, photoUrl } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Coordinator account not found' });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (designation) user.designation = designation.trim();
    if (coordinatorArea) user.coordinatorArea = coordinatorArea.trim();
    if (coordinatorStatus) user.coordinatorStatus = coordinatorStatus;
    if (status) user.status = status;
    if (photoUrl) user.photoUrl = photoUrl;

    await user.save();

    const { password: _, ...userSafe } = user.toObject();
    return res.json({
      success: true,
      message: `Coordinator profile for ${user.name} updated successfully!`,
      coordinator: userSafe
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 8. Admin: Toggle Coordinator Status (active <-> suspended)
 */
const toggleCoordinatorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Coordinator account not found' });
    }

    const currentStatus = user.coordinatorStatus || 'active';
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    user.coordinatorStatus = newStatus;
    user.status = newStatus === 'active' ? 'active' : 'suspended';
    await user.save();

    return res.json({
      success: true,
      message: `Coordinator ${user.name} status updated to ${newStatus.toUpperCase()}`,
      coordinatorStatus: newStatus,
      status: user.status
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 9. Admin: Resend Official Appointment Letter, ID Card & Credentials Email
 */
const resendCoordinatorCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Coordinator account not found' });
    }

    let temporaryPassword = null;
    if (newPassword && newPassword.trim()) {
      temporaryPassword = newPassword.trim();
      user.password = await bcrypt.hash(temporaryPassword, 10);
      await user.save();
    } else if (!user.password) {
      temporaryPassword = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
      user.password = await bcrypt.hash(temporaryPassword, 10);
      await user.save();
    }

    const emailPayload = user.toObject();
    if (temporaryPassword) {
      emailPayload.temporaryPassword = temporaryPassword;
    }

    await sendCoordinatorApprovalEmail(emailPayload);

    return res.json({
      success: true,
      message: `Official Appointment Letter, ID Card & Credentials successfully sent to ${user.email}!`,
      temporaryPassword
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 10. Admin: Revoke Coordinator Privileges
 */
const deleteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Coordinator account not found' });
    }

    user.role = 'Member';
    user.isCoordinator = false;
    user.coordinatorStatus = 'revoked';
    await user.save();

    return res.json({
      success: true,
      message: `Coordinator authority revoked for ${user.name}. Account reverted to standard Member.`
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 11. Coordinator / Admin: Edit Member Images / KYC Documents (Only while pending approval)
 */
const updateMemberImages = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await MembershipApplication.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Enrolled member application not found' });
    }

    // Check authorization: Admin or the Coordinator who enrolled the member
    const isAdmin = req.user?.role?.toLowerCase() === 'admin';
    const isEnroller = (
      req.user && member.addedByCoordinator &&
      member.addedByCoordinator.toString() === req.user.id.toString()
    );

    if (!isAdmin && !isEnroller) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify documents for this member.' });
    }

    // STRICT RULE: Cannot edit images once member application is approved by Admin!
    if (member.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Member application is already APPROVED by Admin. Official documents are locked and cannot be edited.'
      });
    }

    const { photoUrl, documentFront, documentBack, paymentScreenshot, idProofUrl } = req.body;

    if (photoUrl) member.photoUrl = photoUrl;
    if (documentFront) {
      member.documentFront = documentFront;
      member.idProofUrl = documentFront;
    }
    if (idProofUrl && !documentFront) {
      member.documentFront = idProofUrl;
      member.idProofUrl = idProofUrl;
    }
    if (documentBack) member.documentBack = documentBack;
    if (paymentScreenshot) member.paymentScreenshot = paymentScreenshot;

    await member.save();

    // Also update linked user profile if exists
    const userId = member.user?._id || member.user || member.userId;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (photoUrl) user.photoUrl = photoUrl;
        if (documentFront) user.documentFront = documentFront;
        if (documentBack) user.documentBack = documentBack;
        await user.save();
      }
    }

    return res.json({
      success: true,
      message: `Documents for member ${member.name} updated successfully!`,
      member
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 12. Coordinator: Delete enrolled member application (only allowed until admin has approved)
 */
const deleteMemberByCoordinator = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await MembershipApplication.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Enrolled member application not found' });
    }

    // Check authorization: Admin or the Coordinator who enrolled the member
    const isAdmin = req.user?.role?.toLowerCase() === 'admin';
    const isEnroller = (
      req.user && member.addedByCoordinator &&
      member.addedByCoordinator.toString() === req.user.id.toString()
    );

    if (!isAdmin && !isEnroller) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this member application.' });
    }

    // STRICT RULE: Cannot delete once member application is approved by Admin!
    if (member.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Member application is already APPROVED by Admin. Deletion is locked and cannot be removed.'
      });
    }

    await applicationService.deleteMembershipApplication(memberId);

    return res.json({
      success: true,
      message: `Member application for ${member.name} has been deleted successfully.`
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCoordinators,
  getCoordinatorMembers,
  getMyEnrolledMembers,
  addMemberByCoordinator,
  promoteExistingUserToCoordinator,
  createNewCoordinator,
  updateCoordinator,
  toggleCoordinatorStatus,
  resendCoordinatorCredentials,
  deleteCoordinator,
  updateMemberImages,
  deleteMemberByCoordinator
};

