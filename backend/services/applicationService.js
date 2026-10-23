const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const applicationRepository = require('../repositories/applicationRepository');
const userRepository = require('../repositories/userRepository');
const planRepository = require('../repositories/planRepository');
const { 
  sendMembershipApprovalEmail, 
  sendVolunteerApprovalEmail,
  sendGuestApplicationCredentialsEmail 
} = require('./emailService');

class ApplicationService {
  async applyMembership(userId, appData) {
    const { 
      planId, 
      paymentScreenshot, 
      utrNumber, 
      bloodGroup, 
      dob, 
      address, 
      district, 
      state, 
      photoUrl, 
      designation,
      name,
      email,
      phone
    } = appData;

    const finalScreenshot = paymentScreenshot || appData.paymentProof || appData.screenshotUrl;
    const finalUtr = utrNumber || appData.transactionId || '';
    const finalPhoto = photoUrl || appData.userPhoto || appData.avatar || '';
    const finalDocType = appData.documentType || 'Aadhaar Card';
    const finalDocFront = appData.documentFront || appData.idProofUrl || '';
    const finalDocBack = appData.documentBack || '';

    if (!planId) throw new Error('Please select a membership plan');
    if (!finalScreenshot && !finalUtr) throw new Error('Payment screenshot or transaction UTR is mandatory for verification');

    const plan = await planRepository.findById(planId);
    if (!plan) throw new Error('Selected membership plan not found');

    let user = userId ? await userRepository.findById(userId) : null;
    const applicantEmail = (email || user?.email || '').toLowerCase().trim();
    const applicantPhone = (phone || user?.phone || '').trim();
    const applicantName = (name || user?.name || '').trim();

    let generatedPassword = null;
    let isUpdatedPassword = false;

    if (!userId) {
      // GUEST APPLICATION (User NOT logged in)
      if (!applicantName || (!applicantEmail && !applicantPhone)) {
        throw new Error('Please provide your Name, Email, and Mobile Number for membership enrollment.');
      }

      if (applicantEmail) {
        user = await userRepository.findByEmail(applicantEmail);
      }

      const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;

      if (user) {
        // User already exists in database! Since applicant applied without logging in:
        // "if user not login and apply for all then last mail password is valid"
        user.password = hashedPassword;
        isUpdatedPassword = true;
        if (applicantName) user.name = applicantName;
        if (applicantPhone) user.phone = applicantPhone;
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (dob) user.dob = dob;
        if (address) user.address = address;
        user.district = district || user.district || 'Jabalpur';
        user.state = state || user.state || 'Madhya Pradesh';
        if (finalPhoto) user.photoUrl = finalPhoto;
        if (finalDocType) user.documentType = finalDocType;
        if (finalDocFront) user.documentFront = finalDocFront;
        if (finalDocBack) user.documentBack = finalDocBack;
        user.membershipPlan = plan.title || plan.name || 'Membership Plan';
        user.feeAmount = plan.price || plan.fee || 1100;
        user.feePaid = true;
        user.status = user.status === 'active' ? 'active' : 'pending';
        await user.save();
      } else {
        // Create new User account
        user = await userRepository.create({
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone || '9999999999',
          password: hashedPassword,
          role: 'Member',
          status: 'pending',
          isMember: false,
          bloodGroup: bloodGroup || 'O+',
          dob: dob || '2000-01-01',
          address: address || '',
          district: district || 'Jabalpur',
          state: state || 'Madhya Pradesh',
          photoUrl: finalPhoto || '',
          documentType: finalDocType,
          documentFront: finalDocFront,
          documentBack: finalDocBack,
          designation: designation || `${plan.title || plan.name} Member`,
          membershipPlan: plan.title || plan.name || 'Membership Plan',
          feeAmount: plan.price || plan.fee || 1100,
          feePaid: true,
          idCardGenerated: false,
          appointmentLetterGenerated: false
        });
      }

      // Send credentials email to applicant
      if (applicantEmail) {
        sendGuestApplicationCredentialsEmail({
          to: applicantEmail,
          name: user.name,
          temporaryPassword: generatedPassword,
          applicationType: 'Membership',
          isUpdatedPassword
        }).catch(err => console.warn('Guest membership credentials email dispatch notice:', err.message));
      }
    } else {
      // USER IS LOGGED IN
      // "if user is login and apply then her password not change"
      if (user) {
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (dob) user.dob = dob;
        if (address) user.address = address;
        if (district) user.district = district;
        if (state) user.state = state;
        if (finalPhoto) user.photoUrl = finalPhoto;
        if (finalDocType) user.documentType = finalDocType;
        if (finalDocFront) user.documentFront = finalDocFront;
        if (finalDocBack) user.documentBack = finalDocBack;
        if (designation) user.designation = designation;

        user.membershipPlan = plan.title || plan.name || 'Membership Plan';
        user.feeAmount = plan.price || plan.fee || 1100;
        user.feePaid = true;
        await user.save();
      }
    }

    const application = await applicationRepository.createMembershipApp({
      user: user?._id || null,
      userId: user?._id || null,
      isGuest: !userId,
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      plan: planId,
      planId: plan._id?.toString() || planId,
      planName: plan.title || plan.name || 'Membership Plan',
      amount: plan.price || plan.fee || 1100,
      feeAmount: plan.price || plan.fee || 1100,
      paymentScreenshot: finalScreenshot || '',
      utrNumber: finalUtr,
      transactionId: finalUtr,
      bloodGroup: bloodGroup || user?.bloodGroup || 'O+',
      dob: dob || user?.dob || '2000-01-01',
      address: address || user?.address || '',
      district: district || user?.district || 'Jabalpur',
      state: state || user?.state || 'Madhya Pradesh',
      photoUrl: finalPhoto || user?.photoUrl || '',
      documentType: finalDocType,
      documentFront: finalDocFront,
      documentBack: finalDocBack,
      idProofUrl: finalDocFront,
      designation: designation || user?.designation || `${plan.title || plan.name} Member`,
      status: 'pending'
    });

    return application;
  }

  async applyVolunteer(userId, appData) {
    const { 
      skills, 
      availability, 
      idProofDocument, 
      idProofUrl,
      motivation, 
      whyJoin,
      bloodGroup, 
      dob, 
      address, 
      district, 
      state, 
      photoUrl,
      name,
      email,
      phone
    } = appData;

    const finalPhoto = photoUrl || appData.userPhoto || appData.avatar || '';
    const finalDocType = appData.documentType || 'Aadhaar Card';
    const finalDocFront = appData.documentFront || idProofDocument || idProofUrl || appData.idProof || '';
    const finalDocBack = appData.documentBack || '';
    const finalIdProof = finalDocFront || idProofDocument || idProofUrl || appData.idProof;

    if (!finalIdProof && !finalDocFront) throw new Error('Government ID proof upload is required for volunteer verification');

    let user = userId ? await userRepository.findById(userId) : null;
    const applicantEmail = (email || user?.email || '').toLowerCase().trim();
    const applicantPhone = (phone || user?.phone || '').trim();
    const applicantName = (name || user?.name || '').trim();

    let generatedPassword = null;
    let isUpdatedPassword = false;

    if (!userId) {
      // GUEST APPLICATION (User NOT logged in)
      if (!applicantName || (!applicantEmail && !applicantPhone)) {
        throw new Error('Please provide your Name, Email, and Mobile Number for volunteer enrollment.');
      }

      if (applicantEmail) {
        user = await userRepository.findByEmail(applicantEmail);
      }

      const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;

      if (user) {
        // User already exists! Since applicant applied without logging in:
        // "if user not login and apply for all then last mail password is valid"
        user.password = hashedPassword;
        isUpdatedPassword = true;
        if (applicantName) user.name = applicantName;
        if (applicantPhone) user.phone = applicantPhone;
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (dob) user.dob = dob;
        if (address) user.address = address;
        user.district = district || user.district || 'Jabalpur';
        user.state = state || user.state || 'Madhya Pradesh';
        if (finalPhoto) user.photoUrl = finalPhoto;
        if (finalDocType) user.documentType = finalDocType;
        if (finalDocFront) user.documentFront = finalDocFront;
        if (finalDocBack) user.documentBack = finalDocBack;
        user.status = user.status === 'active' ? 'active' : 'pending';
        await user.save();
      } else {
        // Create new User account
        user = await userRepository.create({
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone || '9999999999',
          password: hashedPassword,
          role: 'Volunteer',
          status: 'pending',
          isVolunteer: false,
          volunteerWing: 'Senior Citizen Care & Aashram Seva',
          designation: 'Active Volunteer (Elder Care)',
          bloodGroup: bloodGroup || 'O+',
          dob: dob || '2000-01-01',
          address: address || '',
          district: district || 'Jabalpur',
          state: state || 'Madhya Pradesh',
          photoUrl: finalPhoto || '',
          documentType: finalDocType,
          documentFront: finalDocFront,
          documentBack: finalDocBack,
          idCardGenerated: false,
          appointmentLetterGenerated: false
        });
      }

      // Send credentials email to applicant
      if (applicantEmail) {
        sendGuestApplicationCredentialsEmail({
          to: applicantEmail,
          name: user.name,
          temporaryPassword: generatedPassword,
          applicationType: 'Volunteer',
          isUpdatedPassword
        }).catch(err => console.warn('Guest volunteer credentials email dispatch notice:', err.message));
      }
    } else {
      // USER IS LOGGED IN
      // "if user is login and apply then her password not change"
      if (user) {
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (dob) user.dob = dob;
        if (address) user.address = address;
        if (district) user.district = district;
        if (state) user.state = state;
        if (finalPhoto) user.photoUrl = finalPhoto;
        if (finalDocType) user.documentType = finalDocType;
        if (finalDocFront) user.documentFront = finalDocFront;
        if (finalDocBack) user.documentBack = finalDocBack;
        await user.save();
      }
    }

    const application = await applicationRepository.createVolunteerApp({
      user: user?._id || null,
      userId: user?._id || null,
      isGuest: !userId,
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      skills: Array.isArray(skills) ? skills : [skills || 'Elder Care & Companionship'],
      availability: availability || 'Weekends',
      interests: appData.interests || '',
      documentType: finalDocType,
      documentFront: finalDocFront,
      documentBack: finalDocBack,
      idProofDocument: finalIdProof,
      idProofUrl: finalIdProof,
      motivation: motivation || whyJoin || '',
      whyJoin: motivation || whyJoin || '',
      bloodGroup: bloodGroup || user?.bloodGroup || 'O+',
      dob: dob || user?.dob || '2000-01-01',
      address: address || user?.address || '',
      district: district || user?.district || 'Jabalpur',
      state: state || user?.state || 'Madhya Pradesh',
      photoUrl: finalPhoto || user?.photoUrl || '',
      status: 'pending'
    });

    return application;
  }

  async getMembershipApplications(filter = {}) {
    return applicationRepository.findMembershipApps(filter);
  }

  async getVolunteerApplications(filter = {}) {
    return applicationRepository.findVolunteerApps(filter);
  }

  async generateUniqueMemberId() {
    const currentYear = new Date().getFullYear();
    const prefix = `APVAF-MEM-${currentYear}-`;
    const users = await userRepository.find({ memberId: new RegExp(`^${prefix}`) });
    let maxSeq = 1000;
    for (const u of users) {
      if (u.memberId) {
        const match = u.memberId.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      }
    }
    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${nextSeq}`;
    while (await userRepository.findByMemberId(candidate)) {
      nextSeq++;
      candidate = `${prefix}${nextSeq}`;
    }
    return candidate;
  }

  async generateUniqueVolunteerId() {
    const currentYear = new Date().getFullYear();
    const prefix = `APVAF-VOL-${currentYear}-`;
    const users = await userRepository.find({ 
      $or: [
        { volunteerId: new RegExp(`^${prefix}`) },
        { memberId: new RegExp(`^${prefix}`) }
      ]
    });
    let maxSeq = 500;
    for (const u of users) {
      const idToTest = u.volunteerId || u.memberId;
      if (idToTest) {
        const match = idToTest.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      }
    }
    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${nextSeq}`;
    while (await userRepository.findByVolunteerId(candidate)) {
      nextSeq++;
      candidate = `${prefix}${nextSeq}`;
    }
    return candidate;
  }

  async approveMembershipApplication(appId, adminUser) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email.toLowerCase().trim());
    }

    const plan = app.plan ? await planRepository.findById(app.plan._id || app.plan) : null;
    const verifiedMemberId = (user && user.memberId && user.memberId.startsWith('APVAF-MEM-')) 
      ? user.memberId 
      : await this.generateUniqueMemberId();
    let generatedPassword = null;
    const isGuest = Boolean(app.isGuest || !app.user || !app.userId);

    if (!user) {
      // Auto-create new User account for guest applicant
      const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;

      user = await userRepository.create({
        name: app.name || 'Valued Member',
        email: app.email ? app.email.toLowerCase().trim() : `member_${verifiedMemberId.toLowerCase()}@apnaparivarvriddhaashram.org`,
        phone: app.phone ? app.phone.trim() : '9999999999',
        password: hashedPassword,
        role: 'Member',
        status: 'active',
        isMember: true,
        memberId: verifiedMemberId,
        designation: app.designation || (plan ? `${plan.title || plan.name} Member` : 'Verified Active Member'),
        bloodGroup: app.bloodGroup || 'O+',
        dob: app.dob || '2000-01-01',
        address: app.address || '',
        district: app.district || 'Jabalpur',
        state: app.state || 'Madhya Pradesh',
        photoUrl: app.photoUrl || '',
        documentType: app.documentType || '',
        documentFront: app.documentFront || '',
        documentBack: app.documentBack || '',
        feePaid: true,
        feeAmount: app.amount || app.feeAmount || (plan ? (plan.price || plan.fee || 1100) : 1100),
        idCardGenerated: true,
        appointmentLetterGenerated: true,
        verifiedAt: new Date(),
        verifiedBy: adminUser?.name || 'Trustee Admin',
        membershipExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        membershipStatus: 'active'
      });

      app.user = user._id;
      app.userId = user._id;
    } else {
      user.status = 'active';
      user.role = 'Member';
      user.isMember = true;
      user.memberId = verifiedMemberId;
      user.designation = app.designation || (plan ? `${plan.title || plan.name} Member` : 'Verified Active Member');
      if (app.photoUrl && !user.photoUrl) user.photoUrl = app.photoUrl;
      if (app.documentType) user.documentType = app.documentType;
      if (app.documentFront) user.documentFront = app.documentFront;
      if (app.documentBack) user.documentBack = app.documentBack;
      user.feePaid = true;
      user.feeAmount = app.amount || app.feeAmount || 1100;
      user.idCardGenerated = true;
      user.appointmentLetterGenerated = true;
      user.verifiedAt = new Date();
      user.verifiedBy = adminUser?.name || 'Trustee Admin';
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      user.membershipExpiresAt = oneYearFromNow;
      user.membershipStatus = 'active';

      // If user had no password, generate initial password
      if (!user.password) {
        const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
        user.password = await bcrypt.hash(tempPass, 10);
        generatedPassword = tempPass;
      }
    }

    const qrData = `https://apnaparivarvriddhaashram.org/verify/member/${verifiedMemberId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }
    await user.save();

    app.status = 'approved';
    app.assignedMemberId = verifiedMemberId;
    app.reviewedBy = adminUser?.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    app.expiresAt = expiryDate;
    app.membershipExpiresAt = expiryDate;
    app.membershipStatus = 'active';
    await app.save();

    // Auto send official appointment letter, ID card & login credentials via email asynchronously
    try {
      const emailPayload = user.toObject ? user.toObject() : { ...user };
      if (generatedPassword) {
        emailPayload.temporaryPassword = generatedPassword;
      }
      sendMembershipApprovalEmail(emailPayload).catch(e => {
        console.warn('Membership approval email send warning:', e.message);
      });
    } catch (e) {
      console.warn('Membership approval email dispatch prep warning:', e.message);
    }

    return { application: app, user, temporaryPassword: generatedPassword };
  }

  async rejectMembershipApplication(appId, reason, adminUser) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');

    app.status = 'rejected';
    app.rejectionReason = reason || 'Payment proof verification failed';
    app.reviewedBy = adminUser?.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email);
    }
    if (user) {
      user.status = 'rejected';
      await user.save();
    }

    return app;
  }

  async approveVolunteerApplication(appId, adminUser) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email.toLowerCase().trim());
    }

    const verifiedVolId = (user && user.volunteerId && user.volunteerId.startsWith('APVAF-VOL-')) 
      ? user.volunteerId 
      : await this.generateUniqueVolunteerId();
    let generatedPassword = null;
    const isGuest = Boolean(app.isGuest || !app.user || !app.userId);

    if (!user) {
      // Auto-create new User account for guest volunteer applicant
      const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;

      user = await userRepository.create({
        name: app.name || 'Valued Volunteer',
        email: app.email ? app.email.toLowerCase().trim() : `volunteer_${verifiedVolId.toLowerCase()}@apnaparivarvriddhaashram.org`,
        phone: app.phone ? app.phone.trim() : '9999999999',
        password: hashedPassword,
        role: 'Volunteer',
        status: 'active',
        isVolunteer: true,
        volunteerId: verifiedVolId,
        volunteerWing: 'Senior Citizen Care & Aashram Seva',
        volunteerStatus: 'active',
        designation: 'Active Volunteer (Elder Care)',
        bloodGroup: app.bloodGroup || 'O+',
        dob: app.dob || '2000-01-01',
        address: app.address || '',
        district: app.district || 'Jabalpur',
        state: app.state || 'Madhya Pradesh',
        photoUrl: app.photoUrl || '',
        documentType: app.documentType || '',
        documentFront: app.documentFront || app.idProofUrl || '',
        documentBack: app.documentBack || '',
        feePaid: true,
        feeAmount: 0,
        idCardGenerated: true,
        appointmentLetterGenerated: true,
        verifiedAt: new Date(),
        verifiedBy: adminUser?.name || 'Trustee Admin'
      });

      app.user = user._id;
      app.userId = user._id;
    } else {
      user.status = 'active';
      user.role = 'Volunteer';
      user.isVolunteer = true;
      user.volunteerId = verifiedVolId;
      if (user.memberId && user.memberId.startsWith('APVAF-DON-')) {
        user.memberId = undefined;
      }
      user.designation = 'Active Volunteer (Elder Care)';
      if (app.photoUrl && !user.photoUrl) user.photoUrl = app.photoUrl;
      if (app.documentType) user.documentType = app.documentType;
      if (app.documentFront) user.documentFront = app.documentFront;
      if (app.documentBack) user.documentBack = app.documentBack;
      user.idCardGenerated = true;
      user.appointmentLetterGenerated = true;
      user.verifiedAt = new Date();
      user.verifiedBy = adminUser?.name || 'Trustee Admin';

      // If user had no password, generate initial password
      if (!user.password) {
        const tempPass = 'APVAF@' + Math.floor(100000 + Math.random() * 900000);
        user.password = await bcrypt.hash(tempPass, 10);
        generatedPassword = tempPass;
      }
    }

    const qrData = `https://apnaparivarvriddhaashram.org/verify/volunteer/${verifiedVolId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }
    await user.save();

    app.status = 'approved';
    app.assignedVolunteerId = verifiedVolId;
    app.reviewedBy = adminUser?.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    // Auto send official offer letter, badge & login credentials via email asynchronously
    try {
      const emailPayload = user.toObject ? user.toObject() : { ...user };
      if (generatedPassword) {
        emailPayload.temporaryPassword = generatedPassword;
      }
      sendVolunteerApprovalEmail(emailPayload).catch(e => {
        console.warn('Volunteer approval email send warning:', e.message);
      });
    } catch (e) {
      console.warn('Volunteer approval email dispatch prep warning:', e.message);
    }

    return { application: app, user, temporaryPassword: generatedPassword };
  }

  async rejectVolunteerApplication(appId, reason, adminUser) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');

    app.status = 'rejected';
    app.rejectionReason = reason || 'Verification documents not clear';
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    const user = await userRepository.findById(app.user._id || app.user);
    if (user) {
      user.status = 'rejected';
      await user.save();
    }

    return app;
  }

  async deleteMembershipApplication(appId) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(app);
    return applicationRepository.deleteMembershipApp(appId);
  }

  async deleteVolunteerApplication(appId) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(app);
    return applicationRepository.deleteVolunteerApp(appId);
  }
}

module.exports = new ApplicationService();
