'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiUser,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
  FiPhone,
  FiMapPin,
  FiTrash2,
  FiMail,
  FiLock,
  FiKey,
  FiEye,
  FiEyeOff,
  FiSend,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { updateUserProfile, uploadAndUpdateAvatar, updateUserEmail } from '@/store/authSlice';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function ProfileSettingsPage() {
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  // Active section tab: 'profile' | 'email' | 'password' | 'reset'
  const [activeTab, setActiveTab] = useState('profile');

  // --- Profile Details Form ---
  const [profileForm, setProfileForm] = useState({
    name: effectiveUser?.name || '',
    phone: effectiveUser?.phone || '',
    bloodGroup: effectiveUser?.bloodGroup || 'O+',
    dob: effectiveUser?.dob || '',
    address: effectiveUser?.address || '',
    district: effectiveUser?.district || 'Aligarh',
    state: effectiveUser?.state || 'Uttar Pradesh',
    photoUrl: effectiveUser?.photoUrl || ''
  });

  const [uploading, setUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // --- Email Update Form ---
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: ''
  });
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  // --- Password Update Form ---
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- Reset Password via Email ---
  const [resetSending, setResetSending] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // Synchronize profile form when user updates
  useEffect(() => {
    if (effectiveUser) {
      setProfileForm((prev) => ({
        ...prev,
        name: effectiveUser.name || prev.name,
        phone: effectiveUser.phone || prev.phone,
        bloodGroup: effectiveUser.bloodGroup || prev.bloodGroup,
        dob: effectiveUser.dob || prev.dob,
        address: effectiveUser.address || prev.address,
        district: effectiveUser.district || prev.district,
        state: effectiveUser.state || prev.state,
        photoUrl: effectiveUser.photoUrl !== undefined ? effectiveUser.photoUrl : prev.photoUrl
      }));
    }
  }, [effectiveUser]);

  const hasProfileChanges = (
    profileForm.name !== (effectiveUser?.name || '') ||
    profileForm.phone !== (effectiveUser?.phone || '') ||
    profileForm.bloodGroup !== (effectiveUser?.bloodGroup || 'O+') ||
    profileForm.dob !== (effectiveUser?.dob || '') ||
    profileForm.address !== (effectiveUser?.address || '') ||
    profileForm.district !== (effectiveUser?.district || 'Aligarh') ||
    profileForm.state !== (effectiveUser?.state || 'Uttar Pradesh')
  );
  const isProfileValid = (profileForm.name || '').trim().length > 0 && (profileForm.phone || '').trim().length > 0;
  const canSaveProfile = hasProfileChanges && isProfileValid && !profileSaving;

  // --- Handle Photo Upload ---
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProfileError('');
      setProfileMessage('');

      const resultAction = await dispatch(uploadAndUpdateAvatar({ file, category: 'avatars' }));
      if (uploadAndUpdateAvatar.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        setProfileForm((prev) => ({ ...prev, photoUrl: updated.photoUrl }));
        if (setCurrentUser) setCurrentUser(updated);
        setProfileMessage('Profile photograph uploaded and synchronized in real-time across the app!');
      } else {
        setProfileError(resultAction.payload || 'Failed to upload photo');
      }
    } catch (err) {
      setProfileError('Upload error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setProfileSaving(true);
      setProfileError('');
      setProfileMessage('');
      const resultAction = await dispatch(updateUserProfile({ photoUrl: '' }));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        setProfileForm((prev) => ({ ...prev, photoUrl: '' }));
        if (setCurrentUser) setCurrentUser(updated);
        setProfileMessage('Profile photo removed successfully.');
      } else {
        setProfileError(resultAction.payload || 'Failed to remove photo');
      }
    } catch (err) {
      setProfileError('Error removing photo');
    } finally {
      setProfileSaving(false);
    }
  };

  // --- Save Profile Details ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setProfileError('');
      setProfileMessage('');
      const resultAction = await dispatch(updateUserProfile(profileForm));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        setProfileMessage('Profile details updated successfully!');
        if (setCurrentUser) setCurrentUser(updated);
      } else {
        setProfileError(resultAction.payload || 'Update failed.');
      }
    } catch (err) {
      setProfileError(err.message || 'Error updating profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // --- Update Email ---
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const cleanEmail = (emailForm.newEmail || '').trim().toLowerCase();
    if (!cleanEmail) {
      setEmailError('Please enter a valid new email address.');
      return;
    }
    if (cleanEmail === (effectiveUser?.email || '').toLowerCase()) {
      setEmailError('New email is identical to your current email address.');
      return;
    }

    try {
      setEmailSaving(true);
      setEmailError('');
      setEmailMessage('');

      const resultAction = await dispatch(
        updateUserEmail({
          newEmail: cleanEmail,
          currentPassword: emailForm.currentPassword
        })
      );

      if (updateUserEmail.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        setEmailMessage('Email address updated successfully! All notifications will now go to your new email.');
        if (setCurrentUser) setCurrentUser(updated);
        setEmailForm({ newEmail: '', currentPassword: '' });
      } else {
        setEmailError(resultAction.payload || 'Failed to update email address.');
      }
    } catch (err) {
      setEmailError(err.message || 'Error updating email.');
    } finally {
      setEmailSaving(false);
    }
  };

  // --- Change Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordError('');
      setPasswordMessage('');

      const res = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (res.data?.success) {
        setPasswordMessage('Your password has been successfully updated!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(res.data?.message || 'Password update failed.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Error updating password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // --- Request Reset Password Link via Email ---
  const handleRequestPasswordReset = async () => {
    const email = effectiveUser?.email;
    if (!email) {
      setResetError('No email registered on this account.');
      return;
    }

    try {
      setResetSending(true);
      setResetError('');
      setResetMessage('');

      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.success) {
        setResetMessage(`Password reset link successfully sent to ${email}. Check your inbox/spam folder.`);
      } else {
        setResetError(res.data?.message || 'Failed to dispatch reset email.');
      }
    } catch (err) {
      setResetError(err.response?.data?.message || err.message || 'Failed to send reset link.');
    } finally {
      setResetSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold mb-2 border border-amber-300">
            <FiShield className="w-3.5 h-3.5 text-amber-800" />
            <span>Account Security &amp; Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
            Profile &amp; Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your personal credentials, registered email, password security, and ID card photograph.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200'
          }`}
        >
          <FiUser className="w-4 h-4" />
          <span>Personal Details &amp; Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'email'
              ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200'
          }`}
        >
          <FiMail className="w-4 h-4" />
          <span>Update Email Address</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'password'
              ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200'
          }`}
        >
          <FiLock className="w-4 h-4" />
          <span>Update Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reset')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'reset'
              ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200'
          }`}
        >
          <FiKey className="w-4 h-4" />
          <span>Reset Password</span>
        </button>
      </div>

      {/* ================= TAB 1: PERSONAL DETAILS & PHOTO ================= */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs max-w-3xl">
          {profileMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
            {/* Full Rounded Avatar with Radiant Golden Ring */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-amber-100">
              <div className="relative inline-block shrink-0">
                <div className="w-24 h-24 rounded-full p-1 bg-linear-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-lg ring-4 ring-amber-300/40">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        getContentImageUrl(profileForm.photoUrl || effectiveUser?.photoUrl) ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={profileForm.name || effectiveUser?.name || 'User Profile'}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                </div>
                <label className="absolute -bottom-1 -right-1 p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md cursor-pointer transition ring-2 ring-white">
                  <FiCamera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-amber-950">Official ID Passport Photograph</h3>
                <p className="text-stone-500 text-xs leading-relaxed max-w-md">
                  {uploading
                    ? 'Uploading new photograph to secure server...'
                    : 'Upload a clear passport portrait photograph. Appears on your dual-sided official ID card and member directory.'}
                </p>
                {profileForm.photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={profileSaving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-xs font-bold transition cursor-pointer"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Blood Group</label>
                <select
                  value={profileForm.bloodGroup}
                  onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 font-bold"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={profileForm.dob}
                  onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">District / City</label>
                <input
                  type="text"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  placeholder="Aligarh"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  placeholder="Uttar Pradesh"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Full Postal Address</label>
              <textarea
                rows={3}
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                placeholder="House No, Street, Landmark..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 font-medium leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-stone-500">
                {!hasProfileChanges
                  ? 'No changes detected'
                  : !isProfileValid
                  ? 'Name and Phone number are required'
                  : 'Changes ready to save'}
              </span>
              <button
                type="submit"
                disabled={!canSaveProfile}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-black transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <FiSave className="w-4 h-4" />
                <span>{profileSaving ? 'Saving...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 2: UPDATE EMAIL ADDRESS ================= */}
      {activeTab === 'email' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-amber-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FiMail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-950">Update Registered Email Address</h2>
              <p className="text-xs text-stone-500">
                Keep your login email and official certificate dispatch address up to date.
              </p>
            </div>
          </div>

          {emailMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{emailMessage}</span>
            </div>
          )}

          {emailError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{emailError}</span>
            </div>
          )}

          {/* Current Registered Email Display */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                Current Active Email
              </span>
              <span className="text-sm font-bold text-amber-950 mt-0.5 block">{effectiveUser?.email}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          </div>

          <form onSubmit={handleUpdateEmail} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">New Email Address</label>
              <div className="relative">
                <FiMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                You will need to use this new email address next time you log in.
              </p>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Current Password (For Security Verification)</label>
              <div className="relative">
                <FiLock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  placeholder="Enter current password to authorize change"
                  value={emailForm.currentPassword}
                  onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={emailSaving || !emailForm.newEmail}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                <span>{emailSaving ? 'Updating Email...' : 'Update Email Address'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 3: UPDATE PASSWORD ================= */}
      {activeTab === 'password' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-amber-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-950">Update Account Password</h2>
              <p className="text-xs text-stone-500">
                Change your password to keep your member account safe and secure.
              </p>
            </div>
          </div>

          {passwordMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{passwordMessage}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            {/* Current Password */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Current Password</label>
              <div className="relative">
                <FiLock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">New Password (Min 6 Characters)</label>
              <div className="relative">
                <FiKey className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter new strong password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Confirm New Password</label>
              <div className="relative">
                <FiKey className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-type new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-[10px] text-red-600 font-bold mt-1">Passwords do not match.</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordSaving || !passwordForm.currentPassword || !passwordForm.newPassword}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                <span>{passwordSaving ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 4: RESET PASSWORD VIA EMAIL ================= */}
      {activeTab === 'reset' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-amber-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FiRefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-950">Reset Password via Email</h2>
              <p className="text-xs text-stone-500">
                Trigger a secure one-time password recovery link sent directly to your registered inbox.
              </p>
            </div>
          </div>

          {resetMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}

          {resetError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-linear-to-r from-amber-50 to-yellow-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
              <FiShield className="w-4 h-4 text-amber-700" />
              <span>How Password Reset Works</span>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed">
              Click the button below to generate a cryptographically secure 30-minute password reset link. A direct link
              will be dispatched to your registered address:
              <strong className="block text-amber-950 mt-1 font-mono">{effectiveUser?.email}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRequestPasswordReset}
              disabled={resetSending}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <FiSend className="w-4 h-4" />
              <span>{resetSending ? 'Sending Reset Email...' : 'Send Password Reset Link to Email'}</span>
            </button>

            <Link
              href="/forgot-password"
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition text-center"
            >
              Open Recovery Page →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
