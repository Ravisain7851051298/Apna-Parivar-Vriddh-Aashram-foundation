'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiSettings,
  FiSave,
  FiCheckCircle,
  FiImage,
  FiShield,
  FiPhone,
  FiCreditCard,
  FiArrowLeft,
  FiUploadCloud,
  FiSend,
  FiMail,
  FiAlertCircle,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiExternalLink,
  FiLayers
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { settings, updateSettings, testEmailSettings, currentUser, uploadFile } = useNGO();
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const [activeTab, setActiveTab] = useState('branding');
  const [uploadingField, setUploadingField] = useState(null);
  const [testReceiverEmail, setTestReceiverEmail] = useState('');
  const [testingMail, setTestingMail] = useState(false);
  const [mailTestResult, setMailTestResult] = useState(null);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    ngoNameHi: settings?.ngoNameHi || 'अपना परिवार वृद्ध आश्रम फाउंडेशन',
    ngoName: settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation',
    taglineHi: settings?.taglineHi || 'निराश्रित एवं असहाय वृद्धजनों की निःस्वार्थ सेवा ही हमारा परम धर्म',
    tagline: settings?.tagline || 'Dedicated to Elderly Care, Dignity, Love & Family Atmosphere',
    logoUrl: settings?.logoUrl || '',
    officialSealUrl: settings?.officialSealUrl || '',
    presidentSignatureUrl: settings?.presidentSignatureUrl || '',
    presidentName: settings?.presidentName || 'Ravi Saini (Trustee)',
    registrationNo: settings?.registrationNo || 'REG/2022/NGO/MP/4820',
    panNo: settings?.panNo || 'AAATP4928M',
    nitiAayogDarpanId: settings?.nitiAayogDarpanId || 'MP/2022/0319482',
    csr1No: settings?.csr1No || 'CSR00049281',
    exemption12A: settings?.exemption12A || 'CIT(EXEMP)/12A/2022-23/A-492',
    exemption80G: settings?.exemption80G || 'CIT(EXEMP)/80G/2022-23/G-881',
    phone: settings?.phone || '+91 8959055269',
    whatsapp: settings?.whatsapp || '+918959055269',
    facebook: settings?.facebook || 'https://facebook.com',
    twitter: settings?.twitter || 'https://x.com',
    instagram: settings?.instagram || 'https://instagram.com',
    youtube: settings?.youtube || 'https://youtube.com',
    linkedin: settings?.linkedin || 'https://linkedin.com',
    telegram: settings?.telegram || '',
    email: settings?.email || 'info@apnaparivarvriddhaashram.org',
    address: settings?.address || 'Behind Adhartal Railway Station, Jabalpur, Madhya Pradesh - 482001',
    googleMapEmbed: settings?.googleMapEmbed || '',
    accountName: settings?.bankDetails?.accountName || 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION',
    accountNumber: settings?.bankDetails?.accountNumber || '41298457291',
    ifscCode: settings?.bankDetails?.ifscCode || 'SBIN0001234',
    bankName: settings?.bankDetails?.bankName || 'State Bank of India',
    branch: settings?.bankDetails?.branch || 'Adhartal Branch, Jabalpur, MP',
    upiId: settings?.upiId || 'apnaparivar@okhdfcbank',
    upiQrImage: settings?.upiQrImage || '',
    membershipFee: settings?.membershipFee || 1100,
    smtpHost: settings?.smtpHost || 'smtp.gmail.com',
    smtpPort: settings?.smtpPort || 587,
    smtpUser: settings?.smtpUser || 'ravisain75688@gmail.com',
    smtpPass: settings?.smtpPass || '',
    smtpFromName: settings?.smtpFromName || 'Apna Parivar Vriddh Aashram Foundation',
    adminSecretKey: settings?.adminSecretKey || 'ravi123'
  });

  // Keep form in sync when settings are loaded from server
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setForm(prev => ({
        ...prev,
        ...settings,
        ngoName: settings.ngoName || prev.ngoName,
        ngoNameHi: settings.ngoNameHi || prev.ngoNameHi,
        email: settings.email || prev.email,
        adminSecretKey: settings.adminSecretKey !== undefined ? settings.adminSecretKey : prev.adminSecretKey,
        smtpPass: settings.smtpPass !== undefined ? settings.smtpPass : prev.smtpPass,
        smtpUser: settings.smtpUser || prev.smtpUser,
        smtpHost: settings.smtpHost || prev.smtpHost,
        smtpPort: settings.smtpPort || prev.smtpPort,
        smtpFromName: settings.smtpFromName || prev.smtpFromName,
        accountName: settings.bankDetails?.accountName ?? prev.accountName,
        accountNumber: settings.bankDetails?.accountNumber ?? prev.accountNumber,
        ifscCode: settings.bankDetails?.ifscCode ?? prev.ifscCode,
        bankName: settings.bankDetails?.bankName ?? prev.bankName,
        branch: settings.bankDetails?.branch ?? prev.branch,
      }));
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (fieldName, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const res = await uploadFile(file);
      if (res?.success && res.url) {
        setForm(prev => ({ ...prev, [fieldName]: res.url }));
        toast.success(`Asset uploaded successfully!`);
      }
    } catch (err) {
      toast.error('File upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateSettings({
        ...form,
        bankDetails: {
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
          branch: form.branch
        }
      });
      if (res?.success) {
        toast.success('Master Settings saved successfully!');
      } else {
        toast.error(res?.message || 'Failed to save settings');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testReceiverEmail || !testReceiverEmail.trim()) {
      toast.error('Please enter a recipient email address.');
      return;
    }
    setTestingMail(true);
    setMailTestResult(null);
    try {
      const res = await testEmailSettings({
        smtpHost: form.smtpHost,
        smtpPort: form.smtpPort,
        smtpUser: form.smtpUser,
        smtpPass: form.smtpPass,
        smtpFromName: form.smtpFromName,
        testReceiverEmail: testReceiverEmail.trim(),
        adminSecretKey: form.adminSecretKey
      });
      setMailTestResult(res);
      if (res?.success) {
        toast.success(res.message || 'SMTP Connection Test Passed!');
      } else {
        toast.error(res?.message || 'SMTP Test Failed');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'SMTP diagnostic failed.';
      setMailTestResult({ success: false, message: errMsg });
      toast.error(errMsg);
    } finally {
      setTestingMail(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#fffdfa]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-amber-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 border border-amber-300 shadow-2xs">
            <FiShield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-stone-900">Administrator Access Required</h2>
          <p className="text-xs text-stone-600 mt-2">
            Only designated NGO Administrators have permission to modify brand identity, bank details, and statutory settings.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block px-6 py-2.5 bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20"
          >
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Header Card */}
      <div className="bg-linear-to-r from-amber-100/90 via-[#fefce8] to-amber-50 p-4 rounded-2xl border border-amber-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-black border border-amber-300 mb-1.5">
            <FiSettings className="w-3.5 h-3.5 text-amber-700" />
            <span>NGO Master Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Master Settings &amp; Statutory Credentials
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Official seal, signatures, 12A/80G credentials, banking/UPI, and secure SMTP email relay.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 text-stone-950" />
            <span>{isSaving ? "Saving Settings..." : "Save All Settings"}</span>
          </button>
          <Link
            href="/dashboard/managecontent"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100/70 hover:bg-amber-100 px-3.5 py-2.5 rounded-2xl border border-amber-300 transition"
          >
            <FiLayers className="w-3.5 h-3.5 text-amber-700" />
            <span>Manage Content →</span>
          </Link>
        </div>
      </div>

      {/* 2. Tab Navigation */}
      <div className="bg-white p-1.5 rounded-2xl border border-amber-200/90 shadow-2xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'branding', label: '1. Logo, Seal & Signature', icon: FiImage },
          { id: 'statutory', label: '2. Statutory 12A / 80G & PAN', icon: FiShield },
          { id: 'contact', label: '3. Contact Info & Office', icon: FiPhone },
          { id: 'bank', label: '4. Bank Account & UPI QR', icon: FiCreditCard },
          { id: 'smtp', label: '5. SMTP Email & Security', icon: FiMail },
        ].map((t) => {
          const TabIcon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
                activeTab === t.id
                  ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
                  : 'bg-stone-100/80 text-stone-700 hover:bg-amber-100 hover:text-amber-950'
              }`}
            >
              <TabIcon className={`w-3.5 h-3.5 ${activeTab === t.id ? 'text-stone-950' : 'text-amber-700'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Settings Form Panels */}
      <form onSubmit={handleSave} className="space-y-5 text-xs font-medium">
        {/* TAB 1: BRANDING, LOGO, SEAL, SIGNATURE */}
        {activeTab === 'branding' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-stone-950 flex items-center gap-2 border-b border-amber-100 pb-3">
              <FiImage className="text-amber-700 w-4 h-4" />
              <span>1. Organization Branding, Official Stamp &amp; Signatures</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-900 block mb-1.5">NGO Full English Name *</label>
                <input
                  type="text"
                  required
                  name="ngoName"
                  value={form.ngoName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1.5">NGO Name in Hindi *</label>
                <input
                  type="text"
                  required
                  name="ngoNameHi"
                  value={form.ngoNameHi}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-stone-950 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-900 block mb-1.5">Official Tagline (English)</label>
                <input
                  type="text"
                  name="tagline"
                  value={form.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1.5">Membership Registration Fee (₹)</label>
                <input
                  type="number"
                  name="membershipFee"
                  value={form.membershipFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-stone-950 bg-white"
                />
              </div>
            </div>

            {/* Verification Assets: Logo, Seal, Signature */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-amber-100">
              {/* Logo */}
              <div className="bg-stone-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <span className="font-black text-xs text-stone-900 block">Official Logo</span>
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-amber-300 bg-white flex items-center justify-center shadow-xs">
                  {form.logoUrl ? (
                    <img src={getContentImageUrl(form.logoUrl)} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <FiImage className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <label className="block cursor-pointer">
                  <span className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-50 text-xs shadow-2xs">
                    <FiUploadCloud className="w-4 h-4 text-amber-700" />
                    <span>{uploadingField === 'logoUrl' ? 'Uploading...' : 'Upload Logo'}</span>
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('logoUrl', e)} />
                </label>
              </div>

              {/* Official Seal */}
              <div className="bg-stone-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <span className="font-black text-xs text-stone-900 block">Official Trust Stamp / Seal</span>
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-amber-300 bg-white flex items-center justify-center shadow-xs">
                  {form.officialSealUrl ? (
                    <img src={getContentImageUrl(form.officialSealUrl)} alt="Seal" className="w-full h-full object-contain" />
                  ) : (
                    <FiShield className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <label className="block cursor-pointer">
                  <span className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-50 text-xs shadow-2xs">
                    <FiUploadCloud className="w-4 h-4 text-amber-700" />
                    <span>{uploadingField === 'officialSealUrl' ? 'Uploading...' : 'Upload Stamp'}</span>
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('officialSealUrl', e)} />
                </label>
              </div>

              {/* President Signature */}
              <div className="bg-stone-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <span className="font-black text-xs text-stone-900 block">Trustee President Signature</span>
                <div className="w-28 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-amber-300 bg-white flex items-center justify-center p-1 shadow-xs">
                  {form.presidentSignatureUrl ? (
                    <img src={getContentImageUrl(form.presidentSignatureUrl)} alt="Signature" className="max-h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-stone-400 font-bold">No Signature</span>
                  )}
                </div>
                <label className="block cursor-pointer">
                  <span className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-50 text-xs shadow-2xs">
                    <FiUploadCloud className="w-4 h-4 text-amber-700" />
                    <span>{uploadingField === 'presidentSignatureUrl' ? 'Uploading...' : 'Upload Signature'}</span>
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('presidentSignatureUrl', e)} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATUTORY 12A / 80G */}
        {activeTab === 'statutory' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-stone-950 flex items-center gap-2 border-b border-amber-100 pb-3">
              <FiShield className="text-amber-700 w-4 h-4" />
              <span>2. Statutory Certifications &amp; Income Tax Exemptions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-900 block mb-1">Registration No *</label>
                <input
                  type="text"
                  name="registrationNo"
                  value={form.registrationNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Permanent Account No (PAN) *</label>
                <input
                  type="text"
                  name="panNo"
                  value={form.panNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white uppercase"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">NITI Aayog Darpan ID</label>
                <input
                  type="text"
                  name="nitiAayogDarpanId"
                  value={form.nitiAayogDarpanId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">CSR-1 Registration No</label>
                <input
                  type="text"
                  name="csr1No"
                  value={form.csr1No}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Section 12A Exemption Order</label>
                <input
                  type="text"
                  name="exemption12A"
                  value={form.exemption12A}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Section 80G Tax Exemption Order</label>
                <input
                  type="text"
                  name="exemption80G"
                  value={form.exemption80G}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & OFFICE (Without the old newsTicker marquee!) */}
        {activeTab === 'contact' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-stone-950 flex items-center gap-2 border-b border-amber-100 pb-3">
              <FiPhone className="text-amber-700 w-4 h-4" />
              <span>3. Contact Helplines, Head Office &amp; Social Links</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-900 block mb-1">24x7 Elder Helpline *</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">WhatsApp Seva Desk *</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Official Inquiry Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-stone-950 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-900 block mb-1">Head Office Full Physical Address *</label>
              <textarea
                rows={2}
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-950 bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="font-bold text-stone-900 block mb-1">Google Maps Embed URL</label>
              <input
                type="text"
                name="googleMapEmbed"
                value={form.googleMapEmbed}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs text-stone-950 bg-white"
                placeholder="https://www.google.com/maps/embed?..."
              />
            </div>

            <div className="pt-3 border-t border-amber-100">
              <span className="font-black text-xs text-stone-900 block mb-3">Social Media URLs</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {['facebook', 'instagram', 'youtube', 'twitter', 'linkedin', 'telegram'].map((s) => (
                  <div key={s}>
                    <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">{s}</label>
                    <input
                      type="text"
                      name={s}
                      value={form[s] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANK ACCOUNT & UPI */}
        {activeTab === 'bank' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-stone-950 flex items-center gap-2 border-b border-amber-100 pb-3">
              <FiCreditCard className="text-amber-700 w-4 h-4" />
              <span>4. Official Bank Account &amp; UPI QR Code</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-900 block mb-1">Beneficiary Account Name *</label>
                <input
                  type="text"
                  name="accountName"
                  value={form.accountName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white uppercase"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Bank Name &amp; Branch</label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-950 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-amber-100">
              <div className="space-y-3">
                <label className="font-bold text-stone-900 block">Trustee UPI VPA ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-stone-950 bg-white"
                  placeholder="apnaparivar@okhdfcbank"
                />
                <p className="text-[11px] text-stone-500">
                  Used on public donation receipts, tax deduction acknowledgements, and QR popups.
                </p>
              </div>

              <div className="bg-stone-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-300 bg-white flex items-center justify-center shrink-0">
                  {form.upiQrImage ? (
                    <img src={getContentImageUrl(form.upiQrImage)} alt="QR" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-stone-400 font-bold">No QR</span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="font-bold text-xs text-stone-900 block">Custom UPI QR Image</span>
                  <label className="block cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-50 text-xs shadow-2xs">
                      <FiUploadCloud className="w-3.5 h-3.5 text-amber-700" />
                      <span>{uploadingField === 'upiQrImage' ? 'Uploading...' : 'Upload QR'}</span>
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('upiQrImage', e)} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SMTP & SECURITY */}
        {activeTab === 'smtp' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-stone-950 flex items-center gap-2 border-b border-amber-100 pb-3">
              <FiMail className="text-amber-700 w-4 h-4" />
              <span>5. SMTP Email Server Relay &amp; Master Secret Security</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-900 block mb-1">SMTP Host Server *</label>
                <input
                  type="text"
                  name="smtpHost"
                  value={form.smtpHost}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">SMTP Port *</label>
                <input
                  type="number"
                  name="smtpPort"
                  value={form.smtpPort}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">SMTP Username / Email *</label>
                <input
                  type="email"
                  name="smtpUser"
                  value={form.smtpUser}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">SMTP App Password *</label>
                <div className="relative">
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    name="smtpPass"
                    value={form.smtpPass}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-950 bg-white pr-10"
                    placeholder="16-character App Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    className="absolute right-3 top-3 text-stone-500 hover:text-stone-800"
                  >
                    {showSmtpPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Sender From Name</label>
                <input
                  type="text"
                  name="smtpFromName"
                  value={form.smtpFromName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-950 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-900 block mb-1">Admin Master Secret Key *</label>
                <input
                  type="text"
                  name="adminSecretKey"
                  value={form.adminSecretKey}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-stone-950 bg-white"
                />
              </div>
            </div>

            {/* Diagnostic Email Test Box */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <span className="font-black text-xs text-amber-950 block">Live SMTP Diagnostic Test</span>
              <p className="text-[11px] text-stone-600">
                Send a real test email through your configured SMTP server to verify email dispatch for 80G receipts and login OTPs.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  value={testReceiverEmail}
                  onChange={(e) => setTestReceiverEmail(e.target.value)}
                  placeholder="Enter recipient email (e.g. your email address)..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white w-full"
                />
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testingMail}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <FiSend className="w-3.5 h-3.5" />
                  <span>{testingMail ? 'Testing...' : 'Send Diagnostic Test'}</span>
                </button>
              </div>
              {mailTestResult && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  mailTestResult.success ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                }`}>
                  {mailTestResult.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Save Bar */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-xl shadow-amber-500/25 transition cursor-pointer disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 text-stone-950" />
            <span>{isSaving ? "Saving Settings..." : "Save Master Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
