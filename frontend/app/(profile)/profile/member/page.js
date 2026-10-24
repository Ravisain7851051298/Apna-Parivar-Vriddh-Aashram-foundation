'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiCreditCard,
  FiShield,
  FiFileText,
  FiAward,
  FiCheckCircle,
  FiCheck,
  FiClock,
  FiArrowRight,
  FiDownload,
  FiUserCheck,
  FiAlertCircle,
  FiExternalLink,
  FiEdit3,
  FiUploadCloud,
  FiLock,
  FiX,
  FiCamera
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { getContentImageUrl } from '@/lib/authApi';

export default function ProfileMemberPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const memberApp = effectiveUser?.membershipApplication;

  const isApproved = Boolean(
    effectiveUser?.role === 'Member' ||
    effectiveUser?.role === 'Admin' ||
    memberApp?.status === 'approved' ||
    (effectiveUser?.memberId && !effectiveUser?.memberId?.startsWith('APVAF-DON-') && !effectiveUser?.memberId?.startsWith('BYK-DON-')) ||
    (effectiveUser?.isMember && effectiveUser?.status === 'active')
  );

  const isPending = Boolean(
    !isApproved && (
      memberApp?.status === 'pending' ||
      (effectiveUser?.status === 'pending' && (effectiveUser?.feePaid || memberApp || effectiveUser?.membershipPlan))
    )
  );

  const isMemberOrApplicant = isApproved || isPending;

  // Edit Images & Documents State (available until approved)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState('');
  const [editDocFrontFile, setEditDocFrontFile] = useState(null);
  const [editDocFrontPreview, setEditDocFrontPreview] = useState('');
  const [editDocBackFile, setEditDocBackFile] = useState(null);
  const [editDocBackPreview, setEditDocBackPreview] = useState('');
  const [editPaymentFile, setEditPaymentFile] = useState(null);
  const [editPaymentPreview, setEditPaymentPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleOpenEditModal = () => {
    if (isApproved) {
      toast.error('Your membership is already approved by the Admin. Documents are statutorily locked.');
      return;
    }
    const currentPhoto = effectiveUser?.photoUrl || memberApp?.photoUrl || '';
    const currentDocFront = effectiveUser?.documentFront || memberApp?.documentFront || memberApp?.idProofUrl || '';
    const currentDocBack = effectiveUser?.documentBack || memberApp?.documentBack || '';
    const currentPayment = effectiveUser?.paymentScreenshot || memberApp?.paymentScreenshot || '';

    setEditPhotoFile(null);
    setEditPhotoPreview(getContentImageUrl(currentPhoto) || '');
    setEditDocFrontFile(null);
    setEditDocFrontPreview(getContentImageUrl(currentDocFront) || '');
    setEditDocBackFile(null);
    setEditDocBackPreview(getContentImageUrl(currentDocBack) || '');
    setEditPaymentFile(null);
    setEditPaymentPreview(getContentImageUrl(currentPayment) || '');
    setValidationError('');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (editPhotoPreview && editPhotoPreview.startsWith('blob:')) URL.revokeObjectURL(editPhotoPreview);
    if (editDocFrontPreview && editDocFrontPreview.startsWith('blob:')) URL.revokeObjectURL(editDocFrontPreview);
    if (editDocBackPreview && editDocBackPreview.startsWith('blob:')) URL.revokeObjectURL(editDocBackPreview);
    if (editPaymentPreview && editPaymentPreview.startsWith('blob:')) URL.revokeObjectURL(editPaymentPreview);
    setIsEditModalOpen(false);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Photo size must be under 15MB.');
      return;
    }
    setValidationError('');
    setEditPhotoFile(file);
    setEditPhotoPreview(URL.createObjectURL(file));
  };

  const handleDocFrontSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('ID Proof Front size must be under 15MB.');
      return;
    }
    setValidationError('');
    setEditDocFrontFile(file);
    setEditDocFrontPreview(URL.createObjectURL(file));
  };

  const handleDocBackSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('ID Proof Back size must be under 15MB.');
      return;
    }
    setValidationError('');
    setEditDocBackFile(file);
    setEditDocBackPreview(URL.createObjectURL(file));
  };

  const handlePaymentSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Payment Receipt size must be under 15MB.');
      return;
    }
    setValidationError('');
    setEditPaymentFile(file);
    setEditPaymentPreview(URL.createObjectURL(file));
  };

  const handleSaveDocuments = async (e) => {
    e.preventDefault();
    if (!editPhotoFile && !editDocFrontFile && !editDocBackFile && !editPaymentFile) {
      toast.error('Please select at least one document or receipt to update.');
      return;
    }

    setIsSaving(true);
    setValidationError('');
    const formData = new FormData();
    if (editPhotoFile) formData.append('photo', editPhotoFile);
    if (editDocFrontFile) formData.append('documentFront', editDocFrontFile);
    if (editDocBackFile) formData.append('documentBack', editDocBackFile);
    if (editPaymentFile) formData.append('paymentScreenshot', editPaymentFile);

    const targetId = memberApp?._id || effectiveUser?._id;
    try {
      const res = await api.put(`/applications/members/${targetId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data?.message || 'Membership verification documents updated successfully!');
      handleCloseEditModal();
      if (refreshUser) refreshUser();
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Failed to update documents. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to update documents');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <FiCreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Constitutional Governance Wing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Official Foundation Membership
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Verified membership credentials, statutory privileges, and executive council status under Section 12A &amp; 80G.
          </p>
        </div>

        {isApproved && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/profile/id-card?type=member"
              className="px-4 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <FiShield className="w-4 h-4" />
              <span>Member ID Card</span>
            </Link>
            <Link
              href="/profile/appointment-letter"
              className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <FiFileText className="w-4 h-4" />
              <span>Appointment Letter</span>
            </Link>
          </div>
        )}
      </div>

      {/* ----------------- MEMBER STATUS DISPLAY ----------------- */}
      {isMemberOrApplicant ? (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden ${
            isPending
              ? 'bg-linear-to-r from-amber-600 via-amber-700 to-stone-900'
              : 'bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-xs inline-block ${
                  isPending ? 'bg-amber-400 text-stone-950' : 'bg-white/20 text-white'
                }`}>
                  {isPending ? 'Membership Under Review by Trustees' : 'Verified Active Member'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  {effectiveUser?.name}
                </h2>
                <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                  {isPending
                    ? 'Your membership enrolment and bank ledger receipt are undergoing statutory audit by the Board of Trustees. Once approved, your official Member ID Card and Appointment Letter will be issued and emailed.'
                    : `You are officially enrolled as a verified member of ${settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}. Your statutory rights include voting participation in the annual general assembly, digital identity verification, and community representation.`
                  }
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Official Membership ID</span>
                <span className="text-xl font-mono font-black text-white block mt-0.5">
                  {isPending ? 'AUDIT-IN-PROGRESS' : (effectiveUser?.memberId || 'MEM-VERIFIED')}
                </span>
                <span className="text-[10px] text-emerald-200 mt-1 inline-flex items-center gap-1">
                  {isPending ? (
                    <>
                      <FiClock className="w-3 h-3 text-amber-300" /> Statutory Audit
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-3 h-3 text-emerald-300" /> Anti-Fraud Verifiable
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Pre-Approval KYC & Image Verification Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-stone-900 text-sm sm:text-base">
                    Statutory KYC &amp; Payment Verification
                  </h3>
                  {isPending ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                      Editable Pre-Approval
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <FiLock className="w-2.5 h-2.5" /> Statutorily Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  {isPending
                    ? 'You can review or replace your Passport Photo, Aadhaar / ID Proof, and Payment Screenshot until final Admin approval.'
                    : 'Documents are permanently locked to preserve statutory compliance and legal audit integrity.'}
                </p>
              </div>

              {isPending ? (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                  <span>Edit KYC Documents &amp; Receipt</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold self-start sm:self-auto">
                  <FiLock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Locked (Approved)</span>
                </span>
              )}
            </div>

            {/* Document Previews Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                {effectiveUser?.photoUrl || memberApp?.photoUrl ? (
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.photoUrl || memberApp?.photoUrl)}
                      alt="Member Photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiCamera className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate text-xs">Passport Photo</span>
                  <span className="text-[10px] text-stone-500 block">
                    {effectiveUser?.photoUrl || memberApp?.photoUrl ? 'Uploaded' : 'Missing'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                {effectiveUser?.documentFront || memberApp?.documentFront || memberApp?.idProofUrl ? (
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.documentFront || memberApp?.documentFront || memberApp?.idProofUrl)}
                      alt="ID Proof Front"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiFileText className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate text-xs">ID Proof (Front)</span>
                  <span className="text-[10px] text-stone-500 block">
                    {effectiveUser?.documentFront || memberApp?.documentFront || memberApp?.idProofUrl ? 'Uploaded' : 'Missing'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                {effectiveUser?.documentBack || memberApp?.documentBack ? (
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.documentBack || memberApp?.documentBack)}
                      alt="ID Proof Back"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiFileText className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate text-xs">ID Proof (Back)</span>
                  <span className="text-[10px] text-stone-500 block">
                    {effectiveUser?.documentBack || memberApp?.documentBack ? 'Uploaded' : 'Missing'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                {effectiveUser?.paymentScreenshot || memberApp?.paymentScreenshot ? (
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.paymentScreenshot || memberApp?.paymentScreenshot)}
                      alt="Payment Screenshot"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiCreditCard className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate text-xs">Fee Receipt</span>
                  <span className="text-[10px] text-stone-500 block">
                    {effectiveUser?.paymentScreenshot || memberApp?.paymentScreenshot ? 'Uploaded' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Enrolment Plan</span>
              <span className="font-black text-black text-sm mt-1 block">
                {effectiveUser?.membershipPlan || memberApp?.planName || 'Standard Constitutional Member'}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                {isPending ? 'Verification Pending' : 'Active & Compliant'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Designation / Role</span>
              <span className="font-black text-black text-sm mt-1 block">
                {effectiveUser?.designation || 'Active Social Worker'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Executive Council</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Blood Group on Record</span>
              <span className="font-mono font-black text-amber-700 text-sm mt-1 block">
                {effectiveUser?.bloodGroup || 'O+'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Donor Registry Sync</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Trustees Verification</span>
              <span className="font-black text-emerald-700 text-sm mt-1 flex items-center gap-1">
                {isPending ? (
                  <>
                    <FiClock className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-800">Review In Progress</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Statutorily Approved</span>
                  </>
                )}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">12A &amp; 80G Certified</span>
            </div>
          </div>

          {/* Quick Access Documents */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-black text-black text-base flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Your Official Membership Documents</span>
              <span className="text-xs text-slate-500 font-normal">Instant Digital Download</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-yellow-500 text-stone-950 flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Official Member ID Card</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Dual-sided laminated identity badge with anti-tamper QR code and national president seal.
                  </p>
                </div>
                <div className="pt-4">
                  {isApproved ? (
                    <Link
                      href="/profile/id-card?type=member"
                      className="w-full py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Open Member ID Card</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-500 text-center font-bold text-xs">
                      Issued upon Admin approval
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Appointment Letter</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Official letterhead appointment document recognized under Trust Act for institutional verification.
                  </p>
                </div>
                <div className="pt-4">
                  {isApproved ? (
                    <Link
                      href="/profile/appointment-letter"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>View Appointment Letter</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-500 text-center font-bold text-xs">
                      Issued upon Admin approval
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Member Certificates of Honor</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Verifiable Certificates of Appreciation awarded for social leadership, drives, and tenure.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/certificates"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>View My Certificates</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- NOT A MEMBER YET (APPLICATION INFO) ----------------- */
        <div className="space-y-6">
          <div className="bg-linear-to-b from-amber-50/70 to-yellow-50/40 rounded-3xl p-6 sm:p-10 border-2 border-amber-300/80 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-200/60">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500 to-yellow-500 text-stone-950 flex items-center justify-center font-bold text-2xl shrink-0 shadow-md shadow-amber-500/20">
                  <FiCreditCard className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                      Constitutional Membership
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">• Not Enrolled</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                    Join as an Official Member of {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}
                  </h2>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-medium">
                    Become a voting, verified member of an official 12A &amp; 80G Certified Non-Governmental Organization registered under Indian Trust Bylaws.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href="/profile/apply-member"
                  className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply for Membership Now</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Member Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-black">
                  <FiShield className="w-4 h-4" />
                  <span>Verifiable Photo ID Card</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-medium">
                  Official dual-sided digital identity card signed by National President with anti-fraud QR code for field authorization.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-black">
                  <FiFileText className="w-4 h-4" />
                  <span>Statutory Appointment Letter</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-medium">
                  Formal appointment letter printed with government registration numbers, 12A/80G orders, and Trust seals.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-black">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Voting &amp; Executive Council</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-medium">
                  Direct voting privileges in the annual general assembly and opportunity to lead welfare committees.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-stone-500 font-medium">
                Annual membership contributions directly support elderly shelter, healthcare, and humanitarian care.
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/members"
                  className="px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-stone-900 font-bold text-xs hover:bg-amber-50 hover:border-amber-400 transition"
                >
                  Explore Member Directory
                </Link>
                <Link
                  href="/profile/apply-member"
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                >
                  <span>Start Application</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Documents Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  <FiEdit3 className="w-3 h-3 text-amber-700" />
                  <span>Pre-Approval KYC Update</span>
                </div>
                <h3 className="text-lg font-black text-stone-900 mt-1">
                  Edit Member Documents &amp; Receipt
                </h3>
                <p className="text-xs text-stone-500">
                  Update your identity files or fee screenshot before final trustee approval.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDocuments} className="space-y-4">
              {/* Passport Photo */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Passport Size Photo (Face Identity)
                </label>
                <div className="flex items-center gap-3">
                  {editPhotoPreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                      <Image
                        src={editPhotoPreview}
                        alt="Member photo preview"
                        fill
                        className="object-cover"
                        unoptimized={editPhotoPreview.startsWith('blob:')}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                      <FiCamera className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-600 file:cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">JPG, PNG, WEBP (Max 15MB)</span>
                  </div>
                </div>
              </div>

              {/* ID Proof Front */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Government ID Proof - Front Side (Aadhaar, Voter ID, PAN)
                </label>
                <div className="flex items-center gap-3">
                  {editDocFrontPreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                      <Image
                        src={editDocFrontPreview}
                        alt="Document front preview"
                        fill
                        className="object-cover"
                        unoptimized={editDocFrontPreview.startsWith('blob:')}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                      <FiFileText className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleDocFrontSelect}
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-600 file:cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">Front side with full name and photo</span>
                  </div>
                </div>
              </div>

              {/* ID Proof Back */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Government ID Proof - Back Side (Address Proof)
                </label>
                <div className="flex items-center gap-3">
                  {editDocBackPreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                      <Image
                        src={editDocBackPreview}
                        alt="Document back preview"
                        fill
                        className="object-cover"
                        unoptimized={editDocBackPreview.startsWith('blob:')}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                      <FiFileText className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleDocBackSelect}
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-600 file:cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">Back side with permanent address</span>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Fee Payment Receipt / Bank Transfer Screenshot
                </label>
                <div className="flex items-center gap-3">
                  {editPaymentPreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                      <Image
                        src={editPaymentPreview}
                        alt="Payment screenshot preview"
                        fill
                        className="object-cover"
                        unoptimized={editPaymentPreview.startsWith('blob:')}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                      <FiCreditCard className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handlePaymentSelect}
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-600 file:cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">UPI, Net Banking, or Cash Receipt (Max 15MB)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="w-4 h-4" />
                      <span>Save &amp; Update Documents</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
