const MembershipApplication = require('../models/MembershipApplication');
const VolunteerApplication = require('../models/VolunteerApplication');

class ApplicationRepository {
  // Membership Applications
  async createMembershipApp(data) {
    const app = new MembershipApplication(data);
    return app.save();
  }

  async findMembershipAppById(id) {
    return MembershipApplication.findById(id).populate('user plan');
  }

  async findMembershipApps(query = {}, sort = { createdAt: -1 }) {
    return MembershipApplication.find(query).populate('user plan').sort(sort);
  }

  async updateMembershipApp(id, updateData) {
    return MembershipApplication.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async countMembershipApps(query = {}) {
    return MembershipApplication.countDocuments(query);
  }

  // Volunteer Applications
  async createVolunteerApp(data) {
    const app = new VolunteerApplication(data);
    return app.save();
  }

  async findVolunteerAppById(id) {
    return VolunteerApplication.findById(id).populate('user');
  }

  async findVolunteerApps(query = {}, sort = { createdAt: -1 }) {
    return VolunteerApplication.find(query).populate('user').sort(sort);
  }

  async updateVolunteerApp(id, updateData) {
    return VolunteerApplication.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async countVolunteerApps(query = {}) {
    return VolunteerApplication.countDocuments(query);
  }

  // Coordinator Applications
  async createCoordinatorApp(data) {
    const CoordinatorApplication = require('../models/CoordinatorApplication');
    const app = new CoordinatorApplication(data);
    return app.save();
  }

  async findCoordinatorAppById(id) {
    const CoordinatorApplication = require('../models/CoordinatorApplication');
    return CoordinatorApplication.findById(id).populate('user');
  }

  async findCoordinatorApps(query = {}, sort = { createdAt: -1 }) {
    const CoordinatorApplication = require('../models/CoordinatorApplication');
    return CoordinatorApplication.find(query).populate('user').sort(sort);
  }

  async updateCoordinatorApp(id, updateData) {
    const CoordinatorApplication = require('../models/CoordinatorApplication');
    return CoordinatorApplication.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async countCoordinatorApps(query = {}) {
    const CoordinatorApplication = require('../models/CoordinatorApplication');
    return CoordinatorApplication.countDocuments(query);
  }

  async deleteCoordinatorApp(id) {
    const CoordinatorApplication = require('../models/CoordinatorApplication');
    return CoordinatorApplication.findByIdAndDelete(id);
  }

  async deleteMembershipApp(id) {
    return MembershipApplication.findByIdAndDelete(id);
  }

  async deleteVolunteerApp(id) {
    return VolunteerApplication.findByIdAndDelete(id);
  }
}

module.exports = new ApplicationRepository();
