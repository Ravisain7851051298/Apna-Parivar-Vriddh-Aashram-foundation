const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  fullContent: { type: String, default: '', trim: true },
  citation: { type: String, default: '', trim: true },
  venue: { type: String, default: '', trim: true },
  dateConferred: { type: Date },
  badgeIcon: { type: String, default: 'FiAward' },
  badgeColor: { type: String, default: 'gold' },
  badgeImage: { type: String, default: '' },
  category: { 
    type: String, 
    default: 'Social Service',
    trim: true 
  },
  tier: { 
    type: String, 
    default: 'Gold',
    trim: true
  },
  points: { type: Number, default: 100 },
  awardedBy: { type: String, default: '', trim: true },
  year: { type: String, default: '', trim: true },
  awardImage: { type: String, default: '' },
  image: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  isOrgAward: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

awardSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Award', awardSchema);
