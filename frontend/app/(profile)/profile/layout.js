'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiUser,
  FiCreditCard,
  FiFileText,
  FiAward,
  FiHeart,
  FiAlertCircle,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiUserPlus,
  FiUserCheck,
  FiChevronRight,
  FiChevronLeft,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { GoVerified } from "react-icons/go";
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import { getContentImageUrl } from '@/lib/authApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfileLayout({ children }) {
  const { currentUser, logout } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#fffdf5]">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (!effectiveUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#fffdf5]">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-amber-500/10 text-center border border-amber-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-amber-300">
              <FiUserPlus />
            </div>
            <h2 className="text-xl font-black text-amber-950">Member Portal Login</h2>
            <p className="text-xs text-stone-600 mt-2 font-medium">
              Please log in with your email and password to access your verified profile, applications, ID card, and receipts.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition"
              >
                Sign In to Profile
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isVerified = effectiveUser.status === 'active';
  const isMember = effectiveUser.role === 'Member' || effectiveUser.role === 'Admin' || (!!effectiveUser.memberId && !effectiveUser.memberId.startsWith('APVAF-DON-') && !effectiveUser.memberId.startsWith('BYK-DON-')) || effectiveUser.isMember;
  const isVolunteer = effectiveUser.role === 'Volunteer' || effectiveUser.isVolunteer || effectiveUser.volunteerApplication?.status === 'approved' || effectiveUser.volunteerApplication?.status === 'pending' || (!!effectiveUser.volunteerId && !effectiveUser.volunteerId.startsWith('APVAF-DON-') && !effectiveUser.volunteerId.startsWith('BYK-DON-'));

  const menuItems = [
    { label: 'Overview & Status', href: '/profile', icon: FiUser },
    { label: 'My Certificates', href: '/profile/certificates', icon: FiAward },
    { label: 'My Awards & Badges', href: '/profile/my-awards', icon: FiAward },
    {
      label: 'Membership Profile',
      href: '/profile/member',
      icon: FiCreditCard
    },
    {
      label: 'Volunteer Profile',
      href: '/profile/volunteer',
      icon: FiUserCheck
    },
    {
      label: 'Official ID Card',
      href: isVolunteer && !isMember ? '/profile/id-card?type=volunteer' : '/profile/id-card',
      icon: FiShield,
      locked: !isVerified
    },
    {
      label: 'Offer / Appointment Letter',
      href: isVolunteer && !isMember ? '/profile/appointment-letter?type=volunteer' : '/profile/appointment-letter',
      icon: FiFileText,
      locked: !isVerified
    },
    { label: 'Donations & 80G Receipts', href: '/profile/donations', icon: FiHeart },
    { label: 'Submit Grievance / Inquiry', href: '/profile/grievance', icon: FiAlertCircle },
    { label: 'Account Settings', href: '/profile/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fffdf5] flex flex-col md:flex-row text-stone-900">

        {/* ----------------- MOBILE TOP NAVIGATION BAR ----------------- */}
        <div className="md:hidden bg-white border-b border-amber-200/80 p-4 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getContentImageUrl(effectiveUser.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={effectiveUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-400 ring-2 ring-amber-300/40 shadow-2xs"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
              }}
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-black text-amber-950 text-xs truncate max-w-42.5">{effectiveUser.name}</h3>
                {effectiveUser.status === 'active' ? (
                  <GoVerified className="w-4 h-4 text-amber-600 ml-1" />
                ) : (
                  <FiClock className="w-4 h-4 text-amber-600 ml-1" />
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate max-w-40">{effectiveUser.email}</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-300 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5 text-amber-800" /> : <FiMenu className="w-5 h-5 text-amber-950" />}
          </button>
        </div>

        {/* Mobile Side Drawer (Off-Canvas - Does NOT push page content down) */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="md:hidden fixed inset-0 bg-stone-950/45 backdrop-blur-2xs z-50 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-over Side Drawer - compact and sized to text */}
            <div className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col justify-between border-l border-amber-200 animate-in slide-in-from-right duration-200">
              {/* Drawer Header with user avatar and close button */}
              <div className="p-3.5 border-b border-amber-200/80 bg-linear-to-r from-amber-50 to-yellow-50/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getContentImageUrl(effectiveUser.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={effectiveUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-amber-400 ring-2 ring-amber-300/40 shadow-2xs shrink-0"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-black text-amber-950 text-xs truncate">{effectiveUser.name}</h3>
                      {effectiveUser.status === 'active' ? (
                        <GoVerified className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <FiClock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 font-medium truncate">{effectiveUser.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-amber-100 text-stone-600 hover:text-amber-950 border border-amber-200 flex items-center justify-center transition cursor-pointer shrink-0 ml-2 shadow-2xs"
                  aria-label="Close Navigation Menu"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Navigation List */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
                          : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-700'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.locked && !isActive && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0 ml-1">
                          🔒
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer with Admin View & Sign Out */}
              <div className="p-3 border-t border-amber-100 bg-stone-50/60 flex items-center justify-between gap-2 shrink-0">
                {currentUser?.role === 'Admin' && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-black text-amber-900 hover:underline flex items-center gap-1"
                  >
                    <FiShield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin View →</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-amber-100/80 text-amber-950 text-xs font-bold hover:bg-amber-200 transition cursor-pointer flex items-center gap-1.5 ml-auto shadow-2xs"
                >
                  <FiLogOut className="w-3.5 h-3.5 text-amber-800" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ----------------- DESKTOP SIDEBAR ----------------- */}
        <aside
          className={`hidden md:flex transition-all duration-300 ease-in-out bg-white border-r border-amber-200/80 shrink-0 flex-col justify-between relative ${
            sidebarOpen ? 'w-72 lg:w-80' : 'w-20'
          }`}
        >
          {/* Small Rounded Toggle Button on Sidebar Border */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-white border border-amber-300 shadow-md text-amber-950 flex items-center justify-center hover:bg-amber-100 hover:scale-110 transition cursor-pointer"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? <FiChevronLeft className="w-3.5 h-3.5" /> : <FiChevronRight className="w-3.5 h-3.5" />}
          </button>

          <div className={sidebarOpen ? 'p-6' : 'p-2.5'}>
            {/* User Profile Card */}
            <div className={`text-center border-b border-amber-100 transition-all ${sidebarOpen ? 'pb-6' : 'pb-4'}`}>
              <div className="relative inline-block mx-auto mb-2 group">
                <div
                  className={`rounded-full p-1 bg-linear-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-lg ring-4 ring-amber-300/40 transition-all duration-300 group-hover:scale-105 ${
                    sidebarOpen ? 'w-24 h-24' : 'w-11 h-11'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        getContentImageUrl(effectiveUser.photoUrl) ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={effectiveUser.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                </div>
                <span
                  className={`absolute bottom-0 right-0 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md ${
                    sidebarOpen ? 'w-6 h-6 text-[10px]' : 'w-4 h-4 text-[8px]'
                  } ${isVerified ? 'bg-emerald-600' : 'bg-amber-500'}`}
                  title={isVerified ? 'Verified Active Member' : 'Pending Verification'}
                >
                  {isVerified ? (
                    <FiCheckCircle className={sidebarOpen ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} />
                  ) : (
                    <FiClock className={sidebarOpen ? 'w-3 h-3' : 'w-2.5 h-2.5'} />
                  )}
                </span>
              </div>

              {/* Text details: Hidden when collapsed */}
              {sidebarOpen && (
                <div className="animate-in fade-in duration-200">
                  <h3 className="font-black text-amber-950 text-base leading-tight">
                    {effectiveUser.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">{effectiveUser.email}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                      {effectiveUser.role || 'Member'}
                    </span>

                    {isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100/90 text-amber-900 flex items-center gap-1 border border-amber-300">
                        <FiCheckCircle className="w-3 h-3 text-amber-700" />
                        <span>Verified Active</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-yellow-100 text-yellow-900 flex items-center gap-1 border border-yellow-300">
                        <FiClock className="w-3 h-3 text-yellow-700" />
                        <span>Verification Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className={`space-y-1.5 ${sidebarOpen ? 'mt-6' : 'mt-4'}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`flex items-center rounded-2xl text-xs font-bold transition ${
                      sidebarOpen ? 'justify-between px-3.5 py-2.5' : 'justify-center w-11 h-11 mx-auto'
                    } ${
                      isActive
                        ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                        : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-700'}`} />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.locked && !isActive && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0 ml-1">
                        🔒 Locked
                      </span>
                    )}
                    {sidebarOpen && isActive && <FiChevronRight className="w-3.5 h-3.5 text-stone-950 shrink-0" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer with Trust Stamp & Sign Out */}
          <div className={`border-t border-amber-100 space-y-2 ${sidebarOpen ? 'p-6' : 'p-2.5'}`}>
            {effectiveUser.role === 'Admin' && (
              <Link
                href="/dashboard"
                title="Switch to Admin Dashboard"
                className={`flex items-center justify-center rounded-2xl bg-stone-900 hover:bg-amber-950 text-amber-300 font-bold text-xs shadow-md transition ${
                  sidebarOpen ? 'w-full py-2.5 px-4 gap-2' : 'w-11 h-11 mx-auto'
                }`}
              >
                <FiShield className="w-4 h-4 text-amber-400 shrink-0" />
                {sidebarOpen && <span>Switch to Admin Dashboard →</span>}
              </Link>
            )}

            {sidebarOpen && (
              <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200 text-center animate-in fade-in">
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                  12A &amp; 80G Certified Non-Profit
                </span>
                <span className="text-[9px] text-stone-600 font-medium block mt-0.5">
                  अपना परिवार वृद्ध आश्रम • Adhartal, Jabalpur (M.P.)
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Sign Out from Profile"
              className={`flex items-center justify-center rounded-2xl bg-amber-100/70 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer ${
                sidebarOpen ? 'w-full py-2.5 px-4 gap-2' : 'w-11 h-11 mx-auto hover:bg-red-50 hover:text-red-700'
              }`}
            >
              <FiLogOut className="w-4 h-4 text-amber-800 shrink-0" />
              {sidebarOpen && <span>Sign Out from Profile</span>}
            </button>
          </div>
        </aside>

        {/* ----------------- NESTED CONTENT VIEW ----------------- */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
