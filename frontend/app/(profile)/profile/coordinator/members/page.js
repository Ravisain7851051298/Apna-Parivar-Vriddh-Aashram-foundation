'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiUsers,
  FiUserPlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiCreditCard,
  FiShield,
  FiAlertCircle,
  FiDownload,
  FiMapPin,
  FiPhone,
  FiMail,
  FiX,
  FiEdit3,
  FiUploadCloud,
  FiImage,
  FiLock
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';
import toast from 'react-hot-toast';

export default function CoordinatorMembersPage() {
  const { currentUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedMember, setSelectedMember] = useState(null);

  // Edit Member Images / KYC modal
  const [editingImagesMember, setEditingImagesMember] = useState(null);
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState('');
  const [editDocFrontFile, setEditDocFrontFile] = useState(null);
  const [editDocFrontPreview, setEditDocFrontPreview] = useState('');
  const [editDocBackFile, setEditDocBackFile] = useState(null);
  const [editDocBackPreview, setEditDocBackPreview] = useState('');
  const [editPaymentFile, setEditPaymentFile] = useState(null);
  const [editPaymentPreview, setEditPaymentPreview] = useState('');
  const [isSavingImages, setIsSavingImages] = useState(false);

  const handleOpenEditImagesModal = (member) => {
    if (member.status === 'approved') {
      toast.error('Cannot edit documents once member application is approved by Admin.');
      return;
    }
    setEditingImagesMember(member);
    setEditPhotoFile(null);
    setEditPhotoPreview(getContentImageUrl(member.photoUrl) || '');
    setEditDocFrontFile(null);
    setEditDocFrontPreview(getContentImageUrl(member.documentFront || member.idProofUrl) || '');
    setEditDocBackFile(null);
    setEditDocBackPreview(getContentImageUrl(member.documentBack) || '');
    setEditPaymentFile(null);
    setEditPaymentPreview(getContentImageUrl(member.paymentScreenshot) || '');
  };

  const handleSaveMemberImages = async (e) => {
    e.preventDefault();
    if (!editingImagesMember) return;
    if (!editPhotoFile && !editDocFrontFile && !editDocBackFile && !editPaymentFile) {
      toast.error('Please select at least one document or photo file to update.');
      return;
    }

    setIsSavingImages(true);
    const formData = new FormData();
    if (editPhotoFile) formData.append('photo', editPhotoFile);
    if (editDocFrontFile) formData.append('documentFront', editDocFrontFile);
    if (editDocBackFile) formData.append('documentBack', editDocBackFile);
    if (editPaymentFile) formData.append('paymentScreenshot', editPaymentFile);

    try {
      const res = await api.put(`/coordinators/members/${editingImagesMember._id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data?.message || 'Member images updated successfully!');
      setEditingImagesMember(null);
      fetchMembers(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update member images');
    } finally {
      setIsSavingImages(false);
    }
  };

  const fetchMembers = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/coordinators/my-members');
      const list = res.data?.members || [];
      setMembers(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch enrolled members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    api.get('/coordinators/my-members')
      .then((res) => {
        if (!ignore) {
          const list = res.data?.members || [];
          setMembers(Array.isArray(list) ? list : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          toast.error(err.response?.data?.message || 'Failed to fetch enrolled members');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const totalMembers = members.length;
  const approvedMembers = members.filter(m => m.status === 'approved').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const rejectedMembers = members.filter(m => m.status === 'rejected').length;

  const filteredMembers = members.filter(m => {
    if (activeTab !== 'all' && m.status !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.phone || '').toLowerCase().includes(q) ||
      (m.assignedMemberId || '').toLowerCase().includes(q) ||
      (m.planName || '').toLowerCase().includes(q) ||
      (m.district || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 p-6 rounded-3xl text-stone-950 border border-amber-400 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-amber-950 text-[11px] font-black mb-2 border border-amber-300">
            <FiShield className="w-3.5 h-3.5 text-amber-800" />
            <span>Coordinator Roster Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Members Enrolled by You
          </h1>
          <p className="text-xs text-stone-900 font-medium mt-1">
            Tracking verified registrations and trustee approval statuses for Coordinator: <strong className="font-black">{effectiveUser?.name}</strong> ({effectiveUser?.coordinatorId || 'Coordinator'})
          </p>
        </div>

        <Link
          href="/profile/coordinator/add-member"
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <FiUserPlus className="w-4 h-4" />
          <span>+ Enroll New Member</span>
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Enrolled</span>
          <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1">{totalMembers}</div>
          <span className="text-[10px] text-stone-400 font-medium">All applications submitted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Approved Members</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{approvedMembers}</div>
          <span className="text-[10px] text-emerald-600 font-medium">ID Card &amp; Letter issued</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Approval</span>
          <div className="text-xl sm:text-2xl font-black text-amber-800 mt-1">{pendingMembers}</div>
          <span className="text-[10px] text-amber-700 font-medium">Under Trustee review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Rejected</span>
          <div className="text-xl sm:text-2xl font-black text-rose-700 mt-1">{rejectedMembers}</div>
          <span className="text-[10px] text-rose-600 font-medium">Proof verification failed</span>
        </div>
      </div>

      {/* Search and Tabs Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All', count: totalMembers },
            { id: 'pending', label: 'Pending Approval', count: pendingMembers },
            { id: 'approved', label: 'Approved', count: approvedMembers },
            { id: 'rejected', label: 'Rejected', count: rejectedMembers }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === t.id ? 'bg-stone-950 text-white' : 'bg-stone-200 text-stone-700'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, phone, plan..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Members List Table / Cards */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-stone-500">Loading your enrolled members...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-amber-200">
            <FiUsers className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-black text-stone-800">No Members Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {searchQuery
              ? 'No enrolled members match your search criteria.'
              : 'You haven\'t enrolled any members yet. Click the button below to register your first member!'}
          </p>
          <div className="pt-2">
            <Link
              href="/profile/coordinator/add-member"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-md transition"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Enroll New Member</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4">Enrolled Date</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMembers.map((m) => {
                  const isApproved = m.status === 'approved';
                  const isPending = m.status === 'pending';
                  const isRejected = m.status === 'rejected';

                  return (
                    <tr key={m._id} className="hover:bg-amber-50/30 transition">
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getContentImageUrl(m.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                            alt={m.name}
                            className="w-9 h-9 rounded-full object-cover border border-amber-300 shadow-2xs"
                          />
                          <div>
                            <h4 className="font-bold text-stone-900">{m.name}</h4>
                            {m.assignedMemberId ? (
                              <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                {m.assignedMemberId}
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">ID Pending Approval</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-stone-700">{m.phone}</div>
                        <div className="text-[11px] text-stone-400 truncate max-w-36">{m.email || 'No email provided'}</div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{m.planName || 'Membership Plan'}</div>
                        <div className="text-[11px] font-bold text-amber-900">
                          ₹{Number(m.feeAmount || m.amount || 0).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                        {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Approved by Admin</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                            <FiClock className="w-3 h-3 text-amber-600 animate-pulse" />
                            <span>Pending Admin Review</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                            <FiXCircle className="w-3 h-3 text-rose-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleOpenEditImagesModal(m)}
                              title="Edit Member Images & KYC Documents (Available while pending approval)"
                              className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FiEdit3 className="w-3.5 h-3.5 text-amber-800" />
                              <span>Edit Images</span>
                            </button>
                          )}
                          {isApproved && (
                            <span
                              title="Official documents locked upon Admin approval"
                              className="px-2 py-1 rounded-xl bg-slate-100 text-slate-500 font-bold text-[10px] inline-flex items-center gap-1"
                            >
                              <FiLock className="w-3 h-3" />
                              <span>Locked</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-stone-800 hover:text-stone-900 font-bold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-amber-300 shadow-2xl relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getContentImageUrl(selectedMember.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={selectedMember.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
              />
              <div>
                <h3 className="font-black text-stone-900 text-base">{selectedMember.name}</h3>
                <p className="text-xs text-stone-500">{selectedMember.designation || 'Registered Member'}</p>
                {selectedMember.assignedMemberId && (
                  <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    {selectedMember.assignedMemberId}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Status:</span>
                <span className="font-black capitalize text-stone-900">{selectedMember.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Plan:</span>
                <span className="font-bold text-stone-900">{selectedMember.planName} (₹{selectedMember.feeAmount || selectedMember.amount})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Phone:</span>
                <span className="font-bold text-stone-900">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Email:</span>
                <span className="font-bold text-stone-900">{selectedMember.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Transaction / UTR:</span>
                <span className="font-mono font-bold text-stone-900">{selectedMember.utrNumber || selectedMember.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Address:</span>
                <span className="font-medium text-stone-900 text-right">{selectedMember.address ? `${selectedMember.address}, ` : ''}{selectedMember.district}, {selectedMember.state}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500 font-medium">Enrolled By:</span>
                <span className="font-bold text-amber-900">{effectiveUser?.name} ({effectiveUser?.coordinatorId || 'Coordinator'})</span>
              </div>
            </div>

            {selectedMember.rejectionReason && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800">
                <strong>Rejection Reason:</strong> {selectedMember.rejectionReason}
              </div>
            )}

            {selectedMember.status === 'pending' ? (
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const m = selectedMember;
                    setSelectedMember(null);
                    handleOpenEditImagesModal(m);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Edit Photos &amp; KYC Documents</span>
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 rounded-xl bg-stone-950 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT MEMBER IMAGES & KYC DOCUMENTS (UNTIL APPROVED) */}
      {/* ============================================================== */}
      {editingImagesMember && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-amber-300 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200 shrink-0">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                  KYC Verification Update
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  Edit Documents: {editingImagesMember.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Status: <strong className="text-amber-800 uppercase font-black">Pending Approval</strong> • Documents can be updated until Admin final approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingImagesMember(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMemberImages} className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
              {/* 1. Member Photo */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 flex items-center gap-1.5">
                  <FiImage className="w-4 h-4 text-amber-600" />
                  <span>Passport Photo (Member Display Picture)</span>
                </label>
                <div className="flex items-center gap-3">
                  {editPhotoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editPhotoPreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400 font-bold shrink-0">
                      No Photo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditPhotoFile(file);
                        setEditPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* 2. Aadhaar / Govt ID Front */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 flex items-center gap-1.5">
                  <FiShield className="w-4 h-4 text-amber-600" />
                  <span>Aadhaar / Voter ID (Front Side)</span>
                </label>
                <div className="flex items-center gap-3">
                  {editDocFrontPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editDocFrontPreview}
                      alt="Front preview"
                      className="w-16 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-stone-200 flex items-center justify-center text-[10px] text-stone-400 font-bold shrink-0">
                      No Front
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditDocFrontFile(file);
                        setEditDocFrontPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Aadhaar / Govt ID Back */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 flex items-center gap-1.5">
                  <FiShield className="w-4 h-4 text-amber-600" />
                  <span>Aadhaar / Voter ID (Back Side)</span>
                </label>
                <div className="flex items-center gap-3">
                  {editDocBackPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editDocBackPreview}
                      alt="Back preview"
                      className="w-16 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-stone-200 flex items-center justify-center text-[10px] text-stone-400 font-bold shrink-0">
                      No Back
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditDocBackFile(file);
                        setEditDocBackPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Payment Screenshot */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 flex items-center gap-1.5">
                  <FiCreditCard className="w-4 h-4 text-emerald-600" />
                  <span>UPI Payment Screenshot / Fee Receipt</span>
                </label>
                <div className="flex items-center gap-3">
                  {editPaymentPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editPaymentPreview}
                      alt="Receipt preview"
                      className="w-16 h-12 rounded-xl object-cover border border-emerald-400 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-stone-200 flex items-center justify-center text-[10px] text-stone-400 font-bold shrink-0">
                      No Receipt
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditPaymentFile(file);
                        setEditPaymentPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-900 hover:file:bg-emerald-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingImagesMember(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingImages}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingImages ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiUploadCloud className="w-4 h-4" />}
                  <span>{isSavingImages ? 'Uploading & Updating...' : 'Save Updated Documents'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
