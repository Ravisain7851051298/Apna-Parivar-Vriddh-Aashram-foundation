const Feedback = require('../models/Feedback');

/**
 * Get all feedbacks
 * Public sees Approved only. Admins can see all.
 */
const getFeedbacks = async (req, res) => {
  try {
    const isAdmin = req.user && (req.user.role === 'Admin' || req.user.role === 'admin' || req.user.role === 'manager');
    const filter = {};

    if (!isAdmin) {
      filter.status = 'Approved';
    } else if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const feedbacks = await Feedback.find(filter)
      .populate('userId', 'name email photoUrl role memberId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: feedbacks,
      feedbacks,
      total: feedbacks.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedbacks',
      error: error.message
    });
  }
};

/**
 * Create feedback (supports both authenticated users and guests)
 */
const createFeedback = async (req, res) => {
  try {
    const { name, email, phone, userRole, rating, comment, profilePicture } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Feedback comment is required'
      });
    }

    const resolvedPic = (profilePicture || req.user?.photoUrl || req.user?.image || req.user?.profilePicture || '').trim();

    const feedbackData = {
      name: (req.user?.name || name || 'Anonymous Supporter').trim(),
      email: (req.user?.email || email || '').trim().toLowerCase(),
      phone: (phone || '').trim(),
      userRole: (userRole || req.user?.role || 'Supporter').trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      profilePicture: resolvedPic,
      status: 'Approved' // Publicly visible immediately
    };

    if (req.user && req.user.id && req.user.id !== 'admin_master') {
      feedbackData.userId = req.user.id;
    }

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for sharing your experience.',
      data: feedback,
      feedback
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

/**
 * Admin Reply to Feedback (Add, update or clear reply)
 */
const replyFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, repliedBy, repliedByRole, clearReply } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (clearReply || (reply !== undefined && reply.trim() === '')) {
      feedback.adminReply = '';
      feedback.adminRepliedAt = null;
      feedback.repliedBy = '';
      feedback.repliedByRole = '';
    } else {
      if (!reply || !reply.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Reply message cannot be empty'
        });
      }
      feedback.adminReply = reply.trim();
      feedback.adminRepliedAt = new Date();
      feedback.repliedBy = (repliedBy || req.user?.name || 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION Management').trim();
      feedback.repliedByRole = (repliedByRole || req.user?.role || 'Administrator').trim();
      feedback.status = 'Approved';
    }

    await feedback.save();

    return res.json({
      success: true,
      message: clearReply ? 'Reply removed successfully' : 'Admin reply posted successfully!',
      data: feedback,
      feedback
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to post admin reply',
      error: error.message
    });
  }
};

/**
 * Update full feedback (Edit details, status, photo or reply)
 */
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, userRole, rating, comment, status, profilePicture, adminReply, repliedBy, repliedByRole } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (name !== undefined) feedback.name = name.trim();
    if (email !== undefined) feedback.email = email.trim().toLowerCase();
    if (phone !== undefined) feedback.phone = phone.trim();
    if (userRole !== undefined) feedback.userRole = userRole.trim();
    if (rating !== undefined) feedback.rating = Number(rating) || feedback.rating;
    if (comment !== undefined) feedback.comment = comment.trim();
    if (profilePicture !== undefined) feedback.profilePicture = profilePicture.trim();
    if (status !== undefined) {
      feedback.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
    if (adminReply !== undefined) {
      const trimmedReply = adminReply.trim();
      feedback.adminReply = trimmedReply;
      if (trimmedReply) {
        feedback.adminRepliedAt = feedback.adminRepliedAt || new Date();
        feedback.repliedBy = (repliedBy || feedback.repliedBy || req.user?.name || 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION Management').trim();
        feedback.repliedByRole = (repliedByRole || feedback.repliedByRole || req.user?.role || 'Administrator').trim();
      } else {
        feedback.adminRepliedAt = null;
      }
    }

    await feedback.save();

    return res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback,
      feedback
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
};

/**
 * Update Feedback Status (Approve / Reject / Pending)
 */
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;
    if (status) {
      status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    if (!['Approved', 'Pending', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved, Pending, or Rejected.'
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.json({
      success: true,
      message: `Feedback status updated to ${status}`,
      data: feedback,
      feedback
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
};

/**
 * Delete Feedback
 */
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.json({
      success: true,
      message: 'Feedback deleted successfully',
      id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

module.exports = {
  getFeedbacks,
  createFeedback,
  replyFeedback,
  updateFeedback,
  updateFeedbackStatus,
  deleteFeedback
};

