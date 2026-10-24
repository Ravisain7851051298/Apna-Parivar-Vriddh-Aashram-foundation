'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiUserCheck,
  FiShield,
  FiAward,
  FiCheckCircle,
  FiHeart,
  FiClock,
  FiArrowRight,
  FiUserPlus,
  FiActivity,
  FiPhone,
  FiExternalLink,
  FiEdit3,
  FiUploadCloud,
  FiLock,
  FiX,
  FiCamera,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { getContentImageUrl } from '@/lib/authApi';

export default function ProfileVolunteerPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const volunteerApp = effectiveUser?.volunteerApplication;
  const isApproved = Boolean(
    effectiveUser?.role === 'Volunteer' ||
    volunteerApp?.status === 'approved' ||
    (effectiveUser?.isVolunteer && effectiveUser?.status === 'active')
  );

  const isPending = Boolean(
    volunteerApp?.status === 'pending' ||
    (effectiveUser?.status === 'pending' && !isApproved)
  );

  const isVolunteer = isApproved || isPending || effectiveUser?.isVolunteer;

  const volunteerId = effectiveUser?.volunteerId || volunteerApp?.volunteerId || (effectiveUser?.role === 'Volunteer' ? effectiveUser?.memberId : null);

  // Edit Images & Documents State (allowed while pending)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState('');
  const [editDocFrontFile, setEditDocFrontFile] = useState(null);
  const [editDocFrontPreview, setEditDocFrontPreview] = useState('');
  const [editDocBackFile, setEditDocBackFile] = useState(null);
  const [editDocBackPreview, setEditDocBackPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleOpenEditModal = () => {
    if (isApproved) {
      toast.error('Your volunteer application is already approved by the Admin. Documents are statutorily locked.');
      return;
    }
    const currentPhoto = effectiveUser?.photoUrl || volunteerApp?.photoUrl || '';
    const currentDocFront = effectiveUser?.documentFront || volunteerApp?.documentFront || volunteerApp?.idProofUrl || '';
    const currentDocBack = effectiveUser?.documentBack || volunteerApp?.documentBack || '';

    setEditPhotoFile(null);
    setEditPhotoPreview(getContentImageUrl(currentPhoto) || '');
    setEditDocFrontFile(null);
    setEditDocFrontPreview(getContentImageUrl(currentDocFront) || '');
    setEditDocBackFile(null);
    setEditDocBackPreview(getContentImageUrl(currentDocBack) || '');
    setValidationError('');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (editPhotoPreview && editPhotoPreview.startsWith('blob:')) URL.revokeObjectURL(editPhotoPreview);
    if (editDocFrontPreview && editDocFrontPreview.startsWith('blob:')) URL.revokeObjectURL(editDocFrontPreview);
    if (editDocBackPreview && editDocBackPreview.startsWith('blob:')) URL.revokeObjectURL(editDocBackPreview);
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

  const handleSaveDocuments = async (e) => {
    e.preventDefault();
    if (!editPhotoFile && !editDocFrontFile && !editDocBackFile) {
      toast.error('Please select at least one document or photo to update.');
      return;
    }

    setIsSaving(true);
    setValidationError('');
    const formData = new FormData();
    if (editPhotoFile) formData.append('photo', editPhotoFile);
    if (editDocFrontFile) formData.append('documentFront', editDocFrontFile);
    if (editDocBackFile) formData.append('documentBack', editDocBackFile);

    const targetId = volunteerApp?._id || effectiveUser?._id;
    try {
      const res = await api.put(`/applications/volunteers/${targetId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data?.message || 'Volunteer verification documents updated successfully!');
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold mb-2 border border-indigo-200">
            <FiUserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Grassroots Social Welfare Wing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Grassroots Volunteer Service Profile
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Community service assignments, volunteer ID credentials, field drive participation, and honors.
          </p>
        </div>

        {isVolunteer && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/profile/id-card?type=volunteer"
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <FiShield className="w-4 h-4" />
              <span>Volunteer ID Card</span>
            </Link>
            <Link
              href="/profile/certificates"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <FiAward className="w-4 h-4" />
              <span>Drive Certificates</span>
            </Link>
          </div>
        )}
      </div>

      {/* ----------------- VOLUNTEER STATUS DISPLAY ----------------- */}
      {isVolunteer ? (
        <div className="space-y-6">
          {/* Volunteer Hero Banner */}
          <div className={`text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden ${isPending
              ? 'bg-linear-to-r from-amber-600 via-amber-700 to-stone-900'
              : 'bg-linear-to-r from-indigo-700 via-indigo-800 to-slate-900'
            }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-xs inline-block ${isPending ? 'bg-amber-400 text-stone-950' : 'bg-white/20 text-white'
                  }`}>
                  {isPending ? 'Volunteer Enrolment Under Review' : 'Active Volunteer Contributor'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  {effectiveUser?.name}
                </h2>
                <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
                  {isPending
                    ? 'Thank you for stepping forward to serve! Your volunteer enrolment details and government ID proofs are currently being verified by the Board of Trustees.'
                    : `Thank you for serving on the frontlines of humanitarian action! As an authorized volunteer of ${settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}, you lead elderly care drives, medical camps, nutrition distribution, and community relief.`
                  }
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-indigo-200 block">Volunteer Badge ID</span>
                <span className="text-xl font-mono font-black text-white block mt-0.5">
                  {isPending ? 'VERIFICATION-PENDING' : (volunteerId || 'VOL-ACTIVE')}
                </span>
                <span className="text-[10px] text-indigo-200 mt-1 inline-flex items-center gap-1">
                  {isPending ? (
                    <>
                      <FiClock className="w-3 h-3 text-amber-300" /> Trustee Review
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-3 h-3 text-emerald-300" /> Grassroots Authorized
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
                    Volunteer Identification &amp; KYC Verification
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
                    ? 'You can update your Passport Photo and ID documents anytime before the Admin grants final approval.'
                    : 'Your identity and documents are verified and locked to protect credential integrity.'}
                </p>
              </div>

              {isPending ? (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                  <span>Edit Uploaded Documents</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold self-start sm:self-auto">
                  <FiLock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Locked (Approved)</span>
                </span>
              )}
            </div>

            {/* Document Previews Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                {effectiveUser?.photoUrl || volunteerApp?.photoUrl ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.photoUrl || volunteerApp?.photoUrl)}
                      alt="Volunteer Photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiCamera className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate">Passport Photo</span>
                  <span className="text-[11px] text-stone-500 block">
                    {effectiveUser?.photoUrl || volunteerApp?.photoUrl ? 'Uploaded on file' : 'Not uploaded'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                {effectiveUser?.documentFront || volunteerApp?.documentFront || volunteerApp?.idProofUrl ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.documentFront || volunteerApp?.documentFront || volunteerApp?.idProofUrl)}
                      alt="ID Proof Front"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiFileText className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate">ID Proof (Front)</span>
                  <span className="text-[11px] text-stone-500 block">
                    {effectiveUser?.documentFront || volunteerApp?.documentFront || volunteerApp?.idProofUrl ? 'Uploaded on file' : 'Not uploaded'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                {effectiveUser?.documentBack || volunteerApp?.documentBack ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-stone-200">
                    <Image
                      src={getContentImageUrl(effectiveUser?.documentBack || volunteerApp?.documentBack)}
                      alt="ID Proof Back"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-stone-200 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 shrink-0">
                    <FiFileText className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-stone-900 block truncate">ID Proof (Back)</span>
                  <span className="text-[11px] text-stone-500 block">
                    {effectiveUser?.documentBack || volunteerApp?.documentBack ? 'Uploaded on file' : 'Not uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Volunteer Service Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Service Focus</span>
              <span className="font-black text-black text-sm mt-1 block truncate" title={volunteerApp?.skills || 'Child Education & Blood Drives'}>
                {volunteerApp?.skills || 'Child Education & Blood Drives'}
              </span>
              <span className="text-[11px] text-indigo-600 font-bold mt-1 block">Active Field Drive</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Volunteer Availability</span>
              <span className="font-black text-black text-sm mt-1 block">
                {volunteerApp?.availability || 'Weekends & Outreach Drives'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Flexible Scheduling</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Assigned Division</span>
              <span className="font-black text-indigo-700 text-sm mt-1 block">
                {effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'Uttar Pradesh'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Northern Regional Wing</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Blood Group &amp; Donor Status</span>
              <span className="font-mono font-black text-red-600 text-sm mt-1 block">
                {effectiveUser?.bloodGroup || 'O+'} (Verified)
              </span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Emergency Roster Sync</span>
            </div>
          </div>

          {/* Volunteer Actions & Certificates */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-black text-black text-base flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Volunteer Credentials &amp; Certifications</span>
              <span className="text-xs text-slate-500 font-normal">Official Digital Verification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Official Volunteer Identity Card</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Carry your digital volunteer badge for ground authentication during hospital blood drives, municipal relief camps, and school education projects.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/id-card?type=volunteer"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Open Volunteer ID Card</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Volunteer Certificates of Appreciation</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Official Certificates of Honor issued by the National Executive Trustee for selfless volunteer hours, emergency response, and social impact.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/certificates"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Awarded Certificates</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- NOT A VOLUNTEER YET (ENROLMENT INFO) ----------------- */
        <div className="space-y-6">
          <div className="bg-linear-to-b from-amber-50/70 to-yellow-50/40 rounded-3xl p-6 sm:p-10 border-2 border-amber-300/80 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-200/60">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500 to-yellow-500 text-stone-950 flex items-center justify-center font-bold text-2xl shrink-0 shadow-md shadow-amber-500/20">
                  <FiUserPlus className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                      Community Volunteer Wing
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">• Open Enrolment</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                    Join the Volunteer Care Movement
                  </h2>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-medium">
                    Volunteer with {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'} to bring compassionate care to vulnerable elderly citizens: residential shelter assistance, regular health checkup camps, nutritious food distribution, and community relief.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href="/profile/apply-volunteer"
                  className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply as Volunteer Now</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Volunteer Activities Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-black">
                  <FiHeart className="w-4 h-4 text-amber-600" />
                  <span>Compassionate Elder Care</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-medium">
                  Support elderly residents with companionship, recreational activities, and personalized daily care assistance.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-black">
                  <FiActivity className="w-4 h-4 text-amber-600" />
                  <span>Free Medical &amp; Health Camps</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-medium">
                  Assist in coordinating physician visits, medicine distributions, and physiotherapy camps for senior citizens.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-black">
                  <FiAward className="w-4 h-4 text-amber-600" />
                  <span>Certificates &amp; National Honors</span>
                </div>
                <p className="text-stone-600 leading-relaxed font-medium">
                  Earn digitally verifiable Certificates of Honor from the Board of Trustees recognized for CVs and careers.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-stone-500 font-medium">
                No compulsory fees. 100% voluntary service for senior dignity and community empowerment.
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/volunteer"
                  className="px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-stone-900 font-bold text-xs hover:bg-amber-50 hover:border-amber-400 transition"
                >
                  Volunteer Program Info
                </Link>
                <Link
                  href="/profile/apply-volunteer"
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                >
                  <span>Fill Volunteer Form</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Volunteer Documents Modal */}
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
                  Edit Verification Documents
                </h3>
                <p className="text-xs text-stone-500">
                  Replace your photo or government ID proof before final admin approval.
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
                        alt="Volunteer photo preview"
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
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
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
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
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
                      className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">Back side with permanent address</span>
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
