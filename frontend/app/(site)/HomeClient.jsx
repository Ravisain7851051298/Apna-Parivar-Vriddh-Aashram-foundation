'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  FiSmile,
  FiFileText
} from 'react-icons/fi';
import { FaWhatsapp, FaYoutube } from 'react-icons/fa6';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import { getYoutubeEmbedUrl } from '@/lib/youtube';

// 5 Pillars directly matching elder care priorities
const BANNER_FIVE_PILLARS = [
  {
    id: 'shelter',
    iconColor: '#059669',
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-500',
    iconBg: 'bg-emerald-600',
    titleHi: 'Safe Residential Living',
    titleEn: 'Safe Residential Living',
    desc: 'Senior-tailored rooms, clean bedding, wheelchair campus, and 24/7 dedicated caretaking.',
    link: '/services',
    tag: 'Shelter',
  },
  {
    id: 'food',
    iconColor: '#d97706',
    bgColor: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    hoverBorder: 'hover:border-amber-500',
    iconBg: 'bg-amber-600',
    titleHi: 'Nutritious Satvik Diet',
    titleEn: 'Nutritious Satvik Diet',
    desc: '3-times freshly prepared digestible satvik meals tailored for elderly health.',
    link: '/services',
    tag: 'Nutrition',
  },
  {
    id: 'health',
    iconColor: '#0284c7',
    bgColor: 'bg-sky-50/70',
    borderColor: 'border-sky-200',
    hoverBorder: 'hover:border-sky-500',
    iconBg: 'bg-sky-600',
    titleHi: '24/7 Healthcare & Nursing',
    titleEn: '24/7 Healthcare & Nursing',
    desc: 'Daily vitals monitoring, regular physician visits, free medicines & ambulance on standby.',
    link: '/services',
    tag: 'Healthcare',
  },
  {
    id: 'mental',
    iconColor: '#7c3aed',
    bgColor: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    hoverBorder: 'hover:border-purple-500',
    iconBg: 'bg-purple-600',
    titleHi: 'Yoga, Satsang & Wellbeing',
    titleEn: 'Yoga, Satsang & Wellbeing',
    desc: 'Morning light yoga, devotional kirtan, spiritual satsang & library for peace of mind.',
    link: '/who-we-are',
    tag: 'Wellness',
  },
  {
    id: 'dignity',
    iconColor: '#059669',
    bgColor: 'bg-teal-50/70',
    borderColor: 'border-teal-200',
    hoverBorder: 'hover:border-teal-500',
    iconBg: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    titleHi: 'Dignity & Family Warmth',
    titleEn: 'Dignity & Family Warmth',
    desc: 'Embracing every elder as a revered family member with loving celebration of festivals.',
    link: '/donation',
    tag: 'Family Love',
  },
];

// Rich fallback campaigns for senior citizens
const DEFAULT_CAMPAIGNS = [
  {
    _id: 'cmp_1',
    title: 'Sponsor an Elder (Monthly Shelter & Medical Care)',
    subtitle: 'Provide shelter, nutritious food & 24/7 nursing for a destitute senior citizen',
    category: 'Monthly Care',
    targetAmount: 300000,
    raisedAmount: 215000,
    donorsCount: 86,
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&auto=format&fit=crop&q=80',
    suggestedDonation: 2500,
  },
  {
    _id: 'cmp_2',
    title: 'Tithi Bhoj & Daily Satvik Meal Sponsorship',
    subtitle: 'Feed 150+ elderly mothers and fathers on your auspicious birthdays and anniversaries',
    category: 'Nutrition Seva',
    targetAmount: 500000,
    raisedAmount: 382000,
    donorsCount: 142,
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
    suggestedDonation: 5100,
  },
  {
    _id: 'cmp_3',
    title: 'Emergency Medical & Cataract Surgery Care Fund',
    subtitle: 'Free cataract eye surgeries, specialized medicines & emergency oxygen support',
    category: 'Healthcare',
    targetAmount: 400000,
    raisedAmount: 278000,
    donorsCount: 94,
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    suggestedDonation: 3500,
  },
  {
    _id: 'cmp_4',
    title: 'Winter Warmth: Blankets & Warm Clothing Drive',
    subtitle: 'Distribute warm woolens, heaters & thick quilts for elders to combat harsh winter',
    category: 'Seasonal Aid',
    targetAmount: 200000,
    raisedAmount: 165000,
    donorsCount: 71,
    imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop&q=80',
    suggestedDonation: 1100,
  },
];

// Rich fallback events
const DEFAULT_EVENTS = [
  {
    _id: 'evt_1',
    title: 'Senior Citizen Free Eye & Cataract Screening Camp',
    date: '15 November 2026',
    time: '9:00 AM – 2:00 PM',
    location: 'Apna Parivar Vriddh Aashram, Adhartal, Jabalpur',
    category: 'Health Camp',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
    description: 'Free comprehensive eye checkups, cataract surgical evaluations, and free spectacles distribution by specialist doctors.',
  },
  {
    _id: 'evt_2',
    title: 'Monthly Devotional Satsang & Community Feast',
    date: 'Every Full Moon (Purnima)',
    time: '5:30 PM – 8:30 PM',
    location: 'Satsang Hall, Aashram Campus, Jabalpur',
    category: 'Spiritual Satsang',
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    description: 'Uplifting spiritual singing, prayer recitation, and wholesome dinner for the peace, joy, and bonding of senior citizens.',
  },
  {
    _id: 'evt_3',
    title: 'Elder Respect Day Celebration & Collective Birthdays',
    date: '01 October 2026',
    time: '10:00 AM Onwards',
    location: 'Main Auditorium, Apna Parivar Vriddh Aashram',
    category: 'Felicitation',
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80',
    description: 'Honoring all resident elders with ceremonial blessings, gift hampers, music performances, and warm community bonding.',
  },
];

// Comprehensive photo gallery items
const DEFAULT_GALLERY = [
  {
    title: 'Aashram Campus & Serene Family Living',
    category: 'campus',
    url: '/banner.jpg',
  },
  {
    title: 'Daily Nutritious Satvik Bhojan Prepared in Clean Kitchen',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Daily Vitals Tracking & Experienced Nursing Care',
    category: 'health',
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Morning Yoga, Meditation & Satsang Sessions',
    category: 'satsang',
    url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Smiling Faces - Resident Elders’ Joy & Blessings',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Tithi Bhoj Special Community Feast Sponsored by Donors',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Volunteers Assisting Elders with Mobility in Garden',
    category: 'health',
    url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Festive Celebrations & Sweet Distribution with Elders',
    category: 'satsang',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  },
];

export default function HomeClient() {
  const { settings, gallery, feedbacks, campaigns, events, services, members, teamMembers, currentUser } = useNGO();

  const [reviewIdx, setReviewIdx] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Active campaigns list
  const activeCampaigns = campaigns && campaigns.length > 0 ? campaigns : DEFAULT_CAMPAIGNS;

  // Active events list
  const activeEvents = events && events.length > 0 ? events : DEFAULT_EVENTS;

  // Active gallery list
  const activeGallery = gallery && gallery.length > 0 ? gallery : DEFAULT_GALLERY;

  // Filtered gallery
  const filteredGallery = galleryFilter === 'all'
    ? activeGallery
    : activeGallery.filter((item) => (item.category || '').toLowerCase() === galleryFilter.toLowerCase());

  // Testimonials list
  const approvedReviews = feedbacks && feedbacks.length > 0
    ? feedbacks.filter((f) => (f.status || 'Approved').toLowerCase() === 'approved')
    : [
      {
        name: 'Dr. Alok Agnihotri',
        role: 'Senior Physician & Patron Member',
        rating: 5,
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        comment: 'The tranquility and satisfaction experienced upon visiting Apna Parivar Vriddh Aashram is indescribable. Every senior citizen is cared for with genuine family affection. Instant 80G tax receipt was delivered seamlessly.',
        adminReply: 'Dear Dr. Alok, the guidance and compassionate support of experienced professionals like you is the pillar of our Aashram. Thank you wholeheartedly!',
        repliedBy: 'Management, Apna Parivar Vriddh Aashram'
      },
      {
        name: 'Mrs. Anita Chourasia',
        role: 'Regular Donor (Tithi Bhoj Seva)',
        rating: 5,
        profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        comment: 'Hosting a commemorative satvik meal for the elders on my late father’s death anniversary was a deeply fulfilling experience for our family. The kitchen cleanliness and transparency are exemplary.',
        adminReply: 'Dear Anita Ji, sponsoring meals for senior citizens in remembrance of parents is a sacred virtue. May your family always be blessed.',
        repliedBy: 'Aashram Seva Committee'
      },
      {
        name: 'Er. Mayank Shrivastava',
        role: 'Active Volunteer',
        rating: 5,
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        comment: 'Applying online as a volunteer took just minutes, and I received an official digital ID card upon admin verification. Spending weekends with the resident elders brings immense purpose and joy to my life.',
        adminReply: 'Dear Mayank, energetic young volunteers like you bring radiant smiles to our elders. We are proud to have you on our seva team.',
        repliedBy: 'Volunteer Administration Desk'
      }
    ];

  // Active team members list
  const activeMembersList = members && members.length > 0
    ? members.slice(0, 4)
    : teamMembers && teamMembers.length > 0
      ? teamMembers.slice(0, 4)
      : [
        { name: 'Shri Ravi Saini', role: 'Founder & Chief Managing Trustee', image: '/logo.jpg' },
        { name: 'Dr. S. K. Verma', role: 'Chief Medical Officer (Honorary)', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300' },
        { name: 'Mrs. Rekha Mishra', role: 'Senior Care & Nursing Superintendent', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
        { name: 'Shri Amit Patel', role: 'Coordinator & Volunteer Head', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' }
      ];

  // YouTube Videos list
  const ytVideos = settings?.youtubeVideos && settings.youtubeVideos.length > 0
    ? settings.youtubeVideos
    : [
      {
        title: 'Apna Parivar Vriddh Aashram - Overview & Resident Experiences',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Free Health Camp & Community Bhoj Seva at Jabalpur Aashram',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">

      {/* ================= 1. BANNERS (HERO CAROUSEL) ================= */}
      <section className="relative">
        <HomeCarousel slides={settings?.heroSlides} />
      </section>

      {/* ================= 1.5 FIVE PILLARS FEATURE BAR (MATCHING BANNER.JPG) ================= */}
      <section className="relative -mt-6 sm:-mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card-subtle border border-slate-200/80 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {BANNER_FIVE_PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.link}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 ${pillar.bgColor} ${pillar.borderColor} ${pillar.hoverBorder} hover:shadow-card-hover group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: pillar.iconColor }}
                    >
                      <FiHeart className="w-4 h-4 fill-white" />
                    </span>
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: pillar.iconColor }}
                    >
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-emerald-700">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-emerald-700 group-hover:underline">Learn More</span>
                  <FiArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Seva Instant Contribution Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-3.5">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <FiHeart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Quick Seva Support • 1-Click Contribution (80G Tax Exemption)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Support 1 day meals, essential medicines, or shelter for our resident elders
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { amt: 500, label: '₹500 Breakfast' },
                { amt: 1100, label: '₹1,100 Medicines' },
                { amt: 2100, label: '₹2,100 Nutritious Meals' },
                { amt: 5100, label: '₹5,100 Tithi Bhoj' },
                { amt: 11000, label: '₹11,000 Complete Shelter' },
              ].map((item) => (
                <Link
                  key={item.amt}
                  href={`/donation?amount=${item.amt}`}
                  className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-xs font-semibold transition hover:scale-105 active:scale-95"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/donation"
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition hover:scale-105"
              >
                Custom Amount →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. ABOUT US SECTION ================= */}
      <section id="about-section" className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Visual Story Card & Seal */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-card-subtle border border-slate-200 bg-slate-100 group">
                <img
                  src="/banner.jpg"
                  alt="Apna Parivar Vriddh Aashram Foundation"
                  className="w-full h-72 sm:h-88 object-cover group-hover:scale-103 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider w-max mb-2 shadow-xs">
                    Elder Service is Divine Service
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                    Apna Parivar Vriddh Aashram
                  </h3>
                  <p className="text-xs text-slate-200 font-medium mt-1">
                    Where Every Senior is Family • Adhartal, Jabalpur (M.P.)
                  </p>
                </div>
              </div>

              {/* Impact Metric Cards under photo */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">200+</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-0.5">Elders Supported</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700">100%</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-0.5">80G Tax Exemption</div>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="text-xl sm:text-2xl font-black text-teal-700">24x7</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-0.5">Healthcare Care</div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative, Mission, Vision & Compliance */}
            <div className="lg:col-span-7 space-y-5">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2.5">
                  <FiShield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>12A & 80G Certified Charitable Trust (Jabalpur, M.P.)</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Providing <span className="text-emerald-700">Dignity, Care & Family</span> to Every Senior Citizen
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-normal leading-relaxed">
                  {settings?.aboutStory ||
                    'Apna Parivar Vriddh Aashram Foundation operates in Jabalpur (Madhya Pradesh) with a steadfast commitment to providing dignity, safety, and familial affection to helpless, destitute, and senior citizens. Our mission ensures no elderly individual feels abandoned or lonely at this stage of life. We provide 24/7 medical care, nutritious satvik meals, safe shelter, and emotional companionship.'}
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FiHeart className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Our Mission</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {settings?.aboutMissionSummary ||
                      'Providing destitute senior citizens with safe shelter, nutritious satvik meals, 24/7 healthcare access, and the warmth and respect of a caring family.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <FiShield className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Our Vision</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {settings?.aboutVisionSummary ||
                      'A society where no elderly individual faces helplessness or isolation in their twilight years, living instead with dignity, joy, and peace.'}
                  </p>
                </div>
              </div>

              {/* Statutory Compliance Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FiAward className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statutory Accreditations & Tax Exemption</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">80G Approval:</span>
                    <strong className="text-slate-900 font-mono text-[11px]">{settings?.exemption80G || 'CIT(EXEMP)/80G'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">12A Reg No:</span>
                    <strong className="text-slate-900 font-mono text-[11px]">{settings?.exemption12A || 'CIT(EXEMP)/12A'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">NITI Aayog:</span>
                    <strong className="text-slate-900 font-mono text-[11px]">{settings?.nitiAayogDarpanId || 'MP/2022/0319482'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">CSR-1 Reg:</span>
                    <strong className="text-slate-900 font-mono text-[11px]">{settings?.csr1No || 'CSR00049281'}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition transform hover:scale-102"
                >
                  <span>Read Full Story</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/who-we-are"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition"
                >
                  <span>How We Work</span>
                </Link>

                <Link
                  href="/certificates"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline px-2 py-2 ml-auto"
                >
                  <FiFileText className="w-3.5 h-3.5" />
                  <span>View Certificates</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 3. NO PRESIDENT MESSAGE SECTION (COMPLETELY REMOVED PER REQUIREMENT) ================= */}

      {/* ================= 4. CAMPAIGNS SECTION (सक्रिय अभियान एवं सेवा प्रकल्प) ================= */}
      <section id="campaigns-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
                <FiHeart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                <span>सहयोग एवं सेवा प्रकल्प</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                सक्रिय अभियान • <span className="text-amber-700">वरिष्ठ नागरिक संबल</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                आपका एक कदम किसी बेसहारा वृद्ध माता-पिता के जीवन में खुशियां भर सकता है। सभी दान 80G कर मुक्त।
              </p>
            </div>

            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 text-xs font-black text-amber-900 hover:text-amber-600 transition group shrink-0"
            >
              <span>सभी अभियान देखें</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCampaigns.slice(0, 4).map((cmp, idx) => {
              const cId = cmp._id || cmp.id || idx;
              const title = cmp.title || 'Elder Care Drive';
              const target = cmp.targetAmount || 100000;
              const raised = cmp.raisedAmount || 45000;
              const pct = Math.min(100, Math.round((raised / target) * 100));
              const imgUrl = getContentImageUrl(cmp.imageUrl || cmp.image) || 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800';

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
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800';
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-amber-700 shadow-sm">
                          {cmp.category || 'संबल सेवा'}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                        <span>{cmp.donorsCount || 64} दानदाता</span>
                        <span className="text-amber-300 font-mono">{pct}% पूर्ण</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-800 line-clamp-2 leading-snug">
                        {title}
                      </h4>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-600 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold pt-0.5">
                          <span className="text-slate-500">लक्ष्य: ₹{target.toLocaleString('en-IN')}</span>
                          <span className="text-amber-950 font-mono">₹{raised.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      href={`/donation?campaign=${encodeURIComponent(title)}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition group-hover:scale-102"
                    >
                      <FiHeart className="w-3.5 h-3.5 fill-stone-950" />
                      <span>दान करें (80G कर छूट)</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= 5. EVENTS SECTION (कार्यक्रम एवं शिविर) ================= */}
      <section id="events-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
                <FiCalendar className="w-3.5 h-3.5 text-amber-700" />
                <span>आयोजन एवं स्वास्थ्य शिविर</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                आश्रम गतिविधियां • <span className="text-amber-700">आगामी एवं विगत कार्यक्रम</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                निःशुल्क स्वास्थ्य शिविर, सत्संग, उत्सव एवं वृद्धजनों के सम्मान समारोह में आपका स्वागत है।
              </p>
            </div>

            <Link
              href="/event"
              className="inline-flex items-center gap-2 text-xs font-black text-amber-900 hover:text-amber-600 transition group shrink-0"
            >
              <span>सभी कार्यक्रम देखें</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeEvents.slice(0, 3).map((evt, idx) => {
              const eId = evt._id || evt.id || idx;
              const title = evt.title || 'Aashram Event';
              const date = evt.date || 'आगामी माह';
              const loc = evt.location || 'अपना परिवार वृद्ध आश्रम, जबलपुर';
              const imgUrl = getContentImageUrl(evt.imageUrl || evt.image) || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600';

              return (
                <div
                  key={eId}
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
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600';
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-950 bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-sm">
                          {evt.category || 'स्वास्थ्य शिविर'}
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
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description || 'बुजुर्गों के स्वास्थ्य, मानसिक शांति व समाज कल्याण हेतु आयोजित विशेष कार्यक्रम।'}
                      </p>

                      <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <FiMapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">{loc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <Link
                      href="/event"
                      className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <span>विवरण देखें</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    </Link>

                    <Link
                      href="/apply-volunteer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:border-amber-500 text-stone-800 text-[11px] font-bold transition"
                    >
                      स्वयंसेवक जुड़ें
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= 6. SERVICES SECTION (360° समग्र वृद्धजन सेवाएं) ================= */}
      <section id="services-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#15803d] text-xs font-bold mb-2">
              <FiAward className="w-3.5 h-3.5" />
              <span>आश्रम की 360° समग्र सेवाएं</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              हर बुजुर्ग को मिले <span className="text-amber-950">सम्मान</span>,{' '}
              <span className="text-amber-700">स्वास्थ्य</span> एवं{' '}
              <span className="text-amber-600">अपनापन</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              हम केवल आश्रय नहीं देते, बल्कि जीवन के उत्तरार्ध को गरिमा, आनंद और शांति से परिपूर्ण बनाते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services && services.length > 0 ? services.slice(0, 6) : BANNER_FIVE_PILLARS).map((srv, idx) => {
              const sId = srv._id || srv.id || idx;
              const title = srv.title || srv.titleHi || 'Elder Care Service';
              const desc = srv.description || srv.desc || 'Comprehensive elderly care facility provided with highest compassion.';
              const rawImg = srv.image || srv.imageUrl || (Array.isArray(srv.images) && srv.images[0]) || '/banner.jpg';
              const imgUrl = getContentImageUrl(rawImg) || 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800';

              return (
                <div
                  key={sId}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={imgUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800';
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-black text-sm text-white line-clamp-1">
                          {title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <Link
                      href={`/services/${sId}`}
                      className="text-xs font-bold text-amber-800 hover:text-amber-600 flex items-center gap-1 group-hover:underline"
                    >
                      <span>सुविधाएं जानें</span>
                      <FiChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </Link>

                    <Link
                      href="/donation"
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-[11px] shadow-sm transition"
                    >
                      सेवा स्पॉन्सर करें
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 transition transform hover:scale-105"
            >
              <span>सभी 5 मुख्य स्तंभ एवं सुविधाएं देखें</span>
              <FiArrowRight className="w-4 h-4 text-stone-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 7. PHOTO GALLERY (छायाचित्र दीर्घा - मुस्कुराते चेहरे) ================= */}
      <section id="gallery-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiEye className="w-3.5 h-3.5 text-amber-700" />
              <span>छायाचित्र दीर्घा • आश्रम की झलकियां</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              मुस्कुराते चेहरे... <span className="text-amber-700">यही है हमारी पहचान</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              हमारे आश्रम में वृद्ध माता-पिता के खिलखिलाते चेहरे, स्वास्थ्य शिविर एवं सात्विक भोजन सेवा के कुछ पावन क्षण।
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'all', label: 'सभी तस्वीरें' },
                { id: 'campus', label: 'आश्रम जीवन' },
                { id: 'food', label: 'सात्विक भोजन' },
                { id: 'health', label: 'स्वास्थ्य शिविर' },
                { id: 'satsang', label: 'सत्संग व उत्सव' }
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

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.slice(0, 8).map((photo, idx) => {
              const raw = photo.url || photo.imageUrl || '/banner.jpg';
              const pUrl = getContentImageUrl(raw) || '/banner.jpg';
              const pTitle = photo.title || 'Apna Parivar Vriddh Aashram';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(pUrl)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 bg-slate-100 cursor-pointer"
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

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-[11px] font-bold leading-tight line-clamp-1 drop-shadow-sm">
                      {pTitle}
                    </p>
                  </div>

                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 group-hover:bg-amber-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiEye className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition"
            >
              <span>संपूर्ण फोटो गैलरी देखें</span>
              <FiArrowRight className="w-4 h-4 text-stone-950" />
            </Link>
          </div>

        </div>
      </section>

      {/* Lightbox Modal for Gallery */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full h-full object-contain rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ================= 8. OUR MEMBERS & DEDICATED TEAM (हमारे सम्मानित सदस्य) ================= */}
      <section id="members-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
                <FiUsers className="w-3.5 h-3.5 text-amber-700" />
                <span>समर्पित सेवा परिवार</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                हमारे सम्मानित सदस्य • <span className="text-amber-700">न्यासी एवं सेवा दल</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                निःस्वार्थ सेवा में समर्पित न्यासी, मानद चिकित्सक एवं पंजीकृत आजीवन सदस्य।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/apply-member"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 text-xs font-black shadow-md shadow-amber-500/25 transition"
              >
                <span>सदस्य बनें (ID कार्ड)</span>
              </Link>
              <Link
                href="/team-members"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-amber-50/60 text-stone-800 border border-amber-300 text-xs font-bold transition"
              >
                <span>पूरी टीम देखें</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeMembersList.map((mem, idx) => {
              const mName = mem.name || 'Member Official';
              const mRole = mem.role || mem.designation || 'पंजीकृत सदस्य';
              const mImg = getContentImageUrl(mem.image || mem.photoUrl || mem.profilePicture) || '/logo.jpg';

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-5 text-center shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-amber-400/80 p-1 bg-white shadow-md mb-4 overflow-hidden group-hover:scale-105 transition-transform">
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

                  <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1 rounded-full">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Official Member</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= 9. REPORTS & TRANSPARENCY (वार्षिक प्रतिवेदन एवं पारदर्शिता) ================= */}
      <section id="reports-section" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#15803d] text-xs font-bold mb-2">
              <FiShield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% वित्तीय शुचिता एवं जवाबदेही</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              पारदर्शिता एवं <span className="text-amber-700">वार्षिक प्रतिवेदन</span> (Reports)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              आपके द्वारा दिए गए दान का प्रत्येक रुपया केवल और केवल वृद्धजनों के भोजन, दवाइयों और आवास पर व्यय होता है।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Audit & Impact Cards (Col 7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-3xl bg-amber-50/40 border border-amber-200 space-y-4">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FiAward className="w-5 h-5 text-amber-700" />
                  <span>वैधानिक ऑडिट एवं शासन मान्यता</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  फाउंडेशन का प्रत्येक वित्तीय वर्ष का आय-व्यय विवरण चार्टर्ड एकाउंटेंट द्वारा विधिवत ऑडिट किया जाता है और आयकर विभाग में फॉर्म 10BD और ITR दाखिल किया जाता है।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-stone-500 font-bold block">आयकर छूट धारा 80G:</span>
                    <strong className="text-stone-900 font-mono">{settings?.exemption80G || 'CIT(EXEMP)/80G/2022-23/G-912'}</strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">✓ दानदाताओं को 50% कर छूट</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-stone-500 font-bold block">ट्रस्ट पंजीयन धारा 12A:</span>
                    <strong className="text-stone-900 font-mono">{settings?.exemption12A || 'CIT(EXEMP)/12A/2022-23/A-884'}</strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">✓ स्थायी धर्मार्थ संस्था मान्यता</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-stone-500 font-bold block">नीति आयोग दर्पण पोर्टल:</span>
                    <strong className="text-stone-900 font-mono">{settings?.nitiAayogDarpanId || 'MP/2022/0319482'}</strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">✓ भारत सरकार द्वारा सत्यापित NGO</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-stone-500 font-bold block">कॉर्पोरेट CSR-1 संख्या:</span>
                    <strong className="text-stone-900 font-mono">{settings?.csr1No || 'CSR00049281'}</strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">✓ कंपनियों हेतु CSR अनुदान योग्य</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/certificates"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 text-xs font-black shadow-md shadow-amber-500/25 transition"
                  >
                    <FiDownload className="w-3.5 h-3.5 text-stone-950" />
                    <span>सभी वैधानिक प्रमाण पत्र डाउनलोड करें</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Direct Bank & UPI Support Box (Col 5) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">पारदर्शी दान</span>
                  <h4 className="text-sm font-black text-slate-900">अधिकृत बैंक खाता विवरण</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  80G कर मुक्त
                </span>
              </div>

              <div className="space-y-2 text-xs font-medium text-stone-700">
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-stone-500">खाता धारक:</span>
                  <strong className="text-stone-900 text-right">{settings?.bankDetails?.accountName || 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-stone-500">बैंक नाम:</span>
                  <strong className="text-stone-900">{settings?.bankDetails?.bankName || 'HDFC Bank Ltd.'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-stone-500">खाता संख्या:</span>
                  <strong className="text-amber-950 font-mono font-black">{settings?.bankDetails?.accountNumber || '50200088995678'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-stone-500">IFSC कोड:</span>
                  <strong className="text-stone-900 font-mono font-bold">{settings?.bankDetails?.ifscCode || 'HDFC0001842'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">UPI आईडी:</span>
                  <strong className="text-amber-800 font-mono font-bold">{settings?.upiId || 'apnaparivar@okhdfcbank'}</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/donation"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/30 transition"
                >
                  <FiHeart className="w-4 h-4 fill-stone-950" />
                  <span>ऑनलाइन दान करें एवं 80G रसीद पाएं</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 10. TESTIMONIALS (अनुभव एवं आशीर्वचन) ================= */}
      <section id="feedback-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>अनुभव एवं आशीर्वचन</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              दानदाताओं एवं समाजसेवियों के विचार
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              वृद्धजनों की सेवा में सहभागी बंधुओं के वास्तविक विचार एवं आधिकारिक प्रबंधन प्रतिक्रिया
            </p>
          </div>

          <div className="relative pt-10">
            {/* Top avatar */}
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
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center font-black text-xl">
                    {approvedReviews[reviewIdx]?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="relative bg-white rounded-3xl pt-14 pb-8 px-6 sm:px-12 border border-slate-200 shadow-sm text-center">

              {/* Prev / Next arrows */}
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

              <div className="max-w-xl mx-auto space-y-3">
                {/* 5-Star Rating */}
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-1">
                    ({approvedReviews[reviewIdx]?.rating || 5}.0)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed px-2">
                  “{approvedReviews[reviewIdx]?.comment || 'आश्रम में वृद्धजनों की सेवा देखकर मन अत्यंत प्रसन्न हो गया। ईश्वर इस कार्य को निरंतर आगे बढ़ाए।'}”
                </p>

                <div>
                  <h4 className="text-sm font-black text-amber-950">
                    {approvedReviews[reviewIdx]?.name || 'Anonymous Donor'}
                  </h4>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold mt-0.5">
                    {approvedReviews[reviewIdx]?.role || 'संबल दानदाता'}
                  </span>
                </div>

                {/* Admin Official Reply */}
                {approvedReviews[reviewIdx]?.adminReply && (
                  <div className="mt-4 bg-gradient-to-br from-amber-50/80 to-yellow-50/40 p-3.5 rounded-2xl border border-amber-200 text-left space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                      <FiShield className="w-3.5 h-3.5 text-amber-700" />
                      <span>आधिकारिक प्रत्युत्तर: {approvedReviews[reviewIdx]?.repliedBy || 'प्रबंधन डेस्क'}</span>
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
                    <span>अपना अनुभव साझा करें / सभी समीक्षाएं देखें</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 11. YOUTUBE VIDEO SHOWCASE ================= */}
      {/* <section id="youtube-videos" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
              <FaYoutube className="w-4 h-4 text-red-600" />
              <span>वीडियो दीर्घा</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              आश्रम की वास्तविक झलकियां एवं वृद्धजनों के अनुभव
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ytVideos.map((vid, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-amber-300/40 flex flex-col"
              >
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={getYoutubeEmbedUrl(vid.url || vid.videoUrl)}
                    title={vid.title || `Video ${idx + 1}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {vid.title && (
                  <div className="p-3 bg-white border-t border-amber-100">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{vid.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section> */}

      {/* ================= 12. LOCATION & MAP (आश्रम का पता एवं संपर्क) ================= */}
      <section id="locate-us" className="py-16 sm:py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Contact Details Card (Col 5) */}
            <div className="lg:col-span-5 space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs">
                <FiMapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>आश्रम भ्रमण एवं संपर्क</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                आइए, वृद्धजनों से मिलें और उनका आशीर्वाद लें
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">आश्रम का मुख्य पता:</strong>
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
                    <strong className="block text-slate-900 text-xs">24x7 वृद्धजन सेवा हेल्पलाइन:</strong>
                    <a
                      href={`tel:${settings?.phone || '+918959055269'}`}
                      className="text-amber-950 font-black hover:underline"
                    >
                      {settings?.phone || '+91 8959055269'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">भ्रमण समय (Visiting Hours):</strong>
                    <span className="text-slate-600">प्रातः 9:00 बजे से सायं 6:00 बजे तक (सप्ताह के सातों दिन)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs">आधिकारिक ईमेल:</strong>
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
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 text-xs font-black transition shadow-xs"
                >
                  <FiPhone className="w-3.5 h-3.5" />
                  <span>सीधे कॉल करें</span>
                </a>

                <a
                  href={`https://wa.me/${(settings?.whatsapp || '918959055269').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>व्हाट्सएप</span>
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

      {/* ================= 13. INSPIRING VOLUNTEER & CTA BANNER ================= */}
      <section className="py-14 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <span className="inline-block px-4 py-1 rounded-full bg-stone-950/15 backdrop-blur-md border border-stone-950/20 text-stone-950 text-xs font-black uppercase tracking-wider">
            आइए, मिलकर बनाएं स्नेह और सम्मान से भरा एक बेहतर कल...
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-stone-950 drop-shadow-xs">
            आपके सहयोग से महकेगा किसी बुजुर्ग का आशियाना
          </h2>

          <p className="text-xs sm:text-base text-stone-900 max-w-2xl mx-auto font-medium leading-relaxed">
            चाहे आप एक माह का राशन दान करें, तिथि भोजन सेवा स्पॉन्सर करें या स्वयंसेवक के रूप में अपना समय दें—आपका हर प्रयास किसी बेसहारा बुजुर्ग के चेहरे पर मुस्कान लाएगा।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/donation"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-950 hover:bg-stone-900 text-amber-300 font-black text-xs sm:text-sm shadow-xl shadow-stone-950/30 transform hover:scale-105 transition-all"
            >
              <FiHeart className="w-4 h-4 fill-amber-300" />
              <span>दान करें (80G कर छूट रसीद सहित)</span>
            </Link>

            <Link
              href="/apply-volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-stone-950 border border-amber-300 font-bold text-xs sm:text-sm backdrop-blur-md transition shadow-md"
            >
              <FiUsers className="w-4 h-4 text-amber-700" />
              <span>स्वयंसेवक (Volunteer) बनें</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
