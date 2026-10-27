'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiCreditCard,
  FiUploadCloud,
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2,
  FiUser,
  FiFileText,
  FiShield,
  FiCamera,
  FiArrowRight,
  FiHeart,
  FiClock,
  FiAward,
  FiCopy
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/store/planSlice';
import { submitMembershipApplication, clearAppStatus } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';
import DecorativeRings from '@/components/site/DecorativeRings';

export default function SiteApplyMemberPage() {
  const dispatch = useDispatch();
  const { plans } = useSelector((state) => state.plans);
  const { loading: submitting, error: reduxError } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / PhonePe / GPay');
  const [notes, setNotes] = useState('');

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

  // Payment Screenshot upload state
  const [selectedRawFile, setSelectedRawFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const effectivePlanId = selectedPlanId || plans[0]?._id;
  const selectedPlan = plans.find(p => p._id === effectivePlanId) || plans[0];
  const isFormValid = !!selectedPlan && (!!transactionId.trim() || !!selectedRawFile);

  const isAlreadyMember = Boolean(
    currentUser?.role === 'Member' ||
    currentUser?.role === 'Admin' ||
    currentUser?.isMember ||
    (currentUser?.memberId && !currentUser.memberId.startsWith('APVAF-DON-') && !currentUser.memberId.startsWith('BYK-DON-'))
  );

  const handleCopyUpi = () => {
    const upi = settings?.upiId || 'apnavriddhaashram@okhdfcbank';
    navigator.clipboard?.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // File Handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFormError('Applicant photo size must be under 10MB.');
      return;
    }
    setFormError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoPreview('');
    setPhotoFile(null);
    const input = document.getElementById('userPhotoInput');
    if (input) input.value = '';
  };

  const handleDocFrontSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setFormError('Document Front image must be under 15MB.');
      return;
    }
    setFormError('');
    setDocFrontFile(file);
    setDocFrontPreview(URL.createObjectURL(file));
  };

  const handleRemoveDocFront = () => {
    if (docFrontPreview && docFrontPreview.startsWith('blob:')) URL.revokeObjectURL(docFrontPreview);
    setDocFrontPreview('');
    setDocFrontFile(null);
    const input = document.getElementById('docFrontInput');
    if (input) input.value = '';
  };

  const handleDocBackSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setFormError('Document Back image must be under 15MB.');
      return;
    }
    setFormError('');
    setDocBackFile(file);
    setDocBackPreview(URL.createObjectURL(file));
  };

  const handleRemoveDocBack = () => {
    if (docBackPreview && docBackPreview.startsWith('blob:')) URL.revokeObjectURL(docBackPreview);
    setDocBackPreview('');
    setDocBackFile(null);
    const input = document.getElementById('docBackInput');
    if (input) input.value = '';
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setFormError('Screenshot file size must be under 15MB.');
      return;
    }

    setFormError('');
    setSelectedRawFile(file);
    setFileName(file.name);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  };

  const handleRemoveScreenshot = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedRawFile(null);
    setFileName('');
    setFormError('');
    const input = document.getElementById('screenshotInput');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      setFormError('Please select a membership plan');
      return;
    }

    if (!currentUser && (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim())) {
      setFormError('Please enter your Full Legal Name, Email Address, and 10-digit Mobile Number.');
      return;
    }

    if (!photoFile && !currentUser?.photoUrl) {
      setFormError('Please upload your User Image / Passport Photo for ID card generation.');
      return;
    }

    if (!docFrontFile) {
      setFormError(`Please upload the FRONT side scan/photo of your ${documentType}.`);
      return;
    }

    if (!docBackFile) {
      setFormError(`Please upload the BACK side scan/photo of your ${documentType}.`);
      return;
    }

    if (!transactionId && !selectedRawFile) {
      setFormError('Please provide your Transaction UTR or select a payment screenshot');
      return;
    }

    setFormError('');

    try {
      const formData = new FormData();
      formData.append('name', currentUser ? currentUser.name : guestName.trim());
      formData.append('email', currentUser ? currentUser.email : guestEmail.trim());
      formData.append('phone', currentUser ? currentUser.phone : guestPhone.trim());
      formData.append('bloodGroup', currentUser?.bloodGroup || guestBloodGroup);
      formData.append('district', currentUser?.district || guestDistrict);
      formData.append('state', currentUser?.state || guestState);
      formData.append('planId', selectedPlan._id);
      formData.append('planName', selectedPlan.name || selectedPlan.title || 'Membership Plan');
      formData.append('feeAmount', selectedPlan.fee || selectedPlan.price || 250);
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      formData.append('utrNumber', transactionId);
      formData.append('notes', notes);
      formData.append('category', 'applications');

      // Append Verification Documents
      formData.append('documentType', documentType);
      if (photoFile) formData.append('photo', photoFile);
      if (docFrontFile) formData.append('documentFront', docFrontFile);
      if (docBackFile) formData.append('documentBack', docBackFile);

      if (selectedRawFile) {
        formData.append('file', selectedRawFile);
        formData.append('paymentScreenshot', selectedRawFile);
      }

      await dispatch(submitMembershipApplication(formData)).unwrap();

      setFormSubmitted(true);
      setTimeout(() => dispatch(clearAppStatus()), 6000);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : (err?.message || 'Failed to submit application'));
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf5] py-10 sm:py-14 text-stone-900 relative overflow-hidden">
      {/* Ambient Dark Yellow & Purple Multi-Shape Concentric Rings */}
      <DecorativeRings variant="apply" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* Top Header Card */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 shadow-2xs">
            <FiShield className="w-3.5 h-3.5 text-amber-700" />
            <span>12A &amp; 80G Certified Non-Profit Vriddh Aashram</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
            Apply for Official Foundation Membership
          </h1>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            Join hands with <strong>{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</strong> to support residential elder care, nutritious meals, geriatric healthcare, and lifelong dignity. Verified members receive government-recognized credentials following Trustee approval.
          </p>

          {/* 4-Step Process Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-left">
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 01</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Contact &amp; KYC</p>
              <p className="text-[10px] text-stone-500 font-medium">Identity verified for statutory compliance</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 02</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Membership Tier</p>
              <p className="text-[10px] text-stone-500 font-medium">Annual or Lifetime contribution plan</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 03</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Direct UPI / Bank</p>
              <p className="text-[10px] text-stone-500 font-medium">Zero gateway fee, 100% elder seva</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] font-black text-amber-700 block uppercase">Step 04</span>
              <p className="text-xs font-bold text-stone-900 mt-0.5">Trustee Approval</p>
              <p className="text-[10px] text-stone-500 font-medium">QR ID Card &amp; letter emailed</p>
            </div>
          </div>
        </div>

        {/* Existing Member Notice Banner */}
        {currentUser && isAlreadyMember && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                <FiAward className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-200 text-amber-950 border border-amber-300 inline-block">
                  Active Member Profile
                </span>
                <h3 className="text-base font-black text-stone-950 mt-0.5">
                  Welcome back, {currentUser.name}!
                </h3>
                <p className="text-xs text-stone-700 font-medium">
                  You are already a registered member of the Foundation. You can access your membership dashboard, digital ID card, or appointment letter directly.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/profile/member"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-xs transition"
              >
                View Member Profile
              </Link>
              <Link
                href="/profile/id-card"
                className="px-4 py-2 rounded-xl bg-white text-stone-800 border border-stone-300 font-bold text-xs hover:bg-stone-50 transition"
              >
                My ID Card
              </Link>
            </div>
          </div>
        )}

        {formSubmitted ? (
          /* SUCCESS SUBMISSION CARD */
          <div className="bg-white border-2 border-amber-400 rounded-3xl p-6 sm:p-10 text-stone-900 space-y-6 shadow-xl shadow-amber-500/10">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center mx-auto border-4 border-amber-200 shadow-md">
              <FiCheckCircle className="w-10 h-10" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                Application Submitted Successfully
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                सदस्यता आवेदन सफलतापूर्वक प्राप्त हुआ!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-lg mx-auto">
                आपकी सदस्यता का विवरण, पहचान दस्तावेज व भुगतान रसीद सत्यापन हेतु ट्रस्टी वेरिफिकेशन डेस्क को सफलतापूर्वक भेज दी गई है।
              </p>
            </div>

            {/* Submission Details Card */}
            <div className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 text-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-amber-200/60">
                <span className="text-stone-500 font-bold">Applicant Name:</span>
                <span className="font-extrabold text-stone-900">{currentUser?.name || guestName}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-amber-200/60">
                <span className="text-stone-500 font-bold">Document Type Submitted:</span>
                <span className="font-extrabold text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{documentType} (Front &amp; Back)</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-amber-200/60">
                <span className="text-stone-500 font-bold">Membership Plan:</span>
                <span className="font-extrabold text-stone-900">{selectedPlan?.name || selectedPlan?.title} (₹{selectedPlan?.fee || selectedPlan?.price || 250})</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-stone-500 font-bold">UTR / Payment Reference:</span>
                <code className="font-black text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-lg border border-amber-300">
                  {transactionId || 'Payment Screenshot Attached'}
                </code>
              </div>
            </div>

            {/* Verification Protocol Notice */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 text-xs text-stone-800 space-y-2 leading-relaxed">
              <p className="font-black text-sm text-amber-950 flex items-center gap-2">
                <span className="text-base">📧</span> एडमिन अप्रूवल के बाद क्या होगा?
              </p>
              <p className="text-stone-700">
                <strong>1. लॉगिन क्रेडेंशियल्स:</strong> ट्रस्टी व एडमिन द्वारा बैंक लेजर व यूटीआर वेरिफिकेशन के बाद आपके रजिस्टर्ड ईमेल (<strong className="text-stone-950">{currentUser?.email || guestEmail}</strong>) पर आपका <strong>Portal User ID व Password</strong> स्वचालित रूप से भेज दिया जाएगा।
              </p>
              <p className="text-stone-700">
                <strong>2. नियुक्ति पत्र व आईडी कार्ड:</strong> आधिकारिक <strong>Appointment Letter</strong> और डिजिटल क्यूआर युक्त <strong>Dual-Sided Official ID Card</strong> पीडीएफ प्रारूप में ईमेल के साथ अटैच होकर तुरंत प्राप्त होंगे।
              </p>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/login?role=member"
                className="px-6 py-3 rounded-xl bg-white text-stone-800 border border-stone-300 font-extrabold text-xs hover:bg-stone-50 transition shadow-2xs"
              >
                Go to Member Sign In
              </Link>
              <button
                type="button"
                onClick={() => {
                  setFormSubmitted(false);
                  setTransactionId('');
                  setSelectedRawFile(null);
                  setPreviewUrl('');
                  setFileName('');
                  setPhotoFile(null);
                  setPhotoPreview('');
                  setDocFrontFile(null);
                  setDocFrontPreview('');
                  setDocBackFile(null);
                  setDocBackPreview('');
                  setFormError('');
                }}
                className="px-6 py-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-extrabold text-xs hover:bg-amber-100 transition cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Global Alert Notification */}
            {(formError || reduxError) && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-1">
                <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-black text-sm text-rose-950">आवेदन सबमिट नहीं हो सका (Submission Failed)</p>
                  <p className="mt-0.5 text-xs text-rose-800 font-medium">{formError || reduxError}</p>
                </div>
              </div>
            )}

            {/* GUEST APPLICANT INFORMATION */}
            {!currentUser ? (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <FiUser className="w-4 h-4 text-amber-600" />
                    <span>Personal Contact Details</span>
                  </span>
                  <Link href="/login?role=member&redirect=/apply-member" className="text-xs font-bold text-amber-800 hover:text-amber-950 underline">
                    Already registered? Sign in to auto-fill
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
                      placeholder="Name as per Aadhaar"
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

            {/* STEP 1: APPLICANT PHOTO & KYC DUAL-SIDED DOCUMENT UPLOADS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-900">
                <span className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                  1
                </span>
                <span>Applicant Photo &amp; Government ID Verification (KYC)</span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">

                {/* User Photo Upload */}
                <div className="border-b border-stone-100 pb-6">
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
                        id="userPhotoInput"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <label
                          htmlFor="userPhotoInput"
                          className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                        >
                          <FiUploadCloud className="w-4 h-4" />
                          <span>{photoFile ? 'Change Photo' : 'Upload User Image'}</span>
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
                        Clear frontal passport photograph (JPG, PNG up to 10MB). Used for printing on your official dual-sided ID card.
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
                    <option value="Other Government ID">Other Government Recognized Photo ID</option>
                  </select>
                </div>

                {/* Dual-Sided Document Uploads (Front & Back) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">

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
                          id="docFrontInput"
                          onChange={handleDocFrontSelect}
                          className="hidden"
                        />
                        <label htmlFor="docFrontInput" className="cursor-pointer space-y-2 block">
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
                          id="docBackInput"
                          onChange={handleDocBackSelect}
                          className="hidden"
                        />
                        <label htmlFor="docBackInput" className="cursor-pointer space-y-2 block">
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

            {/* STEP 2: SELECT MEMBERSHIP TIER */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-900">
                <span className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                  2
                </span>
                <span>Select Your Membership Tier</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.length > 0 ? (
                  plans.map((plan) => {
                    const isSelected = effectivePlanId === plan._id;
                    return (
                      <div
                        key={plan._id}
                        onClick={() => setSelectedPlanId(plan._id)}
                        className={`cursor-pointer rounded-3xl p-5 border transition flex flex-col justify-between ${isSelected
                          ? 'border-amber-500 ring-2 ring-amber-400/40 bg-linear-to-b from-amber-50/80 to-white shadow-md shadow-amber-500/10'
                          : 'border-stone-200 bg-white hover:border-amber-300 shadow-2xs'
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                              {plan.duration || 'Annual'}
                            </span>
                            {plan.popular && (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                                Recommended
                              </span>
                            )}
                          </div>
                          <h4 className="font-black text-stone-900 text-base mt-1">{plan.name || plan.title}</h4>
                          <div className="my-3">
                            <span className="text-2xl font-black text-amber-950">₹{Number(plan.fee || plan.price || 0).toLocaleString('en-IN')}</span>
                            <span className="text-xs text-stone-600 font-semibold"> / {plan.duration}</span>
                          </div>
                          <p className="text-xs text-stone-600 font-medium mb-4">{plan.description}</p>

                          <div className="space-y-1.5 border-t border-stone-100 pt-3">
                            {(Array.isArray(plan.perks) ? plan.perks : []).map((perk, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-700 font-medium">
                                <FiCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <span>{perk}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-stone-100">
                          <div className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1 ${isSelected
                            ? 'bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-xs'
                            : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                            }`}>
                            {isSelected ? (
                              <>
                                <FiCheck className="w-3.5 h-3.5" />
                                <span>Selected Plan</span>
                              </>
                            ) : (
                              'Select This Plan'
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-3 p-8 text-center bg-white rounded-3xl border border-stone-200">
                    <p className="text-xs font-bold text-stone-500">Loading available membership tiers...</p>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 3: PAYMENT DETAILS (UPI QR & BANK TRANSFER) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-900">
                <span className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                  3
                </span>
                <span>Transfer Membership Contribution (₹{Number(selectedPlan?.fee || selectedPlan?.price || 250).toLocaleString('en-IN')})</span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* UPI QR Display */}
                <div className="text-center md:border-r md:border-stone-100 md:pr-8">
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-amber-400 shadow-sm mb-3">
                    <img
                      src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=apnavriddhaashram@okhdfcbank%26pn=Apna%20Parivar%20Vriddh%20Aashram%26cu=INR'}
                      alt="Foundation Official UPI QR"
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">Scan via Any UPI App</span>
                    <div className="inline-flex items-center gap-2 bg-amber-50 py-1.5 px-3.5 rounded-xl border border-amber-300">
                      <span className="font-mono font-black text-amber-950 text-xs">
                        {settings?.upiId || 'apnavriddhaashram@okhdfcbank'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="text-amber-800 hover:text-amber-950 font-bold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <FiCopy className="w-3.5 h-3.5" />
                        <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium">Google Pay • PhonePe • Paytm • BHIM UPI</p>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-black text-stone-950 text-sm pb-2 border-b border-stone-100 flex items-center gap-1.5">
                    <FiShield className="w-4 h-4 text-amber-700" />
                    <span>Official Foundation Bank Account Details</span>
                  </h4>
                  <div>
                    <span className="text-stone-500 font-semibold block">Account Name</span>
                    <strong className="text-stone-900 text-sm font-black">
                      {settings?.bankDetails?.accountName || 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-semibold block">Bank Name</span>
                    <strong className="text-stone-900">{settings?.bankDetails?.bankName || 'HDFC Bank Ltd.'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-semibold block">Account Number</span>
                    <strong className="font-mono text-stone-900 text-sm">
                      {settings?.bankDetails?.accountNumber || '50200088991234'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-semibold block">IFSC Code</span>
                    <strong className="font-mono text-stone-900">
                      {settings?.bankDetails?.ifscCode || 'HDFC0001234'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 font-semibold block">Registered Head Office</span>
                    <span className="text-stone-700 font-medium">{settings?.address || 'Jabalpur, Madhya Pradesh - 482001'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: SUBMIT PAYMENT PROOF & FINALIZE APPLICATION */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-900">
                <span className="w-6 h-6 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center text-xs font-black shadow-xs">
                  4
                </span>
                <span>Submit Payment Proof for Verification</span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      UPI Transaction ID / Bank UTR Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 429188291039 or UPI/429188..."
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono text-stone-900 bg-white"
                    />
                    <span className="text-[10px] text-stone-500 font-medium mt-1 block">
                      Found on your GooglePay/PhonePe/Bank debit confirmation screen.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-stone-900 bg-white"
                    >
                      <option value="UPI / PhonePe / GPay">UPI / PhonePe / GPay</option>
                      <option value="Paytm Wallet / UPI">Paytm Wallet / UPI</option>
                      <option value="IMPS / NEFT Bank Transfer">IMPS / NEFT Bank Transfer</option>
                      <option value="Net Banking">Net Banking</option>
                    </select>
                  </div>
                </div>

                {/* Screenshot Selection with Local Preview & Remove Option */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Upload Payment Transfer Screenshot (PNG / JPG) <span className="text-rose-500">*</span>
                  </label>

                  {!selectedRawFile ? (
                    <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-6 text-center transition bg-amber-50/20">
                      <input
                        type="file"
                        accept="image/*"
                        id="screenshotInput"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label htmlFor="screenshotInput" className="cursor-pointer space-y-2 block">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl shadow-2xs">
                          <FiUploadCloud className="w-6 h-6 text-amber-700" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-amber-800 hover:underline block">
                            Click to select payment screenshot image
                          </span>
                          <span className="text-xs text-stone-500 font-medium block mt-1">
                            PNG, JPG or JPEG up to 15MB • Uploaded with application in a single API call
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900">Selected Screenshot:</span>
                          <span className="text-xs font-mono text-amber-900 font-bold">{fileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Change Screenshot</span>
                        </button>
                      </div>

                      {previewUrl && (
                        <div className="relative max-w-sm mx-auto overflow-hidden rounded-xl border border-stone-200 bg-white p-2 shadow-xs">
                          <img
                            src={previewUrl}
                            alt="Payment Screenshot Preview"
                            className="w-full max-h-56 object-contain rounded-lg mx-auto"
                          />
                          <div className="mt-2 text-center text-[11px] font-bold text-emerald-800 bg-emerald-50 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200">
                            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Screenshot attached and ready to submit</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Special Notes / Address Confirmation</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Enrolled for Jabalpur elder welfare seva chapter..."
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-stone-900 bg-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-stone-700 font-semibold">
                    Selected: <strong className="text-amber-950 font-bold">{selectedPlan?.name || selectedPlan?.title}</strong> (₹{selectedPlan?.fee || selectedPlan?.price || 250})
                  </span>

                  <button
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting
                      ? 'Submitting Application & Documents...'
                      : (!isFormValid
                        ? 'Enter UTR or Attach Screenshot to Submit'
                        : 'Submit Application for Trustee Verification')}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
