'use client';

import React, { useState, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => { };
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
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
  FiUsers,
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
  const mounted = useIsMounted();

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
            <h2 className="text-xl font-black text-amber-950">Portal Authentication</h2>
            <p className="text-xs text-stone-600 mt-2 font-medium">
              Please sign in with your email and password to access your verified profile, applications, ID card, and receipts.
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
  const isMember = Boolean(
    effectiveUser.role === 'Member' ||
    effectiveUser.role === 'Admin' ||
    effectiveUser.isMember ||
    (effectiveUser.memberId && !effectiveUser.memberId.startsWith('APVAF-DON-') && !effectiveUser.memberId.startsWith('BYK-DON-'))
  );
  const isVolunteer = Boolean(
    effectiveUser.role === 'Volunteer' ||
    effectiveUser.isVolunteer ||
    effectiveUser.volunteerApplication?.status === 'approved' ||
    effectiveUser.volunteerApplication?.status === 'pending' ||
    (effectiveUser.volunteerId && !effectiveUser.volunteerId.startsWith('APVAF-DON-') && !effectiveUser.volunteerId.startsWith('BYK-DON-'))
  );
  const isCoordinator = Boolean(
    effectiveUser.role === 'Coordinator' ||
    effectiveUser.role?.toLowerCase?.() === 'coordinator' ||
    effectiveUser.isCoordinator ||
    effectiveUser.coordinatorApplication?.status === 'approved' ||
    (effectiveUser.coordinatorId && !effectiveUser.coordinatorId.startsWith('APVAF-DON-'))
  );

  // Dynamic menu items based on roles
  const menuItems = [
    { label: 'Overview & Status', href: '/profile', icon: FiUser },
    { label: 'My Certificates', href: '/profile/certificates', icon: FiAward },
    { label: 'My Awards & Badges', href: '/profile/my-awards', icon: FiAward },
  ];

  // If user is a Coordinator: show Coordinator Desk & Add Member
  if (isCoordinator) {
    menuItems.push(
      {
        label: 'Coordinator Desk (Members)',
        href: '/profile/coordinator/members',
        icon: FiUsers
      },
      {
        label: '+ Enroll New Member',
        href: '/profile/coordinator/add-member',
        icon: FiUserPlus
      }
    );
  }

  menuItems.push(
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
      label: isCoordinator ? 'Official Coordinator ID Card' : (isVolunteer && !isMember ? 'Volunteer ID Card' : 'Official ID Card'),
      href: isCoordinator
        ? '/profile/id-card?type=coordinator'
        : (isVolunteer && !isMember ? '/profile/id-card?type=volunteer' : '/profile/id-card'),
      icon: FiShield,
      locked: !isVerified
    },
    {
      label: isCoordinator ? 'Coordinator Appointment Letter' : (isVolunteer && !isMember ? 'Volunteer Offer Letter' : 'Offer / Appointment Letter'),
      href: isCoordinator
        ? '/profile/appointment-letter?type=coordinator'
        : (isVolunteer && !isMember ? '/profile/appointment-letter?type=volunteer' : '/profile/appointment-letter'),
      icon: FiFileText,
      locked: !isVerified
    },
    { label: 'Donations & 80G Receipts', href: '/profile/donations', icon: FiHeart },
    { label: 'Submit Grievance / Inquiry', href: '/profile/grievance', icon: FiAlertCircle },
    { label: 'Account Settings', href: '/profile/settings', icon: FiSettings }
  );

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const primaryRoleLabel = isCoordinator
    ? 'Coordinator'
    : (effectiveUser.role === 'Admin' ? 'Admin' : (isVolunteer ? 'Volunteer' : (isMember ? 'Member' : 'Supporter')));

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
              <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                {primaryRoleLabel} • {effectiveUser.status === 'active' ? 'Active' : 'Pending'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-300"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5 text-red-600" /> : <FiMenu className="w-5 h-5 text-amber-900" />}
          </button>
        </div>

        {/* ----------------- MOBILE DRAWER NAVIGATION ----------------- */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-amber-200 p-4 space-y-1 z-30 shadow-lg animate-in slide-in-from-top duration-200">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const itemPath = item.href.split('?')[0];
              const isActive = pathname === itemPath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${isActive
                    ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-sm'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <FiChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-100 text-amber-950 text-xs font-bold cursor-pointer"
            >
              <FiLogOut className="w-4 h-4 text-amber-800" />
              <span>Sign Out from Profile</span>
            </button>
          </div>
        )}

        {/* ----------------- DESKTOP COLLAPSIBLE SIDEBAR ----------------- */}
        <aside
          className={`hidden md:flex flex-col justify-between bg-white border-r border-amber-200/90 transition-all duration-300 ease-in-out top-0 h-screen shrink-0 sticky select-none ${sidebarOpen ? 'w-64' : 'w-20'
            }`}
        >
          {/* Collapse Toggle Button - Centered on X-axis Divider & Y-axis Sidebar Border */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-20.5 -right-3.5 -translate-y-1/2 z-40 w-7 h-7 rounded-full bg-linear-to-tr from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-950 border-2 border-white shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? (
              <FiChevronLeft className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>

          {/* Scrollable Sidebar Content */}
          <div className="flex-1 flex flex-col justify-between min-h-full overflow-y-auto overflow-x-hidden">
            <div>
              {/* User Profile Card */}
              <div className={`transition-all text-center ${sidebarOpen ? 'p-6 pb-5' : 'p-2.5 pt-4 pb-3.5'}`}>
                <div className="relative inline-block mx-auto mb-2 group">
                  <div
                    className={`rounded-full p-1 bg-linear-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-lg ring-4 ring-amber-300/40 transition-all duration-300 group-hover:scale-105 ${sidebarOpen ? 'w-24 h-24' : 'w-11 h-11'
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
                    className={`absolute bottom-0 right-0 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md ${sidebarOpen ? 'w-6 h-6 text-[10px]' : 'w-4 h-4 text-[8px]'
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
                        {primaryRoleLabel}
                      </span>

                      {isCoordinator && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-stone-950 border border-amber-600">
                          ⭐ Coordinator
                        </span>
                      )}

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

              {/* X-axis Divider line touching Y-axis sidebar border */}
              <div className="w-full border-b border-amber-200/90" />

              {/* Navigation Links */}
              <div className={sidebarOpen ? 'p-4' : 'px-2 py-3.5'}>
                <nav className="space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const itemPath = item.href.split('?')[0];
                    const isActive = pathname === itemPath;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        className={`flex items-center rounded-2xl text-xs font-bold transition ${sidebarOpen ? 'justify-between px-3.5 py-2.5' : 'justify-center w-11 h-11 mx-auto'
                          } ${isActive
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
            </div>

            {/* Sidebar Footer with Trust Stamp & Sign Out */}
            <div>
              <div className="w-full border-t border-amber-200/90" />
              <div className={`space-y-2 ${sidebarOpen ? 'p-6' : 'p-2.5'}`}>
                {/* {effectiveUser.role === 'Admin' && (
                  <Link
                    href="/dashboard"
                    title="Switch to Admin Dashboard"
                    className={`flex items-center justify-center rounded-2xl bg-stone-900 hover:bg-amber-950 text-amber-300 font-bold text-xs shadow-md transition ${sidebarOpen ? 'w-full py-2.5 px-4 gap-2' : 'w-11 h-11 mx-auto'
                      }`}
                  >
                    <FiShield className="w-4 h-4 text-amber-400 shrink-0" />
                    {sidebarOpen && <span>Switch to Admin Dashboard →</span>}
                  </Link>
                )} */}

                {/* {sidebarOpen && (
                  <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200 text-center animate-in fade-in">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                      12A &amp; 80G Certified Non-Profit
                    </span>
                    <span className="text-[9px] text-stone-600 font-medium block mt-0.5">
                      अपना परिवार वृद्ध आश्रम • Adhartal, Jabalpur (M.P.)
                    </span>
                  </div>
                )} */}

                <button
                  onClick={handleLogout}
                  title="Sign Out from Profile"
                  className={`flex items-center justify-center rounded-2xl bg-red-100/70 hover:bg-red-200 text-red-700 font-bold text-xs transition cursor-pointer ${sidebarOpen ? 'w-full py-2.5 px-4 gap-2' : 'w-11 h-11 mx-auto hover:bg-red-50 hover:text-red-700'
                    }`}
                >
                  <FiLogOut className="w-4 h-4 text-red-800 shrink-0" />
                  {sidebarOpen && <span>Sign Out from Profile</span>}
                </button>
              </div>
            </div>
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