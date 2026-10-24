const mongoose = require('mongoose');
const fileCleanupPlugin = require('./plugins/fileCleanupPlugin');

const coordinatorApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  qualification: { type: String, default: 'Graduate' },
  experience: { type: String, default: '' },
  areaOfOperation: { type: String, default: 'Aligarh District' },
  skills: { type: mongoose.Schema.Types.Mixed, default: 'Team Coordination & Social Outreach' },
  motivation: { type: String, default: '' },
  bloodGroup: { type: String, default: 'O+' },
  dob: { type: String, default: '1995-01-01' },
  address: { type: String, default: '' },
  district: { type: String, default: 'Aligarh' },
  state: { type: String, default: 'Uttar Pradesh' },
  photoUrl: { type: String, default: '' },
  documentType: { type: String, default: 'Aadhaar Card' },
  documentFront: { type: String, default: '' },
  documentBack: { type: String, default: '' },
  idProofUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  assignedCoordinatorId: { type: String, default: null },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  reviewedBy: { type: String, default: null },
  rejectionReason: { type: String, default: null },
  isGuest: { type: Boolean, default: false }
}, {
  timestamps: true
});

coordinatorApplicationSchema.pre('save', function () {
  if (this.user && !this.userId) this.userId = this.user;
  if (this.userId && !this.user) this.user = this.userId;
  if (this.documentFront && !this.idProofUrl) this.idProofUrl = this.documentFront;
  if (this.idProofUrl && !this.documentFront) this.documentFront = this.idProofUrl;
});

coordinatorApplicationSchema.plugin(fileCleanupPlugin);

module.exports = mongoose.model('CoordinatorApplication', coordinatorApplicationSchema);
