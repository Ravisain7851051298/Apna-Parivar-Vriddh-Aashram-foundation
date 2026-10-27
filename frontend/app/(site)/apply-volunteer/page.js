'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiUserCheck,
  FiUploadCloud,
  FiCheckCircle,
  FiTrash2,
  FiClock,
  FiHeart,
  FiCamera,
  FiUser,
  FiFileText,
  FiShield,
  FiAlertTriangle,
  FiAward,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { submitVolunteerApplication } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';
import DecorativeRings from '@/components/site/DecorativeRings';

export default function SiteApplyVolunteerPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [skills, setSkills] = useState('Elder Care Assistance & Satsang');
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [interests, setInterests] = useState('Elder Healthcare, Meal Service & Emotional Care');
  const [whyJoin, setWhyJoin] = useState('');

  // Guest applicant fields (active when user is not signed in)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestBloodGroup, setGuestBloodGroup] = useState('O+');
  const [guestDistrict, setGuestDistrict] = useState('Jabalpur');
  const [guestState, setGuestState] = useState('Madhya Pradesh');

  // KYC Verification Documents & User Photo State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [docFrontFile, setDocFrontFile] = useState(null);
  const [docFrontPreview, setDocFrontPreview] = useState('');
  const [docBackFile, setDocBackFile] = useState(null);
  const [docBackPreview, setDocBackPreview] = useState('');

  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isAlreadyVolunteer = Boolean(
    currentUser?.role === 'Volunteer' ||
    currentUser?.isVolunteer ||
    currentUser?.volunteerApplication?.status === 'approved' ||
    (currentUser?.volunteerId && !currentUser.volunteerId.startsWith('APVAF-DON-') && !currentUser.volunteerId.startsWith('BYK-DON-'))
  );

  // File Handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Applicant photo size must be under 10MB.');
      return;
    }
    setValidationError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoPreview('');
    setPhotoFile(null);
    const input = document.getElementById('volPhotoInput');
    if (input) input.value = '';
  };

  const handleDocFrontSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Document Front image must be under 15MB.');
      return;
    }
    setValidationError('');
    setDocFrontFile(file);
    setDocFrontPreview(URL.createObjectURL(file));
  };

  const handleRemoveDocFront = () => {
    if (docFrontPreview && docFrontPreview.startsWith('blob:')) URL.revokeObjectURL(docFrontPreview);
    setDocFrontPreview('');
    setDocFrontFile(null);
    const input = document.getElementById('volDocFrontInput');
    if (input) input.value = '';
  };

  const handleDocBackSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Document Back image must be under 15MB.');
      return;
    }
    setValidationError('');
    setDocBackFile(file);
    setDocBackPreview(URL.createObjectURL(file));
  };

  const handleRemoveDocBack = () => {
    if (docBackPreview && docBackPreview.startsWith('blob:')) URL.revokeObjectURL(docBackPreview);
    setDocBackPreview('');
    setDocBackFile(null);
    const input = document.getElementById('volDocBackInput');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser && (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim())) {
      setValidationError('Please provide your Full Legal Name, Email Address, and 10-digit Mobile Number.');
      return;
    }

    if (!photoFile && !currentUser?.photoUrl) {
      setValidationError('Please upload applicant user photo / profile picture.');
      return;
    }

    if (!docFrontFile) {
      setValidationError(`Please upload the FRONT side scan/photo of your ${documentType}.`);
      return;
    }

    if (!docBackFile) {
      setValidationError(`Please upload the BACK side scan/photo of your ${documentType}.`);
      return;
    }

    setValidationError('');

    try {
      const formData = new FormData();
      formData.append('name', currentUser ? currentUser.name : guestName.trim());
      formData.append('email', currentUser ? currentUser.email : guestEmail.trim());
      formData.append('phone', currentUser ? currentUser.phone : guestPhone.trim());
      formData.append('bloodGroup', currentUser?.bloodGroup || guestBloodGroup);
      formData.append('district', currentUser?.district || guestDistrict);
      formData.append('state', currentUser?.state || guestState);
      formData.append('skills', skills);
      formData.append('availability', availability);
      formData.append('interests', interests);
      formData.append('motivation', whyJoin);
      formData.append('whyJoin', whyJoin);
      formData.append('category', 'applications');

      // Append Verification Documents
      formData.append('documentType', documentType);
      if (photoFile) formData.append('photo', photoFile);
      if (docFrontFile) {
        formData.append('documentFront', docFrontFile);
        formData.append('file', docFrontFile); // for backward compatibility
      }
      if (docBackFile) formData.append('documentBack', docBackFile);

      await dispatch(submitVolunteerApplication(formData)).unwrap();
      setSubmitted(true);
    } catch (err) {
      setValidationError(typeof err === 'string' ? err : (err?.message || 'Failed to submit volunteer application'));
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf5] py-10 sm:py-14 text-stone-900 relative overflow-hidden">
      {/* Ambient Dark Yellow & Purple Multi-Shape Concentric Rings */}
      <DecorativeRings variant="apply" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* Top Header Card */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 shadow-2xs">
            <FiHeart className="w-3.5 h-3.5 text-amber-700" />
            <span>Volunteer Seva Wing | सेवा समर्पण पहल</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
            Join as an Official Volunteer
          </h1>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            Dedicate your compassion, time, and skills to bring warmth and comfort to elderly residents at <strong>{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</strong>. All verified volunteers receive government-recognized credentials following Trustee ratification.
          </p>

          {/* 3-Step Process Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-left">
            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 01</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Contact &amp; KYC Verification</p>
              <p className="text-[11px] text-stone-500 font-medium">Upload photo &amp; ID proof for statutory volunteer record</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 02</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Skills &amp; Seva Interests</p>
              <p className="text-[11px] text-stone-500 font-medium">Tell us your availability and preferred areas of service</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 03</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Credentials &amp; Badge Emailed</p>
              <p className="text-[11px] text-stone-500 font-medium">Official Offer Letter &amp; digital ID badge upon approval</p>
            </div>
          </div>
        </div>

        {/* Existing Volunteer Notice Banner */}
        {currentUser && isAlreadyVolunteer && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                <FiUserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-200 text-amber-950 border border-amber-300 inline-block">
                  Active Volunteer Profile
                </span>
                <h3 className="text-base font-black text-stone-950 mt-0.5">
                  Welcome, {currentUser.name}!
                </h3>
                <p className="text-xs text-stone-700 font-medium">
                  You are already a registered volunteer of the Foundation. You can access your volunteer hub, digital badge, or offer letter anytime.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/profile/volunteer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-xs transition"
              >
                Volunteer Hub
              </Link>
              <Link
                href="/profile/id-card?type=volunteer"
                className="px-4 py-2 rounded-xl bg-white text-stone-800 border border-stone-300 font-bold text-xs hover:bg-stone-50 transition"
              >
                Volunteer ID
              </Link>
            </div>
          </div>
        )}

        {submitted ? (
          /* SUCCESS SUBMISSION CARD */
          <div className="bg-white border-2 border-amber-400 rounded-3xl p-6 sm:p-10 text-stone-900 space-y-6 shadow-xl shadow-amber-500/10">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center mx-auto border-4 border-amber-200 shadow-md">
              <FiCheckCircle className="w-10 h-10" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                Application Received Successfully
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                स्वयंसेवक आवेदन सफलतापूर्वक प्राप्त हुआ!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-lg mx-auto">
                Thank you, <strong>{currentUser?.name || guestName}</strong>! Your voluntary application and verification documents have been forwarded to the Trustee Verification Desk.
              </p>
            </div>

            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 text-xs text-stone-800 space-y-2.5">
              <p className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <span>📧</span> Next Steps Upon Admin Approval:
              </p>
              <p className="text-stone-700">
                1. When the Admin committee approves your voluntary profile, your <strong>Official Portal Login Credentials (Email &amp; Temporary Password)</strong> will be emailed to <code className="text-stone-950 font-bold bg-amber-100/70 px-2 py-0.5 rounded">{currentUser?.email || guestEmail}</code>.
              </p>
              <p className="text-stone-700">
                2. Your <strong>Official Volunteer Offer Letter</strong> and <strong>Verifiable Digital Badge</strong> will be attached to the email for immediate download.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/login?role=volunteer"
                className="px-6 py-3 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-50 transition shadow-2xs"
              >
                Go to Volunteer Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {validationError && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-start gap-3 shadow-sm">
                <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-black text-sm text-rose-950">कृपया आवश्यक जानकारी पूर्ण करें</p>
                  <p className="mt-0.5 text-xs text-rose-800 font-medium">{validationError}</p>
                </div>
              </div>
            )}

            {/* GUEST APPLICANT INFORMATION */}
            {!currentUser ? (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <FiUser className="w-4 h-4 text-amber-600" />
                    <span>Personal Contact Information</span>
                  </span>
                  <Link href="/login?role=volunteer&redirect=/apply-volunteer" className="text-xs font-bold text-amber-800 hover:text-amber-950 underline">
                    Already registered? Sign in
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Legal full name"
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white font-medium text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Credentials will be sent here"
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white font-medium text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white font-medium text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Blood Group</label>
                    <select
                      value={guestBloodGroup}
                      onChange={(e) => setGuestBloodGroup(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white font-medium text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">District / City</label>
                    <input
                      type="text"
                      value={guestDistrict}
                      onChange={(e) => setGuestDistrict(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white font-medium text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">State</label>
                    <input
                      type="text"
                      value={guestState}
                      onChange={(e) => setGuestState(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white font-medium text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-2xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm">
                    {currentUser.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-800">Applying as Verified Account</span>
                    <p className="text-xs font-bold text-stone-900">{currentUser.name} ({currentUser.email})</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  {currentUser.phone || 'Phone on File'}
                </span>
              </div>
            )}

            {/* STEP 1: APPLICANT USER PHOTO & KYC DUAL-SIDED DOCUMENT UPLOADS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-900">
                <span className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                  1
                </span>
                <span>Volunteer Photo &amp; Government ID Verification (KYC)</span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs space-y-6">

                {/* User Photo Upload */}
                <div className="border-b border-stone-100 pb-5">
                  <label className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    <FiCamera className="text-amber-700 w-4 h-4" />
                    <span>Applicant Passport Size Photo / Profile Picture <span className="text-rose-500">*</span></span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400 p-1 bg-amber-50/30 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Applicant Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <FiUser className="w-10 h-10 text-stone-300" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <input
                        type="file"
                        accept="image/*"
                        id="volPhotoInput"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <label
                          htmlFor="volPhotoInput"
                          className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-stone-950 font-black text-xs cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                        >
                          <FiUploadCloud className="w-4 h-4" />
                          <span>{photoFile ? 'Change Photo' : 'Upload Volunteer Photo'}</span>
                        </label>
                        {photoFile && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-rose-600 font-bold text-xs transition cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium">
                        Clear frontal passport photograph (JPG, PNG up to 10MB). Used for issuing your volunteer appointment badge.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Type Selection */}
                <div>
                  <label className="text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                    <FiShield className="text-amber-700 w-4 h-4" />
                    <span>Select Government Verification Document Type <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full sm:max-w-md p-3 text-xs border border-stone-200 rounded-xl bg-white font-semibold text-stone-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (आधार कार्ड)</option>
                    <option value="PAN Card">PAN Card (पैन कार्ड)</option>
                    <option value="Voter ID Card">Voter ID Card (मतदाता पहचान पत्र)</option>
                    <option value="Driving License">Driving License (ड्राइविंग लाइसेंस)</option>
                    <option value="Passport">Passport (पासपोर्ट)</option>
                    <option value="College / Student ID">College / Student ID (छात्र पहचान पत्र)</option>
                    <option value="Other Government ID">Other Government Recognized Photo ID</option>
                  </select>
                </div>

                {/* Dual-Sided Document Uploads (Front & Back) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">

                  {/* 1. FRONT SIDE UPLOAD */}
                  <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <FiFileText className="text-amber-700 w-3.5 h-3.5" />
                        <span>{documentType} - FRONT Side <span className="text-rose-500">*</span></span>
                      </span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Front Side (सामने)
                      </span>
                    </div>

                    {!docFrontFile ? (
                      <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-5 text-center transition bg-white cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          id="volDocFrontInput"
                          onChange={handleDocFrontSelect}
                          className="hidden"
                        />
                        <label htmlFor="volDocFrontInput" className="cursor-pointer space-y-2 block">
                          <FiUploadCloud className="w-8 h-8 text-amber-600 mx-auto" />
                          <div>
                            <span className="text-xs font-bold text-amber-800 hover:underline block">
                              Click to upload Front Side Scan
                            </span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Clear photo or scan (JPG, PNG up to 15MB)
                            </span>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-300 bg-white p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-800 truncate max-w-50">{docFrontFile.name}</span>
                          <button
                            type="button"
                            onClick={handleRemoveDocFront}
                            className="text-rose-600 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                        {docFrontPreview && (
                          <div className="rounded-lg overflow-hidden border border-stone-100 bg-stone-50 max-h-40 flex items-center justify-center">
                            <img src={docFrontPreview} alt="Document Front Preview" className="max-h-40 w-auto object-contain" />
                          </div>
                        )}
                        <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Front Side Attached Successfully</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. BACK SIDE UPLOAD */}
                  <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <FiFileText className="text-amber-700 w-3.5 h-3.5" />
                        <span>{documentType} - BACK Side <span className="text-rose-500">*</span></span>
                      </span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Back Side (पीछे)
                      </span>
                    </div>

                    {!docBackFile ? (
                      <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-5 text-center transition bg-white cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          id="volDocBackInput"
                          onChange={handleDocBackSelect}
                          className="hidden"
                        />
                        <label htmlFor="volDocBackInput" className="cursor-pointer space-y-2 block">
                          <FiUploadCloud className="w-8 h-8 text-amber-600 mx-auto" />
                          <div>
                            <span className="text-xs font-bold text-amber-800 hover:underline block">
                              Click to upload Back Side Scan
                            </span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Clear photo or scan (JPG, PNG up to 15MB)
                            </span>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-300 bg-white p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-800 truncate max-w-50">{docBackFile.name}</span>
                          <button
                            type="button"
                            onClick={handleRemoveDocBack}
                            className="text-rose-600 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                        {docBackPreview && (
                          <div className="rounded-lg overflow-hidden border border-stone-100 bg-stone-50 max-h-40 flex items-center justify-center">
                            <img src={docBackPreview} alt="Document Back Preview" className="max-h-40 w-auto object-contain" />
                          </div>
                        )}
                        <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Back Side Attached Successfully</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* STEP 2: VOLUNTEER SKILLS & PREFERENCES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-900">
                <span className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                  2
                </span>
                <span>Volunteer Skills &amp; Preferences</span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Key Skills &amp; Capabilities <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. Elder Care, First Aid, Teaching, Event Organizing..."
                      className="w-full p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Availability <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-stone-900 bg-white"
                    >
                      <option value="Weekends & Evenings">Weekends &amp; Evenings</option>
                      <option value="Full-time Volunteer (Daily)">Full-time Volunteer (Daily)</option>
                      <option value="Emergency Relief On-Call">Emergency Relief On-Call</option>
                      <option value="Online / Remote Assistance">Online / Remote Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Areas of Humanitarian Interest <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Geriatric Healthcare, Nutritious Meal Seva, Satsang & Emotional Well-being..."
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Why do you want to volunteer with {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}? <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={whyJoin}
                    onChange={(e) => setWhyJoin(e.target.value)}
                    placeholder="Tell us about your motivation to serve elderly mothers and fathers at our aashram..."
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-stone-900 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submission Section */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-[11px] text-stone-500 font-medium">
                🔒 All volunteer records and identity proofs are verified by the executive board prior to badge issuance.
              </span>
              <button
                type="submit"
                disabled={loading || (!photoFile && !currentUser?.photoUrl) || !docFrontFile || !docBackFile}
                className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiUserCheck className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Submitting Application & Documents...'
                    : (!docFrontFile || !docBackFile
                      ? 'Attach Verification Documents to Submit'
                      : 'Submit Volunteer Application')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
