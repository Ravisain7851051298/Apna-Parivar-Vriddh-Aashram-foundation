/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FiShield,
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiX,
  FiAward,
  FiFileText,
  FiEdit3,
  FiSend,
  FiUserX,
  FiCreditCard,
  FiPower,
} from 'react-icons/fi';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Enrolled members modal
  const [selectedCoordForMembers, setSelectedCoordForMembers] = useState(null);
  const [coordMembers, setCoordMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Promote existing user modal
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [promoteDesignation, setPromoteDesignation] = useState('District / Field Coordinator');
  const [promoteArea, setPromoteArea] = useState('Aligarh District');
  const [promoting, setPromoting] = useState(false);

  // Create new coordinator modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCoord, setNewCoord] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'District / Field Coordinator',
    coordinatorArea: 'Aligarh District',
    bloodGroup: 'O+',
    dob: '1995-01-01',
    address: '',
    district: 'Aligarh',
    state: 'Uttar Pradesh',
    documentType: 'Aadhaar Card'
  });
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState('');
  const [newDocFrontFile, setNewDocFrontFile] = useState(null);
  const [newDocFrontPreview, setNewDocFrontPreview] = useState('');
  const [newDocBackFile, setNewDocBackFile] = useState(null);
  const [newDocBackPreview, setNewDocBackPreview] = useState('');

  // Image preview modal
  const [previewImage, setPreviewImage] = useState(null);

  // Edit Coordinator Modal
  const [editingCoord, setEditingCoord] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    designation: '',
    coordinatorArea: '',
    coordinatorStatus: 'active'
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Resend Credentials Modal
  const [resendModalCoord, setResendModalCoord] = useState(null);
  const [resendCustomPass, setResendCustomPass] = useState('');
  const [isResending, setIsResending] = useState(false);

  // 1. Fetch all coordinators
  const fetchCoordinators = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/coordinators');
      const list = res.data?.coordinators || [];
      setCoordinators(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load coordinators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    api.get('/coordinators')
      .then((res) => {
        if (!ignore) {
          const list = res.data?.coordinators || [];
          setCoordinators(Array.isArray(list) ? list : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          toast.error(err.response?.data?.message || 'Failed to load coordinators');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  // 2. Load members enrolled by coordinator
  const handleViewEnrolledMembers = async (coord) => {
    setSelectedCoordForMembers(coord);
    setLoadingMembers(true);
    try {
      const res = await api.get(`/coordinators/${coord._id}/members`);
      setCoordMembers(res.data?.members || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load enrolled members');
      setCoordMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // 3. Open Promote Modal & fetch users
  const handleOpenPromoteModal = async () => {
    setPromoteModalOpen(true);
    setSelectedUserId('');
    setUserSearch('');
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      const usersList = res.data?.users || res.data?.data || [];
      setExistingUsers(Array.isArray(usersList) ? usersList : []);
    } catch (err) {
      toast.error('Failed to load user list');
    } finally {
      setLoadingUsers(false);
    }
  };

  // 3b. Open Edit Modal
  const handleOpenEditModal = (coord) => {
    setEditingCoord(coord);
    setEditForm({
      name: coord.name || '',
      phone: coord.phone || '',
      designation: coord.designation || 'District / Field Coordinator',
      coordinatorArea: coord.coordinatorArea || coord.district || 'Regional Operations',
      coordinatorStatus: coord.coordinatorStatus || coord.status || 'active'
    });
  };

  // 3c. Submit Edit Coordinator
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCoord) return;
    setIsSavingEdit(true);
    try {
      const res = await api.put(`/coordinators/${editingCoord._id}`, editForm);
      toast.success(res.data?.message || 'Coordinator updated successfully!');
      setEditingCoord(null);
      fetchCoordinators(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update coordinator');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 3d. Toggle Coordinator Status
  const handleToggleStatus = async (coord) => {
    const currentStatus = coord.coordinatorStatus || coord.status || 'active';
    const targetStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to mark Coordinator ${coord.name} as ${targetStatus.toUpperCase()}?`)) {
      return;
    }
    try {
      const res = await api.patch(`/coordinators/${coord._id}/status`);
      toast.success(res.data?.message || `Coordinator marked as ${targetStatus}`);
      setCoordinators((prev) =>
        prev.map((c) =>
          c._id === coord._id
            ? { ...c, coordinatorStatus: targetStatus, status: targetStatus }
            : c
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle coordinator status');
    }
  };

  // 3e. Resend Credentials Email
  const handleResendCredentials = async (e) => {
    e.preventDefault();
    if (!resendModalCoord) return;
    setIsResending(true);
    try {
      const res = await api.post(`/coordinators/${resendModalCoord._id}/resend-credentials`, {
        newPassword: resendCustomPass.trim() || undefined
      });
      toast.success(res.data?.message || 'Credentials & official documents emailed successfully!');
      setResendModalCoord(null);
      setResendCustomPass('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send credentials email');
    } finally {
      setIsResending(false);
    }
  };

  // 3f. Revoke Coordinator Role
  const handleRevokeRole = async (coord) => {
    if (!window.confirm(`Are you sure you want to REVOKE the Coordinator role for ${coord.name}? Their account will be converted back to a regular member.`)) {
      return;
    }
    try {
      const res = await api.delete(`/coordinators/${coord._id}`);
      toast.success(res.data?.message || 'Coordinator role revoked');
      fetchCoordinators(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke role');
    }
  };

  // 4. Submit Promote Existing User
  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select a user to promote');
      return;
    }

    setPromoting(true);
    try {
      const res = await api.post('/coordinators/promote-existing', {
        userId: selectedUserId,
        designation: promoteDesignation,
        coordinatorArea: promoteArea
      });

      toast.success(res.data?.message || 'User promoted to Coordinator successfully!');
      setPromoteModalOpen(false);
      fetchCoordinators();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign Coordinator role');
    } finally {
      setPromoting(false);
    }
  };

  // 5. Submit Create New Coordinator
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newCoord.name.trim() || !newCoord.email.trim() || !newCoord.phone.trim()) {
      toast.error('Name, Email, and Phone number are required.');
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      Object.entries(newCoord).forEach(([k, v]) => {
        formData.append(k, v);
      });

      if (newPhotoFile) formData.append('photo', newPhotoFile);
      if (newDocFrontFile) formData.append('documentFront', newDocFrontFile);
      if (newDocBackFile) formData.append('documentBack', newDocBackFile);

      const res = await api.post('/coordinators/create-new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(res.data?.message || 'Coordinator created successfully!');
      setCreateModalOpen(false);
      // Reset form
      setNewCoord({
        name: '',
        email: '',
        phone: '',
        password: '',
        designation: 'District / Field Coordinator',
        coordinatorArea: 'Aligarh District',
        bloodGroup: 'O+',
        dob: '1995-01-01',
        address: '',
        district: 'Aligarh',
        state: 'Uttar Pradesh',
        documentType: 'Aadhaar Card'
      });
      setNewPhotoFile(null);
      setNewPhotoPreview('');
      setNewDocFrontFile(null);
      setNewDocFrontPreview('');
      setNewDocBackFile(null);
      setNewDocBackPreview('');

      fetchCoordinators();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create new coordinator');
    } finally {
      setCreating(false);
    }
  };

  // Filtered Coordinators
  const filteredCoordinators = useMemo(() => {
    if (!searchQuery.trim()) return coordinators;
    const q = searchQuery.toLowerCase();
    return coordinators.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.coordinatorId || '').toLowerCase().includes(q) ||
      (c.coordinatorArea || '').toLowerCase().includes(q) ||
      (c.district || '').toLowerCase().includes(q)
    );
  }, [coordinators, searchQuery]);

  // Aggregate Stats
  const totalCoordinators = coordinators.length;
  const totalMembersEnrolled = coordinators.reduce((sum, c) => sum + (c.membersCount || 0), 0);
  const totalApprovedMembers = coordinators.reduce((sum, c) => sum + (c.approvedCount || 0), 0);
  const totalPendingMembers = coordinators.reduce((sum, c) => sum + (c.pendingCount || 0), 0);

  // Filtered users for promotion modal
  const eligibleUsers = useMemo(() => {
    return existingUsers.filter(u => {
      // Exclude already coordinators or admins if desired
      const isAlreadyCoord = u.role === 'Coordinator' || u.isCoordinator;
      if (isAlreadyCoord) return false;
      if (!userSearch.trim()) return true;
      const q = userSearch.toLowerCase();
      return (
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q) ||
        (u.memberId || '').toLowerCase().includes(q)
      );
    });
  }, [existingUsers, userSearch]);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="w-full bg-linear-to-r from-amber-100/90 via-[#fefce8] to-amber-50 p-4 rounded-bl-3xl border-b border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-white text-amber-900 border border-amber-300 shadow-2xs shrink-0">
              <FiShield className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-stone-950 tracking-tight">
                Regional Coordinators Management
              </h1>
              <p className="text-xs text-amber-950/80 font-medium">
                Apna Parivar Vriddh Aashram Foundation • Executive Coordination Wing
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 text-xs font-black shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add New Coordinator</span>
          </button>

          <button
            onClick={handleOpenPromoteModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FiAward className="w-3.5 h-3.5 text-amber-700" />
            <span>Promote User</span>
          </button>

          <button
            onClick={fetchCoordinators}
            className="p-2 rounded-xl bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 transition cursor-pointer shadow-2xs"
            title="Refresh"
            aria-label="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 text-amber-800 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-stone-600 hover:text-amber-900 bg-white/80 hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition shadow-2xs"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Content wrapper with px-3 space-y-4 */}
      <div className="px-3 space-y-4 pb-16">
        {/* ----------------- 4 STATS METRICS ----------------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
            Total Coordinators
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalCoordinators}</span>
            <span className="text-xs font-bold text-amber-600">Active Leaders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
            Members Enrolled
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-700">{totalMembersEnrolled}</span>
            <span className="text-xs font-bold text-blue-500">Total Enrolled</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
            Approved Members
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{totalApprovedMembers}</span>
            <span className="text-xs font-bold text-emerald-500">Sealed &amp; Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
            Pending Admin Review
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{totalPendingMembers}</span>
            <span className="text-xs font-bold text-amber-500">Needs Approval</span>
          </div>
        </div>
      </div>

      {/* ----------------- SEARCH & CONTROLS BAR ----------------- */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coordinators by name, ID, mobile, area..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={fetchCoordinators}
          className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* ----------------- COORDINATORS LIST / CARDS ----------------- */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-600 font-bold">Loading Coordinators Directory...</p>
        </div>
      ) : filteredCoordinators.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-3xl flex items-center justify-center mx-auto text-2xl border border-amber-200">
            <FiShield className="w-7 h-7" />
          </div>
          <h3 className="font-black text-slate-900 text-base">No Coordinators Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No coordinator matches "${searchQuery}". Try a different keyword.`
              : 'No coordinators have been appointed yet. Click "+ Add New Coordinator" or "Assign from Existing User" to create one.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCoordinators.map((coord) => (
            <div
              key={coord._id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              {/* Coordinator Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        getContentImageUrl(coord.photoUrl) ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                      }
                      alt={coord.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 ring-2 ring-amber-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                      }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 text-sm truncate">{coord.name}</h3>
                      <p className="text-[11px] font-extrabold text-amber-700 truncate">
                        {coord.designation || 'Field Coordinator'}
                      </p>
                      <span className="font-mono text-[10px] font-bold text-slate-600 block">
                        {coord.coordinatorId || 'APVAF-CRD-ACTIVE'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(coord)}
                    title="Click to toggle Active / Suspended status"
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer transition shrink-0 ${coord.coordinatorStatus === 'suspended' || coord.status === 'suspended'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                      }`}
                  >
                    {coord.coordinatorStatus === 'suspended' || coord.status === 'suspended'
                      ? '● Suspended'
                      : '● Active'}
                  </button>
                </div>

                {/* Direct Credentials Link Strip */}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold">
                  <Link
                    href={`/verify/coordinator/${coord.coordinatorId || coord._id}`}
                    target="_blank"
                    className="flex-1 py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-center transition flex items-center justify-center gap-1"
                  >
                    <FiCreditCard className="w-3 h-3 text-amber-700" />
                    <span>ID Badge</span>
                  </Link>
                  <Link
                    href={`/profile/appointment-letter?type=coordinator`}
                    target="_blank"
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-center transition flex items-center justify-center gap-1"
                  >
                    <FiFileText className="w-3 h-3 text-slate-600" />
                    <span>Letter</span>
                  </Link>
                </div>

                {/* Details list */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 truncate">
                    <FiMapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">
                      <strong>Area:</strong> {coord.coordinatorArea || coord.district || 'Regional Operations'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <FiMail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{coord.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <FiPhone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{coord.phone}</span>
                  </div>
                </div>

                {/* Member Enrollment Metrics Pill */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 block">Members Enrolled</span>
                    <strong className="text-base font-black text-amber-950">
                      {coord.membersCount || 0}
                    </strong>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold block">Approved</span>
                      <strong className="text-xs font-black text-emerald-800">
                        {coord.approvedCount || 0}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-bold block">Pending</span>
                      <strong className="text-xs font-black text-amber-800">
                        {coord.pendingCount || 0}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleViewEnrolledMembers(coord)}
                  className="w-full py-2 px-3 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiUsers className="w-4 h-4 text-stone-950" />
                  <span>Enrolled Members ({coord.membersCount || 0})</span>
                </button>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setResendModalCoord(coord);
                      setResendCustomPass('');
                    }}
                    title="Resend Appointment Letter, ID Card & Credentials Email"
                    className="py-1.5 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition flex items-center justify-center gap-1 border border-indigo-200 cursor-pointer"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(coord)}
                    title="Edit Coordinator Details"
                    className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition flex items-center justify-center gap-1 border border-amber-200 cursor-pointer"
                  >
                    <FiEdit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(coord)}
                    title={coord.coordinatorStatus === 'suspended' || coord.status === 'suspended' ? 'Activate Coordinator' : 'Suspend Coordinator'}
                    className={`py-1.5 px-2 rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1 border cursor-pointer ${coord.coordinatorStatus === 'suspended' || coord.status === 'suspended'
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                  >
                    <FiPower className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {coord.coordinatorStatus === 'suspended' || coord.status === 'suspended' ? 'Active' : 'Halt'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRevokeRole(coord)}
                    title="Revoke Coordinator Role"
                    className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition flex items-center justify-center gap-1 border border-rose-200 cursor-pointer"
                  >
                    <FiUserX className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Revoke</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: VIEW ENROLLED MEMBERS BY COORDINATOR */}
      {/* ============================================================== */}
      {selectedCoordForMembers && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                  Coordinator Roster Inspection
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Members Enrolled by {selectedCoordForMembers.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Coordinator ID: <strong className="font-mono text-amber-900">{selectedCoordForMembers.coordinatorId}</strong> • Mobile: {selectedCoordForMembers.phone}
                </p>
              </div>

              <button
                onClick={() => setSelectedCoordForMembers(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Members table/list */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3">
              {loadingMembers ? (
                <div className="py-12 text-center text-xs font-bold text-slate-500">
                  Loading enrolled members...
                </div>
              ) : coordMembers.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  This coordinator has not enrolled any members yet.
                </div>
              ) : (
                coordMembers.map((m) => (
                  <div
                    key={m._id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          getContentImageUrl(m.photoUrl) ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                        }
                        alt={m.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900">{m.name}</h4>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${m.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {m.email} • {m.phone}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Plan: <strong>{m.planName || 'Membership'}</strong> • Fee: ₹{m.feeAmount || m.amount || 1100} • UTR: {m.transactionId || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {m.paymentScreenshot && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(m.paymentScreenshot)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 cursor-pointer"
                        >
                          <FiEye className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      )}
                      {(m.documentFront || m.idProofUrl) && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(m.documentFront || m.idProofUrl)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200 flex items-center gap-1 cursor-pointer"
                        >
                          <FiEye className="w-3 h-3" />
                          <span>KYC Front</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 font-medium">
              <span>Total Enrolled: <strong>{coordMembers.length}</strong></span>
              <button
                onClick={() => setSelectedCoordForMembers(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ASSIGN / PROMOTE EXISTING USER TO COORDINATOR */}
      {/* ============================================================== */}
      {promoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                  Role Promotion
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Assign Coordinator Role from Existing User
                </h3>
              </div>
              <button
                onClick={() => setPromoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  1. Search &amp; Select Existing User Account:
                </label>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter users by name, email, phone..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
                />

                {loadingUsers ? (
                  <p className="text-xs text-slate-500 italic">Loading users...</p>
                ) : (
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="">-- Choose User ({eligibleUsers.length} available) --</option>
                    {eligibleUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email} • {u.phone}) - {u.role || 'Member'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  2. Official Coordinator Designation:
                </label>
                <input
                  type="text"
                  value={promoteDesignation}
                  onChange={(e) => setPromoteDesignation(e.target.value)}
                  placeholder="e.g. District / Field Coordinator"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  3. Assigned Operational Jurisdiction / Area:
                </label>
                <input
                  type="text"
                  value={promoteArea}
                  onChange={(e) => setPromoteArea(e.target.value)}
                  placeholder="e.g. Aligarh District & Surrounding Tehsils"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-[11px] text-amber-950 leading-relaxed space-y-1">
                <p>
                  ✅ <strong>Instant Statutory Actions:</strong> This user will receive Coordinator privileges, a unique Coordinator ID, a dual-sided ID card, and an official appointment letter emailed automatically.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPromoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={promoting || !selectedUserId}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {promoting ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{promoting ? 'Promoting...' : 'Confirm & Appoint Coordinator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CREATE BRAND NEW COORDINATOR FROM SCRATCH */}
      {/* ============================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                  New Coordinator Enrollment
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Create New Coordinator (Direct Trust Induction)
                </h3>
                <p className="text-xs text-slate-500">
                  Credentials and official appointment letter will be mailed to the newly created coordinator.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={newCoord.name}
                    onChange={(e) => setNewCoord({ ...newCoord, name: e.target.value })}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newCoord.email}
                    onChange={(e) => setNewCoord({ ...newCoord, email: e.target.value })}
                    required
                    placeholder="coordinator@domain.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={newCoord.phone}
                    onChange={(e) => setNewCoord({ ...newCoord, phone: e.target.value })}
                    required
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Portal Password (Optional)</label>
                  <input
                    type="text"
                    value={newCoord.password}
                    onChange={(e) => setNewCoord({ ...newCoord, password: e.target.value })}
                    placeholder="Leave blank for auto-generated password"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newCoord.designation}
                    onChange={(e) => setNewCoord({ ...newCoord, designation: e.target.value })}
                    placeholder="District / Field Coordinator"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Operational Area / Jurisdiction</label>
                  <input
                    type="text"
                    value={newCoord.coordinatorArea}
                    onChange={(e) => setNewCoord({ ...newCoord, coordinatorArea: e.target.value })}
                    placeholder="e.g. Aligarh District"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Blood Group</label>
                  <select
                    value={newCoord.bloodGroup}
                    onChange={(e) => setNewCoord({ ...newCoord, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newCoord.dob}
                    onChange={(e) => setNewCoord({ ...newCoord, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">District</label>
                  <input
                    type="text"
                    value={newCoord.district}
                    onChange={(e) => setNewCoord({ ...newCoord, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">State</label>
                  <input
                    type="text"
                    value={newCoord.state}
                    onChange={(e) => setNewCoord({ ...newCoord, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Photo & KYC Uploads */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900">Coordinator Photo &amp; KYC Verification Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Passport Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setNewPhotoFile(f);
                          setNewPhotoPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="text-[11px] w-full"
                    />
                    {newPhotoPreview && (
                      <img src={newPhotoPreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-200" />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">KYC Front (Aadhaar / Voter ID)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setNewDocFrontFile(f);
                          setNewDocFrontPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="text-[11px] w-full"
                    />
                    {newDocFrontPreview && (
                      <img src={newDocFrontPreview} alt="Doc front" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-200" />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">KYC Back (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setNewDocBackFile(f);
                          setNewDocBackPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="text-[11px] w-full"
                    />
                    {newDocBackPreview && (
                      <img src={newDocBackPreview} alt="Doc back" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-200" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {creating ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{creating ? 'Creating Coordinator...' : 'Create Coordinator & Dispatch Letter'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* IMAGE PREVIEW MODAL */}
      {/* ============================================================== */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-black text-slate-900 text-sm">Document Verification Preview</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
              <img
                src={getContentImageUrl(previewImage)}
                alt="Document proof preview"
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL 4: EDIT COORDINATOR DETAILS */}
      {/* ============================================================== */}
      {editingCoord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                  Modify Coordinator
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Edit Details: {editingCoord.name}
                </h3>
                <p className="text-xs font-mono text-amber-800">{editingCoord.coordinatorId}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCoord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Designation Title</label>
                <input
                  type="text"
                  value={editForm.designation}
                  onChange={(e) => setEditForm((p) => ({ ...p, designation: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Area of Operation / Zone</label>
                <input
                  type="text"
                  value={editForm.coordinatorArea}
                  onChange={(e) => setEditForm((p) => ({ ...p, coordinatorArea: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Account Status</label>
                <select
                  value={editForm.coordinatorStatus}
                  onChange={(e) => setEditForm((p) => ({ ...p, coordinatorStatus: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="active">Active (Full Access)</option>
                  <option value="suspended">Suspended (Access Halted)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCoord(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingEdit ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{isSavingEdit ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: RESEND APPOINTMENT LETTER, ID CARD & CREDENTIALS */}
      {/* ============================================================== */}
      {resendModalCoord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-300 inline-block mb-1">
                  Email Dispatch Hub
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Resend Official Documents &amp; Credentials
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Coordinator: <strong>{resendModalCoord.name}</strong> ({resendModalCoord.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResendModalCoord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 space-y-2">
              <p className="font-semibold">
                This action will automatically generate and attach:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium">
                <li><strong>Official Appointment Letter PDF</strong> with Trust President seals</li>
                <li><strong>Dual-Sided Coordinator ID Card PDF</strong> with scannable QR verification</li>
                <li>Coordinator portal sign-in URL &amp; instructions</li>
              </ul>
            </div>

            <form onSubmit={handleResendCredentials} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Optional: Set New Temporary Password
                </label>
                <input
                  type="text"
                  value={resendCustomPass}
                  onChange={(e) => setResendCustomPass(e.target.value)}
                  placeholder="Leave blank to keep existing password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  If left blank, the email will notify the coordinator to use their registered password. If filled, their password will be updated and clearly displayed in the email.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setResendModalCoord(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResending}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isResending ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiSend className="w-3.5 h-3.5" />}
                  <span>{isResending ? 'Generating & Sending...' : 'Dispatch Email with Attached PDFs'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
