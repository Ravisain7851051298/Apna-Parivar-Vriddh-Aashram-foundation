const mongoose = require('mongoose');
const Award = require('../models/Award');
const UserAward = require('../models/UserAward');
const User = require('../models/User');

const DEFAULT_AWARDS = [
  {
    title: 'Star Volunteer Award',
    description: 'Awarded for exceptional commitment and selfless hours dedicated to grassroots social service.',
    badgeIcon: 'FiStar',
    badgeColor: 'gold',
    category: 'Volunteerism',
    tier: 'Gold',
    points: 150,
    isOrgAward: false
  },
  {
    title: 'Dedicated Member Seva Honor',
    description: 'Conferred upon official members for steadfast humanitarian commitment and institutional support.',
    badgeIcon: 'FiAward',
    badgeColor: 'gold',
    category: 'Membership Honor',
    tier: 'Platinum',
    points: 300,
    isOrgAward: false
  },
  {
    title: 'Community Champion',
    description: 'Recognizing steadfast dedication to local elder care, ration drives, and winter relief.',
    badgeIcon: 'FiShield',
    badgeColor: 'emerald',
    category: 'Community Aid',
    tier: 'Platinum',
    points: 250,
    isOrgAward: false
  },
  {
    title: 'Healthcare & Elder Care Hero',
    description: 'Awarded for organizing life-saving geriatric medical camps, medicine aid, and patient nursing care.',
    badgeIcon: 'FiHeart',
    badgeColor: 'red',
    category: 'Emergency Relief',
    tier: 'Gold',
    points: 200,
    isOrgAward: false
  }
];

const DEFAULT_ORG_AWARDS = [
  {
    title: 'Madhya Pradesh Rajya Samaj Seva Gaurav Samman',
    description: 'Conferred by the State Social Welfare Board in recognition of exemplary and transparent geriatric shelter, nutritious bhoj seva, and continuous medical rehabilitation for destitute senior citizens.',
    awardedBy: 'Government of Madhya Pradesh & State Welfare Council',
    year: '2025',
    category: 'Senior Citizen Rehabilitation',
    tier: 'State Award',
    isOrgAward: true,
    badgeColor: 'gold',
    badgeIcon: 'FiAward',
    order: 1
  },
  {
    title: 'Rashtriya Vayoshreshtha Exemplary Institution Citation',
    description: 'National social welfare recognition for setting benchmarks in dignity, hygiene, specialized geriatric healthcare, and peaceful sanctuary for elderly citizens.',
    awardedBy: 'National Council for Older Persons & Humanitarian Federation',
    year: '2024',
    category: 'Institutional Elder Care',
    tier: 'National Honor',
    isOrgAward: true,
    badgeColor: 'gold',
    badgeIcon: 'FiAward',
    order: 2
  }
];

// Seed default awards if collection is empty
const seedDefaultAwardsIfEmpty = async () => {
  try {
    const count = await Award.countDocuments();
    if (count === 0) {
      await Award.insertMany([...DEFAULT_AWARDS, ...DEFAULT_ORG_AWARDS]);
    } else {
      const orgCount = await Award.countDocuments({ isOrgAward: true });
      if (orgCount === 0) {
        await Award.insertMany(DEFAULT_ORG_AWARDS);
      }
    }
  } catch (e) {
    console.error('Failed to seed default awards:', e);
  }
};

// ----------------- AWARD TEMPLATES -----------------

const getAwards = async (req, res) => {
  try {
    await seedDefaultAwardsIfEmpty();
    const query = { isActive: true };
    if (req.query.isOrgAward !== undefined) {
      query.isOrgAward = req.query.isOrgAward === 'true' || req.query.isOrgAward === true;
    }
    const awards = await Award.find(query).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, awards, data: awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAward = async (req, res) => {
  try {
    const {
      title,
      description,
      badgeIcon,
      badgeColor,
      badgeImage,
      category,
      tier,
      points,
      awardedBy,
      year,
      awardImage,
      certificateUrl,
      isOrgAward,
      order
    } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Award title is required' });
    }

    const award = new Award({
      title,
      description: description || '',
      badgeIcon: badgeIcon || 'FiAward',
      badgeColor: badgeColor || 'gold',
      badgeImage: badgeImage || '',
      category: category || 'Social Service',
      tier: tier || 'Gold',
      points: Number(points) || 100,
      awardedBy: awardedBy || '',
      year: year || '',
      awardImage: awardImage || '',
      certificateUrl: certificateUrl || '',
      isOrgAward: Boolean(isOrgAward),
      order: Number(order) || 0,
      createdBy: req.user?.id || null
    });

    await award.save();
    return res.status(201).json({ success: true, message: 'Award badge created successfully', award });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award template not found' });
    }
    return res.json({ success: true, message: 'Award badge updated successfully', award });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByIdAndDelete(id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award template not found' });
    }
    return res.json({ success: true, message: 'Award badge deleted successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ----------------- USER AWARD GRANTS -----------------

const getAllGrantedAwards = async (req, res) => {
  try {
    const { role, search, q } = req.query;
    const query = {};
    if (role && role !== 'All') {
      query.userRole = new RegExp(`^${role}$`, 'i');
    }
    const term = (search || q || '').trim();
    if (term) {
      const regex = new RegExp(term, 'i');
      query.$or = [
        { userName: regex },
        { userEmail: regex },
        { title: regex },
        { reason: regex },
        { badgeNumber: regex }
      ];
    }

    const grants = await UserAward.find(query)
      .sort({ awardedAt: -1, createdAt: -1 })
      .populate('userId', 'name email phone role photoUrl memberId volunteerId status');

    return res.json({ success: true, grants, data: grants, total: grants.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const grantAwardToUser = async (req, res) => {
  try {
    const { userId, userEmail, email, userName, name, awardId, title, reason, citation, tier, category, badgeColor, badgeIcon, badgeImage } = req.body;
    const recipientEmail = email || userEmail || (typeof userId === 'string' && userId.includes('@') ? userId : null);
    
    let user = null;
    if (userId && mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId);
    }
    if (!user && recipientEmail) {
      user = await User.findOne({ email: recipientEmail.toLowerCase().trim() });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Citation / Reason for the award is required' });
    }

    let awardTemplate = null;
    if (awardId && mongoose.isValidObjectId(awardId)) {
      awardTemplate = await Award.findById(awardId);
    }

    const resolvedUserId = user ? user._id : (userId && mongoose.isValidObjectId(userId) ? userId : new mongoose.Types.ObjectId());
    const resolvedName = user?.name || userName || name || 'Honored Contributor';
    const resolvedEmail = user?.email || recipientEmail || '';
    const resolvedRole = user?.role || 'Member';
    const resolvedPhoto = user?.photoUrl || '';

    const userAward = new UserAward({
      userId: resolvedUserId,
      awardId: awardTemplate?._id || null,
      userName: resolvedName,
      userEmail: resolvedEmail,
      userRole: resolvedRole,
      userPhoto: resolvedPhoto,
      title: title || awardTemplate?.title || 'Excellence Award',
      description: awardTemplate?.description || '',
      badgeIcon: badgeIcon || awardTemplate?.badgeIcon || 'FiAward',
      badgeColor: badgeColor || awardTemplate?.badgeColor || 'gold',
      badgeImage: badgeImage || awardTemplate?.badgeImage || '',
      category: category || awardTemplate?.category || 'Social Service',
      tier: tier || awardTemplate?.tier || 'Gold',
      reason: reason.trim(),
      citation: citation || reason.trim(),
      awardedAt: new Date(),
      awardedBy: req.user?.id || null,
      awardedByName: req.user?.name || 'National Trustee Board'
    });

    await userAward.save();
    return res.status(201).json({
      success: true,
      message: `Award '${userAward.title}' successfully presented to ${user.name}!`,
      userAward
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const revokeUserAward = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserAward.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Award record not found' });
    }
    return res.json({ success: true, message: 'Award badge revoked successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyAwards = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const awards = await UserAward.find({ userId }).sort({ awardedAt: -1, createdAt: -1 });
    return res.json({ success: true, awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserAwardsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const awards = await UserAward.find({ userId }).sort({ awardedAt: -1, createdAt: -1 });
    return res.json({ success: true, awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
  getAllGrantedAwards,
  grantAwardToUser,
  revokeUserAward,
  getMyAwards,
  getUserAwardsByUserId
};

