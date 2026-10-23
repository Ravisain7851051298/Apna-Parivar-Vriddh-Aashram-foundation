'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid,
  FiCreditCard,
  FiActivity,
  FiUserPlus,
  FiUsers,
  FiUserCheck,
  FiCompass,
  FiLayers,
  FiFileText,
  FiTarget,
  FiAward,
  FiMessageSquare,
  FiAlertCircle,
  FiCalendar,
  FiImage,
  FiBookOpen,
  FiSettings,
  FiUser,
  FiLogOut,
  FiExternalLink,
  FiShield,
  FiMenu,
  FiX,
  FiPlay,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

// Master 18 modules for Admin
export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: FiGrid },
  { label: "Donations", href: "/dashboard/donations", icon: FiCreditCard },
  { label: "Our Services", href: "/dashboard/services", icon: FiActivity },
  { label: "Volunteer", href: "/dashboard/volunteers", icon: FiUserPlus },
  { label: "Members", href: "/members", icon: FiUsers },
  { label: "Team Members", href: "/team-members", icon: FiUserCheck },
  { label: "Mission & Vision", href: "/mission-vision", icon: FiCompass },
  { label: "Programs", href: "/programs", icon: FiLayers },
  { label: "News & Blogs", href: "/blogs", icon: FiFileText },
  { label: "Campaigns", href: "/campaigns", icon: FiTarget },
  { label: "Org Certificates", href: "/dashboard/certificates", icon: FiAward },
  { label: "Reviews & Feedback", href: "/dashboard/feedback", icon: FiMessageSquare },
  { label: "Complaints & Inquiries", href: "/complaints", icon: FiAlertCircle },
  { label: "Event", href: "/event", icon: FiCalendar },
  { label: "Gallery", href: "/gallery", icon: FiImage },
  { label: "Manage Home Content", href: "/dashboard/managecontent", icon: FiLayers },
  { label: "Contact & NGO Settings", href: "/settings", icon: FiSettings },
  { label: "Profile", href: "/profile", icon: FiUser }
];

// Role-based limited navigation items
export const ROLE_NAV_ITEMS = {
  Admin: ADMIN_NAV_ITEMS,

  TeamMember: [
    { label: "Overview", href: "/dashboard", icon: FiGrid },
    { label: "Officer Profile & ID", href: "/profile", icon: FiUser },
    { label: "Team Directory", href: "/team-members", icon: FiUserCheck },
    { label: "Members Directory", href: "/members", icon: FiUsers },
    { label: "Programs Oversight", href: "/programs", icon: FiLayers },
    { label: "Campaigns & Drives", href: "/campaigns", icon: FiTarget },
    { label: "Events Roster", href: "/event", icon: FiCalendar },
    { label: "Org Certificates", href: "/dashboard/certificates", icon: FiAward },
    { label: "Stories & Impact", href: "/story", icon: FiBookOpen },
    { label: "Feedback & Reviews", href: "/dashboard/feedback", icon: FiMessageSquare },
  ],

  Volunteer: [
    { label: "Volunteer Profile & ID Card", href: "/profile/id-card", icon: FiUser },
    { label: "Appointment Letter", href: "/profile/appointment-letter", icon: FiFileText },
    { label: "My Certificates", href: "/profile/certificates", icon: FiAward },
    { label: "Upcoming Events & Tasks", href: "/event", icon: FiCalendar },
    { label: "Active Campaigns", href: "/campaigns", icon: FiTarget },
    { label: "Welfare Programs", href: "/programs", icon: FiLayers },
    { label: "Submit Feedback", href: "/feedback", icon: FiMessageSquare },
    { label: "Help Desk / Grievance", href: "/profile/complaints", icon: FiAlertCircle },
  ],

  Member: [
    { label: "Member Profile & ID Card", href: "/profile/id-card", icon: FiUser },
    { label: "Appointment Letter", href: "/profile/appointment-letter", icon: FiFileText },
    { label: "My 80G Donations", href: "/profile/donations", icon: FiCreditCard },
    { label: "My Certificates", href: "/profile/certificates", icon: FiAward },
    { label: "Welfare Programs", href: "/programs", icon: FiLayers },
    { label: "Community Events", href: "/event", icon: FiCalendar },
    { label: "Submit Feedback", href: "/feedback", icon: FiMessageSquare },
    { label: "Grievance Redressal", href: "/profile/complaints", icon: FiAlertCircle },
  ]
};

export default function AdminSidebar({ activeRole = null }) {
  const pathname = usePathname();
  const { currentUser, logout, settings } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const effectiveUser = isMounted ? (reduxUser || currentUser) : null;

  // Determine effective role
  const role = activeRole || effectiveUser?.role || 'Admin';
  const navItems = ROLE_NAV_ITEMS[role] || ROLE_NAV_ITEMS.Member;

  const roleBadgeText = {
    Admin: 'Master Admin Panel (All 18 Modules)',
    TeamMember: 'Team Officer Panel (Operations)',
    Volunteer: 'Volunteer Portal (Field Services)',
    Member: 'Member Portal (Identity & Tax)'
  }[role] || 'Member Portal';

  return (
    <>
      {/* Mobile Sticky Bar Toggle */}
      <div className="lg:hidden w-full bg-white text-black px-4 py-3 flex items-center justify-between border-b border-slate-200 sticky top-20 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold truncate text-black">
            {roleBadgeText}
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-black flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          {mobileSidebarOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? 'Close Menu' : 'Portal Menu'}</span>
        </button>
      </div>

      {/* Desktop Fixed Sidebar & Mobile Drawer */}
      <aside
        className={`
          ${mobileSidebarOpen ? 'block fixed inset-y-0 left-0 z-50 w-72' : 'hidden'}
          lg:flex lg:flex-col lg:w-64 lg:shrink-0
          bg-white text-black border-r border-slate-200 shadow-sm
          lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 flex items-center justify-center font-black text-stone-950 shadow-md shadow-amber-500/20 shrink-0">
              IYF
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-xs tracking-wide text-black truncate">
                {settings?.ngoName || 'Yuva Kranti Dal'}
              </h2>
              <span className="text-[10px] text-amber-800 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 inline-block mt-0.5">
                {role}
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-black"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-amber-500 flex items-center justify-center text-stone-950 text-xs font-black shrink-0 shadow-2xs">
            {effectiveUser?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getContentImageUrl(effectiveUser.photoUrl)}
                alt={effectiveUser.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <span className={effectiveUser?.photoUrl ? 'sr-only' : ''}>
              {effectiveUser?.name ? effectiveUser.name.charAt(0) : 'U'}
            </span>
          </div>
          <div className="overflow-hidden text-xs">
            <div className="font-bold text-black truncate">{effectiveUser?.name || 'Authorized User'}</div>
            <div className="text-[10px] text-slate-600 truncate">{effectiveUser?.memberId || roleBadgeText}</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Handle query strings matching
            const itemPath = item.href.split('?')[0];
            const isActive = pathname === itemPath;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-700 hover:bg-amber-50 hover:text-amber-800'
                  }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Bar & Quick Links */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/60">
          <Link
            href="/"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-black transition font-semibold shadow-2xs"
          >
            <FiExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={() => { logout(); setMobileSidebarOpen(false); }}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer font-bold"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
        />
      )}
    </>
  );
}
