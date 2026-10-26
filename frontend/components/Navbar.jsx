'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => { };
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiHome,
  FiChevronRight,
  FiHeart,
  FiUser,
  FiCreditCard,
  FiAward,
  FiFileText,
  FiShield,
  FiSettings,
  FiActivity,
  FiUsers,
  FiBookOpen,
  FiImage,
  FiLogIn,
  FiUserPlus,
  FiUserCheck,
  FiLayers,
  FiPhoneCall,
  FiMapPin,
  FiSmile,
  FiCheckCircle,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiMessageSquare
} from 'react-icons/fi';
import {
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa6';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import GoogleTranslate from '@/components/common/GoogleTranslate';

export default function Navbar() {
  const pathname = usePathname();
  const { settings, currentUser, logout } = useNGO();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const isMounted = useIsMounted();
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close drawer and dropdowns on route changes without cascading render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleDropdownLinkClick = () => {
    setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const toggleMobileSubmenu = (id) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeUser = isMounted ? currentUser : null;
  const userAvatarUrl = activeUser
    ? getContentImageUrl(activeUser?.photoUrl || activeUser?.image || activeUser?.profilePicture)
    : null;

  const isMember = Boolean(
    activeUser?.role === 'Member' ||
    activeUser?.role === 'Admin' ||
    (activeUser?.isMember && !activeUser?.memberId?.startsWith('APVAF-DON-') && !activeUser?.memberId?.startsWith('BYK-DON-')) ||
    (activeUser?.membershipApplication?.status === 'approved') ||
    (activeUser?.memberId && (activeUser.memberId.startsWith('APVAF-MEM-') || activeUser.memberId.startsWith('BYK-MEM-') || activeUser.memberId.startsWith('MEM-')))
  );

  const isVolunteer = Boolean(
    activeUser?.role === 'Volunteer' ||
    activeUser?.isVolunteer ||
    activeUser?.volunteerApplication?.status === 'approved' ||
    activeUser?.volunteerApplication?.status === 'pending' ||
    (activeUser?.volunteerId && !activeUser?.volunteerId?.startsWith('APVAF-DON-') && !activeUser?.volunteerId?.startsWith('BYK-DON-'))
  );

  const isAdmin = Boolean(
    activeUser?.role === 'Admin' ||
    activeUser?.role === 'admin'
  );

  const isCoordinator = Boolean(
    activeUser?.role === 'Coordinator' ||
    activeUser?.isCoordinator ||
    activeUser?.coordinatorStatus === 'approved' ||
    activeUser?.coordinatorApplication?.status === 'approved' ||
    activeUser?.coordinatorId
  );

  // Modern navigation structured into clean, concise dropdowns
  const navigationGroups = [
    {
      id: 'about',
      label: 'About Us',
      links: [
        { label: 'About Foundation', href: '/about', icon: FiBookOpen, desc: 'Our journey, ethos & elder care dedication' },
        { label: 'Who We Are', href: '/who-we-are', icon: FiUsers, desc: 'Grassroots shelter for homeless senior citizens' },
        { label: 'Awards & Honors', href: '/awards', icon: FiAward, desc: 'State & national recognitions conferred to Aashram' },
        { label: 'Mission & Vision', href: '/mission-vision', icon: FiActivity, desc: 'Dignity, satvik living & selfless seva' },
        { label: 'Inspiring Stories', href: '/story', icon: FiFileText, desc: 'Lives transformed at our Aashram' },
      ],
    },
    {
      id: 'services',
      label: 'Services & Care',
      links: [
        { label: 'All 5 Care Pillars', href: '/services', icon: FiAward, desc: '360° holistic elderly care' },
        { label: 'Safe Residential Living', href: '/services#srv_1', icon: FiHome, desc: 'Hygienic rooms & round-the-clock safety' },
        { label: 'Satvik Diet & Nutrition', href: '/services#srv_2', icon: FiSmile, desc: 'Daily 3-time freshly cooked meals' },
        { label: '24/7 Medical Care', href: '/services#srv_3', icon: FiActivity, desc: 'Nursing, medicine & regular health checks' },
        { label: 'Satsang & Spiritual Care', href: '/services#srv_4', icon: FiHeart, desc: 'Yoga, bhajans & emotional counseling' },
      ],
    },
    {
      id: 'campaigns-events',
      label: 'Campaigns & Events',
      links: [
        { label: 'Active Campaigns', href: '/campaigns', icon: FiHeart, desc: 'Sponsor an elder, medicine & winter warmth' },
        { label: 'Upcoming & Past Events', href: '/event', icon: FiCalendar, desc: 'Medical camps, festival celebrations & satsang' },
        { label: 'Tithi Bhoj Seva', href: '/donation', icon: FiSmile, desc: 'Feed elders on your birthdays & anniversaries' },
      ],
    },
    {
      id: 'involved',
      label: 'Get Involved',
      links: [
        { label: isMember ? 'Member Profile' : 'Apply for Membership', href: isMember ? '/profile/member' : '/apply-member', icon: FiUserPlus, desc: 'Official digital ID card & appointment' },
        { label: isVolunteer ? 'Volunteer Profile' : 'Join as Volunteer', href: isVolunteer ? '/profile/volunteer' : '/apply-volunteer', icon: FiUsers, desc: 'Spend time with elders & assist programs' },
        { label: isCoordinator ? 'Coordinator Desk' : 'Join as Coordinator', href: isCoordinator ? '/profile/coordinator/members' : '/apply-coordinator', icon: FiShield, desc: 'Enroll members & lead community seva wing' },
        { label: 'Trustees & Team', href: '/team-members', icon: FiShield, desc: 'Leadership & caregiving staff' },
        { label: 'Verified Members', href: '/members', icon: FiUserCheck, desc: 'Directory of registered members' },
        { label: 'Legal Certifications', href: '/certificates', icon: FiAward, desc: '12A, 80G & NITI Aayog Darpan credentials' },
      ],
    },
    {
      id: 'media-reports',
      label: 'Media & Reports',
      links: [
        { label: 'Photo Gallery', href: '/gallery', icon: FiImage, desc: 'Moments of joy, festivals & care activities' },
        { label: 'Annual Reports & Transparency', href: '/#reports-section', icon: FiFileText, desc: 'Financial audits & social impact stats' },
        { label: 'News & Bulletins', href: '/blogs', icon: FiBookOpen, desc: 'Recent press releases & updates' },
      ],
    },
    {
      id: 'support',
      label: 'Help Desk',
      links: [
        { label: 'Elder Helpline & Complaints', href: '/complaints', icon: FiPhoneCall, desc: '24/7 emergency support & elder admission' },
        { label: 'Donor Feedback & Reviews', href: '/feedback', icon: FiSmile, desc: 'Read experiences or share your thoughts' },
        { label: 'Aashram Location & Directions', href: '/#locate-us', icon: FiMapPin, desc: 'Adhartal, Jabalpur (M.P.)' },
      ],
    },
  ];

  const helplineNumber = settings?.phone || '+91 8959055269';
  const whatsappNumber = (settings?.whatsapp || '918959055269').replace(/[^0-9]/g, '');

  return (
    <header ref={dropdownRef} className="sticky top-0 z-50 transition-all duration-300">

      {/* ================= 1. TOP UTILITY & ANNOUNCEMENT BAR ================= */}
      <div className="relative z-50 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 border-b border-amber-600/30 text-[11px] sm:text-xs font-bold py-1.5 px-3 sm:px-6 shadow-xs">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3">

          {/* Left: 24x7 Helpline + WhatsApp + Tax Status */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <a
              href={`tel:${helplineNumber}`}
              className="flex items-center gap-1.5 hover:text-stone-900 transition tracking-tight"
              title="Call Aashram Helpline"
            >
              <FiPhoneCall className="w-3.5 h-3.5 text-stone-900 animate-pulse" />
              <span>24x7 Helpline: {helplineNumber}</span>
            </a>

            <span className="hidden sm:inline text-amber-900/40">•</span>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-stone-900 hover:text-white transition"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-emerald-900" />
              <span>WhatsApp Seva Desk</span>
            </a>

            <span className="hidden lg:inline text-amber-900/40">•</span>

            <div className="hidden lg:flex items-center gap-1 text-stone-900">
              <FiShield className="w-3.5 h-3.5" />
              <span>12A &amp; 80G Tax Exemption Certified (50% Tax Rebate)</span>
            </div>
          </div>

          {/* Right: Google Translate Selector + Location */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-stone-900">
              <FiMapPin className="w-3.5 h-3.5 text-stone-950" />
              <span>Adhartal, Jabalpur (M.P.)</span>
            </div>

            <div className="relative z-50">
              <GoogleTranslate />
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN HEADER ROW ================= */}
      <div className="relative z-30 bg-white/98 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">

            {/* Logo & Foundation Identity */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 py-1">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full p-0.5 bg-linear-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0 ring-2 ring-amber-300/60">
                <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden flex items-center justify-center">
                  <img
                    src={getContentImageUrl(settings?.logoUrl) || '/logo.jpg'}
                    alt={settings?.ngoName || 'Apna Parivar Vriddh Aashram'}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logo.jpg';
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-amber-950 font-black text-sm sm:text-base lg:text-lg tracking-tight leading-tight block">
                  Apna Parivar
                </span>
                <span className="text-amber-600 font-black text-xs sm:text-sm lg:text-base tracking-tight leading-tight block">
                  Vriddh Aashram
                </span>
                <div className="hidden 2xl:flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-stone-500 tracking-wide mt-0.5">
                  <span className="text-amber-700">Service</span>
                  <span>•</span>
                  <span className="text-stone-600">Dignity</span>
                  <span>•</span>
                  <span className="text-amber-800">Family</span>
                  <span className="text-stone-300">|</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[8px] font-extrabold">
                    80G Approved
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links with Modern Dropdowns */}
            <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5">
              {/* Home link */}
              {/* <Link
                href="/"
                className={`px-2.5 2xl:px-3 py-2 rounded-xl text-xs 2xl:text-sm font-black transition-all ${pathname === '/'
                  ? 'text-amber-900 bg-amber-100/90 font-black shadow-2xs'
                  : 'text-stone-700 hover:text-amber-800 hover:bg-amber-50/80'
                  }`}
              >
                Home
              </Link> */}

              {/* Dropdown Groups */}
              {navigationGroups.map((group) => {
                const isOpen = activeDropdown === group.id;
                const hasActiveChild = group.links.some((l) => {
                  const clean = l.href.split('#')[0];
                  return clean && clean !== '/' ? pathname.startsWith(clean) : false;
                });

                return (
                  <div
                    key={group.id}
                    className="relative"
                    onMouseLeave={() => setActiveDropdown((prev) => (prev === group.id ? null : prev))}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(group.id)}
                      onMouseEnter={() => setActiveDropdown(group.id)}
                      className={`flex items-center gap-1 px-2 2xl:px-2.5 py-2 rounded-xl text-xs 2xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${isOpen || hasActiveChild
                        ? 'text-amber-900 bg-amber-100/90 font-black shadow-2xs'
                        : 'text-stone-700 hover:text-amber-800 hover:bg-amber-50/80'
                        }`}
                    >
                      <span>{group.label}</span>
                      <FiChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''
                          }`}
                      />
                    </button>

                    {/* Dropdown Box */}
                    {isOpen && (
                      <div
                        className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      >
                        <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-200 p-2 ring-1 ring-amber-500/10 space-y-0.5">
                          {group.links.map((link) => {
                            const IconComp = link.icon;
                            const clean = link.href.split('#')[0];
                            const isSubActive = clean && clean !== '/' ? pathname === clean : false;

                            return (
                              <Link
                                key={link.href + link.label}
                                href={link.href}
                                onClick={handleDropdownLinkClick}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition group ${isSubActive
                                  ? 'bg-amber-100/80 text-amber-950 font-bold'
                                  : 'hover:bg-amber-50/70 text-stone-700 hover:text-amber-900'
                                  }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${isSubActive
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100/70 text-amber-700 group-hover:bg-amber-500 group-hover:text-white'
                                    }`}
                                >
                                  {IconComp && <IconComp className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold leading-tight group-hover:text-amber-900">
                                    {link.label}
                                  </div>
                                  {link.desc && (
                                    <div className="text-[10px] text-stone-500 font-medium line-clamp-1 mt-0.5">
                                      {link.desc}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Action Center - Never wraps or overflows */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

              {/* Admin Dashboard Pill (if Admin) */}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-900 hover:bg-amber-900 text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
                  title="Admin Control Center"
                >
                  <FiLayers className="w-4 h-4 text-amber-400 my-0.5" />
                </Link>
              )}

              {/* Radiant Yellow / Golden Amber Donate Now CTA Button */}
              <Link
                href="/donation"
                className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 transform hover:scale-104 active:scale-97 transition-all duration-300 shrink-0 whitespace-nowrap"
              >
                <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-stone-950 animate-pulse text-stone-950" />
                <span className="tracking-wide">Donate</span>
              </Link>

              {/* User Profile / Login Dropdown */}
              {activeUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('user_profile_box')}
                    className="flex items-center rounded-full border-2 border-amber-400 hover:border-amber-500 bg-amber-50/90 hover:bg-amber-100 transition cursor-pointer p-0.5 shadow-2xs"
                    aria-label="User Profile"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-linear-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center text-[10px] font-black shrink-0 relative">
                      {userAvatarUrl ? (
                        <img
                          src={userAvatarUrl}
                          alt={activeUser.name || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.nav-avatar-initial');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span
                        className="nav-avatar-initial text-[11px] font-black text-stone-950 items-center justify-center"
                        style={{ display: userAvatarUrl ? 'none' : 'flex' }}
                      >
                        {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </button>

                  {activeDropdown === 'user_profile_box' && (
                    <>
                      {/* Mobile Backdrop Overlay */}
                      <div
                        className="sm:hidden fixed inset-0 bg-stone-950/30 backdrop-blur-2xs z-90"
                        onClick={() => setActiveDropdown(null)}
                      />

                      <div className="max-sm:fixed max-sm:top-18 max-sm:right-3 max-sm:w-68 max-sm:max-w-[calc(100vw-24px)] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2 z-100 ring-1 ring-amber-500/10 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Profile Header with Avatar & Status */}
                        <div className="p-2.5 border-b border-amber-100 flex items-center gap-2.5 bg-linear-to-r from-amber-50/80 to-yellow-50/50 rounded-xl mb-1">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 ring-2 ring-amber-300/40 shrink-0 bg-amber-100 flex items-center justify-center relative">
                            {userAvatarUrl ? (
                              <img
                                src={userAvatarUrl}
                                alt={activeUser.name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.parentElement?.querySelector('.drop-avatar-initial');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <span
                              className="drop-avatar-initial text-sm font-black text-amber-950 items-center justify-center"
                              style={{ display: userAvatarUrl ? 'none' : 'flex' }}
                            >
                              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-black text-amber-950 truncate leading-tight">
                              {activeUser.name}
                              <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200 mt-1">
                                {activeUser.role || 'Unknown'}
                              </span>
                            </p>
                            {activeUser.email && (
                              <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                                {activeUser.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="py-1 space-y-0.5 text-xs font-medium text-stone-700">
                          <Link
                            href="/profile"
                            onClick={handleDropdownLinkClick}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                          >
                            <FiUser className="w-4 h-4 text-amber-700" />
                            <span>Profile Overview</span>
                          </Link>
                          <Link
                            href={isMember ? '/profile/member' : '/apply-member'}
                            onClick={handleDropdownLinkClick}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                          >
                            <FiCreditCard className="w-4 h-4 text-amber-700" />
                            <span>{isMember ? 'Member Portal' : 'Apply for Member'}</span>
                          </Link>
                          <Link
                            href={isVolunteer ? '/profile/volunteer' : '/apply-volunteer'}
                            onClick={handleDropdownLinkClick}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                          >
                            <FiUsers className="w-4 h-4 text-amber-700" />
                            <span>{isVolunteer ? 'Volunteer Portal' : 'Apply as Volunteer'}</span>
                          </Link>
                          {isCoordinator ? (
                            <Link
                              href="/profile/coordinator/members"
                              onClick={handleDropdownLinkClick}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-950 font-bold hover:bg-amber-100 transition"
                            >
                              <FiShield className="w-4 h-4 text-amber-700" />
                              <span>Coordinator Desk</span>
                            </Link>
                          ) : (
                            <Link
                              href="/apply-coordinator"
                              onClick={handleDropdownLinkClick}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                            >
                              <FiShield className="w-4 h-4 text-amber-700" />
                              <span>Join as Coordinator</span>
                            </Link>
                          )}
                          <Link
                            href="/profile/id-card"
                            onClick={handleDropdownLinkClick}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                          >
                            <FiShield className="w-4 h-4 text-amber-700" />
                            <span>Official ID Card</span>
                          </Link>
                          <Link
                            href="/profile/certificates"
                            onClick={handleDropdownLinkClick}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                          >
                            <FiAward className="w-4 h-4 text-amber-700" />
                            <span>My Certificates</span>
                          </Link>
                          <Link
                            href="/profile/settings"
                            onClick={handleDropdownLinkClick}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition"
                          >
                            <FiSettings className="w-4 h-4 text-amber-700" />
                            <span>Account Settings</span>
                          </Link>
                        </div>

                        <div className="pt-1 mt-1 border-t border-amber-100">
                          <button
                            type="button"
                            onClick={async () => {
                              setActiveDropdown(null);
                              await logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer transition"
                          >
                            <FiLogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('login_menu_box')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 lg:py-2 hover:scale-105 transition duration-300 ease-in-out cursor-pointer rounded-full border border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-100 text-stone-800 hover:text-amber-900 font-bold text-xs lg:text-sm whitespace-nowrap"
                  >
                    <FiLogIn className="w-3.5 h-3.5 text-amber-700" />
                    <span>Login</span>
                    <FiChevronDown className="w-3 h-3 text-stone-400" />
                  </button>

                  {activeDropdown === 'login_menu_box' && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2 z-50 ring-1 ring-amber-500/10 animate-in fade-in slide-in-from-top-1 duration-150 text-xs font-semibold">
                      <Link
                        href="/login?role=coordinator"
                        onClick={handleDropdownLinkClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-100/70 text-stone-700 hover:text-amber-950 transition"
                      >
                        <FiShield className="w-4 h-4 text-amber-600" />
                        <span>Coordinator Login</span>
                      </Link>
                      <Link
                        href="/login?role=member"
                        onClick={handleDropdownLinkClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 text-stone-700 hover:text-amber-900 transition"
                      >
                        <FiUserCheck className="w-4 h-4 text-amber-600" />
                        <span>Member Login</span>
                      </Link>
                      <Link
                        href="/login?role=volunteer"
                        onClick={handleDropdownLinkClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition"
                      >
                        <FiUsers className="w-4 h-4 text-emerald-600" />
                        <span>Volunteer Login</span>
                      </Link>
                      <Link
                        href="/login?role=admin"
                        onClick={handleDropdownLinkClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition"
                      >
                        <FiShield className="w-4 h-4 text-amber-800" />
                        <span>Admin Desk Login</span>
                      </Link>
                      <div className="pt-1 mt-1 border-t border-yellow-500/30 space-y-1">
                        <Link
                          href="/apply-coordinator"
                          onClick={handleDropdownLinkClick}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100/70 text-amber-950 font-bold hover:bg-yellow-200"
                        >
                          <FiShield className="w-4 h-4 text-amber-800" />
                          <span>Apply as Coordinator</span>
                        </Link>
                        <Link
                          href="/apply-member"
                          onClick={handleDropdownLinkClick}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100/70 text-amber-950 font-bold hover:bg-amber-200"
                        >
                          <FiUserPlus className="w-4 h-4 text-amber-800" />
                          <span>Apply for Membership</span>
                        </Link>
                        <Link
                          href="/apply-volunteer"
                          onClick={handleDropdownLinkClick}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100/70 text-green-950 font-bold hover:bg-green-200"
                        >
                          <FiUsers className="w-4 h-4 text-green-800" />
                          <span>Apply as Volunteer</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-800 hover:text-amber-900 flex items-center justify-center transition border border-amber-300 cursor-pointer shrink-0"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5 text-red-600" /> : <FiMenu className="w-5 h-5 text-amber-900" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ================= 3. MOBILE RESPONSIVE DRAWER (OFF-CANVAS) ================= */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="xl:hidden fixed inset-0 bg-stone-950/50 backdrop-blur-2xs z-50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="xl:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col justify-between border-l border-amber-200 animate-in slide-in-from-right duration-200">
            <div className="flex-1 overflow-y-auto">
              {/* Header inside mobile drawer */}
              <div className="p-3.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 flex items-center justify-between shadow-xs sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white p-0.5 overflow-hidden shrink-0">
                    <img
                      src={getContentImageUrl(settings?.logoUrl) || '/logo.jpg'}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xs leading-tight">Apna Parivar</span>
                    <span className="text-[10px] font-bold text-amber-950/80 leading-tight">Vriddh Aashram</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-amber-600/30 hover:bg-amber-700/40 text-stone-950 flex items-center justify-center cursor-pointer transition"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Helpline Strip */}
              <div className="px-3 py-2 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs font-bold">
                <a
                  href={`tel:${helplineNumber}`}
                  className="flex items-center gap-1.5 text-amber-950 hover:underline"
                >
                  <FiPhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>{helplineNumber}</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-full text-[10px] font-bold"
                >
                  <FaWhatsapp className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                {/* Home link */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition ${pathname === '/'
                    ? 'bg-amber-100 text-amber-950 font-black'
                    : 'text-stone-800 hover:bg-amber-50'
                    }`}
                >
                  <FiHome className="w-4 h-4 text-amber-600" />
                  <span>Home</span>
                </Link>

                {/* Groups */}
                {navigationGroups.map((group) => {
                  const isExpanded = mobileExpanded[group.id];

                  return (
                    <div key={group.id} className="border-b border-amber-100 last:border-none pb-1">
                      <button
                        type="button"
                        onClick={() => toggleMobileSubmenu(group.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-amber-50 transition cursor-pointer"
                      >
                        <span>{group.label}</span>
                        <FiChevronDown
                          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-600' : ''
                            }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 pr-2 py-1 space-y-0.5 bg-amber-50/50 rounded-xl my-1">
                          {group.links.map((link) => {
                            const IconComp = link.icon;
                            const clean = link.href.split('#')[0];
                            const isSubActive = clean && clean !== '/' ? pathname === clean : false;

                            return (
                              <Link
                                key={link.href + link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition ${isSubActive
                                  ? 'bg-amber-200/80 text-amber-950 font-black'
                                  : 'text-stone-700 hover:text-amber-900'
                                  }`}
                              >
                                {IconComp ? (
                                  <IconComp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                )}
                                <span>{link.label}</span>
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

            {/* Bottom Auth & Translate inside Drawer */}
            <div className="p-3 border-t border-amber-200 bg-amber-50/40 space-y-2 shrink-0">
              {activeUser ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 bg-white border border-amber-200 rounded-xl flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300 shrink-0 bg-amber-100 flex items-center justify-center">
                      {userAvatarUrl ? (
                        <img src={userAvatarUrl} alt={activeUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] font-black text-amber-950">
                          {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-amber-950 truncate">{activeUser.name}</p>
                      <span className="text-[10px] text-stone-500 font-bold">{activeUser.role}</span>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[10px] font-bold"
                      >
                        Admin
                      </Link>
                    )}
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-700 hover:bg-amber-100/70"
                  >
                    View Full Profile &amp; ID Card
                  </Link>

                  {isCoordinator ? (
                    <Link
                      href="/profile/coordinator/members"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-xs font-bold bg-amber-100 text-amber-950"
                    >
                      Coordinator Desk (+ Enroll Members)
                    </Link>
                  ) : (
                    <Link
                      href="/apply-coordinator"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-xs font-bold text-amber-900 hover:bg-amber-100/70"
                    >
                      Join as Coordinator
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login?role=member"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-300 text-stone-800 text-xs font-bold hover:bg-amber-100 transition"
                  >
                    <FiLogIn className="w-3.5 h-3.5 text-amber-700" />
                    <span>Member Login</span>
                  </Link>
                  <Link
                    href="/login?role=coordinator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-300 text-stone-800 text-xs font-bold hover:bg-amber-100 transition"
                  >
                    <FiShield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Coordinator Login</span>
                  </Link>
                  <Link
                    href="/apply-member"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm transition"
                  >
                    <FiUserPlus className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Apply Member</span>
                  </Link>
                  <Link
                    href="/apply-coordinator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-yellow-500 text-stone-950 text-xs font-bold hover:bg-yellow-600 shadow-sm transition"
                  >
                    <FiShield className="w-3.5 h-3.5 text-stone-950" />
                    <span>Apply Coordinator</span>
                  </Link>
                </div>
              )}

              {/* Mobile Google Translate */}
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Language:</span>
                <GoogleTranslate />
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
