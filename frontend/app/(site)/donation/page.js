'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FiHeart,
  FiShield,
  FiCheckCircle,
  FiFileText,
  FiUploadCloud,
  FiClock,
  FiAlertTriangle,
  FiTrash2,
  FiTarget,
  FiHash,
  FiCopy,
  FiCheck,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLogIn
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa6';
import confetti from 'canvas-confetti';
import { useNGO } from '@/context/NGOContext';

function DonationContent() {
  const { settings, campaigns, recordDonation, currentUser } = useNGO();
  const searchParams = useSearchParams();
  const campaignQuery = searchParams.get('campaign') || searchParams.get('campaignId') || searchParams.get('id');

  // Radio toggle: 'qr' for UPI QR Code, 'bank' for Direct Bank Account Details
  const [displayMode, setDisplayMode] = useState('qr');

  const [selectedCampaign, setSelectedCampaign] = useState(campaignQuery || 'general');
  const [copiedKey, setCopiedKey] = useState(null);
  const [amount, setAmount] = useState(1100);

  // Donor Details (Supports both Guest donors & Logged-in users via optionalAuth)
  const [donorName, setDonorName] = useState(() => currentUser?.name || '');
  const [donorPhone, setDonorPhone] = useState(() => currentUser?.phone || '');
  const [donorEmail, setDonorEmail] = useState(() => currentUser?.email || '');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState(() => currentUser?.address || '');

  // Payment Verification Fields
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Under-review submitted donation confirmation state
  const [submittedDonation, setSubmittedDonation] = useState(null);

  const quickAmounts = [500, 1100, 2100, 5100, 11000];

  // Auto-sync user fields when currentUser state changes
  useEffect(() => {
    if (currentUser) {
      if (!donorName) setDonorName(currentUser.name || '');
      if (!donorEmail) setDonorEmail(currentUser.email || '');
      if (!donorPhone) setDonorPhone(currentUser.phone || '');
      if (!address && currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  // Synchronize campaign selection with query params (?campaign=..., ?campaignId=..., ?id=...)
  useEffect(() => {
    const rawParam = searchParams.get('campaign') || searchParams.get('campaignId') || searchParams.get('id');
    if (rawParam) {
      if (campaigns && campaigns.length > 0) {
        const found = campaigns.find(c =>
          c._id === rawParam ||
          c.id === rawParam ||
          String(c._id) === String(rawParam) ||
          c.title?.toLowerCase() === rawParam.toLowerCase()
        );
        if (found) {
          setSelectedCampaign(found._id || found.id);
        } else {
          setSelectedCampaign(rawParam);
        }
      } else {
        setSelectedCampaign(rawParam);
      }
    }
  }, [searchParams, campaigns]);

  // Resolve currently attached crowdfunding campaign object
  const currentCampaign = campaigns?.find(c =>
    c._id === selectedCampaign ||
    c.id === selectedCampaign ||
    String(c._id) === String(selectedCampaign)
  );

  const handleCopy = (text, key) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('Screenshot file size must be under 15MB.');
      return;
    }

    setError('');
    setScreenshotFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setScreenshotFileName(file.name);
  };

  const handleRemoveScreenshot = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setScreenshotFile(null);
    setScreenshotFileName('');
    const input = document.getElementById('donationScreenshotInput');
    if (input) input.value = '';
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');

    // Guest donor field validation
    if (!currentUser && (!donorName.trim() || !donorEmail.trim() || !donorPhone.trim())) {
      setError('Please provide your Full Legal Name, Email Address, and 10-digit Mobile Number.');
      return;
    }

    if (!amount || Number(amount) < 10) {
      setError('Please enter a valid donation amount of at least ₹10.');
      return;
    }

    if (!transactionId.trim()) {
      setError('Please enter the UPI Transaction ID / Bank UTR Number from your payment app.');
      return;
    }

    if (!screenshotFile) {
      setError('Please attach the payment transfer screenshot for Trustee bank reconciliation.');
      return;
    }

    setLoading(true);

    try {
      const campObj = campaigns.find(c => c._id === selectedCampaign || c.id === selectedCampaign || String(c._id) === String(selectedCampaign));
      const finalCampaignId = campObj ? (campObj._id || campObj.id) : (selectedCampaign === 'general' ? 'general' : selectedCampaign);
      const campaignTitle = campObj ? campObj.title : (selectedCampaign === 'general' ? 'General NGO Social Welfare Fund' : 'General Welfare Fund');

      const formData = new FormData();
      formData.append('donorName', (donorName || currentUser?.name || 'Generous Contributor').trim());
      formData.append('donorPhone', (donorPhone || currentUser?.phone || '').trim());
      formData.append('donorEmail', (donorEmail || currentUser?.email || '').toLowerCase().trim());
      formData.append('panNumber', panNumber ? panNumber.toUpperCase().trim() : '');
      formData.append('amount', String(amount));
      formData.append('campaignId', finalCampaignId);
      formData.append('campaignTitle', campaignTitle);
      formData.append('transactionId', transactionId.trim());
      formData.append('paymentMethod', displayMode === 'qr' ? 'UPI QR' : 'Direct Bank Transfer');
      formData.append('address', (address || currentUser?.address || '').trim());
      formData.append('category', 'payments');
      if (screenshotFile) {
        formData.append('file', screenshotFile);
        formData.append('screenshot', screenshotFile);
        formData.append('paymentScreenshot', screenshotFile);
      }

      const res = await recordDonation(formData);
      setLoading(false);

      if (res.success) {
        setSubmittedDonation({
          donorName: (donorName || currentUser?.name || 'Generous Contributor').trim(),
          donorEmail: (donorEmail || currentUser?.email || '').toLowerCase().trim(),
          amount: Number(amount),
          campaignId: finalCampaignId,
          campaignTitle,
          transactionId: transactionId.trim(),
          paymentMethod: displayMode === 'qr' ? 'UPI QR Code' : 'Direct Bank Transfer',
          date: new Date()
        });

        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) { }
      } else {
        setError(res.message || 'Error occurred while submitting donation. Please check your network and try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(typeof err === 'string' ? err : (err?.message || 'Failed to submit donation.'));
    }
  };

  const defaultUpiQr = settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=apnaparivar@okhdfcbank%26pn=Apna%20Parivar%20Vriddh%20Aashram%20Foundation%26cu=INR';
  const defaultUpiId = settings?.upiId || 'apnaparivar@okhdfcbank';

  const bankName = settings?.bankDetails?.bankName || 'State Bank of India';
  const bankAccNo = settings?.bankDetails?.accountNumber || '41298457291';
  const bankIfsc = settings?.bankDetails?.ifscCode || 'SBIN0001234';
  const bankAccName = settings?.bankDetails?.accountName || settings?.ngoName || 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION';
  const bankBranch = settings?.bankDetails?.branch || 'Adhartal Branch, Jabalpur, MP';

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Header Card */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#0b8026] text-xs font-black border border-emerald-200 shadow-2xs">
            <FiShield className="w-4 h-4 text-[#0b8026]" />
            <span>Section 80G Certified Non-Profit • 50% Income Tax Exemption</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Support Our Mission with 80G Tax Exemption
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Your generous contribution directly finances shelter, nutritious satvik meals, 24x7 medical checkups, and loving care for destitute elderly mothers and fathers in Jabalpur, Madhya Pradesh.
          </p>
        </div>

        {/* ---------------- 1. SUBMITTED CONFIRMATION SCREEN (WHEN SUCCESSFUL) ---------------- */}
        {submittedDonation ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-500 shadow-xl max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
              <FiCheckCircle className="w-12 h-12" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Donation Received • Under Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                दान सफलतापूर्वक प्राप्त हुआ!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{submittedDonation.donorName}</strong>. Your payment proof for <strong className="text-emerald-700">₹{Number(submittedDonation.amount).toLocaleString('en-IN')}</strong> has been submitted to the Trustee Verification Desk.
              </p>
            </div>

            {/* Submission Summary Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Bank UTR / Transaction ID:</span>
                <strong className="font-mono text-emerald-800 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {submittedDonation.transactionId}
                </strong>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Contribution Amount:</span>
                <strong className="text-slate-900 text-sm font-black">₹{Number(submittedDonation.amount).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Registered Email Address:</span>
                <span className="font-bold text-slate-900">{submittedDonation.donorEmail}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-slate-500 font-bold">Earmarked Cause / Fund:</span>
                <strong className="text-slate-900">{submittedDonation.campaignTitle}</strong>
              </div>
            </div>

            {/* CBDT 80G Statutory Notice */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-xs text-emerald-950 space-y-2 leading-relaxed">
              <p className="font-black text-sm text-emerald-900 flex items-center gap-2">
                <span>📧</span> 80G Tax Receipt &amp; Verification Protocol:
              </p>
              <p>
                1. <strong>Audit Reconciliation:</strong> Your payment UTR is verified against official bank ledger statements by our accounts committee.
              </p>
              <p>
                2. <strong>Email Dispatch:</strong> Upon Trustee approval, your digitally stamped <strong>Section 80G Tax Exemption Receipt</strong> will be emailed automatically to <strong className="text-emerald-900">{submittedDonation.donorEmail}</strong>.
              </p>
              {!currentUser && (
                <p>
                  3. <strong>Donor Portal Access:</strong> A member/donor account has been automatically provisioned for you. Your login credentials (temporary password) have been sent to your registered email address so you can access your donation history, 80G receipts, and certificates anytime!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 font-black text-xs transition shadow-md shadow-amber-500/20"
              >
                Back to Home
              </Link>
              {currentUser && (
                <Link
                  href="/profile/donations"
                  className="px-6 py-2.5 rounded-xl bg-white border border-amber-200 text-amber-950 font-bold text-xs hover:bg-amber-50 transition shadow-2xs"
                >
                  View Receipts in Profile
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setSubmittedDonation(null);
                  setTransactionId('');
                  setScreenshotFile(null);
                  setPreviewUrl('');
                  setScreenshotFileName('');
                  setError('');
                }}
                className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold hover:underline cursor-pointer"
              >
                Make Another Contribution
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- 2. DONATION FORM (OPTIONAL AUTH + RADIO METHOD + GUEST INFO + SCREENSHOT) ---------------- */
          <form onSubmit={handleDonate} className="space-y-6">

            {/* Error Alert Box */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-1">
                <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-black text-sm text-rose-950">Submission Error</p>
                  <p className="mt-0.5 text-xs text-rose-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Authenticated Contributor Active Session Banner */}
            {currentUser && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 text-amber-950 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">
                      Logged in as: {currentUser.name}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      {currentUser.email} • Verified Contributor
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Active Session
                </span>
              </div>
            )}

            {/* Step 1 Card: Cause & Amount Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0 border border-amber-300">
                  1
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Select Donation Amount &amp; Cause</h3>
                  <p className="text-[11px] text-slate-500">Every rupee supports elderly care with 100% 80G tax receipt.</p>
                </div>
              </div>

              {/* Cause Picker Dropdown */}
              <div>
                <label className="font-bold text-slate-900 text-xs block mb-1">
                  Select Cause / Crowdfunding Campaign
                </label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-xs text-slate-900 bg-white"
                >
                  <option value="general">🪔 वृद्ध आश्रम सेवा कोष (General Vriddh Aashram Fund)</option>
                  {campaigns && campaigns.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      🎯 [ID: #{(c._id || c.id).slice(-6)}] {c.title}
                    </option>
                  ))}
                </select>
                {currentCampaign && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <FiTarget className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="truncate">{currentCampaign.title}</span>
                    </span>
                    <span className="text-[10px] bg-white text-amber-800 px-2 py-0.5 rounded-md border border-amber-200 shrink-0 font-mono">
                      #{currentCampaign._id?.slice(-6) || 'DRIVE'}
                    </span>
                  </div>
                )}
              </div>

              {/* Amount Quick Selector & Input */}
              <div>
                <label className="font-bold text-slate-900 text-xs block mb-1">
                  Contribution Amount (INR ₹) *
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2.5">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2.5 rounded-xl font-black text-xs transition cursor-pointer border ${Number(amount) === amt
                        ? 'bg-linear-to-r from-amber-500 to-yellow-500 border-amber-500 text-amber-950 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-amber-50/40 border-amber-200/80 text-amber-950 hover:border-amber-400 hover:bg-amber-100/50'
                        }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">₹</span>
                  <input
                    type="number"
                    min="10"
                    required
                    placeholder="Enter custom amount in INR (Min ₹10)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-black text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 Card: Radio Button for Display QR Code vs Bank Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0 border border-amber-300">
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Choose Transfer Mode / भुगतान का माध्यम चुनें</h3>
                  <p className="text-[11px] text-slate-500">Select either UPI QR code scan or official bank account transfer.</p>
                </div>
              </div>

              {/* Radio Button Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label
                  onClick={() => setDisplayMode('qr')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition ${displayMode === 'qr'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="displayMode"
                    checked={displayMode === 'qr'}
                    onChange={() => setDisplayMode('qr')}
                    className="mt-0.5 w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <FaQrcode className="w-3.5 h-3.5 text-amber-600" />
                      <span>UPI QR Code (Instant Scan)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      GooglePay, PhonePe, Paytm, BHIM or any UPI app.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setDisplayMode('bank')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition ${displayMode === 'bank'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="displayMode"
                    checked={displayMode === 'bank'}
                    onChange={() => setDisplayMode('bank')}
                    className="mt-0.5 w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <FiCreditCard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Direct Bank Account (IMPS/NEFT)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Official Trust current account details with IFSC.
                    </p>
                  </div>
                </label>
              </div>

              {/* Mode 1 Display: Official Trust UPI QR Code */}
              {displayMode === 'qr' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-amber-50/70 via-white to-yellow-50/50 border-2 border-amber-400/60 text-center space-y-4">
                  <div className="inline-block p-3 bg-white rounded-2xl border border-amber-200 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={defaultUpiQr}
                      alt="Apna Parivar Vriddh Aashram Official UPI QR"
                      className="w-48 h-48 sm:w-52 sm:h-52 mx-auto object-contain"
                    />
                  </div>

                  <div className="space-y-2 max-w-sm mx-auto">
                    <div className="text-[11px] font-bold text-slate-500">Official Society UPI ID:</div>
                    <div className="flex items-center justify-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs font-mono text-xs font-black text-amber-950">
                      <span>{defaultUpiId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(defaultUpiId, 'upi')}
                        className="ml-1 p-1 hover:bg-amber-100 rounded text-amber-700 transition cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedKey === 'upi' ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium max-w-md mx-auto">
                    Scan using GooglePay, PhonePe, Paytm, or BHIM. After paying, note down the 12-digit UTR and take a screenshot.
                  </p>
                </div>
              )}

              {/* Mode 2 Display: Direct Bank Details */}
              {displayMode === 'bank' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-amber-50/70 via-white to-yellow-50/50 border-2 border-amber-400/60 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                      Official Trust Bank Account Details
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      Current Account
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[11px] text-slate-500 block font-medium">Account Holder Name:</span>
                      <strong className="text-slate-900 block font-black text-xs">{bankAccName}</strong>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[11px] text-slate-500 block font-medium">Bank Name &amp; Branch:</span>
                      <strong className="text-slate-900 block font-black text-xs">{bankName} ({bankBranch})</strong>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[11px] text-slate-500 block font-medium">Account Number:</span>
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 font-mono font-black text-sm">{bankAccNo}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(bankAccNo, 'acc')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-black transition cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedKey === 'acc' ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[11px] text-slate-500 block font-medium">IFSC Code:</span>
                      <div className="flex items-center justify-between">
                        <strong className="text-emerald-800 font-mono font-black text-sm">{bankIfsc}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(bankIfsc, 'ifsc')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-black transition cursor-pointer"
                          title="Copy IFSC Code"
                        >
                          {copiedKey === 'ifsc' ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium">
                    Use NEFT, IMPS, or RTGS from your netbanking app to transfer funds directly to this account.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3 Card: Guest User Information Inputs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0 border border-amber-300">
                  3
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Donor Information / दानदाता का विवरण</h3>
                  <p className="text-[11px] text-slate-500">Official 80G tax receipt will be issued in this name.</p>
                </div>
              </div>

              {/* Guest User Information Header Notice */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  This Email ID is used for sending official 80G Tax Exemption Receipt and Donation Certificate
                </span>
                {!currentUser && (
                  <Link href="/login?redirect=/donation" className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0">
                    Already have an account? Sign in
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Name as per PAN Card"
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white font-medium text-slate-900 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="Receipt will be emailed here"
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white font-medium text-slate-900 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white font-medium text-slate-900 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    PAN Card Number (Required for 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white uppercase font-mono font-bold text-slate-900 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Mandatory by Income Tax Department (CBDT) for 50% deduction.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Postal Address / City / State</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Aligarh, Uttar Pradesh - 202001"
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white font-medium text-slate-900 focus:outline-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Printed on your formal 80G statutory tax donation receipt.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4 Card: Screenshot & Transaction ID */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50 shadow-md space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  4
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Payment Proof &amp; Screenshot / भुगतान रसीद</h3>
                  <p className="text-[11px] text-slate-500">Enter the UTR reference number and upload transaction screenshot.</p>
                </div>
              </div>

              {/* UTR Input */}
              <div>
                <label className="block font-bold text-slate-900 text-xs mb-1">
                  UPI Transaction ID / Bank UTR Reference Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 429188291039 or UPI/429188..."
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono text-xs font-black text-slate-900 bg-white placeholder:text-slate-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Find this on GooglePay, PhonePe, Paytm, or your bank debit confirmation SMS / statement.
                </span>
              </div>

              {/* Screenshot Upload with Golden Theme */}
              <div>
                <label className="block font-bold text-slate-900 text-xs mb-1">
                  Upload Payment Transfer Screenshot (PNG / JPG) *
                </label>

                <div className="border-2 border-dashed border-amber-400 hover:border-amber-600 rounded-2xl p-5 text-center transition bg-linear-to-b from-amber-50/30 via-white to-yellow-50/30">
                  <input
                    type="file"
                    accept="image/*"
                    id="donationScreenshotInput"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {!previewUrl ? (
                    <label htmlFor="donationScreenshotInput" className="cursor-pointer space-y-2 block py-2">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-100 to-yellow-200 text-amber-700 flex items-center justify-center mx-auto text-2xl shadow-2xs border border-amber-300">
                        <FiUploadCloud className="w-6 h-6 text-amber-700" />
                      </div>
                      <span className="text-xs font-black text-amber-900 hover:text-amber-700 transition block">
                        Click to select payment transfer screenshot
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        PNG, JPG, or JPEG up to 15MB
                      </span>
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-2xl border-2 border-amber-400 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Payment Screenshot Preview"
                          className="w-24 h-24 object-cover rounded-xl border border-slate-300 shadow-2xs shrink-0"
                        />
                        <div className="text-left flex-1 space-y-1">
                          <div className="text-xs font-extrabold text-slate-900 truncate max-w-xs">
                            {screenshotFileName || 'Payment Transfer Screenshot'}
                          </div>
                          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Screenshot attached &amp; verified</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer mt-1"
                          >
                            <FiTrash2 className="w-3 h-3" />
                            <span>Remove Screenshot</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA Button in Radiant Golden Amber Theme */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-amber-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Contribution for Verification...</span>
                  ) : (
                    <>
                      <FiHeart className="w-4 h-4 fill-amber-950" />
                      <span>Submit ₹{Number(amount || 0).toLocaleString('en-IN')} Contribution for Trustee Verification</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-500 font-medium">
                  Official Section 80G tax exemption receipt will be dispatched to <strong>{donorEmail || 'your email'}</strong> after bank reconciliation.
                </p>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default function DonationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading donation portal...</div>}>
      <DonationContent />
    </Suspense>
  );
}
