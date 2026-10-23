'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiCompass,
  FiTarget,
  FiHeart,
  FiUsers,
  FiAward,
  FiBookOpen,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiDownload,
  FiMapPin,
  FiPhone,
  FiMail,
  FiFileText,
  FiCalendar,
  FiExternalLink
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function AboutPage() {
  const { settings, teamMembers } = useNGO();
  const [activePillar, setActivePillar] = useState('education');

  const pillars = [
    {
      id: 'shelter',
      title: 'आश्रय एवं सुरक्षित आवास (Safe Shelter)',
      tagline: 'Dignified, peaceful home for destitute elderly parents',
      icon: FiHeart,
      metrics: '100+ Seniors Housed with Love',
      description: 'We believe every elderly mother and father deserves to live their sunset years with comfort, peace, and absolute safety. Our ashram provides clean, weather-protected living rooms, clean bedding, round-the-clock caretakers, and an environment filled with respect.',
      initiatives: [
        'Hygienic living rooms with modern senior-friendly amenities',
        '24x7 Caretakers, attendants & emergency wardens',
        'Clean sanitation, regular laundry, and peaceful surroundings',
        'Wheelchair accessibility & daily personal care assistance'
      ],
      image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'healthcare',
      title: 'स्वास्थ्य सेवा व चिकित्सा (24/7 Healthcare)',
      tagline: 'Round-the-clock medical attention, medicines & geriatric care',
      icon: FiActivity,
      metrics: '24x7 Doctor & Nursing Support',
      description: 'Old age brings multiple health challenges. We ensure each resident undergoes regular medical examinations, receives prescribed daily medicines without fail, and has access to physiotherapy and emergency ambulance services.',
      initiatives: [
        'Weekly specialist doctor visits & routine health vitals tracking',
        '100% Free daily prescription medicines & specialized vitamins',
        'Physiotherapy, orthopaedic aids & mobility walker support',
        'Emergency ambulance tie-ups with top Jabalpur hospitals'
      ],
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'nutrition',
      title: 'सात्विक पौष्टिक आहार (Satvik Nutrition)',
      tagline: 'Warm, nutritious satvik meals prepared with pure devotion',
      icon: FiBookOpen,
      metrics: '65,000+ Satvik Meals Served',
      description: 'Food in our ashram is prepared with devotion (Bhog) and tailored for elderly digestive health. We serve morning herbal tea, wholesome breakfast, satvik lunch, evening snacks, and light dinner following dietary doctor recommendations.',
      initiatives: [
        'Four nutritious, hygienically cooked satvik meals daily',
        'Low-sodium, diabetic-friendly customized food preparations',
        'Seasonal fresh fruits, cow milk, daliya, and herbal decoctions',
        'Special feast meals sponsored by generous donors on birthdays & anniversaries'
      ],
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dignity',
      title: 'सम्मान, सत्संग व परिवार (Dignity & Satsang)',
      tagline: 'Emotional healing, morning yoga, bhajans & family love',
      icon: FiAward,
      metrics: '100% Family Warmth & Respect',
      description: 'Loneliness hurts more than physical illness. At Apna Parivar, residents find brothers, sisters, and affectionate volunteers who listen to their stories, celebrate Diwali and Holi with them, and join them in morning yoga and evening bhajans.',
      initiatives: [
        'Daily morning light yoga, pranayama, and peaceful meditation',
        'Evening spiritual satsang, devotional kirtan, and Ramcharitmanas path',
        'Grand celebration of festivals, birthdays, and spiritual milestones',
        'Regular visits by school students, youth, and caring families'
      ],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const currentPillar = pillars.find(p => p.id === activePillar) || pillars[0];

  const timelineMilestones = [
    {
      year: '2021',
      title: 'Genesis of Apna Parivar Vriddh Aashram',
      desc: 'Formally founded with the sacred vow that no senior citizen in Jabalpur should ever spend cold winter nights on streets without shelter, food, or family affection.'
    },
    {
      year: '2022',
      title: 'Expanded Resident Care & 24x7 Medical Tie-ups',
      desc: 'Equipped our Jabalpur premises with dedicated senior-citizen friendly beds, nursing room, and established round-the-clock doctor checkup protocols.'
    },
    {
      year: '2023',
      title: 'Section 80G & 12A Income Tax Certifications',
      desc: 'Honored with statutory 80G tax-deductible certification and 12A registration from the Income Tax Department (CBDT), guaranteeing 100% transparent giving.'
    },
    {
      year: '2024',
      title: 'NITI Aayog Darpan Recognition & Annakshetra Expansion',
      desc: 'Officially certified on the Government of India NITI Aayog NGO Darpan portal. Expanded the daily Annakshetra serving over 150+ nutritious satvik meals daily.'
    },
    {
      year: '2026',
      title: 'Digital Giving, Transparency Portal & Golden Jubilee Vision',
      desc: 'Pioneered instant verifiable 80G digital tax receipts, donor portal transparency, and continuous expansion to welcome more abandoned elders.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ---------------- 1. HERO HEADER ---------------- */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/80 via-white to-slate-50 py-16 sm:py-24 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-xs">
              <FiShield className="w-4 h-4 text-amber-700" />
              <span>Government Recognized 12A &amp; 80G Certified Non-Profit Vriddh Aashram</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              About <span className="bg-linear-to-r from-amber-600 via-amber-700 to-yellow-700 bg-clip-text text-transparent">{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              Known natively as <strong>{settings?.ngoNameHi || 'अपना परिवार वृद्ध आश्रम फाउंडेशन'}</strong>, we are a compassionate haven dedicated to sheltering, nourishing, and cherishing destitute elderly mothers and fathers with the dignity and warmth of an authentic family.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/donation"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-amber-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:scale-102 transition cursor-pointer"
              >
                <FiHeart className="w-4 h-4 fill-amber-950" />
                <span>Support Our Mission (80G Tax Exemption)</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50/50 text-slate-900 border-2 border-amber-200 hover:border-amber-400 font-bold text-xs shadow-xs hover:scale-102 transition cursor-pointer"
              >
                <FiFileText className="w-4 h-4 text-amber-700" />
                <span>View Legal Certificates</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14">
            <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm text-center hover:border-amber-400 transition">
              <div className="text-2xl sm:text-4xl font-black text-amber-700">100+</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Sheltered Elders Protected</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm text-center hover:border-amber-400 transition">
              <div className="text-2xl sm:text-4xl font-black text-slate-900">65,000+</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Nutritious Satvik Meals</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm text-center hover:border-amber-400 transition">
              <div className="text-2xl sm:text-4xl font-black text-amber-700">24x7</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Medical &amp; Nursing Care</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm text-center hover:border-amber-400 transition">
              <div className="text-2xl sm:text-4xl font-black text-amber-600">100%</div>
              <div className="text-xs font-bold text-slate-700 mt-1">CBDT 80G Tax-Deductible</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. OUR GENESIS & FOUNDATION STORY ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <FiCompass className="w-3.5 h-3.5 text-amber-700" />
                <span>Our Heritage &amp; Sacred Mission</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Where Every Elder Finds Love, Dignity &amp; Family
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                The <strong>Apna Parivar Vriddh Aashram Foundation</strong> was established with a singular humanitarian conviction: that in their twilight years, no elderly mother or father should ever suffer abandonment, neglect, or lack of medical care. What began with serving a handful of destitute elders has blossomed into a sanctified refuge in Jabalpur, Madhya Pradesh.
              </p>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Here, residents are treated not as inmates, but as venerable heads of our family. We provide round-the-clock nursing supervision, fresh satvik meals prepared with devotion, hygienic shelter, and a serene spiritual environment filled with yoga and satsang.
              </p>

              {/* Core Philosophy Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Elder Care First Ideology</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Giving elderly citizens the utmost love, dignity, emotional listening, and medical care they richly deserve.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Total Financial Transparency</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Every rupee contributed goes directly to senior welfare, backed by Section 80G tax receipts and audited accounts.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&auto=format&fit=crop&q=80"
                  alt="Apna Parivar Vriddh Aashram Elders"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-black/50 px-2.5 py-1 rounded-md border border-amber-400/30">
                      Venerable Elders In Our Care
                    </span>
                    <h3 className="text-lg font-black leading-snug">
                      Apna Parivar Vriddh Aashram • Jabalpur, MP
                    </h3>
                    <p className="text-xs text-slate-200 font-medium">
                      Providing 100+ seniors with nutritious food, round-the-clock doctor care, and loving family comfort.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. INTERACTIVE 4 PILLARS OF WORK ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-300">
              <FiTarget className="w-3.5 h-3.5 text-amber-700" />
              <span>Core Vriddh Seva Pillars</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Where Your Support Drives Real Change
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Explore our four core pillars of senior citizen welfare. Select any tab below to inspect our on-ground methodology.
            </p>
          </div>

          {/* Interactive Pillar Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activePillar === pillar.id;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${isActive
                    ? 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/25 scale-102 border border-amber-400'
                    : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Interactive Showcase Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
                    {currentPillar.metrics}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {currentPillar.title}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-amber-700">
                  {currentPillar.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentPillar.description}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Key On-Ground Initiatives:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    {currentPillar.initiatives.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/60">
                        <FiCheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Link
                    href="/donation"
                    className="px-5 py-3 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
                  >
                    Contribute to this Pillar →
                  </Link>
                  <Link
                    href="/services"
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition"
                  >
                    View All Services
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 aspect-4/3 bg-slate-100">
                  <img
                    src={currentPillar.image}
                    alt={currentPillar.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. STATUTORY TRUST & LEGAL TRANSPARENCY ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-300">
              <FiShield className="w-3.5 h-3.5 text-amber-700" />
              <span>Government Transparency</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Statutory Accreditations &amp; Tax Exemptions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              We uphold 100% legal compliance with government authorities. Inspect our official statutory registration numbers below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 80G Exemption */}
            <div className="bg-amber-50/30 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-3 border border-amber-300">
                80G
              </div>
              <h4 className="font-black text-sm text-slate-900">Section 80G Approval</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Donors are entitled to 50% income tax exemption under Section 80G of the Income Tax Act 1961.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                {settings?.exemption80G || 'CIT(EXEMP)/80G/2023-24/G-9401'}
              </div>
            </div>

            {/* 12A Registration */}
            <div className="bg-amber-50/30 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-3 border border-amber-300">
                12A
              </div>
              <h4 className="font-black text-sm text-slate-900">Section 12A Registration</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Registered non-profit entity status granted by the Income Tax Department for charitable welfare.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                {settings?.exemption12A || 'CIT(EXEMP)/12A/2023-24/A-1102'}
              </div>
            </div>

            {/* NITI Aayog Darpan */}
            <div className="bg-amber-50/30 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-3 border border-amber-300">
                NITI
              </div>
              <h4 className="font-black text-sm text-slate-900">NITI Aayog Darpan</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Enlisted on the Government of India NGO-Darpan portal for partnership in national social programs.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                {settings?.nitiAayogDarpanId || 'MP/2024/0398210'}
              </div>
            </div>

            {/* Societies Registration */}
            <div className="bg-amber-50/30 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-3 border border-amber-300">
                REG
              </div>
              <h4 className="font-black text-sm text-slate-900">Society Registration</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Statutory society charter legally enrolled under Societies Registration Act XXI of 1860.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                {settings?.registrationNo || 'MP/JBP/VRIDDH/2024/0912'}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <FiDownload className="w-4 h-4 text-amber-950" />
              <span>Inspect &amp; Download Verified NGO Certificates →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 5. TIMELINE & GROWTH TRACKER ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-300">
              <FiCalendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Milestones &amp; Evolution</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Journey Over the Years
            </h2>
          </div>

          <div className="relative border-l-2 border-amber-300 ml-4 sm:ml-32 space-y-10">
            {timelineMilestones.map((item, index) => (
              <div key={index} className="relative pl-6 sm:pl-8 group">
                {/* Year Marker Badge */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 border-4 border-white flex items-center justify-center text-amber-950 text-[10px] font-black shadow-md">
                  ✓
                </div>

                <div className="sm:absolute sm:-left-28 sm:top-0.5 sm:text-right">
                  <span className="font-mono text-xs font-black text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                    {item.year}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all">
                  <h4 className="text-base font-black text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 6. LEADERSHIP TEAM GLIMPSE ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-300">
                <FiUsers className="w-3.5 h-3.5 text-amber-700" />
                <span>Executive Council</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Leadership, Trustees &amp; Caretakers
              </h2>
            </div>
            <Link
              href="/team-members"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>View Full Governing Body</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(teamMembers && teamMembers.length > 0 ? teamMembers.slice(0, 4) : [
              { name: 'Dr. Ravi Saini', role: 'Founder & National President', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
              { name: 'Pooja Verma', role: 'Vice President & Elder Welfare', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
              { name: 'Amit Sharma', role: 'Chief Trustee & Legal Secretary', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Neha Gupta', role: 'Chief Coordinator & Healthcare Incharge', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' }
            ]).map((member, idx) => (
              <div
                key={member._id || member.id || idx}
                className="text-center p-4 rounded-3xl bg-amber-50/30 border border-slate-200 hover:border-amber-400 transition"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400 shadow-sm mb-3">
                  <img
                    src={getContentImageUrl(member.image || member.photoUrl)}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">{member.name}</h4>
                  <p className="text-[11px] text-amber-700 font-bold mt-0.5">{member.position || member.role}</p>

                  {/* Department */}
                  {member.department && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300">
                      {member.department}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 7. CALL TO ACTION ---------------- */}
      <section className="py-20 bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 shadow-xl border-t border-amber-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/15 text-amber-950 text-xs font-bold border border-amber-900/20 backdrop-blur-sm">
            <FiHeart className="w-3.5 h-3.5 fill-amber-950" />
            <span>Join Hands in Vriddh Seva &amp; Elder Care</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-amber-950 tracking-tight">
            Be the Catalyst of Comfort in an Elder's Twilight Years
          </h2>

          <p className="text-xs sm:text-sm text-amber-950/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Whether you wish to offer your time as a compassionate volunteer, sponsor daily satvik meals, or support our 12A &amp; 80G certified foundation with a tax-exempt donation — every gesture of love counts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/volunteer"
              className="px-6 py-3.5 rounded-2xl bg-amber-950 hover:bg-black text-amber-300 font-black text-xs shadow-xl transition cursor-pointer"
            >
              Apply as Volunteer (Offer Letter &amp; ID Card)
            </Link>
            <Link
              href="/donation"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-xs border border-amber-400/40 shadow-md transition cursor-pointer"
            >
              Make an 80G Tax-Deductible Donation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
