'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiUserPlus,
  FiCheckCircle,
  FiUploadCloud,
  FiTrash2,
  FiCamera,
  FiCreditCard,
  FiAlertTriangle,
  FiShield,
  FiArrowLeft,
  FiUsers
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/store/planSlice';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function CoordinatorAddMemberPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { plans } = useSelector((state) => state.plans);
  const { currentUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dob, setDob] = useState('1990-01-01');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState(effectiveUser?.district || 'Aligarh');
  const [state, setState] = useState(effectiveUser?.state || 'Uttar Pradesh');
  const [designation, setDesignation] = useState('Executive Member');

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  // KYC Verification Documents & User Photo State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [docFrontFile, setDocFrontFile] = useState(null);
  const [docFrontPreview, setDocFrontPreview] = useState('');
  const [docBackFile, setDocBackFile] = useState(null);
  const [docBackPreview, setDocBackPreview] = useState('');

  // Payment proof
  const [paymentScreenshotFile, setPaymentScreenshotFile] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const activePlans = Array.isArray(plans) ? plans.filter(p => p.isActive !== false) : [];
  const effectivePlanId = selectedPlanId || activePlans[0]?._id;
  const currentPlan = activePlans.find(p => p._id === effectivePlanId) || activePlans[0];

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDocFrontSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFrontFile(file);
    setDocFrontPreview(URL.createObjectURL(file));
  };

  const handleDocBackSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocBackFile(file);
    setDocBackPreview(URL.createObjectURL(file));
  };

  const handlePaymentScreenshotSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaymentScreenshotFile(file);
    setPaymentScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter applicant name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please enter at least email or phone number.');
      return;
    }
    if (!currentPlan) {
      setErrorMsg('Please select a membership plan.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('phone', phone.trim());
      formData.append('bloodGroup', bloodGroup);
      formData.append('dob', dob);
      formData.append('address', address);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('designation', designation || `${currentPlan.title || currentPlan.name} Member`);
      formData.append('planId', currentPlan._id);
      formData.append('planName', currentPlan.title || currentPlan.name || 'Membership Plan');
      formData.append('feeAmount', currentPlan.price || currentPlan.fee || 1100);
      formData.append('utrNumber', transactionId.trim());
      formData.append('transactionId', transactionId.trim());
      formData.append('notes', notes.trim());
      formData.append('documentType', documentType);

      // Explicit Coordinator attribution
      formData.append('addedByCoordinator', effectiveUser?._id || effectiveUser?.id);
      formData.append('coordinatorName', effectiveUser?.name || 'Coordinator');
      formData.append('coordinatorId', effectiveUser?.coordinatorId || 'COORDINATOR');
      formData.append('isAddedByCoordinator', 'true');

      if (photoFile) formData.append('photo', photoFile);
      if (docFrontFile) formData.append('documentFront', docFrontFile);
      if (docBackFile) formData.append('documentBack', docBackFile);
      if (paymentScreenshotFile) formData.append('paymentScreenshot', paymentScreenshotFile);

      const res = await api.post('/coordinators/members', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(res.data?.message || 'Member registered successfully!');
      setSuccessMsg(`Member application for "${name}" submitted successfully! It is now in the Admin Verification queue. Once the Admin approves the bank proof, the official ID Card & Appointment Letter will be generated.`);
      
      // Reset Form
      setName('');
      setEmail('');
      setPhone('');
      setTransactionId('');
      setNotes('');
      setPhotoFile(null);
      setPhotoPreview('');
      setDocFrontFile(null);
      setDocFrontPreview('');
      setDocBackFile(null);
      setDocBackPreview('');
      setPaymentScreenshotFile(null);
      setPaymentScreenshotPreview('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to register member.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 p-6 rounded-3xl text-stone-950 border border-amber-400 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-amber-950 text-[11px] font-black mb-2 border border-amber-300">
            <FiShield className="w-3.5 h-3.5 text-amber-800" />
            <span>Coordinator Desk • Member Enrollment</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Register New Member
          </h1>
          <p className="text-xs text-stone-900 font-medium mt-1">
            Coordinator: <strong className="font-black">{effectiveUser?.name}</strong> ({effectiveUser?.coordinatorId || 'Official Coordinator'})
          </p>
        </div>

        <Link
          href="/profile/coordinator/members"
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
        >
          <FiUsers className="w-3.5 h-3.5" />
          <span>View My Enrolled Members</span>
        </Link>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Member Enrollment Registered!</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed font-medium">
            {successMsg}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/profile/coordinator/members"
              className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-black shadow-xs hover:bg-emerald-800 transition"
            >
              Check Enrollment Status →
            </Link>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold">
          <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Notice on Approval */}
      <div className="bg-amber-50/80 border border-amber-200/90 p-4 rounded-2xl text-xs text-amber-950 font-medium flex items-center gap-3">
        <FiShield className="w-5 h-5 text-amber-700 shrink-0" />
        <span>
          <strong>Trustee Approval Protocol:</strong> As a Coordinator, you can submit member enrollments and upload proof. The application will show as &quot;Added by Coordinator: {effectiveUser?.name}&quot; in the Admin Panel, and the <strong>Admin will give the final approval</strong> to mint the ID card and official appointment letter.
        </span>
      </div>

      {/* Member Enrollment Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-6">
        {/* Section 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
            <FiUserPlus className="w-4 h-4 text-amber-700" />
            <span>1. Member Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Legal Name"
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Designation / Title on ID Card
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Executive Member / Life Member"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street, Colony, Village"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                District / City
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Membership Plan Selection */}
        <div className="space-y-4 pt-4 border-t border-amber-200/80">
          <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
            <FiCreditCard className="w-4 h-4 text-amber-700" />
            <span>2. Select Membership Plan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activePlans.map(plan => {
              const isSelected = (plan._id === effectivePlanId);
              return (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/40 shadow-xs'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="font-black text-xs text-stone-900">{plan.title || plan.name}</h4>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{plan.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">
                      ₹{Number(plan.price || plan.fee || 0).toLocaleString('en-IN')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Transaction ID / UTR Number
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 403928172819"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Payment Proof / Bank Receipt (Optional)
              </label>
              {paymentScreenshotPreview ? (
                <div className="relative w-full h-10 rounded-xl overflow-hidden border border-amber-300 flex items-center justify-between px-3 bg-amber-50/50">
                  <span className="text-xs font-bold text-amber-900 truncate">{paymentScreenshotFile?.name || 'Screenshot attached'}</span>
                  <button
                    type="button"
                    onClick={() => { setPaymentScreenshotFile(null); setPaymentScreenshotPreview(''); }}
                    className="text-rose-600 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-stone-300 hover:border-amber-400 rounded-xl px-4 py-2 flex items-center justify-center gap-2 cursor-pointer transition bg-white text-xs font-bold text-stone-600">
                  <FiUploadCloud className="w-4 h-4 text-stone-400" />
                  <span>Upload Payment Slip</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePaymentScreenshotSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Photo & Government ID Proof */}
        <div className="space-y-4 pt-4 border-t border-amber-200/80">
          <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
            <FiShield className="w-4 h-4 text-amber-700" />
            <span>3. Member Photo &amp; Government ID Proof</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Photo */}
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Applicant Photo
                </label>
                <p className="text-[11px] text-stone-500 mb-3">Front-facing formal photo for member ID badge.</p>
              </div>

              {photoPreview ? (
                <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-xs"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition bg-white text-center">
                  <FiCamera className="w-5 h-5 text-stone-400 mb-1" />
                  <span className="text-[11px] font-bold text-stone-700">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                </label>
              )}
            </div>

            {/* Doc Front */}
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  ID Proof (Front Side)
                </label>
                <p className="text-[11px] text-stone-500 mb-3">Aadhaar Card, Voter ID, or Driving License.</p>
              </div>

              {docFrontPreview ? (
                <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={docFrontPreview} alt="Doc Front" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setDocFrontFile(null); setDocFrontPreview(''); }}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-xs"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition bg-white text-center">
                  <FiUploadCloud className="w-5 h-5 text-stone-400 mb-1" />
                  <span className="text-[11px] font-bold text-stone-700">Upload ID Front</span>
                  <input type="file" accept="image/*" onChange={handleDocFrontSelect} className="hidden" />
                </label>
              )}
            </div>

            {/* Doc Back */}
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  ID Proof (Back Side)
                </label>
                <p className="text-[11px] text-stone-500 mb-3">Address page of Aadhaar or ID document.</p>
              </div>

              {docBackPreview ? (
                <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={docBackPreview} alt="Doc Back" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setDocBackFile(null); setDocBackPreview(''); }}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-xs"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition bg-white text-center">
                  <FiUploadCloud className="w-5 h-5 text-stone-400 mb-1" />
                  <span className="text-[11px] font-bold text-stone-700">Upload ID Back</span>
                  <input type="file" accept="image/*" onChange={handleDocBackSelect} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-stone-500 font-medium">
            Coordinator Attribution: This member will be linked to your Coordinator ID: <strong>{effectiveUser?.coordinatorId || 'Current User'}</strong>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Registering Member...</span>
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                <span>Submit Member for Trustee Approval</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
