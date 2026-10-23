'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import HomeCarousel from '@/components/site/HomeCarousel';
import {
  FiUsers,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiArrowRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiActivity,
  FiAward,
  FiClock,
  FiStar,
  FiShield,
  FiCornerDownRight,
  FiMessageSquare,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiBookOpen,
  FiCheck,
  FiX,
  FiPlay,
  FiLock,
  FiFileText,
  FiAlertTriangle
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaHouseChimney,
  FaBowlFood,
  FaHeartPulse,
  FaSpa,
  FaHandHoldingHeart,
  FaMugSaucer,
  FaPills
} from 'react-icons/fa6';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { CardSkeleton, EmptyState } from '@/components/common/SkeletonLoader';
import { getYoutubeVideoId, getYoutubeEmbedUrl, isVideoItem } from '@/lib/youtube';
import api from '@/services/api';
import toast from 'react-hot-toast';

// 5 Pillars directly matching elder care priorities with distinct icons & luxury amber styling
const BANNER_FIVE_PILLARS = [
  {
    id: 'shelter',
    icon: FaHouseChimney,
    gradient: 'from-amber-500 to-yellow-500',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-500 text-stone-950',
    glowColor: 'shadow-amber-500/25',
    title: 'Safe Residential Living',
    desc: 'Senior-tailored rooms, clean bedding, wheelchair campus, and 24/7 dedicated caretaking.',
    link: '/services',
    tag: 'Shelter',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  {
    id: 'food',
    icon: FaBowlFood,
    gradient: 'from-amber-500 to-yellow-400',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-400 text-stone-950',
    glowColor: 'shadow-amber-500/25',
    title: 'Nutritious Satvik Diet',
    desc: '3-times freshly prepared digestible satvik meals tailored for elderly health and digestion.',
    link: '/services',
    tag: 'Nutrition',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  {
    id: 'health',
    icon: FaHeartPulse,
    gradient: 'from-amber-600 to-yellow-500',
    iconBg: 'bg-gradient-to-br from-amber-600 to-yellow-500 text-stone-950',
    glowColor: 'shadow-amber-600/25',
    title: '24/7 Healthcare & Nursing',
    desc: 'Daily vitals monitoring, regular physician visits, free medicines & ambulance on standby.',
    link: '/services',
    tag: 'Healthcare',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  {
    id: 'mental',
    icon: FaSpa,
    gradient: 'from-yellow-500 to-amber-500',
    iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-500 text-stone-950',
    glowColor: 'shadow-yellow-500/25',
    title: 'Yoga, Satsang & Wellbeing',
    desc: 'Morning light yoga, devotional kirtan, spiritual satsang & library for peace of mind.',
    link: '/who-we-are',
    tag: 'Wellness',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  {
    id: 'dignity',
    icon: FaHandHoldingHeart,
    gradient: 'from-amber-500 to-yellow-500',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-500 text-stone-950',
    glowColor: 'shadow-amber-500/25',
    title: 'Dignity & Family Warmth',
    desc: 'Embracing every elder as a revered family member with loving celebration of festivals.',
    link: '/donation',
    tag: 'Family Love',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-300',
  },
];

function HomeClientContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinEventId = searchParams.get('joinEventId');

  const {
    settings,
    gallery,
    feedbacks,
    campaigns,
    events,
    services,
    members,
    teamMembers,
    currentUser,
    sponsorships,
    awards,
    loading
  } = useNGO();

  const [reviewIdx, setReviewIdx] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Event join states
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [joiningEventId, setJoiningEventId] = useState(null);

  // Strictly real data only (no mock fallbacks)
  const activeCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const activeEvents = Array.isArray(events) ? events : [];
  const activeGallery = Array.isArray(gallery) ? gallery : [];
  const activeServices = Array.isArray(services) ? services : [];
  const activeSponsorships = Array.isArray(sponsorships) ? sponsorships : [];
  const activeAwards = Array.isArray(awards)
    ? awards.filter((a) => (a.isOrgAward || Boolean(a.awardedBy)) && a.isActive !== false)
    : [];

  // Initialize joined events for current user
  useEffect(() => {
    if (!currentUser || !Array.isArray(events)) return;
    const joined = new Set();
    events.forEach((evt) => {
      const eId = evt._id || evt.id;
      const isAttending = evt.attendees?.some((att) =>
        (att.user && att.user === currentUser.id) ||
        (att.email && att.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
        (att.phone && att.phone === currentUser.phone)
      );
      if (isAttending) joined.add(eId);
    });
    setJoinedEventIds(joined);
  }, [currentUser, events]);

  // Handle URL joinEventId (after login/register redirect)
  useEffect(() => {
    if (joinEventId && currentUser && !joinedEventIds.has(joinEventId)) {
      handleJoinEvent(joinEventId);
    }
  }, [joinEventId, currentUser]);

  const handleJoinEvent = async (eId) => {
    if (!currentUser) {
      const redirectUrl = `/?joinEventId=${eId}#event-${eId}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    try {
      setJoiningEventId(eId);
      const res = await api.post(`/events/${eId}/join`, {
        name: currentUser.name || 'Verified Member',
        email: currentUser.email,
        phone: currentUser.phone || '9999999999',
        message: 'Joined from Homepage'
      });
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setJoinedEventIds((prev) => new Set([...prev, eId]));
        toast.success('Successfully registered for the event!');
      } else {
        toast.error(res.data?.message || 'Could not register for event.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to join event.';
      if (msg.toLowerCase().includes('already registered')) {
        setJoinedEventIds((prev) => new Set([...prev, eId]));
        toast.success('You are already registered for this event!');
      } else {
        toast.error(msg);
      }
    } finally {
      setJoiningEventId(null);
    }
  };

  // Filtered gallery
  const filteredGallery = galleryFilter === 'all'
    ? activeGallery
    : activeGallery.filter((item) => {
      const cat = (item.category || '').toLowerCase();
      const target = galleryFilter.toLowerCase();
      if (target.includes('video')) {
        return isVideoItem(item) || cat.includes('video');
      }
      return cat === target || cat.includes(target);
    });

  // Testimonials list
  const approvedReviews = Array.isArray(feedbacks)
    ? feedbacks.filter((f) => (f.status || 'Approved').toLowerCase() === 'approved')
    : [];

  // Active team members list
  const activeMembersList = (teamMembers && teamMembers.length > 0)
    ? teamMembers.slice(0, 8)
    : (members && Array.isArray(members) ? members.slice(0, 8) : []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdfa] text-slate-800 font-sans selection:bg-amber-500 selection:text-white">

      {/* ================= 1. BANNERS (HERO CAROUSEL) ================= */}
      <section className="relative">
        <HomeCarousel slides={settings?.heroSlides} />
      </section>

      {/* ================= 1.5 FIVE PILLARS FEATURE BAR (MATCHING BANNER.JPG) ================= */}
      <section className="relative -mt-6 sm:-mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-950/8 border-2 border-amber-300/80 p-4 sm:p-5 lg:p-6 overflow-hidden ring-1 ring-amber-400/20">
          {/* Top glowing ambient accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400 to-transparent" />

          {/* Five Pillars Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {BANNER_FIVE_PILLARS.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <Link
                  key={pillar.id}
                  href={pillar.link}
                  className="group relative bg-white hover:bg-linear-to-b hover:from-white hover:to-amber-50/40 rounded-2xl p-4 sm:p-4.5 border border-amber-200/90 hover:border-amber-400 shadow-xs hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`w-11 h-11 rounded-2xl ${pillar.iconBg} flex items-center justify-center shadow-md shadow-amber-950/10 ring-2 ring-white/90 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}
                      >
                        <IconComponent className="w-5 h-5 text-stone-950" />
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${pillar.tagBg}`}
                      >
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="font-black text-stone-900 group-hover:text-amber-800 text-xs sm:text-sm leading-snug tracking-tight transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] text-stone-600 mt-1.5 leading-relaxed line-clamp-2 font-medium">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="relative z-10 pt-3 mt-3 border-t border-amber-100 group-hover:border-amber-200/80 flex items-center justify-between text-[11px] font-bold transition-colors">
                    <span className="text-amber-900 group-hover:text-amber-950 group-hover:underline">Learn More</span>
                    <span className="w-5 h-5 rounded-full bg-amber-100/80 group-hover:bg-amber-500 group-hover:text-stone-950 text-amber-800 flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-0.5">
                      <FiArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Seva Instant Contribution Bar */}
          <div className="mt-5 pt-4 border-t border-amber-300/70 flex flex-col xl:flex-row items-center justify-between gap-4 bg-linear-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 rounded-2xl p-4 sm:p-4.5 shadow-inner">
            <div className="flex items-center gap-3.5 text-left w-full xl:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center shadow-md shadow-amber-500/30 ring-2 ring-white shrink-0">
                <FaHandHoldingHeart className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-stone-950 tracking-tight">
                    Quick Seva Support • 1-Click Contribution
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                    <FiShield className="w-3 h-3 text-emerald-700" />
                    <span>80G Tax Exempt</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                  Support 1 day meals, essential medicines, or shelter for our resident elders
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start xl:justify-end gap-2 w-full xl:w-auto">
              {[
                { amt: 500, label: 'Breakfast', icon: FaMugSaucer },
                { amt: 1100, label: 'Medicines', icon: FaPills },
                { amt: 2100, label: 'Nutritious Meals', icon: FaBowlFood },
                { amt: 5100, label: 'Tithi Bhoj', icon: FaSpa },
                { amt: 11000, label: 'Complete Shelter', icon: FaHouseChimney },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.amt}
                    href={`/donation?amount=${item.amt}`}
                    className="px-3.5 py-2 rounded-xl border border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-100/80 text-stone-900 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs hover:shadow-md flex items-center gap-1.5 group cursor-pointer"
                  >
                    <ItemIcon className="w-3.5 h-3.5 text-amber-700 group-hover:text-stone-950 transition-colors" />
                    <span className="font-black text-stone-950">₹{item.amt.toLocaleString('en-IN')}</span>
                    <span className="text-stone-600 text-[11px] font-medium hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/donation"
                className="px-4.5 py-2 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 text-xs font-black shadow-md shadow-amber-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Custom Amount</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. ABOUT US SECTION ================= */}
      <section id="about-section" className="py-14 sm:py-20 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiHeart className="w-3.5 h-3.5 text-amber-700" />
              <span>Sanctuary of Compassion &amp; Dignity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              About <span className="text-amber-700">Apna Ghar Ashram</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              A loving sanctuary dedicated to elderly care, lifelong dignity, medical support, and genuine family atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Visual Story Card & Seal */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-card-subtle border border-amber-200 bg-slate-100 group">
                <img
                  src="/banner.jpg"
                  alt="Apna Ghar Ashram Foundation"
                  className="w-full h-72 sm:h-88 object-cover group-hover:scale-103 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider w-max mb-2 shadow-xs">
                    Elder Service is Divine Service
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                    Apna Ghar Vriddh Ashram
                  </h3>
                  <p className="text-xs text-amber-200 font-medium mt-1">
                    Where Every Senior is Family • Adhartal, Jabalpur (M.P.)
                  </p>
                </div>
              </div>

              {/* Impact Metric Cards under photo */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300">
                  <div className="text-xl sm:text-2xl font-black text-amber-950">200+</div>
                  <div className="text-[10px] font-bold text-stone-600 mt-0.5">Elders Supported</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300">
                  <div className="text-xl sm:text-2xl font-black text-amber-800">100%</div>
                  <div className="text-[10px] font-bold text-stone-600 mt-0.5">80G Tax Exemption</div>
                </div>
                <div className="p-3 rounded-xl bg-yellow-50/80 border border-yellow-300">
                  <div className="text-xl sm:text-2xl font-black text-amber-900">24x7</div>
                  <div className="text-[10px] font-bold text-stone-600 mt-0.5">Healthcare Care</div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative, Mission, Vision & Compliance */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Providing <span className="text-amber-700">Dignity, Care &amp; Family</span> to Every Senior Citizen
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-normal leading-relaxed">
                  {settings?.aboutStory ||
                    'Apna Parivar Vriddh Aashram Foundation operates in Jabalpur (Madhya Pradesh) with a steadfast commitment to providing dignity, safety, and familial affection to helpless, destitute, and senior citizens. Our mission ensures no elderly individual feels abandoned or lonely at this stage of life. We provide 24/7 medical care, nutritious satvik meals, safe shelter, and emotional companionship.'}
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 transition shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                      <FiHeart className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950">Our Mission</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {settings?.aboutMissionSummary ||
                      'Providing destitute senior citizens with safe shelter, nutritious satvik meals, 24/7 healthcare access, and the warmth and respect of a caring family.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 hover:border-amber-400 transition shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-amber-700 to-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <FiShield className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950">Our Vision</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {settings?.aboutVisionSummary ||
                      'A society where no elderly individual faces helplessness or isolation in their twilight years, living instead with dignity, joy, and peace.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition transform hover:scale-102"
                >
                  <span>Read Full Story</span>
                  <FiArrowRight className="w-3.5 h-3.5 text-stone-950" />
                </Link>

                <Link
                  href="/who-we-are"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-amber-50/60 text-stone-800 border border-amber-300 font-bold text-xs transition"
                >
                  <span>How We Work</span>
                </Link>

                <Link
                  href="/certificates"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline px-2 py-2 ml-auto"
                >
                  <FiFileText className="w-3.5 h-3.5" />
                  <span>View Certificates</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 4. CROWDFUNDING & CAMPAIGNS SECTION ================= */}
      <section id="campaigns-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiHeart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
              <span>Support &amp; Humanitarian Drives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Crowdfunding &amp; <span className="text-amber-700">Campaigns</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Your compassion provides nutritious meals, medical therapies, and loving shelter to destitute elderly citizens. All contributions are 80G tax-exempt.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={4} />
          ) : activeCampaigns.length === 0 ? (
            <EmptyState itemName="Campaigns" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeCampaigns.slice(0, 4).map((cmp, idx) => {
                const cId = cmp._id || cmp.id || idx;
                const title = cmp.title || 'Elder Care Drive';
                const target = cmp.targetAmount || cmp.goalAmount || 100000;
                const raised = cmp.raisedAmount || 0;
                const pct = Math.min(100, Math.round((raised / target) * 100));
                const imgUrl = getContentImageUrl(cmp.imageUrl || cmp.image || cmp.bannerImage) || '/banner.jpg';

                return (
                  <div
                    key={cId}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                        <img
                          src={imgUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/banner.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-amber-700 shadow-sm">
                            {cmp.category || 'Elder Care'}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                          <span>{cmp.donorsCount || 0} Donors</span>
                          <span className="text-amber-300 font-mono">{pct}% Funded</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-800 line-clamp-2 leading-snug">
                          {title}
                        </h4>

                        <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          <MarkdownRenderer content={cmp.subtitle || cmp.description} />
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-yellow-400 via-amber-500 to-amber-600 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold pt-0.5">
                            <span className="text-slate-500">Goal: ₹{Number(target).toLocaleString('en-IN')}</span>
                            <span className="text-amber-950 font-mono font-black">₹{Number(raised).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <Link
                          href={`/campaigns/${cId}`}
                          className="text-amber-800 font-bold hover:underline text-xs flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <FiArrowRight className="w-3.5 h-3.5 text-amber-600" />
                        </Link>
                        <span className="text-[10px] text-emerald-700 font-bold">80G Tax-Exempt</span>
                      </div>

                      <Link
                        href={`/donation?campaign=${encodeURIComponent(title)}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition group-hover:scale-102"
                      >
                        <FiHeart className="w-3.5 h-3.5 fill-stone-950" />
                        <span>Donate Now (80G Benefit)</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-amber-50 border border-amber-300 text-xs font-black text-amber-950 transition shadow-2xs hover:shadow-md"
            >
              <span>Explore All Campaigns &amp; Relief Drives</span>
              <FiArrowRight className="w-4 h-4 text-amber-700" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 5. EVENTS SECTION ================= */}
      <section id="events-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiCalendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Aashram Gatherings &amp; Welfare Camps</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Events &amp; <span className="text-amber-700">Programs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Join our healthcare camps, spiritual satsangs, festival celebrations, and honorary community programs for senior residents.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={3} />
          ) : activeEvents.length === 0 ? (
            <EmptyState itemName="Events" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeEvents.slice(0, 3).map((evt, idx) => {
                const eId = evt._id || evt.id || idx;
                const title = evt.title || 'Aashram Event';
                const date = evt.date || 'Upcoming Date';
                const loc = evt.location || 'Apna Parivar Vriddh Aashram, Jabalpur';
                const rawImg = evt.imageUrl || evt.image || (Array.isArray(evt.images) && evt.images[0]) || '/banner.jpg';
                const imgUrl = getContentImageUrl(rawImg) || '/banner.jpg';
                const isJoined = joinedEventIds.has(eId);

                return (
                  <div
                    key={eId}
                    id={`event-${eId}`}
                    className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-200">
                        <img
                          src={imgUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/banner.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-950 bg-linear-to-tr from-amber-500 to-yellow-400 shadow-sm">
                            {evt.category || 'Welfare Camp'}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                            <FiCalendar className="w-3.5 h-3.5" />
                            <span>{date}</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-black text-sm text-slate-900 group-hover:text-amber-800 line-clamp-2 leading-snug">
                          {title}
                        </h4>
                        <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          <MarkdownRenderer content={evt.description || 'Special welfare gathering for resident elders.'} />
                        </div>

                        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <FiMapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="line-clamp-1">{loc}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2 gap-2">
                      <Link
                        href={`/event/${eId}`}
                        className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <FiArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      </Link>

                      {isJoined ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-2xs">
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Joined ✓</span>
                        </span>
                      ) : currentUser ? (
                        <button
                          type="button"
                          onClick={() => handleJoinEvent(eId)}
                          disabled={joiningEventId === eId}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 text-xs font-black shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          <FiUsers className="w-3.5 h-3.5 text-stone-950" />
                          <span>{joiningEventId === eId ? 'Joining...' : 'Join Event'}</span>
                        </button>
                      ) : (
                        <Link
                          href={`/login?redirect=${encodeURIComponent(`/?joinEventId=${eId}#event-${eId}`)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:border-amber-500 text-stone-900 text-xs font-bold transition shadow-2xs hover:bg-amber-50"
                        >
                          <FiLock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Login to Join</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/event"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-amber-50 border border-amber-300 text-xs font-black text-amber-950 transition shadow-2xs hover:shadow-md"
            >
              <span>Explore All Events &amp; Programs</span>
              <FiArrowRight className="w-4 h-4 text-amber-700" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 6. SERVICES SECTION ================= */}
      <section id="services-section" className="py-16 sm:py-20 bg-[#fffdf5] border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiAward className="w-3.5 h-3.5 text-amber-700" />
              <span>360° Comprehensive Senior Care</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Our Services &amp; <span className="text-amber-700">Elder Care Facilities</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              We provide more than shelter—we enrich the golden years with comprehensive care, nutritious meals, and genuine family love.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={3} />
          ) : activeServices.length === 0 ? (
            <EmptyState itemName="Services & Facilities" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeServices.slice(0, 6).map((srv, idx) => {
                const sId = srv._id || srv.id || idx;
                const title = srv.title || srv.titleHi || 'Elder Care Service';
                const desc = srv.description || srv.desc || 'Comprehensive elderly care facility provided with highest compassion.';
                const rawImg = srv.image || srv.imageUrl || (Array.isArray(srv.images) && srv.images[0]) || '/banner.jpg';
                const imgUrl = getContentImageUrl(rawImg) || '/banner.jpg';

                return (
                  <div
                    key={sId}
                    className="bg-white rounded-3xl border border-amber-200/90 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-amber-50">
                        <img
                          src={imgUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/banner.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-950 bg-linear-to-tr from-amber-400 to-yellow-300 shadow-sm">
                            Elder Care Facility
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                            {title}
                          </h4>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
                          <MarkdownRenderer content={desc} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-amber-100 flex items-center justify-between mt-2">
                      <Link
                        href={`/services/${sId}`}
                        className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 group-hover:underline"
                      >
                        <span>Explore Facilities</span>
                        <FiChevronRight className="w-3.5 h-3.5 text-amber-600" />
                      </Link>

                      <Link
                        href="/donation"
                        className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-[11px] shadow-sm transition group-hover:scale-102"
                      >
                        Sponsor Care
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition transform hover:scale-105"
            >
              <span>Explore All 5 Core Pillars &amp; Facilities</span>
              <FiArrowRight className="w-4 h-4 text-stone-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 7. PHOTO & VIDEO GALLERY ================= */}
      <section id="gallery-section" className="py-16 sm:py-20 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiEye className="w-3.5 h-3.5 text-amber-700" />
              <span>Moments &amp; Media Archives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Photo &amp; <span className="text-amber-700">Video Gallery</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Heartwarming glimpses of everyday aashram life, medical care, spiritual celebrations, and video recordings.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'Elder Care', label: 'Elder Care & Living' },
                { id: 'Satvik', label: 'Satvik Meals' },
                { id: 'Healthcare', label: 'Health Camps' },
                { id: 'Satsang', label: 'Satsang & Festivals' },
                { id: 'video', label: 'Videos & YouTube' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGalleryFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${galleryFilter === tab.id
                    ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                    : 'bg-amber-50 hover:bg-amber-100/80 text-stone-800'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Media Grid */}
          {loading ? (
            <CardSkeleton count={4} />
          ) : filteredGallery.length === 0 ? (
            <EmptyState itemName="Gallery Items" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.slice(0, 8).map((item, idx) => {
                const isVid = isVideoItem(item);
                const raw = item.url || item.imageUrl || '/banner.jpg';
                const pUrl = getContentImageUrl(raw) || '/banner.jpg';
                const pTitle = item.title || 'Apna Parivar Vriddh Aashram';
                const videoUrl = item.videoUrl || item.url || '';
                const ytId = getYoutubeVideoId(videoUrl);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (ytId) {
                        setSelectedMedia({
                          type: 'youtube',
                          embedUrl: getYoutubeEmbedUrl(videoUrl, true),
                          title: pTitle
                        });
                      } else if (isVid) {
                        setSelectedMedia({
                          type: 'video',
                          url: videoUrl || pUrl,
                          title: pTitle
                        });
                      } else {
                        setSelectedMedia({
                          type: 'image',
                          url: pUrl,
                          title: pTitle
                        });
                      }
                    }}
                    className="group relative aspect-4/3 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-200 bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={pUrl}
                      alt={pTitle}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/banner.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Video Badge Overlay */}
                    {isVid && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <FiPlay className="w-2.5 h-2.5 fill-white" />
                        <span>{ytId ? 'YouTube' : 'Video'}</span>
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <p className="text-[11px] font-bold leading-tight line-clamp-1 drop-shadow-sm">
                        {pTitle}
                      </p>
                    </div>

                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 group-hover:bg-amber-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isVid ? <FiPlay className="w-3.5 h-3.5 fill-white" /> : <FiEye className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition"
            >
              <span>View Full Photo &amp; Video Gallery</span>
              <FiArrowRight className="w-4 h-4 text-stone-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* Lightbox Modal for Photo / Video / YouTube */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
            >
              <FiX className="w-6 h-6" />
            </button>

            {selectedMedia.type === 'youtube' ? (
              <div className="aspect-video w-full">
                <iframe
                  src={selectedMedia.embedUrl}
                  title={selectedMedia.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full h-full max-h-[80vh] object-contain"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
              />
            )}

            <div className="p-4 bg-stone-950/90 text-white flex items-center justify-between">
              <span className="text-xs font-black truncate">{selectedMedia.title}</span>
              <span className="text-[11px] text-amber-300 font-bold uppercase">{selectedMedia.type}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 8. OUR DEDICATED TEAM MEMBERS ================= */}
      <section id="members-section" className="py-16 sm:py-20 bg-slate-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiUsers className="w-3.5 h-3.5 text-amber-700" />
              <span>Compassionate Care Family</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Our Dedicated <span className="text-amber-700">Team Members</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Meet the selfless trustees, honorary physicians, and dedicated caretakers serving our resident elders every single day.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={4} />
          ) : activeMembersList.length === 0 ? (
            <EmptyState itemName="Official Members" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeMembersList.map((mem, idx) => {
                const mName = mem.name || 'Member Official';
                const mRole = mem.role || mem.designation || 'Registered Member';
                const mImg = getContentImageUrl(mem.image || mem.photoUrl || mem.profilePicture) || '/logo.jpg';
                const isExpired = Boolean(
                  mem.isExpired ||
                  mem.membershipStatus === 'expired' ||
                  mem.status === 'expired' ||
                  (mem.membershipExpiresAt && new Date(mem.membershipExpiresAt).getTime() < Date.now())
                );

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl p-5 text-center shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group ${
                      isExpired
                        ? 'border-2 border-rose-300/80 hover:border-rose-500 bg-rose-50/10'
                        : 'border border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 p-1 bg-white shadow-md mb-4 overflow-hidden group-hover:scale-105 transition-transform ${
                        isExpired ? 'border-rose-400 grayscale-30' : 'border-amber-400/80'
                      }`}>
                        <img
                          src={mImg}
                          alt={mName}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                      </div>

                      <h4 className="font-black text-sm text-slate-900 group-hover:text-amber-800">
                        {mName}
                      </h4>
                      <p className="text-[11px] font-bold text-amber-800 mt-1">
                        {mRole}
                      </p>
                    </div>

                    {isExpired ? (
                      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 py-1 rounded-full">
                        <FiAlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Expired Member</span>
                      </div>
                    ) : (
                      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1 rounded-full">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Official Member</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/apply-member"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 text-xs font-black shadow-md shadow-amber-500/25 transition"
            >
              <span>Become a Member (ID Card)</span>
            </Link>
            <Link
              href="/team-members"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-amber-50/60 text-stone-800 border border-amber-300 text-xs font-bold transition"
            >
              <span>View Full Team Directory</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 9. CORPORATE SPONSORSHIPS & CSR PARTNERS ================= */}
      <section id="sponsorships-section" className="py-16 sm:py-20 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-amber-700" />
              <span>Corporate Social Responsibility (CSR)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Corporate Partnerships &amp; <span className="text-amber-700">Sponsorships</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Distinguished institutional partners and corporate patrons powering dignified living, healthcare, and nourishment for our senior residents.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={4} />
          ) : activeSponsorships.length === 0 ? (
            <EmptyState itemName="Corporate Sponsorships & Partners" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeSponsorships.map((spon, idx) => {
                const sId = spon._id || spon.id || idx;
                const logo = getContentImageUrl(spon.logoUrl || spon.logo) || '/logo.jpg';
                const orgName = spon.organizationName || 'Corporate Partner';
                const tier = spon.tier || 'CSR Partner';
                const supportType = spon.supportType || 'Elder Care Support';

                return (
                  <div
                    key={sId}
                    className="bg-amber-50/30 rounded-3xl p-6 border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-24 w-full flex items-center justify-center p-3 bg-white rounded-2xl border border-amber-200/70 shadow-xs mb-4 overflow-hidden">
                        <img
                          src={logo}
                          alt={orgName}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                            {tier}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {supportType}
                          </span>
                        </div>

                        <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-800 leading-snug">
                          {orgName}
                        </h3>

                        {spon.title && (
                          <p className="text-xs font-semibold text-amber-900">
                            {spon.title}
                          </p>
                        )}

                        {spon.description && (
                          <div className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            <MarkdownRenderer content={spon.description} />
                          </div>
                        )}
                      </div>
                    </div>

                    {spon.websiteUrl && (
                      <div className="pt-4 mt-3 border-t border-amber-200/60">
                        <a
                          href={spon.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
                        >
                          <span>Visit Partner Website</span>
                          <FiExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition"
            >
              <span>Partner With Us Under CSR</span>
              <FiArrowRight className="w-4 h-4 text-stone-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 10. ORGANIZATION AWARDS & HONORS ================= */}
      <section id="awards-section" className="py-16 sm:py-20 bg-slate-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiAward className="w-3.5 h-3.5 text-amber-700" />
              <span>Excellence &amp; Accreditations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Organization Awards &amp; <span className="text-amber-700">Honors</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              National recognitions, citations, and awards conferred to Apna Parivar Vriddh Aashram Foundation.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={3} />
          ) : activeAwards.length === 0 ? (
            <EmptyState itemName="Organization Awards & Accreditations" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAwards.map((award, idx) => {
                const aId = award._id || award.id || idx;
                const img = getContentImageUrl(award.awardImage || award.certificateUrl || award.image) || '/logo.jpg';
                const aTitle = award.title || 'National Excellence Award';
                const awardedBy = award.awardedBy || 'Government / Social Body';
                const year = award.year || '2025-2026';

                return (
                  <div
                    key={aId}
                    className="bg-white rounded-3xl overflow-hidden border border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-52 bg-slate-100 overflow-hidden">
                        <img
                          src={img}
                          alt={aTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-950 bg-linear-to-tr from-amber-400 to-yellow-300 shadow-sm flex items-center gap-1.5">
                            <FiAward className="w-3 h-3 text-amber-900" />
                            <span>{year}</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-2.5">
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block">
                          Conferred By: {awardedBy}
                        </span>
                        <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 leading-snug">
                          {aTitle}
                        </h3>
                        {award.description && (
                          <div className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            <MarkdownRenderer content={award.description} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span>Verified Honor</span>
                      </span>
                      <Link
                        href="/certificates"
                        className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <span>Verify Certificate</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-amber-50 border border-amber-300 text-xs font-black text-amber-950 transition shadow-2xs hover:shadow-md"
            >
              <span>View All Accreditations &amp; Citations</span>
              <FiArrowRight className="w-4 h-4 text-amber-700" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 11. TESTIMONIALS (Reviews & Blessings) ================= */}
      <section id="feedback-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Voices of Compassion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Testimonials &amp; <span className="text-amber-700">Blessings</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Real reflections and reviews from families, donors, and patrons who have experienced the warmth of our aashram.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={1} />
          ) : approvedReviews.length === 0 ? (
            <EmptyState itemName="Testimonials & Reviews" />
          ) : (
            <div className="relative pt-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="w-20 h-20 rounded-full border-4 border-amber-400 p-1 bg-white shadow-xl overflow-hidden flex items-center justify-center">
                  {approvedReviews[reviewIdx]?.profilePicture ? (
                    <img
                      src={getContentImageUrl(approvedReviews[reviewIdx].profilePicture)}
                      alt={approvedReviews[reviewIdx]?.name || 'User'}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-linear-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center font-black text-xl">
                      {approvedReviews[reviewIdx]?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </div>

              {/* Testimonial Box */}
              <div className="relative bg-amber-50/20 rounded-3xl pt-14 pb-8 px-6 sm:px-12 border border-amber-200/80 shadow-sm text-center">
                {approvedReviews.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setReviewIdx((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length)}
                      className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-amber-50 hover:bg-amber-500 hover:text-stone-950 text-stone-700 flex items-center justify-center transition shadow-2xs cursor-pointer border border-amber-200"
                      aria-label="Previous Review"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewIdx((prev) => (prev + 1) % approvedReviews.length)}
                      className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-amber-50 hover:bg-amber-500 hover:text-stone-950 text-stone-700 flex items-center justify-center transition shadow-2xs cursor-pointer border border-amber-200"
                      aria-label="Next Review"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="max-w-xl mx-auto space-y-3">
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-1">
                      ({approvedReviews[reviewIdx]?.rating || 5}.0)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed px-2">
                    “{approvedReviews[reviewIdx]?.comment || 'Witnessing the loving care and dignity provided to the elders here fills the heart with pure peace. May this noble mission continue to touch many lives.'}”
                  </p>

                  <div>
                    <h4 className="text-sm font-black text-amber-950">
                      {approvedReviews[reviewIdx]?.name || 'Anonymous Supporter'}
                    </h4>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold mt-0.5">
                      {approvedReviews[reviewIdx]?.role || 'Dedicated Supporter'}
                    </span>
                  </div>

                  {approvedReviews[reviewIdx]?.adminReply && (
                    <div className="mt-4 bg-linear-to-br from-amber-50/80 to-yellow-50/40 p-3.5 rounded-2xl border border-amber-200 text-left space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                        <FiShield className="w-3.5 h-3.5 text-amber-700" />
                        <span>Official Response: {approvedReviews[reviewIdx]?.repliedBy || 'Management Desk'}</span>
                      </div>
                      <div className="flex items-start gap-2 pl-1">
                        <FiCornerDownRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {approvedReviews[reviewIdx].adminReply}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href="/feedback"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
                    >
                      <FiMessageSquare className="w-3.5 h-3.5" />
                      <span>Share Your Experience / View All Reviews</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================= 12. ANNUAL REPORTS & STATUTORY DISCLOSURES ================= */}
      <section id="annual-reports" className="py-16 sm:py-20 bg-slate-50 border-b border-amber-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Center Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-amber-700" />
              <span>Statutory Audits &amp; Financial Integrity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Annual Reports &amp; <span className="text-amber-700">Financial Disclosures</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Every single rupee contributed goes directly to the healthcare, meals, and dignity of our senior residents. Explore our audited disclosures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Annual Activity Report (2024–25)',
                subtitle: 'Comprehensive chronicle of senior resident care, healthcare milestones, and infrastructure expansions.',
                badge: 'Annual Report',
                link: '/certificates',
                tag: 'Full Narrative'
              },
              {
                title: 'Audited Financial Statements (CA Certified)',
                subtitle: 'Meticulously audited balance sheets, income & expenditure statements, and Form 10BD filings.',
                badge: 'Financial Audit',
                link: '/certificates',
                tag: 'Audited'
              },
              {
                title: 'Section 80G Tax Exemption Order',
                subtitle: 'Government of India Income Tax exemption order granting 50% tax deduction on all donor contributions.',
                badge: 'CIT 80G Approval',
                link: '/certificates',
                tag: 'Tax Exemption'
              },
              {
                title: 'Trust Registration Section 12A',
                subtitle: 'Perpetual registration order as an official non-profit charitable trust dedicated to destitute elder welfare.',
                badge: 'Section 12A',
                link: '/certificates',
                tag: 'Legal Trust'
              },
              {
                title: 'Ministry of Corporate Affairs CSR-1 Approval',
                subtitle: 'Official registration with the Ministry of Corporate Affairs for statutory Corporate Social Responsibility grants.',
                badge: 'CSR-1 Registered',
                link: '/certificates',
                tag: 'CSR Eligible'
              },
              {
                title: 'NITI Aayog Darpan Transparency Certification',
                subtitle: 'Government portal verification and unique NGO Darpan ID ensuring public accountability and compliance.',
                badge: 'NITI Aayog',
                link: '/certificates',
                tag: 'Govt Portal'
              }
            ].map((rep, rIdx) => (
              <div
                key={rIdx}
                className="bg-white rounded-3xl p-6 border border-amber-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                      {rep.badge}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {rep.tag}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 leading-snug">
                    {rep.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {rep.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={rep.link}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 hover:text-amber-950 group-hover:underline"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span>Download / View</span>
                  </Link>

                  <span className="text-[10px] text-stone-400 font-mono">PDF Verified</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition"
            >
              <span>View All Statutory Accreditations &amp; Certificates</span>
              <FiArrowRight className="w-4 h-4 text-stone-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= ORGANIZATION AWARDS & HONORS RECEIVED ================= */}
      {activeAwards.length > 0 && (
        <section id="awards" className="py-16 sm:py-20 bg-linear-to-b from-[#fffdf5] via-[#fefce8] to-[#fffdf5] border-b border-amber-200/80 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-linear-to-tr from-amber-400 to-yellow-300 text-stone-950 font-black text-xs uppercase tracking-wider shadow-xs">
                <FiAward className="w-3.5 h-3.5 text-stone-950" />
                <span>Honors &amp; Recognitions</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight">
                Awards Received by Apna Parivar Vriddh Aashram
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                National, state, and humanitarian awards conferred upon our foundation for exemplary elder care and selfless social service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAwards.map((awd, idx) => (
                <div
                  key={awd._id || awd.id || idx}
                  className="bg-white rounded-3xl p-6 border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                        {awd.tier || "Honor"}
                      </span>
                      {awd.year && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {awd.year}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-4">
                      {awd.awardImage || awd.image ? (
                        <img
                          src={getContentImageUrl(awd.awardImage || awd.image)}
                          alt={awd.title}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center font-bold text-2xl shadow-md border-2 border-amber-200 shrink-0">
                          <FiAward className="w-8 h-8" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-base text-stone-950 group-hover:text-amber-900 leading-snug">
                          {awd.title}
                        </h3>
                        {awd.awardedBy && (
                          <p className="text-xs font-bold text-amber-800 mt-1">
                            Conferred by: {awd.awardedBy}
                          </p>
                        )}
                        <span className="inline-block text-[10px] font-bold text-stone-500 uppercase mt-0.5">
                          {awd.category || "Elder Welfare & Social Service"}
                        </span>
                      </div>
                    </div>

                    {awd.description && (
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">
                        {awd.description}
                      </p>
                    )}
                  </div>

                  {awd.certificateUrl && (
                    <div className="pt-4 mt-4 border-t border-amber-100 flex items-center justify-between">
                      <a
                        href={getContentImageUrl(awd.certificateUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 hover:text-amber-950 group-hover:underline"
                      >
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span>View Official Citation / Certificate</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 13. LOCATION & MAP ================= */}
      <section id="locate-us" className="py-16 sm:py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Contact Details Card (Col 5) */}
            <div className="lg:col-span-5 space-y-5 bg-amber-50/30 p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs">
                <FiMapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Visit &amp; Connect With Us</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Visit Our Elders &amp; Receive Their Blessings
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">Main Aashram Address:</strong>
                    <span className="text-slate-600 leading-relaxed">
                      {settings?.address || 'Behind Adhartal Railway Station, Adhartal, Jabalpur, Madhya Pradesh - 482001'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">24x7 Elder Helpline:</strong>
                    <a
                      href={`tel:${settings?.phone || '+918959055269'}`}
                      className="text-amber-950 font-black hover:underline"
                    >
                      {settings?.phone || '+91 8959055269'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">Visiting Hours:</strong>
                    <span className="text-slate-600">9:00 AM to 6:00 PM (All 7 Days Open)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">Official Email:</strong>
                    <a
                      href={`mailto:${settings?.email || 'info@apnaparivarvriddhaashram.org'}`}
                      className="text-slate-600 hover:text-amber-800 hover:underline"
                    >
                      {settings?.email || 'info@apnaparivarvriddhaashram.org'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${settings?.phone || '+918959055269'}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 text-xs font-black transition shadow-xs"
                >
                  <FiPhone className="w-3.5 h-3.5" />
                  <span>Call Directly</span>
                </a>

                <a
                  href={`https://wa.me/${(settings?.whatsapp || '918959055269').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Interactive Map (Col 7) */}
            <div className="lg:col-span-7 h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-amber-300 ring-4 ring-amber-100 shadow-md bg-slate-200">
              <iframe
                title="Apna Parivar Vriddh Aashram Location Map Jabalpur"
                src={
                  settings?.googleMapEmbed ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117387.89!2d79.88!3d23.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a0fb6cb7d%3A0x6b10b7849e79d7e0!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000'
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 14. INSPIRING VOLUNTEER & CTA BANNER ================= */}
      <section className="py-14 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-stone-950/15 backdrop-blur-md border border-stone-950/20 text-stone-950 text-xs font-black uppercase tracking-wider">
            Building a Dignified &amp; Loving Tomorrow for Every Elder...
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-stone-950 drop-shadow-xs">
            Your Compassion Brings Light to an Elder’s Life
          </h2>

          <p className="text-xs sm:text-base text-stone-900 max-w-2xl mx-auto font-medium leading-relaxed">
            Whether you sponsor monthly nutrition, celebrate special occasions with a Tithi Bhoj meal, or volunteer your time—every small act of kindness brings warmth and joy to senior lives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/donation"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-950 hover:bg-stone-900 text-amber-300 font-black text-xs sm:text-sm shadow-xl shadow-stone-950/30 transform hover:scale-105 transition-all"
            >
              <FiHeart className="w-4 h-4 fill-amber-300" />
              <span>Donate Now (80G Tax Exemption Included)</span>
            </Link>

            <Link
              href="/apply-volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-stone-950 border border-amber-300 font-bold text-xs sm:text-sm backdrop-blur-md transition shadow-md"
            >
              <FiUsers className="w-4 h-4 text-amber-700" />
              <span>Become a Volunteer</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function HomeClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] flex items-center justify-center text-xs font-bold text-amber-900">Loading home page...</div>}>
      <HomeClientContent />
    </Suspense>
  );
}
