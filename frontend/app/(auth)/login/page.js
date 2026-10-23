'use client';

import React, { useState, Suspense, useEffect } from 'react';
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
  FiUsers,
  FiUserCheck,
  FiHome,
  FiHeart
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role')?.toLowerCase() || 'member';
  const redirectTarget = searchParams.get('redirect');
  const isExpired = searchParams.get('expired');
  const { login, settings } = useNGO();

  const validRoles = ['volunteer', 'member', 'admin', 'donor'];
  const initialRole = validRoles.includes(roleParam) ? roleParam : 'member';
  const [activeRole, setActiveRole] = useState(initialRole);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session expired. Please sign in again.' : '');
  const [success, setSuccess] = useState('');

  // Synchronize when URL role query param changes
  useEffect(() => {
    if (validRoles.includes(roleParam) && roleParam !== activeRole) {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    setError('');
    setSuccess('');
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', newRole);
    router.replace(`/login?${params.toString()}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      const loggedUser = res.user;
      setSuccess(`Authentication verified! Welcome back, ${loggedUser.name}.`);
      setTimeout(() => {
        if (loggedUser.role === 'Admin' || activeRole === 'admin') {
          router.push(redirectTarget || '/dashboard');
        } else if (loggedUser.role === 'Donor' || activeRole === 'donor') {
          router.push(redirectTarget || '/profile/donations');
        } else {
          router.push(redirectTarget || '/profile');
        }
      }, 500);
    } else {
      setError(res.message || 'Invalid credentials. Please verify your registered email/phone and password.');
    }
  };

  const roleConfig = {
    volunteer: {
      title: 'Volunteer Portal Login',
      badge: 'Seva & Elder Care Volunteer Wing',
      badgeColor: 'bg-amber-100/90 text-amber-950 border-amber-300',
      icon: FiUsers,
      btnText: 'Sign In as Volunteer',
      btnColor: 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black shadow-md shadow-amber-500/30',
      subText: 'Access field tasks, attendance logs, and volunteer certificates.'
    },
    member: {
      title: 'Member Portal Login',
      badge: 'Verified Foundation Member',
      badgeColor: 'bg-amber-100/90 text-amber-950 border-amber-300',
      icon: FiUserCheck,
      btnText: 'Sign In as Member',
      btnColor: 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black shadow-md shadow-amber-500/30',
      subText: 'Access membership card, appointment letter, and welfare benefits.'
    },
    admin: {
      title: 'Admin Desk Login',
      badge: 'Trustee & Administrative Control',
      badgeColor: 'bg-amber-200/90 text-amber-950 border-amber-400',
      icon: FiShield,
      btnText: 'Sign In to Admin Dashboard',
      btnColor: 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-700 text-stone-950 font-black shadow-md shadow-amber-500/30',
      subText: 'Central governance, approval desk, and content operations.'
    },
    donor: {
      title: 'Donor Portal Login',
      badge: 'Generous Contributor Wing',
      badgeColor: 'bg-amber-100/90 text-amber-950 border-amber-300',
      icon: FiHeart,
      btnText: 'Sign In as Donor',
      btnColor: 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black shadow-md shadow-amber-500/30',
      subText: 'Access official 80G tax receipts and cumulative donation records.'
    }
  };

  const currentConfig = roleConfig[activeRole] || roleConfig.member;
  const ActiveIcon = currentConfig.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-[#fffdf5] text-stone-900">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-2xl shadow-amber-500/10 relative overflow-hidden">

        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none bg-amber-400/20" />

        {/* Brand Banner */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-full border-2 border-amber-500 ring-4 ring-amber-300/40 p-1 flex items-center justify-center mx-auto mb-3 shadow-md bg-white overflow-hidden">
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
            {currentConfig.title}
          </h1>
          <p className="text-xs text-stone-600 mt-1 font-semibold">
            {settings?.ngoName || 'अपना परिवार वृद्ध आश्रम फाउंडेशन'} — Central Gateway
          </p>

          {/* Active Role Indicator Badge */}
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${currentConfig.badgeColor}`}>
            <ActiveIcon className="w-3.5 h-3.5 shrink-0 text-amber-800" />
            <span className="uppercase tracking-wider">{currentConfig.badge}</span>
          </div>
        </div>

        {/* ROLE SWITCHER BUTTONS (Volunteer | Member | Donor | Admin) */}
        <div className="mb-6 p-1 bg-amber-50/80 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1 border border-amber-200">
          <button
            type="button"
            onClick={() => handleRoleChange('volunteer')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'volunteer'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-sm font-black'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
          >
            <FiUsers className="w-3.5 h-3.5 shrink-0" />
            <span>Volunteer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('member')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'member'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-sm font-black'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
          >
            <FiUserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Member</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('donor')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'donor'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-sm font-black'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
          >
            <FiHeart className="w-3.5 h-3.5 shrink-0" />
            <span>Donor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'admin'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-sm font-black'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
          >
            <FiShield className="w-3.5 h-3.5 shrink-0" />
            <span>Admin</span>
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <FiAlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* LOGIN FORM */}
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
            className={`w-full py-3.5 rounded-xl ${currentConfig.btnColor} text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <FiLogIn className="w-4 h-4" />
                <span>{currentConfig.btnText}</span>
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

          {/* Contextual Register / Apply Links */}
          <div className="mt-6 text-center text-xs text-stone-600 border-t border-amber-100 pt-4 space-y-2">
            {activeRole === 'volunteer' && (
              <div>
                Not an active volunteer yet?{' '}
                <Link href="/apply-volunteer" className="text-amber-800 font-bold hover:underline">
                  Apply as Volunteer →
                </Link>
              </div>
            )}
            {activeRole === 'member' && (
              <div>
                Don&apos;t have a verified membership?{' '}
                <Link href="/apply-member" className="text-amber-800 font-bold hover:underline">
                  Apply for Membership →
                </Link>
              </div>
            )}
            {activeRole === 'admin' && (
              <div className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
                <FiShield className="w-3.5 h-3.5 text-amber-700" />
                <span>Restricted Access: Authorized Trustee Administrators Only</span>
              </div>
            )}
            <div>
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
