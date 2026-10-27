'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
  FiDroplet,
  FiUserPlus
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import DecorativeRings from '@/components/site/DecorativeRings';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profile';
  const { registerUser, settings } = useNGO();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('Jabalpur');
  const [state, setState] = useState('Madhya Pradesh');
  const [bloodGroup, setBloodGroup] = useState('O+');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password match & strength calculations
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isPasswordLongEnough = password.length >= 6;

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '' };
    if (password.length < 6) return { text: 'Too Short (Min 6 chars)', color: 'text-amber-700' };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && hasNum && hasSpecial) return { text: 'Strong Password', color: 'text-emerald-700' };
    if (password.length >= 6 && (hasNum || hasSpecial)) return { text: 'Medium Password', color: 'text-amber-800' };
    return { text: 'Weak Password', color: 'text-yellow-600' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      confirmPassword,
      district: district.trim(),
      state: state.trim(),
      bloodGroup
    };

    const res = await registerUser(payload);
    setLoading(false);

    if (res.success) {
      setSuccess('Account created successfully! Redirecting to user portal...');
      setTimeout(() => {
        router.push(redirectTarget);
      }, 1000);
    } else {
      setError(res.message || 'Registration failed. The email or mobile number may already be registered.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#fffdf5] text-stone-900 relative overflow-hidden">
      {/* Ambient Dark Yellow & Purple Multi-Shape Concentric Rings */}
      <DecorativeRings variant="auth" />

      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-2xl shadow-amber-500/10 relative overflow-hidden z-10">
        {/* Decorative Corner Rings inside card */}
        <DecorativeRings variant="card" />

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-amber-500 ring-4 ring-amber-300/40 p-1 flex items-center justify-center mx-auto mb-3 shadow-md bg-white overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getContentImageUrl(settings?.logoUrl) || '/logo.jpg'}
              alt={settings?.ngoName || 'अपना परिवार वृद्ध आश्रम'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.jpg';
              }}
            />
          </div>
          <h1 className="text-2xl font-black text-amber-950">Create User Account</h1>
          <p className="text-xs text-stone-600 mt-1 font-semibold">
            {settings?.ngoName} — Official Gateway
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[10px] text-amber-950 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            12A &amp; 80G Certified Non-Profit • Member, Volunteer &amp; Donor Access
          </div>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <FiAlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-stone-800 block mb-1.5">
              Full Legal Name <span className="text-amber-700">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-xs font-medium transition"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                Email Address <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-xs font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                Mobile Number (WhatsApp) <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-xs font-medium transition"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-stone-800">
                  Password <span className="text-amber-700">*</span>
                </label>
                {strength.text && (
                  <span className={`text-[10px] font-bold ${strength.color}`}>{strength.text}</span>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-xs font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-amber-800 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1.5">
                Confirm Password <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border text-stone-900 placeholder-stone-400 focus:outline-none text-xs font-medium transition ${passwordMismatch ? 'border-amber-600' : 'border-amber-200 focus:border-amber-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-amber-800 cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* District, State & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="font-bold text-stone-800 block mb-1">City / District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Jabalpur"
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Madhya Pradesh"
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 mb-1 flex items-center gap-1">
                <FiDroplet className="w-3.5 h-3.5 text-amber-700" />
                <span>Blood Group</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-stone-900 text-xs focus:outline-none focus:border-amber-500 font-bold"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                  <option key={b} value={b} className="bg-white">{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || passwordMismatch || !isPasswordLongEnough}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Registering account...</span>
            ) : (
              <>
                <FiUserPlus className="w-4 h-4" />
                <span>Create User Account &amp; Access Portal</span>
              </>
            )}
          </button>

          {/* Navigation Links */}
          <div className="mt-6 text-center text-xs text-stone-600 border-t border-amber-100 pt-4">
            <div>
              Already registered with Apna Parivar Vriddh Aashram?{' '}
              <Link href={`/login${redirectTarget !== '/profile' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="text-amber-800 font-black hover:underline">
                Sign In to Portal →
              </Link>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdf5] flex items-center justify-center text-xs text-amber-900 font-bold">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
