const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  badgeIcon: { type: String, default: 'FiAward' },
  badgeColor: { type: String, enum: ['gold', 'red', 'emerald', 'blue', 'purple'], default: 'gold' },
  badgeImage: { type: String, default: '' },
  category: { 
    type: String, 
    default: 'Social Service',
    trim: true 
  },
  tier: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Special Honor', 'National Honor', 'State Award'], 
    default: 'Gold' 
  },
  points: { type: Number, default: 100 },
  awardedBy: { type: String, default: 'Government & Social Welfare Council', trim: true },
  year: { type: String, default: '2026', trim: true },
  awardImage: { type: String, default: '' },
  image: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  isOrgAward: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

awardSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Award', awardSchema);
