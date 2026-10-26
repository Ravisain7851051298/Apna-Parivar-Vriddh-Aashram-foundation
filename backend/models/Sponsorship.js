const mongoose = require('mongoose');
const fileCleanupPlugin = require('./plugins/fileCleanupPlugin');

const sponsorshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organizationName: { type: String, required: true, trim: true },
  name: { type: String, trim: true },
  logoUrl: { type: String, default: '' },
  image: { type: String, default: '' },
  tier: {
    type: String,
    enum: [
      'Platinum',
      'Gold',
      'Silver',
      'Bronze',
      'Associate',
      'CSR Partner'
    ],
    default: 'CSR Partner'
  },
  websiteUrl: { type: String, default: '', trim: true },
  link: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  supportType: { type: String, default: 'Elder Welfare & Shelter Support', trim: true },
  contributionAmount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

sponsorshipSchema.pre('validate', function () {
  if (this.title && !this.name) this.name = this.title;
  if (this.name && !this.title) this.title = this.name;
  if (!this.organizationName && this.title) this.organizationName = this.title;
  if (this.logoUrl && !this.image) this.image = this.logoUrl;
  if (this.image && !this.logoUrl) this.logoUrl = this.image;
  if (this.link && !this.websiteUrl) this.websiteUrl = this.link;
  if (this.websiteUrl && !this.link) this.link = this.websiteUrl;
});

sponsorshipSchema.plugin(fileCleanupPlugin);

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
