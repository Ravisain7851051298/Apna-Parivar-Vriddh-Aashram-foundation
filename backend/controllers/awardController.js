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
    fullContent: 'Presented by the Department of Social Justice & Empowerment, Government of Madhya Pradesh, during the State Humanitarian Leadership Summit. Apna Parivar Vriddh Aashram Foundation was honored for providing homeless, ailing, and destitute senior citizens with a state-of-the-art sanctuary, nutritious satvik meals, palliative medical care, and permanent legal and emotional rehabilitation.\n\nThe citation commends the foundation\'s zero-refusal admissions policy, round-the-clock emergency hospital tie-ups, and dignified last-rites services conducted with Vedic reverence.',
    awardedBy: 'Government of Madhya Pradesh & State Welfare Council',
    year: '2025',
    venue: 'Bhopal, Madhya Pradesh',
    category: 'Senior Citizen Rehabilitation & Welfare',
    tier: 'State Award',
    isOrgAward: true,
    badgeColor: 'gold',
    badgeIcon: 'FiAward',
    awardImage: '/banner.jpg',
    image: '/banner.jpg',
    order: 1,
    isActive: true
  },
  {
    title: 'Rashtriya Vayoshreshtha Exemplary Institution Citation',
    description: 'National social welfare recognition for setting benchmarks in dignity, hygiene, specialized geriatric healthcare, and peaceful sanctuary for elderly citizens.',
    fullContent: 'Conferred jointly by the National Council of Older Persons and the Humanitarian Welfare Federation of India. The award honors Apna Parivar Vriddh Aashram Foundation for extraordinary commitment to compassionate elder care, setting exemplary standards in geriatric bedding, daily medical supervision, and active psychosocial engagement.\n\nThe foundation was especially commended for its 80G tax exemption transparency, audited financial disclosures, and 24x7 volunteer helpline responding to elder rescue calls across the Mahakoshal region.',
    awardedBy: 'National Council for Older Persons & Humanitarian Federation',
    year: '2024',
    venue: 'New Delhi, India',
    category: 'Institutional Elder Care Benchmark',
    tier: 'National Honor',
    isOrgAward: true,
    badgeColor: 'gold',
    badgeIcon: 'FiAward',
    awardImage: '/logo.jpg',
    image: '/logo.jpg',
    order: 2,
    isActive: true
  },
  {
    title: 'Rotary International Seva Shiromani Humanitarian Award',
    description: 'Recognizing relentless grassroots dedication to feeding, sheltering, and clothing abandoned senior citizens with family warmth and unconditional affection.',
    fullContent: 'Conferred by Rotary International District 3261 and Rotary Club Jabalpur Midtown. This honor celebrates the dedicated trustees, caregivers, and medical team of Apna Parivar Vriddh Aashram for creating a truly loving home for destitute elderly citizens who had no family support.\n\nThe felicitation recognized the ashram\'s comprehensive daily Tithi Bhoj nutrition program and regular eye care, dental, and orthopedic health camps organized free of cost for senior residents.',
    awardedBy: 'Rotary Club Jabalpur Midtown & Rotary District 3261',
    year: '2025',
    venue: 'Jabalpur, Madhya Pradesh',
    category: 'Humanitarian Elder Relief',
    tier: 'Humanitarian Trophy',
    isOrgAward: true,
    badgeColor: 'emerald',
    badgeIcon: 'FiAward',
    awardImage: '/banner.jpg',
    image: '/banner.jpg',
    order: 3,
    isActive: true
  },
  {
    title: 'Bhagwan Mahaveer Karuna & Jeevdaya Sanman',
    description: 'Special citation presented by Jain Social Groups & Philanthropic Council for pure satvik living, selfless care, and protective shelter for helpless seniors.',
    fullContent: 'Presented by the All India Jain Social Groups Federation and Bhagwan Mahaveer Philanthropic Council in recognition of Apna Parivar Vriddh Aashram\'s embodiment of boundless compassion, ahimsa, and universal seva. The foundation ensures every senior citizen receives freshly prepared pure vegetarian meals, spiritual peace through regular satsang, and loving familial respect.',
    awardedBy: 'All India Jain Social Groups Federation & Karuna Council',
    year: '2024',
    venue: 'Jabalpur, Madhya Pradesh',
    category: 'Social Compassion & Elder Care',
    tier: 'Special Citation',
    isOrgAward: true,
    badgeColor: 'purple',
    badgeIcon: 'FiAward',
    awardImage: '/logo.jpg',
    image: '/logo.jpg',
    order: 4,
    isActive: true
  }
];

// Seed default awards if collection is empty or update org awards
const seedDefaultAwardsIfEmpty = async () => {
  try {
    const count = await Award.countDocuments();
    if (count === 0) {
      await Award.insertMany([...DEFAULT_AWARDS, ...DEFAULT_ORG_AWARDS]);
      return;
    }

    // 1. Separate user badge templates from org awards
    const userBadgeTitles = [
      'Star Volunteer Award',
      'Yuva Kranti Ratna',
      'Child Literacy Crusader',
      'Inspiring Changemaker',
      'Healthcare & Blood Hero',
      'Healthcare & Elder Care Hero',
      'Community Champion',
      'Dedicated Member Seva Honor'
    ];

    await Award.updateMany(
      { title: { $in: userBadgeTitles } },
      { $set: { isOrgAward: false, awardedBy: '' } }
    );

    // 2. Only enrich already existing default org awards (never recreate awards deleted by admin)
    for (const defAward of DEFAULT_ORG_AWARDS) {
      const existing = await Award.findOne({ title: defAward.title });

      if (existing && (!existing.fullContent || !existing.awardImage || existing.isOrgAward !== true)) {
        await Award.updateOne(
          { _id: existing._id },
          {
            $set: {
              isOrgAward: true,
              awardedBy: existing.awardedBy || defAward.awardedBy,
              fullContent: existing.fullContent || defAward.fullContent,
              awardImage: existing.awardImage || existing.image || defAward.awardImage,
              image: existing.image || existing.awardImage || defAward.image,
              venue: existing.venue || defAward.venue,
              year: existing.year || defAward.year,
              category: existing.category || defAward.category,
              tier: existing.tier || defAward.tier
            }
          }
        );
      }
    }
  } catch (e) {
    console.error('Failed to seed default awards:', e);
  }
};

// ----------------- AWARD TEMPLATES & ORG AWARDS -----------------

const getAwards = async (req, res) => {
  try {
    await seedDefaultAwardsIfEmpty();
    const query = {};

    // Filter by active status unless specifically requesting all/inactive
    if (req.query.all !== 'true' && req.query.includeInactive !== 'true') {
      query.isActive = true;
    }

    // Filter by Org Award flag if specified
    if (req.query.isOrgAward !== undefined) {
      query.isOrgAward = req.query.isOrgAward === 'true' || req.query.isOrgAward === true;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { awardedBy: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    const awards = await Award.find(query).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, awards, data: awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAwardById = async (req, res) => {
  try {
    await seedDefaultAwardsIfEmpty();
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Award ID' });
    }
    const award = await Award.findById(id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found' });
    }
    return res.json({ success: true, award, data: award });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAward = async (req, res) => {
  try {
    const {
      title,
      description,
      fullContent,
      citation,
      venue,
      dateConferred,
      badgeIcon,
      badgeColor,
      badgeImage,
      category,
      tier,
      points,
      awardedBy,
      year,
      awardImage,
      image,
      certificateUrl,
      isOrgAward,
      order,
      isActive
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Award title is required' });
    }

    let finalImage = (awardImage || image || '').trim();
    if (req.file) {
      const cat = req.file.category || 'awards';
      finalImage = `/uploads/${cat}/${req.file.filename}`;
    }

    const award = new Award({
      title: title.trim(),
      description: (description || '').trim(),
      fullContent: (fullContent || '').trim(),
      citation: (citation || '').trim(),
      venue: (venue || '').trim(),
      dateConferred: dateConferred ? new Date(dateConferred) : null,
      badgeIcon: badgeIcon || 'FiAward',
      badgeColor: badgeColor || 'gold',
      badgeImage: badgeImage || '',
      category: (category || 'Social Service').trim(),
      tier: (tier || 'Gold').trim(),
      points: Number(points) || 100,
      awardedBy: (awardedBy || '').trim(),
      year: (year || '').trim(),
      awardImage: finalImage,
      image: finalImage,
      certificateUrl: (certificateUrl || '').trim(),
      isOrgAward: isOrgAward === 'true' || isOrgAward === true,
      order: Number(order) || 0,
      isActive: isActive === undefined ? true : (isActive === 'true' || isActive === true),
      createdBy: req.user?.id || null
    });

    await award.save();
    return res.status(201).json({ success: true, message: 'Award created successfully', award });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Award ID' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const cat = req.file.category || 'awards';
      updateData.awardImage = `/uploads/${cat}/${req.file.filename}`;
      updateData.image = `/uploads/${cat}/${req.file.filename}`;
    } else if (updateData.awardImage && !updateData.image) {
      updateData.image = updateData.awardImage;
    } else if (updateData.image && !updateData.awardImage) {
      updateData.awardImage = updateData.image;
    }

    if (updateData.isOrgAward !== undefined) {
      updateData.isOrgAward = updateData.isOrgAward === 'true' || updateData.isOrgAward === true;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }
    if (updateData.points !== undefined) {
      updateData.points = Number(updateData.points) || 100;
    }
    if (updateData.order !== undefined) {
      updateData.order = Number(updateData.order) || 0;
    }

    const award = await Award.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found' });
    }
    return res.json({ success: true, message: 'Award updated successfully', award });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Award ID' });
    }
    const award = await Award.findByIdAndDelete(id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found' });
    }
    if (award.awardImage || award.image) {
      try {
        const { deleteFileByUrl } = require('../utils/fileCleaner');
        await deleteFileByUrl(award.awardImage || award.image);
      } catch (cleanErr) {
        console.warn('Award image cleanup notice:', cleanErr.message);
      }
    }
    return res.json({ success: true, message: 'Award deleted successfully', id });
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
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
  getAllGrantedAwards,
  grantAwardToUser,
  revokeUserAward,
  getMyAwards,
  getUserAwardsByUserId
};

