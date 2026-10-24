const applicationService = require('../services/applicationService');

const applyMembership = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || null;
    const application = await applicationService.applyMembership(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Membership application submitted successfully! Pending Trustee approval.',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const applyVolunteer = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || null;
    const application = await applicationService.applyVolunteer(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully! Pending Trustee verification.',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMembershipApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await applicationService.getMembershipApplications(filter);
    return res.json({ success: true, applications, total: applications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getVolunteerApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await applicationService.getVolunteerApplications(filter);
    return res.json({ success: true, applications, total: applications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approveMembershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await applicationService.approveMembershipApplication(id, req.user);
    return res.json({
      success: true,
      message: 'Membership approved! Official ID Card & Appointment Letter generated & emailed.',
      application: result.application,
      user: result.user
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const rejectMembershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const application = await applicationService.rejectMembershipApplication(id, reason, req.user);
    return res.json({
      success: true,
      message: 'Membership application rejected',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const approveVolunteerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await applicationService.approveVolunteerApplication(id, req.user);
    return res.json({
      success: true,
      message: 'Volunteer verified! Badge and offer letter generated & emailed.',
      application: result.application,
      user: result.user
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const rejectVolunteerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const application = await applicationService.rejectVolunteerApplication(id, reason, req.user);
    return res.json({
      success: true,
      message: 'Volunteer application rejected',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMembershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await applicationService.deleteMembershipApplication(id);
    return res.json({
      success: true,
      message: 'Membership application and associated proof files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteVolunteerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await applicationService.deleteVolunteerApplication(id);
    return res.json({
      success: true,
      message: 'Volunteer application and associated ID files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const applyCoordinator = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || null;
    const application = await applicationService.applyCoordinator(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Coordinator application submitted successfully! Pending Trustee review.',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCoordinatorApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await applicationService.getCoordinatorApplications(filter);
    return res.json({ success: true, applications, total: applications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approveCoordinatorApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await applicationService.approveCoordinatorApplication(id, req.user);
    return res.json({
      success: true,
      message: 'Coordinator approved! Official ID Card & Appointment Letter generated & emailed.',
      application: result.application,
      user: result.user
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const rejectCoordinatorApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const application = await applicationService.rejectCoordinatorApplication(id, reason, req.user);
    return res.json({
      success: true,
      message: 'Coordinator application rejected',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCoordinatorApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await applicationService.deleteCoordinatorApplication(id);
    return res.json({
      success: true,
      message: 'Coordinator application and associated ID proof files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateMembershipImages = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role?.toLowerCase() === 'admin';
    const updated = await applicationService.updateMembershipImages(id, req.user?.id, req.body, isAdmin);
    return res.json({
      success: true,
      message: 'Membership verification images updated successfully',
      application: updated
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateVolunteerImages = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role?.toLowerCase() === 'admin';
    const updated = await applicationService.updateVolunteerImages(id, req.user?.id, req.body, isAdmin);
    return res.json({
      success: true,
      message: 'Volunteer verification images updated successfully',
      application: updated
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyMembership,
  applyVolunteer,
  applyCoordinator,
  getMembershipApplications,
  getVolunteerApplications,
  getCoordinatorApplications,
  approveMembershipApplication,
  rejectMembershipApplication,
  approveVolunteerApplication,
  rejectVolunteerApplication,
  approveCoordinatorApplication,
  rejectCoordinatorApplication,
  deleteMembershipApplication,
  deleteVolunteerApplication,
  deleteCoordinatorApplication,
  updateMembershipImages,
  updateVolunteerImages
};
