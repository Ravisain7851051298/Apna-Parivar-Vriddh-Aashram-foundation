'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiCheckSquare,
  FiLayers,
  FiMail,
  FiSettings,
  FiLogOut,
  FiGlobe,
  FiShield,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiUsers,
  FiUserCheck,
  FiHeart,
  FiFileText,
  FiCalendar,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiSidebar,
  FiAward,
  FiActivity,
  FiBookOpen,
  FiSmile
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings, members, donations, complaints } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const authLoading = useSelector((state) => state.auth?.loading);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Active user resolution prioritizing whichever is available
  const user = currentUser || reduxUser;

  // Initialize and persist collapsed state from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('apna_admin_sidebar_collapsed');
      if (saved === 'true') {
        setCollapsed(true);
      }
    } catch (e) { }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('apna_admin_sidebar_collapsed', String(next));
      } catch (e) { }
      return next;
    });
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Real-time counter metrics for badge indicators
  const pendingMembers = members?.filter(m => m.status === 'pending')?.length || 0;
  const pendingDonations = donations?.filter(d => d.status === 'pending')?.length || 0;
  const pendingComplaints = complaints?.filter(c => c.status === 'pending')?.length || 0;
  const totalApprovalsPending = pendingMembers + pendingDonations;

  // Hierarchical / Nested Navigation Groups matching user specifications
  const navGroups = useMemo(() => [
    {
      id: 'overview',
      group: 'Overview',
      singleItem: { label: 'Control Overview', href: '/dashboard', icon: FiHome }
    },
    {
      id: 'content',
      group: 'Manage Content',
      icon: FiBookOpen,
      badge: null,
      items: [
        { label: 'Content CMS Hub', href: '/dashboard/managecontent', icon: FiLayers, isHub: true },
        { label: 'Campaigns CMS', href: '/dashboard/campaigns', icon: FiFileText },
        { label: 'Our Services', href: '/dashboard/services', icon: FiActivity },
        { label: 'Events & Programs', href: '/dashboard/events', icon: FiCalendar },
        { label: 'News & Press Releases', href: '/dashboard/blogs', icon: FiFileText },
        { label: 'Photo & Video Gallery', href: '/dashboard/gallery', icon: FiImage },
        { label: 'Awards & Honors', href: '/dashboard/awards', icon: FiAward },
        { label: 'Sponsorships & Partners', href: '/dashboard/sponsorships', icon: FiAward },
      ]
    },
    {
      id: 'members',
      group: 'Members & Volunteers',
      icon: FiUsers,
      badge: totalApprovalsPending > 0 ? totalApprovalsPending : null,
      items: [
        { label: 'Approvals Center', href: '/dashboard/approvals', icon: FiCheckSquare, badge: totalApprovalsPending },
        { label: 'Members Directory', href: '/dashboard/members', icon: FiUsers },
        { label: 'Volunteer Wing', href: '/dashboard/volunteers', icon: FiUserCheck },
        { label: 'Executive Team', href: '/dashboard/team-members', icon: FiUsers },
        { label: 'Membership Plans', href: '/dashboard/plans', icon: FiLayers },
      ]
    },
    {
      id: 'finance',
      group: 'Finance & Taxation',
      icon: FiHeart,
      badge: pendingDonations > 0 ? pendingDonations : null,
      items: [
        { label: '80G Tax Donations', href: '/dashboard/donations', icon: FiHeart, badge: pendingDonations },
        { label: 'Org Certificates', href: '/dashboard/certificates', icon: FiShield },
      ]
    },
    {
      id: 'helpdesk',
      group: 'Helpdesk & Inquiries',
      icon: FiAlertCircle,
      badge: pendingComplaints > 0 ? pendingComplaints : null,
      items: [
        { label: 'Complaints & Inquiries', href: '/dashboard/complaints', icon: FiAlertCircle, badge: pendingComplaints },
        { label: 'Reviews & Feedback', href: '/dashboard/feedback', icon: FiSmile },
        { label: 'Email Audit Logs', href: '/dashboard/email-logs', icon: FiMail },
      ]
    },
    {
      id: 'system',
      group: 'Administration',
      icon: FiSettings,
      badge: null,
      items: [
        { label: 'User Accounts', href: '/dashboard/users', icon: FiUsers },
        { label: 'NGO Master Settings', href: '/settings', icon: FiSettings },
      ]
    }
  ], [totalApprovalsPending, pendingDonations, pendingComplaints]);

  // State to track which nested groups are expanded in the sidebar
  const [openGroups, setOpenGroups] = useState({
    content: true,
    members: true,
    finance: true,
    helpdesk: true,
    system: true
  });

  // Automatically keep current active group expanded
  useEffect(() => {
    navGroups.forEach(g => {
      if (g.items?.some(sub => pathname === sub.href || pathname.startsWith(sub.href))) {
        setOpenGroups(prev => ({ ...prev, [g.id]: true }));
      }
    });
  }, [pathname, navGroups]);

  const toggleGroup = (groupId) => {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Find active label for breadcrumb
  const activeItem = useMemo(() => {
    for (const group of navGroups) {
      if (group.singleItem && pathname === group.singleItem.href) return group.singleItem;
      if (group.items) {
        const match = group.items.find(i => pathname === i.href) ||
          group.items.find(i => pathname.startsWith(i.href) && i.href !== '/dashboard');
        if (match) return match;
      }
    }
    return { label: 'Control Overview', href: '/dashboard', icon: FiHome };
  }, [pathname, navGroups]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Wait for client mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-stone-600">Initializing Trustee Workspace...</p>
        </div>
      </div>
    );
  }

  // If auth is still checking and user is not yet populated
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-stone-600">Verifying Trustee Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-amber-200 p-8 rounded-3xl text-center text-stone-900 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4 border border-amber-300">
            <FiShield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-stone-950">Restricted Trustee Access</h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            You must be authenticated with the <strong>Admin</strong> role to access the National Trustee Dashboard and document authorization modules.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl border border-amber-200 hover:bg-amber-50 text-stone-800 font-bold text-xs transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-900 flex flex-col md:flex-row antialiased">
      {/* ----------------- FIXED DESKTOP SIDEBAR (COLLAPSIBLE WITH NESTED ITEMS) ----------------- */}
      <aside
        className={`hidden md:flex flex-col justify-between fixed inset-y-0 left-0 z-30 bg-[#fefce8] border-r border-amber-200/90 transition-all duration-300 ease-in-out shadow-xs select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div
            className={`px-4 py-3.5 border-b border-amber-200/90 flex items-center transition-all bg-linear-to-r from-amber-100/80 via-[#fefce8] to-amber-50/60 ${
              collapsed ? 'justify-center flex-col gap-2' : 'justify-between'
            }`}
          >
            {!collapsed ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-stone-950 text-base shrink-0 overflow-hidden ring-2 ring-amber-300/60">
                  {settings?.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getContentImageUrl(settings.logoUrl)}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    'परिवार'
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xs font-black text-stone-950 leading-tight truncate">
                    {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}
                  </h2>
                  <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider block truncate">
                    Trustee Admin Panel
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-stone-950 text-base shrink-0 cursor-pointer overflow-hidden ring-2 ring-amber-300/60"
                onClick={toggleCollapsed}
                title="Expand sidebar"
              >
                {settings?.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getContentImageUrl(settings.logoUrl)}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  'परिवार'
                )}
              </div>
            )}
          </div>

          {/* Navigation Links Scrollable (Nested Structure) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-2">
            {navGroups.map((group) => {
              // 1. Single standalone item (like Overview)
              if (group.singleItem) {
                const active = pathname === group.singleItem.href;
                const Icon = group.singleItem.icon;
                if (collapsed) {
                  return (
                    <Link
                      key={group.singleItem.href}
                      href={group.singleItem.href}
                      title={group.singleItem.label}
                      className={`group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all ${
                        active
                          ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                          : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/70'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                        {group.singleItem.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={group.singleItem.href}
                    href={group.singleItem.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                        : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-stone-950' : 'text-amber-700'}`} />
                      <span className="truncate">{group.singleItem.label}</span>
                    </div>
                  </Link>
                );
              }

              // 2. Nested Groups (with child items)
              const isGroupOpen = openGroups[group.id] ?? true;
              const hasActiveChild = group.items?.some(
                item => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
              );
              const GroupIcon = group.icon;

              if (collapsed) {
                return (
                  <div key={group.id} className="py-1 border-t border-amber-100/80 space-y-1">
                    {group.items?.map((item) => {
                      const active = pathname === item.href;
                      const Icon = item.icon;
                      const badge = item.badge || 0;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={item.label}
                          className={`group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all ${
                            active
                              ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                              : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/70'
                          }`}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          {badge > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                          )}
                          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 flex items-center gap-1.5">
                            <span>{item.label}</span>
                            {badge > 0 && (
                              <span className="px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded text-[9px] font-black">
                                {badge}
                              </span>
                            )}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              }

              return (
                <div key={group.id} className="rounded-2xl border border-amber-100/80 bg-stone-50/50 overflow-hidden">
                  {/* Group Header Button (Accordion Toggle) */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-black transition-colors ${
                      hasActiveChild ? 'text-amber-950 bg-amber-100/50' : 'text-stone-700 hover:bg-amber-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GroupIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="text-[11px] uppercase tracking-wider truncate font-black">
                        {group.group}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {group.badge && group.badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-200 text-amber-950 border border-amber-300">
                          {group.badge}
                        </span>
                      )}
                      <FiChevronDown
                        className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                          isGroupOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Sub-items (Child links) */}
                  {isGroupOpen && (
                    <div className="p-1 space-y-0.5 bg-[#fffdf0] border-t border-amber-200/60">
                      {group.items?.map((item) => {
                        const active = pathname === item.href;
                        const Icon = item.icon;
                        const badge = item.badge || 0;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between pl-3 pr-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              active
                                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-stone-950' : 'text-amber-700'}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {badge > 0 && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                                  active
                                    ? 'bg-stone-950 text-amber-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ----------------- MOBILE DRAWER WITH BACKDROP ----------------- */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-76 max-w-[85vw] bg-[#fefce8] h-full flex flex-col justify-between shadow-2xl z-10 border-r border-amber-200/90">
            <div className="flex flex-col h-full overflow-hidden">
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-amber-200/90 flex items-center justify-between bg-linear-to-r from-amber-100/90 via-[#fefce8] to-amber-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-stone-950 text-sm shadow-xs shrink-0 ring-2 ring-amber-300">
                    परिवार
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-stone-950">Trustee Admin</div>
                    <div className="text-[10px] text-stone-500 font-medium truncate">{currentUser?.name}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 text-stone-800 transition cursor-pointer"
                  aria-label="Close Admin Navigation"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {navGroups.map((group) => {
                  if (group.singleItem) {
                    const active = pathname === group.singleItem.href;
                    const Icon = group.singleItem.icon;
                    return (
                      <Link
                        key={group.singleItem.href}
                        href={group.singleItem.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                          active
                            ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
                            : 'text-stone-700 hover:bg-amber-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? 'text-stone-950' : 'text-amber-700'}`} />
                          <span>{group.singleItem.label}</span>
                        </div>
                      </Link>
                    );
                  }

                  const isGroupOpen = openGroups[group.id] ?? true;
                  const GroupIcon = group.icon;

                  return (
                    <div key={group.id} className="rounded-2xl border border-amber-100/80 bg-stone-50/50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-black text-stone-800 hover:bg-amber-50/80"
                      >
                        <div className="flex items-center gap-2">
                          <GroupIcon className="w-3.5 h-3.5 text-amber-700" />
                          <span className="text-[11px] uppercase tracking-wider font-black">{group.group}</span>
                        </div>
                        <FiChevronDown
                          className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isGroupOpen && (
                        <div className="p-1 space-y-0.5 bg-[#fffdf0] border-t border-amber-200/60">
                          {group.items?.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;
                            const badge = item.badge || 0;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                                  active
                                    ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
                                    : 'text-stone-700 hover:bg-amber-100/60'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-stone-950' : 'text-amber-700'}`} />
                                  <span>{item.label}</span>
                                </div>
                                {badge > 0 && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                    {badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-3 border-t border-amber-200 space-y-1.5 bg-amber-100/40">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-amber-100/60 transition"
                >
                  <FiShield className="w-4 h-4 text-amber-700" />
                  <span>User Portal View</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:text-black hover:bg-amber-100/60 transition"
                >
                  <FiGlobe className="w-4 h-4 text-stone-600" />
                  <span>Public Live Site</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MAIN ADMIN WORKSPACE WITH HEADER ----------------- */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* TOP HEADER FOR ADMIN DASHBOARD */}
        <header className="sticky top-0 z-20 bg-[#fefce8]/95 backdrop-blur-md border-b border-amber-200/90 px-4 py-3 flex items-center justify-between gap-4 shadow-2xs">
          {/* Left section: Collapse/Expand toggles & Page Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden md:inline-flex items-center justify-center p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-800 transition cursor-pointer border border-amber-200"
              title={collapsed ? "Expand full sidebar" : "Collapse sidebar to icons only"}
            >
              <FiSidebar className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-900 transition cursor-pointer border border-amber-200"
              aria-label="Open Admin Menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {/* Active Page Breadcrumb & Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                <span>Trustee Admin</span>
                <span>/</span>
                <span className="text-amber-950 font-black">{activeItem?.label}</span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-stone-950 truncate flex items-center gap-2">
                <span>{activeItem?.label}</span>
                {totalApprovalsPending > 0 && activeItem?.href === '/dashboard/approvals' && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
                    {totalApprovalsPending} Awaiting Review
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Right section: Quick Actions & Profile Widget */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-stone-800 text-xs font-bold transition shadow-2xs"
              title="Navigate to Public Website"
            >
              <FiGlobe className="w-3.5 h-3.5 text-stone-600" />
              <span>Live Site</span>
            </Link>

            <Link
              href="/profile"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 text-xs font-black transition shadow-xs"
              title="Open User Portal View"
            >
              <FiShield className="w-3.5 h-3.5 text-stone-950" />
              <span>User Portal</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 sm:border-l border-amber-200">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-500 to-yellow-400 text-stone-950 font-black flex items-center justify-center text-xs shadow-xs overflow-hidden ring-2 ring-amber-300">
                {currentUser?.photoUrl ? (
                  <img
                    src={getContentImageUrl(currentUser.photoUrl)}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'
                )}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-black text-stone-950 leading-tight truncate max-w-32.5">
                  {currentUser?.name || 'Trustee Admin'}
                </div>
                <div className="text-[10px] text-stone-500 font-medium">National Trustee</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg text-rose-700 bg-rose-50 border border-rose-200 shadow-2xs hover:bg-rose-100 transition cursor-pointer"
                title="Sign Out Session"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-0 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
