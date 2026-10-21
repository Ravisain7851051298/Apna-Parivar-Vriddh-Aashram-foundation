'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiLock, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import api from '@/services/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Password reset token is missing or invalid.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await api.post('/auth/reset-password', { token, newPassword });
      if (res.data.success) {
        setMessage(res.data.message || 'Password successfully updated!');
      } else {
        setError(res.data.message || 'Failed to update password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating password. The token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 mb-4 shadow-lg shadow-amber-500/10">
            <FiLock className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-3xl font-black text-amber-950 tracking-tight">Set New Password</h2>
          <p className="mt-2 text-xs text-stone-600 font-medium">
            {email ? `Updating credentials for ${email}` : 'Enter your new secure password below'}
          </p>
        </div>

        <div className="mt-8 bg-white border border-amber-200/90 py-8 px-6 shadow-xl shadow-amber-500/5 rounded-3xl sm:px-10">
          {message ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-300">
                <FiCheckCircle className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-amber-950">Password Updated</h3>
              <p className="text-xs text-stone-700 leading-relaxed">{message}</p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs transition-colors shadow-md shadow-amber-500/20"
                >
                  Proceed to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
                  <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-amber-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-amber-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Updating password...' : 'Update Password & Access Account'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 hover:underline"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdf5] flex items-center justify-center text-xs text-amber-900 font-bold">Loading reset gateway...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
