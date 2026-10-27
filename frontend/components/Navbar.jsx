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
  FiArrowRight,
  FiCheckSquare,
} from 'react-icons/fi';
import {
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa6';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import GoogleTranslate from '@/components/common/GoogleTranslate';
import DecorativeRings from '@/components/site/DecorativeRings';

export default function Navbar() {
  const pathname = usePathname();
  const { settings, currentUser, logout } = useNGO();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const isMounted = useIsMounted();
  const navContainerRef = useRef(null);

  // Close dropdown on click outside or on Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close drawer and dropdowns on route changes
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
      setMobileMenuOpen(false);
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

  const helplineNumber = settings?.phone || '+91 8959055269';
  const whatsappNumber = (settings?.whatsapp || '918959055269').replace(/[^0-9]/g, '');
  const ngoTitle = settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation';
  const presidentName = settings?.presidentName || 'Dr. Ravi Saini';

  // Comprehensive, structured Mega Menu Groups representing ALL important site links
  const navigationGroups = [
    {
      id: 'about',
      label: 'About Us',
      overview: {
        badge: 'Our Ethos',
        title: 'About Us',
        description: `Led by President ${presidentName}, ${ngoTitle} was established to provide lifelong shelter, satvik food, 24/7 medical supervision, and familial dignity to abandoned and destitute elderly mothers and fathers.`,
        ctaText: 'KNOW MORE',
        ctaHref: '/about'
      },
      columns: [
        {
          title: 'Identity & Mission',
          links: [
            { label: 'About Foundation', href: '/about', icon: FiBookOpen, desc: 'Our journey, history & elder care dedication' },
            { label: 'Who We Are', href: '/who-we-are', icon: FiUsers, desc: 'Grassroots sanctuary for homeless senior citizens' },
            { label: 'Mission & Vision', href: '/mission-vision', icon: FiActivity, desc: 'Dignity, satvik living & selfless seva' },
            { label: 'Inspiring Stories', href: '/story', icon: FiFileText, desc: 'Real life transformations at our Aashram' }
          ]
        },
        {
          title: 'Trust & Governance',
          links: [
            { label: 'Awards & Honors', href: '/awards', icon: FiAward, desc: 'State & national recognitions conferred to Aashram' },
            { label: 'Trustees & Governing Team', href: '/team-members', icon: FiShield, desc: 'Leadership board & selfless caregiving staff' },
            { label: '12A & 80G Certificates', href: '/certificates', icon: FiAward, desc: 'Income Tax exemption & NITI Aayog Darpan credentials' },
            { label: 'Annual Audit Reports', href: '/#annual-reports', icon: FiFileText, desc: 'Statutory balance sheets & social impact disclosures' }
          ]
        }
      ],
      featured: {
        image: settings?.chairpersonPhotoUrl || settings?.presidentPhotoUrl || settings?.logoUrl || '/logo.jpeg',
        tag: 'Founder & President Desk',
        title: 'Transforming Elder Care',
        description: `${ngoTitle} engages in round-the-clock elder healthcare, pure satvik nutrition, spiritual counseling, and dignified shelter so no senior citizen ever sleeps hungry or alone.`,
        link: '/about',
        linkText: 'Read Foundation Message'
      }
    },
    {
      id: 'services',
      label: 'Services & Care',
      overview: {
        badge: 'Holistic Seva',
        title: 'Services & Care',
        description: 'Our comprehensive elder living model is structured on the 5 sacred pillars of unconditional seva—ensuring medical healing, nutritious satvik meals, spiritual peace, and emotional comfort.',
        ctaText: 'EXPLORE SERVICES',
        ctaHref: '/services'
      },
      columns: [
        {
          title: 'Daily Care & Nutrition',
          links: [
            { label: 'All 5 Care Pillars', href: '/services', icon: FiAward, desc: '360° holistic elderly care model' },
            { label: 'Safe Residential Living', href: '/services#srv_1', icon: FiHome, desc: 'Hygienic rooms, wheelchair campus & 24/7 safety' },
            { label: 'Nutritious Satvik Bhoj', href: '/services#srv_2', icon: FiSmile, desc: 'Daily 3-time freshly prepared pure vegetarian meals' },
            { label: '24/7 Medical Care & Nursing', href: '/services#srv_3', icon: FiActivity, desc: 'Doctor visits, daily medicines & vital monitoring' }
          ]
        },
        {
          title: 'Emotional & Social Seva',
          links: [
            { label: 'Satsang & Spiritual Care', href: '/services#srv_4', icon: FiHeart, desc: 'Daily morning yoga, bhajans & emotional counseling' },
            { label: 'Recreational & Cultural Seva', href: '/services#srv_5', icon: FiSmile, desc: 'Festivals, music, games & recreational outings' },
            { label: 'Welfare Programs & Outreach', href: '/programs', icon: FiCheckSquare, desc: 'Senior support drives across local settlements' },
            { label: 'Senior Rescue & Emergency', href: '/complaints', icon: FiPhoneCall, desc: 'Emergency admission for abandoned senior citizens' }
          ]
        }
      ],
      featured: {
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80',
        tag: 'Sacred Annakshetra',
        title: 'Nutritious Satvik Bhoj',
        description: 'Every meal at the ashram is prepared with fresh vegetables, pure ingredients, and maternal affection tailored to elderly digestion.',
        link: '/donation',
        linkText: 'Sponsor A Day Meal (Tithi Bhoj)'
      }
    },
    {
      id: 'involved',
      label: 'Get Involved',
      overview: {
        badge: 'Join Movement',
        title: 'Get Involved',
        description: 'Become part of our nationwide family of compassionate youth volunteers, verified lifetime members, and regional seva coordinators restoring hope to seniors.',
        ctaText: 'BECOME A MEMBER',
        ctaHref: '/apply-member'
      },
      columns: [
        {
          title: 'Membership & Volunteer Wings',
          links: [
            { label: isMember ? 'My Member Profile' : 'Apply for Official Membership', href: isMember ? '/profile/member' : '/apply-member', icon: FiUserPlus, desc: 'Official digital ID card, letter & voting rights' },
            { label: isVolunteer ? 'My Volunteer Profile' : 'Join as Active Volunteer', href: isVolunteer ? '/profile/volunteer' : '/apply-volunteer', icon: FiUsers, desc: 'Spend time with elders & assist daily programs' },
            { label: isCoordinator ? 'Coordinator Seva Desk' : 'Become Seva Coordinator', href: isCoordinator ? '/profile/coordinator/members' : '/apply-coordinator', icon: FiShield, desc: 'Lead community wing & enroll registered members' },
            { label: 'Verified Members Directory', href: '/members', icon: FiUserCheck, desc: 'Public roster of registered patrons & benefactors' }
          ]
        },
        {
          title: 'Donation & Sponsorship',
          links: [
            { label: 'Instant 80G Tax Donation', href: '/donation', icon: FiHeart, desc: '50% income tax deduction with instant digital 80G receipt' },
            { label: 'Active Relief Campaigns', href: '/campaigns', icon: FiHeart, desc: 'Winter blankets, senior medicine fund & emergency relief' },
            { label: 'Sponsors & CSR Partners', href: '/sponsors', icon: FiCreditCard, desc: 'Corporate CSR partnerships & institutional patrons' },
            { label: 'Verify ID & Certificates', href: '/verify', icon: FiCheckCircle, desc: 'Online authentication of membership ID & certificates' }
          ]
        }
      ],
      featured: {
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
        tag: 'Tax Exemption',
        title: '50% Income Tax Rebate',
        description: 'All donations to Apna Parivar Vriddh Aashram Foundation are 100% eligible for tax rebate under Section 80G. Automated 80G receipt generated immediately.',
        link: '/donation',
        linkText: 'Donate with 80G Tax Benefit'
      }
    },
    {
      id: 'media',
      label: 'Media & Events',
      overview: {
        badge: 'Life & Moments',
        title: 'Media & Events',
        description: 'Experience the heartwarming joy, festival celebrations, healthcare camps, and inspiring milestone events that bring vibrant smiles to our venerable seniors.',
        ctaText: 'BROWSE GALLERY',
        ctaHref: '/gallery'
      },
      columns: [
        {
          title: 'Moments & Happenings',
          links: [
            { label: 'Photo & Video Gallery', href: '/gallery', icon: FiImage, desc: 'Cherished memories, celebrations & care activities' },
            { label: 'Upcoming & Past Events', href: '/event', icon: FiCalendar, desc: 'Health camps, festive feasts & bhajan sandhyas' },
            { label: 'Festival Celebrations', href: '/event', icon: FiSmile, desc: 'Diwali, Holi, Makar Sankranti & national festivals' }
          ]
        },
        {
          title: 'Press & Transparency',
          links: [
            { label: 'News & Media Bulletins', href: '/blogs', icon: FiBookOpen, desc: 'Recent press releases, coverage & newsletters' },
            { label: 'Social Impact & Footprint', href: '/who-we-are', icon: FiActivity, desc: 'Hundreds of elderly sheltered, healed & empowered' },
            { label: 'YouTube Video Broadcasts', href: 'https://youtube.com', icon: FaYoutube, desc: 'Watch real everyday footage from our Aashram' }
          ]
        }
      ],
      featured: {
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
        tag: 'Moments of Joy',
        title: 'Family Celebrations',
        description: 'At Apna Parivar, no elder feels abandoned. Birthdays, festivals, and cultural events are celebrated with music, sweets, and heartfelt family bonding.',
        link: '/gallery',
        linkText: 'View Photo Archives'
      }
    },
    {
      id: 'support',
      label: 'Trust & Help Desk',
      overview: {
        badge: 'Open Governance',
        title: 'Trust & Help Desk',
        description: 'We believe in 100% open book governance. Reach our 24/7 elder helpline, request senior admissions, read verified community reviews, or inspect audited accounts.',
        ctaText: 'CONTACT DESK',
        ctaHref: '/complaints'
      },
      columns: [
        {
          title: 'Emergency & Helplines',
          links: [
            { label: 'Elder Helpline & Complaints', href: '/complaints', icon: FiPhoneCall, desc: `Emergency line: ${helplineNumber}` },
            { label: 'Emergency Elder Rescue & Intake', href: '/complaints', icon: FiShield, desc: 'Report an abandoned or distressed senior citizen' },
            { label: 'WhatsApp Seva Desk', href: `https://wa.me/${whatsappNumber}`, icon: FaWhatsapp, desc: 'Instant chat with coordinators & volunteers' },
            { label: 'Locate Aashram (Directions)', href: '/#locate-us', icon: FiMapPin, desc: `${settings?.address || 'Adhartal, Jabalpur (M.P.)'}` }
          ]
        },
        {
          title: 'Transparency & Reviews',
          links: [
            { label: 'Donor Reviews & Testimonials', href: '/feedback', icon: FiSmile, desc: 'Verified community reflections & official replies' },
            { label: 'Statutory Financial Audits', href: '/#annual-reports', icon: FiFileText, desc: 'Full annual reports & audited balance sheets' },
            { label: 'Statutory Certifications', href: '/certificates', icon: FiAward, desc: '12A, 80G, CSR-1 & NITI Aayog credentials' }
          ]
        }
      ],
      featured: {
        image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600&auto=format&fit=crop&q=80',
        tag: 'Public Verification',
        title: 'Verified Transparency',
        description: 'Every rupee donated is audited and directly deployed towards senior meal trays, medical equipment, clean bedding, and dignified living.',
        link: '/feedback',
        linkText: 'Read Community Reviews'
      }
    }
  ];

  const activeGroup = navigationGroups.find((g) => g.id === activeDropdown);

  return (
    <header ref={navContainerRef} className="sticky top-0 z-50 transition-all duration-300">

      {/* ================= 1. TOP UTILITY & ANNOUNCEMENT BAR ================= */}
      <div className="relative z-20 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 border-b border-amber-600/30 text-[11px] sm:text-xs font-bold py-1.5 px-3 sm:px-6 shadow-xs">
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
              <FaWhatsapp className="w-3.5 h-3.5 text-emerald-950" />
              <span>WhatsApp Seva Desk</span>
            </a>

            <span className="hidden lg:inline text-amber-900/40">•</span>

            <div className="hidden lg:flex items-center gap-1 text-stone-900 font-semibold">
              <FiShield className="w-3.5 h-3.5" />
              <span>12A &amp; 80G Tax Exemption Certified (50% Tax Rebate)</span>
            </div>
          </div>

          {/* Right: Google Translate Selector + Location */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-stone-900">
              <FiMapPin className="w-3.5 h-3.5 text-stone-950" />
              <span>{settings?.address ? settings.address.split(',')[0] : 'Adhartal, Jabalpur (M.P.)'}</span>
            </div>

            <div className="relative z-50">
              <GoogleTranslate />
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN HEADER ROW ================= */}
      <div className="relative z-40 bg-white/98 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
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
                  <span className="text-amber-700">Seva</span>
                  <span>•</span>
                  <span className="text-stone-600">Dignity</span>
                  <span>•</span>
                  <span className="text-amber-800">Shelter</span>
                  <span className="text-stone-300">|</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[8px] font-extrabold">
                    80G Approved
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links with Mega Menu Dropdown Triggers */}
            <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
              {navigationGroups.map((group) => {
                const isOpen = activeDropdown === group.id;
                const hasActiveChild = group.columns.some((col) =>
                  col.links.some((l) => {
                    const clean = l.href.split('#')[0];
                    return clean && clean !== '/' ? pathname.startsWith(clean) : false;
                  })
                );

                return (
                  <div
                    key={group.id}
                    className="static"
                    onMouseEnter={() => setActiveDropdown(group.id)}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(group.id)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${isOpen || hasActiveChild
                        ? 'text-amber-950 bg-amber-100 font-black shadow-2xs border border-amber-300/80'
                        : 'text-stone-700 hover:text-amber-900 hover:bg-amber-50/80 border border-transparent'
                        }`}
                      aria-expanded={isOpen}
                    >
                      <span>{group.label}</span>
                      <FiChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-700' : ''
                          }`}
                      />
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Right Action Center */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

              {/* Admin Dashboard Pill (if Admin) */}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 h-9 sm:h-10 rounded-full bg-stone-900 hover:bg-stone-950 text-white text-xs font-black transition-all duration-200 shadow-xs hover:shadow-md whitespace-nowrap border border-amber-400/40 shrink-0"
                  title="Admin Master Control & Analytics Hub"
                >
                  <FiLayers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                </Link>
              )}

              {/* Radiant Yellow / Golden Amber Donate Now CTA Button */}
              <Link
                href="/donation"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4.5 h-9 sm:h-10 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-xs shadow-md shadow-amber-500/25 hover:shadow-lg transition-all duration-200 shrink-0 whitespace-nowrap"
              >
                <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-stone-950 animate-pulse text-stone-950 shrink-0" />
                <span className="hidden md:block tracking-wide">Donate 80G</span>
              </Link>

              {/* User Profile / Login Dropdown */}
              {activeUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('user_profile_box')}
                    className="inline-flex items-center gap-2 px-2 h-9 sm:h-10 rounded-full border border-amber-300 hover:border-amber-500 bg-amber-50/90 hover:bg-amber-100 text-stone-900 transition-all duration-200 cursor-pointer shadow-2xs group shrink-0"
                    aria-label="User Profile"
                  >
                    {/* Compact Profile Image */}
                    <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full overflow-hidden bg-linear-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center text-[10px] font-black shrink-0 relative ring-1 ring-amber-400">
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
                    </div>

                    {/* Display User Name & Role in Site Navbar */}
                    <div className="hidden sm:flex flex-col text-left leading-tight">
                      <span className="text-xs font-black text-stone-950 truncate max-w-24 lg:max-w-30">
                        {activeUser.name}
                      </span>
                      <span className="text-[9px] font-bold text-amber-900 truncate">
                        {activeUser.role || (isCoordinator ? 'Coordinator' : isVolunteer ? 'Volunteer' : 'Member')}
                      </span>
                    </div>

                    <FiChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-900 transition-transform shrink-0" />
                  </button>

                  {activeDropdown === 'user_profile_box' && (
                    <>
                      {/* Mobile Backdrop Overlay */}
                      <div
                        className="sm:hidden fixed inset-0 bg-stone-950/30 backdrop-blur-2xs z-90"
                        onClick={() => setActiveDropdown(null)}
                      />

                      <div className="max-sm:fixed max-sm:top-18 max-sm:right-3 max-sm:w-68 max-sm:max-w-[calc(100vw-24px)] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2 z-100 ring-1 ring-amber-500/10 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                        <DecorativeRings variant="card" />
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
                                {activeUser.role || 'Member'}
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
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 h-9 sm:h-10 rounded-full border border-amber-300 hover:border-amber-500 bg-amber-50/80 hover:bg-amber-100 text-stone-900 hover:text-amber-950 font-bold text-xs sm:text-xs transition-all duration-200 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                  >
                    <FiLogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" />
                    <span className="hidden md:block">Login</span>
                    <FiChevronDown className="w-3 h-3 text-stone-500" />
                  </button>

                  {activeDropdown === 'login_menu_box' && (
                    <>
                      {/* Mobile Backdrop Overlay */}
                      <div
                        className="sm:hidden fixed inset-0 bg-stone-950/30 backdrop-blur-2xs z-90"
                        onClick={() => setActiveDropdown(null)}
                      />

                      <div className="max-sm:fixed max-sm:top-18 max-sm:right-3 max-sm:w-64 max-sm:max-w-[calc(100vw-24px)] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-60 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2 z-100 ring-1 ring-amber-500/10 animate-in fade-in slide-in-from-top-1 duration-150 text-xs font-semibold overflow-hidden">
                        <DecorativeRings variant="card" />
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
                    </>
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

        {/* ================= 2.1 DESKTOP MEGA MENU FULL-WIDTH DROPDOWN (LIKE REFERENCE IMAGE) ================= */}
        {activeGroup && (
          <div
            className="hidden xl:block absolute left-0 right-0 top-full w-full z-50 pt-2 pb-6 px-4 sm:px-6 2xl:px-8 animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setActiveDropdown(activeGroup.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="max-w-350 mx-auto bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-amber-200/90 ring-1 ring-amber-400/20 p-6 sm:p-7 overflow-hidden text-stone-900 transition-all relative">
              {/* Dark Yellow & Purple Multi-Shape Rings */}
              <DecorativeRings variant="dropdown" />
              <div className="grid grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">

                {/* Left Column: Category Overview Card (like Reliance Foundation screenshot) */}
                <div className="col-span-12 lg:col-span-3 bg-linear-to-b from-amber-50/90 via-amber-100/40 to-yellow-50/50 rounded-2xl p-6 border border-amber-200/80 flex flex-col justify-between space-y-4 relative overflow-hidden">
                  <DecorativeRings variant="card" />
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/70 text-amber-950 border border-amber-300">
                      {activeGroup.overview.badge}
                    </span>
                    <h3 className="text-2xl 2xl:text-3xl font-black text-amber-950 tracking-tight leading-tight">
                      {activeGroup.overview.title}
                    </h3>
                    <p className="text-xs 2xl:text-sm text-stone-600 font-medium leading-relaxed">
                      {activeGroup.overview.description}
                    </p>
                  </div>

                  <Link
                    href={activeGroup.overview.ctaHref}
                    onClick={handleDropdownLinkClick}
                    className="inline-flex items-center gap-2 text-xs font-black text-amber-900 hover:text-amber-700 tracking-wider group/cta uppercase pt-2 transition"
                  >
                    <span>{activeGroup.overview.ctaText}</span>
                    <FiArrowRight className="w-4 h-4 text-amber-600 group-hover/cta:translate-x-1.5 transition-transform" />
                  </Link>
                </div>

                {/* Middle Columns: Direct Important Links (Split into 2 Columns with Divider Lines) */}
                <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {activeGroup.columns.map((col, cIdx) => (
                    <div key={cIdx} className="space-y-1">
                      <h4 className="text-[11px] font-black text-amber-900/70 uppercase tracking-wider pb-2 border-b border-amber-100">
                        {col.title}
                      </h4>
                      <div className="space-y-0.5 pt-1">
                        {col.links.map((link) => {
                          const IconComp = link.icon;
                          const clean = link.href.split('#')[0];
                          const isSubActive = clean && clean !== '/' ? pathname === clean : false;

                          return (
                            <Link
                              key={link.href + link.label}
                              href={link.href}
                              onClick={handleDropdownLinkClick}
                              className={`group/item flex items-center justify-between py-2.5 px-2 rounded-xl border-b border-stone-100 hover:border-amber-300 transition-all ${isSubActive
                                ? 'bg-amber-100/70 text-amber-950 font-black'
                                : 'text-stone-800 hover:text-amber-900 hover:bg-amber-50/50'
                                }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${isSubActive
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100/70 text-amber-800 group-hover/item:bg-amber-500 group-hover/item:text-white'
                                    }`}
                                >
                                  {IconComp && <IconComp className="w-3.5 h-3.5" />}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs sm:text-[13px] font-extrabold block truncate">
                                    {link.label}
                                  </span>
                                  {link.desc && (
                                    <span className="text-[10px] text-stone-500 font-medium block truncate">
                                      {link.desc}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <FiChevronRight className="w-4 h-4 text-stone-300 group-hover/item:text-amber-600 group-hover/item:translate-x-1 transition-all shrink-0 ml-1" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Featured Large Information Card (like Reliance Foundation preview in screenshot) */}
                <div className="col-span-12 lg:col-span-3">
                  <div className="h-full bg-linear-to-b from-stone-50 to-amber-50/40 rounded-2xl p-4 border border-amber-200/80 shadow-2xs flex flex-col justify-between group/feat">
                    <div className="space-y-3">
                      {/* Image Banner */}
                      <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-xs border border-amber-200 bg-amber-100">
                        <img
                          src={getContentImageUrl(activeGroup.featured.image)}
                          alt={activeGroup.featured.title}
                          className="w-full h-full object-cover group-hover/feat:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider">
                          {activeGroup.featured.tag}
                        </span>
                      </div>

                      {/* Title & Info */}
                      <div>
                        <h4 className="text-sm font-black text-amber-950 group-hover/feat:text-amber-800 transition">
                          {activeGroup.featured.title}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1 line-clamp-3">
                          {activeGroup.featured.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={activeGroup.featured.link}
                      onClick={handleDropdownLinkClick}
                      className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs text-center border border-amber-300/80 transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>{activeGroup.featured.linkText}</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-amber-800" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= 3. MOBILE RESPONSIVE DRAWER (OFF-CANVAS) ================= */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="xl:hidden fixed inset-0 bg-stone-950/50 backdrop-blur-2xs z-50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="xl:hidden fixed top-0 right-0 h-full w-84 max-w-[88vw] bg-white shadow-2xl z-50 flex flex-col justify-between border-l border-amber-200 animate-in slide-in-from-right duration-200 overflow-hidden">
            <DecorativeRings variant="dropdown" />
            <div className="flex-1 overflow-y-auto relative z-10">
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
                        <span className="font-extrabold">{group.label}</span>
                        <FiChevronDown
                          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-600' : ''
                            }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 pr-2 py-1.5 space-y-2 bg-amber-50/50 rounded-xl my-1">
                          {/* Overview Snippet */}
                          <p className="text-[11px] text-stone-600 italic px-2">
                            {group.overview.description}
                          </p>

                          {group.columns.map((col, cIdx) => (
                            <div key={cIdx} className="space-y-0.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-amber-900/60 px-2 block pt-1">
                                {col.title}
                              </span>
                              {col.links.map((link) => {
                                const IconComp = link.icon;
                                const clean = link.href.split('#')[0];
                                const isSubActive = clean && clean !== '/' ? pathname === clean : false;

                                return (
                                  <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition ${isSubActive
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
                          ))}

                          {/* Featured Mini Card on Mobile */}
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs space-y-1.5 mt-2">
                            <span className="text-[9px] font-black uppercase text-amber-700 block">
                              Featured: {activeGroup?.featured?.tag || group.featured.tag}
                            </span>
                            <h5 className="font-bold text-stone-900 text-xs">
                              {group.featured.title}
                            </h5>
                            <Link
                              href={group.featured.link}
                              onClick={() => setMobileMenuOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline pt-0.5"
                            >
                              <span>{group.featured.linkText}</span>
                              <FiArrowRight className="w-3 h-3 text-amber-600" />
                            </Link>
                          </div>
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
