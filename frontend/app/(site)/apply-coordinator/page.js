'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiUploadCloud,
  FiCheckCircle,
  FiTrash2,
  FiCamera,
  FiUser,
  FiFileText,
  FiAlertTriangle,
  FiAward,
  FiArrowRight
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { submitCoordinatorApplication } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';

export default function SiteApplyCoordinatorPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [qualification, setQualification] = useState('Graduate');
  const [experience, setExperience] = useState('2+ years in community outreach & social volunteerism');
  const [areaOfOperation, setAreaOfOperation] = useState('Jabalpur District & Surrounding Tehsils');
  const [skills, setSkills] = useState('Public Outreach, Member Enrollment & Elder Welfare Coordination');
  const [motivation, setMotivation] = useState('');

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
    const input = document.getElementById('coordPhotoInput');
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
    const input = document.getElementById('coordDocFrontInput');
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
    const input = document.getElementById('coordDocBackInput');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!currentUser) {
      if (!guestName.trim()) {
        setValidationError('Please enter your full legal name.');
        return;
      }
      if (!guestEmail.trim() || !guestEmail.includes('@')) {
        setValidationError('Please enter a valid email address.');
        return;
      }
      if (!guestPhone.trim() || guestPhone.trim().length < 10) {
        setValidationError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    if (!docFrontFile) {
      setValidationError('Please upload at least the Front Side of your Government ID proof.');
      return;
    }

    const formData = new FormData();
    formData.append('qualification', qualification);
    formData.append('experience', experience);
    formData.append('areaOfOperation', areaOfOperation);
    formData.append('skills', skills);
    formData.append('motivation', motivation);
    formData.append('documentType', documentType);

    if (photoFile) formData.append('photo', photoFile);
    if (docFrontFile) formData.append('documentFront', docFrontFile);
    if (docBackFile) formData.append('documentBack', docBackFile);

    if (!currentUser) {
      formData.append('name', guestName.trim());
      formData.append('email', guestEmail.trim().toLowerCase());
      formData.append('phone', guestPhone.trim());
      formData.append('bloodGroup', guestBloodGroup);
      formData.append('district', guestDistrict);
      formData.append('state', guestState);
    }

    try {
      await dispatch(submitCoordinatorApplication(formData)).unwrap();
      setSubmitted(true);
    } catch (err) {
      setValidationError(typeof err === 'string' ? err : err?.message || 'Failed to submit coordinator application.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fffdf5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto my-8 bg-white p-8 sm:p-12 rounded-3xl border border-amber-300 shadow-xl shadow-amber-500/10 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 border-2 border-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 inline-block mb-3">
            Application Submitted Successfully
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Coordinator Enrollment Request Under Review
          </h2>
          <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed max-w-lg mx-auto">
            Thank you for applying for the Coordinator role at <strong>{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</strong>.
            Our Board of Trustees is reviewing your credentials. Once approved, your official Coordinator ID Card and Appointment Letter will be generated and emailed to your registered email.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-950 font-medium space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <FiShield className="w-4 h-4 text-amber-700" />
              <span>Coordinator Authorities upon Approval:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-[11.5px]">
              <li>Official Dual-Sided Coordinator Identity Badge with QR verification.</li>
              <li>Statutory Appointment Letter signed by the National President.</li>
              <li>Authority to enroll and register new foundation members.</li>
              <li>Real-time dashboard access to track all members enrolled by you.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-stone-950 font-black text-xs shadow-md transition"
            >
              Back to Home
            </Link>
            {currentUser && (
              <Link
                href="/profile"
                className="px-6 py-2.5 rounded-xl bg-white text-stone-800 border border-stone-300 font-bold text-xs hover:bg-stone-50 transition"
              >
                Go to Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf5] py-10 sm:py-14 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header Card */}
        <div className="bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 p-6 sm:p-8 rounded-3xl text-stone-950 border border-amber-400 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-amber-950 text-[11px] font-black mb-2 border border-amber-300 shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-amber-800" />
              <span>District &amp; Regional Leadership Wing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
              Apply to Become an Official Coordinator
            </h1>
            <p className="text-xs sm:text-sm text-stone-900 font-medium mt-1.5 max-w-xl leading-relaxed">
              Lead grassroots elder care, expand our welfare network, enroll verified members, and receive official statutory credentials upon Trustee ratification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="self-start md:self-auto px-4 py-2 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs shadow-xs transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs">
            <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-6">
          {/* Guest applicant details if not logged in */}
          {!currentUser ? (
            <div className="space-y-4 pb-6 border-b border-amber-200/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-amber-700" />
                  <span>Personal Contact Details</span>
                </h3>
                <Link href="/login?role=coordinator&redirect=/apply-coordinator" className="text-xs font-bold text-amber-800 hover:underline">
                  Already registered? Sign in
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Saini"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={guestBloodGroup}
                    onChange={(e) => setGuestBloodGroup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    District / City
                  </label>
                  <input
                    type="text"
                    value={guestDistrict}
                    onChange={(e) => setGuestDistrict(e.target.value)}
                    placeholder="e.g. Jabalpur"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={guestState}
                    onChange={(e) => setGuestState(e.target.value)}
                    placeholder="e.g. Madhya Pradesh"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800">Applying as Verified Account</span>
                <p className="text-xs font-bold text-stone-900">{currentUser.name} ({currentUser.email})</p>
              </div>
              <span className="text-xs font-bold text-stone-700 bg-white px-3 py-1 rounded-xl border border-stone-200">
                {currentUser.phone || 'Phone on File'}
              </span>
            </div>
          )}

          {/* Coordinator Operational Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
              <FiAward className="w-4 h-4 text-amber-700" />
              <span>Coordinator Qualifications &amp; Operational Area</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Highest Educational Qualification
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {['High School / 12th', 'Graduate (BA / B.Com / B.Sc / B.Tech)', 'Post Graduate (MA / M.Com / MSW / MBA)', 'Doctorate / Professional', 'Other'].map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Proposed Area / District of Operation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={areaOfOperation}
                  onChange={(e) => setAreaOfOperation(e.target.value)}
                  placeholder="e.g. Jabalpur District & Surrounding Tehsils"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Key Skills / Strengths
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Public Speaking, Member Mobilization, Event Organizing"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Prior Social Work Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 2 years volunteer at local elderly welfare group"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Why do you want to join as Coordinator? (Motivation &amp; Vision)
              </label>
              <textarea
                rows={3}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tell us briefly about your vision for expanding Apna Parivar Vriddh Aashram Foundation in your region..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* KYC Verification & Document Upload */}
          <div className="space-y-4 pt-4 border-t border-amber-200/80">
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
              <FiShield className="w-4 h-4 text-amber-700" />
              <span>KYC Verification Documents &amp; Photo</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Passport Photo */}
              <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    1. Passport Size Photo
                  </label>
                  <p className="text-[11px] text-stone-500 mb-3">Front-facing formal photograph for official ID card badge.</p>
                </div>

                {photoPreview ? (
                  <div className="relative w-28 h-28 mx-auto rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs mb-2">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-xs"
                      title="Remove Photo"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-white text-center">
                    <FiCamera className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-[11px] font-bold text-stone-700">Upload Photo</span>
                    <span className="text-[10px] text-stone-400">JPG/PNG up to 10MB</span>
                    <input
                      id="coordPhotoInput"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 2. Document Front */}
              <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-800">
                      2. ID Proof (Front) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="text-[10px] font-bold py-0.5 px-1.5 rounded-lg border border-stone-200 bg-white"
                    >
                      {['Aadhaar Card', 'Voter ID', 'Driving License', 'Passport', 'PAN Card'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-3">Front side of government photo identity proof.</p>
                </div>

                {docFrontPreview ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs mb-2">
                    <img src={docFrontPreview} alt="Doc Front" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveDocFront}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-xs"
                      title="Remove Document"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-white text-center">
                    <FiUploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-[11px] font-bold text-stone-700">Upload ID Front</span>
                    <span className="text-[10px] text-stone-400">JPG/PNG up to 15MB</span>
                    <input
                      id="coordDocFrontInput"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleDocFrontSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 3. Document Back */}
              <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    3. ID Proof (Back / Address)
                  </label>
                  <p className="text-[11px] text-stone-500 mb-3">Back side showing residential address proof.</p>
                </div>

                {docBackPreview ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs mb-2">
                    <img src={docBackPreview} alt="Doc Back" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveDocBack}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-xs"
                      title="Remove Document"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-white text-center">
                    <FiUploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-[11px] font-bold text-stone-700">Upload ID Back</span>
                    <span className="text-[10px] text-stone-400">JPG/PNG up to 15MB</span>
                    <input
                      id="coordDocBackInput"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleDocBackSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Submission Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-stone-500 font-medium">
              🔒 By submitting, you pledge to uphold the charter and ethical standards of Apna Parivar Vriddh Aashram Foundation.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Submit Coordinator Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
