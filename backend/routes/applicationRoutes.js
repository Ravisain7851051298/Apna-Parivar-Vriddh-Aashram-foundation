const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Applications creation (Member, Volunteer & Coordinator) with single-API file upload - Supports guest applicants without login
router.post('/members', optionalAuth, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/apply', optionalAuth, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/volunteers', optionalAuth, handleOptionalFileUpload, applicationController.applyVolunteer);
router.post('/coordinators', optionalAuth, handleOptionalFileUpload, applicationController.applyCoordinator);

// Applications listing (Admin / Manager)
router.get('/members', verifyToken, requireRole(['admin', 'Admin']), applicationController.getMembershipApplications);
router.get('/memberships', verifyToken, requireRole(['admin', 'Admin']), applicationController.getMembershipApplications);
router.get('/admin/all', verifyToken, requireRole(['admin', 'Admin']), applicationController.getMembershipApplications);
router.get('/volunteers', verifyToken, requireRole(['admin', 'Admin']), applicationController.getVolunteerApplications);
router.get('/coordinators', verifyToken, requireRole(['admin', 'Admin']), applicationController.getCoordinatorApplications);

// Approval & Rejection workflows (Admin)
router.put('/members/:id/approve', verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication);
router.put('/members/:id/reject', verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication);
router.put('/volunteers/:id/approve', verifyToken, requireRole(['admin', 'Admin']), applicationController.approveVolunteerApplication);
router.put('/volunteers/:id/reject', verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectVolunteerApplication);
router.put('/coordinators/:id/approve', verifyToken, requireRole(['admin', 'Admin']), applicationController.approveCoordinatorApplication);
router.put('/coordinators/:id/reject', verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectCoordinatorApplication);

// Image & Document Updates before approval (Applicant or Admin)
router.put('/members/:id/images', verifyToken, handleOptionalFileUpload, applicationController.updateMembershipImages);
router.put('/volunteers/:id/images', verifyToken, handleOptionalFileUpload, applicationController.updateVolunteerImages);

// Deletion endpoints (Admin only)
router.delete('/members/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteMembershipApplication);
router.delete('/memberships/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteMembershipApplication);
router.delete('/volunteers/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteVolunteerApplication);
router.delete('/coordinators/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteCoordinatorApplication);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteMembershipApplication);

module.exports = router;

