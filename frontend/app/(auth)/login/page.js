'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertTriangle,
  FiLogIn,
  FiShield,
  FiHome,
  FiArrowRight,
  FiLogOut
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import { getContentImageUrl } from '@/lib/authApi';
import DecorativeRings from '@/components/site/DecorativeRings';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role')?.toLowerCase();
  const redirectTarget = searchParams.get('redirect');
  const isExpired = searchParams.get('expired');
  const { currentUser, login, logout, settings } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const activeUser = reduxUser || currentUser;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session expired. Please sign in again.' : '');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      const loggedUser = res.user;
      const userRole = loggedUser.role || (loggedUser.isCoordinator ? 'Coordinator' : (loggedUser.isVolunteer ? 'Volunteer' : 'Member'));
      setSuccess(`Authentication verified! Welcome back, ${loggedUser.name} (${userRole}).`);

      setTimeout(() => {
        if (loggedUser.role === 'Admin') {
          router.push(redirectTarget || '/dashboard');
        } else if (loggedUser.role === 'Coordinator' || loggedUser.isCoordinator) {
          router.push(redirectTarget || '/profile/coordinator/members');
        } else if (loggedUser.role === 'Volunteer' || loggedUser.isVolunteer) {
          router.push(redirectTarget || '/profile/volunteer');
        } else if (loggedUser.role === 'Member' || loggedUser.isMember) {
          router.push(redirectTarget || '/profile/member');
        } else if (loggedUser.role === 'Donor') {
          router.push(redirectTarget || '/profile/donations');
        } else {
          router.push(redirectTarget || '/profile');
        }
      }, 600);
    } else {
      setError(res.message || 'Invalid credentials. Please verify your registered email/phone and password.');
    }
  };

  const getPortalDestination = (user) => {
    if (!user) return '/profile';
    if (user.role === 'Admin') return '/dashboard';
    if (user.role === 'Coordinator' || user.isCoordinator) return '/profile/coordinator/members';
    if (user.role === 'Volunteer' || user.isVolunteer) return '/profile/volunteer';
    if (user.role === 'Member' || user.isMember) return '/profile/member';
    if (user.role === 'Donor') return '/profile/donations';
    return '/profile';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#fffdf5] text-stone-900 relative overflow-hidden">
      {/* Ambient Dark Yellow & Purple Multi-Shape Concentric Rings */}
      <DecorativeRings variant="auth" />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-2xl shadow-amber-500/10 relative overflow-hidden z-10">
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
          <h1 className="text-xl sm:text-2xl font-black text-amber-950">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-stone-600 mt-1 font-semibold">
            {settings?.ngoName || 'अपना परिवार वृद्ध आश्रम फाउंडेशन'} — Central Gateway
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold bg-amber-100/90 text-amber-950 border-amber-300">
            <FiShield className="w-3.5 h-3.5 shrink-0 text-amber-800" />
            <span className="uppercase tracking-wider">
              {roleParam === 'coordinator'
                ? 'Coordinator Access Desk'
                : roleParam === 'admin'
                  ? 'Trustee & Administrative Control'
                  : roleParam === 'volunteer'
                    ? 'Volunteer Service Wing'
                    : 'Unified NGO Portal Sign In'}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CURRENTLY LOGGED IN USER CARD (Displays who is logged in) */}
        {/* ============================================================== */}
        {activeUser && (
          <div className="mb-6 p-4 rounded-2xl bg-linear-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-400/80 text-stone-900 shadow-sm space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300">
                Active Session Detected
              </span>
              <span className="text-[11px] text-amber-900 font-bold flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Signed In</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 bg-amber-100 flex items-center justify-center shrink-0 shadow-xs">
                {activeUser.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getContentImageUrl(activeUser.photoUrl)}
                    alt={activeUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-black text-amber-950">
                    {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-amber-950 text-sm truncate">
                    {activeUser.name}
                  </h4>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-300 shrink-0">
                    {activeUser.role || (activeUser.isCoordinator ? 'Coordinator' : 'Member')}
                  </span>
                </div>
                {activeUser.coordinatorId && (
                  <span className="text-[10px] font-mono font-bold text-amber-800 block truncate">
                    ID: {activeUser.coordinatorId}
                  </span>
                )}
                {activeUser.memberId && !activeUser.coordinatorId && (
                  <span className="text-[10px] font-mono font-bold text-amber-800 block truncate">
                    ID: {activeUser.memberId}
                  </span>
                )}
                <p className="text-[10px] text-stone-600 truncate mt-0.5 font-medium">
                  {activeUser.email || activeUser.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-amber-200/80">
              <button
                type="button"
                onClick={() => router.push(redirectTarget || getPortalDestination(activeUser))}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue as {activeUser.name?.split(' ')[0]}</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                }}
                className="py-2 px-3 rounded-xl border border-amber-300 hover:bg-amber-100/70 text-stone-800 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                title="Switch user account"
              >
                <FiLogOut className="w-3.5 h-3.5 text-stone-600" />
                <span>Switch</span>
              </button>
            </div>
          </div>
        )}

        {/* Alert Notifications */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <FiAlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-100/90 border border-amber-400 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* LOGIN FORM (Single unified form - No role switch toggle) */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1.5">
              Registered Email or Mobile Number
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="name@domain.org or 98XXXXXXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-xs font-medium transition"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-amber-600 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-xs font-medium transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-amber-800 cursor-pointer"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-stone-500">Can&apos;t remember?</span>
            <Link href="/forgot-password" className="text-amber-800 hover:text-amber-950 font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/30 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <FiLogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-200 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <FiHome className="w-4 h-4 text-amber-800" />
            <span>Back to Home</span>
          </Link>

          {/* Contextual Register / Coordinator / Member Links */}
          <div className="mt-6 text-center text-xs text-stone-600 border-t border-amber-100 pt-4 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-stone-600 font-medium">
              <span>Are you a District Coordinator?</span>
              <Link href="/apply-coordinator" className="text-amber-900 font-black hover:underline">
                Coordinator Desk →
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 flex-wrap">
              <Link href="/apply-member" className="text-amber-800 font-bold hover:underline">
                Apply Member
              </Link>
              <span>•</span>
              <Link href="/apply-volunteer" className="text-amber-800 font-bold hover:underline">
                Apply Volunteer
              </Link>
              <span>•</span>
              <Link href="/apply-coordinator" className="text-amber-800 font-bold hover:underline">
                Apply Coordinator
              </Link>
            </div>

            <div className="pt-1">
              New user?{' '}
              <Link
                href={`/register${redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
                className="text-amber-900 font-black hover:underline"
              >
                Create Account →
              </Link>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdf5] flex items-center justify-center text-xs text-amber-900 font-bold">Loading sign in gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}
