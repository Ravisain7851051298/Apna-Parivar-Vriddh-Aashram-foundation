const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Public / Candidate apply to become coordinator (same as volunteers/apply and members/apply)
router.post('/apply', optionalAuth, handleOptionalFileUpload, applicationController.applyCoordinator);

// Admin: View all coordinators and their enrolled member counts
router.get('/', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.getCoordinators);

// Admin: Promote existing user to Coordinator
router.post('/promote-existing', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.promoteExistingUserToCoordinator);

// Admin: Create brand new Coordinator from scratch
router.post('/create-new', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, coordinatorController.createNewCoordinator);

// Coordinator: Get members enrolled by self
router.get('/my-members', verifyToken, requireRole(['coordinator', 'Coordinator', 'admin', 'Admin']), coordinatorController.getMyEnrolledMembers);

// Coordinator: Add new member (pending Admin final approval)
router.post('/members', verifyToken, requireRole(['coordinator', 'Coordinator', 'admin', 'Admin']), handleOptionalFileUpload, coordinatorController.addMemberByCoordinator);

// Coordinator / Admin: Edit member images / KYC until approved
router.put('/members/:memberId/images', verifyToken, requireRole(['coordinator', 'Coordinator', 'admin', 'Admin']), handleOptionalFileUpload, coordinatorController.updateMemberImages);

// Admin or Coordinator: View members of a specific coordinator
router.get('/:id/members', verifyToken, coordinatorController.getCoordinatorMembers);

// Admin: Update coordinator details
router.put('/:id', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, coordinatorController.updateCoordinator);

// Admin: Toggle coordinator active/suspended status
router.patch('/:id/status', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.toggleCoordinatorStatus);

// Admin: Resend credentials, appointment letter & ID card email
router.post('/:id/resend-credentials', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.resendCoordinatorCredentials);

// Admin: Revoke coordinator privileges
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.deleteCoordinator);

module.exports = router;
