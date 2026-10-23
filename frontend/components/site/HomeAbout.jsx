'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiTarget,
  FiCompass,
  FiArrowRight,
  FiAward,
  FiHeart,
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function HomeAbout() {
  const { settings } = useNGO();

  const corePillars = [
    {
      title: 'Safe Residential Living',
      desc: 'Ventilated, hygienic rooms tailored for senior comfort, accessibility, and 24/7 security.',
      icon: FiShield,
    },
    {
      title: '24/7 Healthcare & Medical Care',
      desc: 'Regular blood pressure and sugar monitoring, doctor visits, and emergency ambulance access.',
      icon: FiHeart,
    },
    {
      title: 'Satvik Diet & Nutrition',
      desc: 'Nutritious, easily digestible meals freshly prepared 3 times daily in a clean kitchen.',
      icon: FiAward,
    },
    {
      title: 'Satsang, Yoga & Emotional Care',
      desc: 'Daily yoga, devotional kirtan, spiritual satsang, and loving emotional companionship.',
      icon: FiTarget,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200" aria-label="About Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <FiShield className="w-4 h-4 text-amber-700" />
            <span>12A & 80G Certified Non-Profit Trust • Jabalpur (M.P.)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {settings?.aboutHeading || 'About Apna Parivar Vriddh Aashram'}
          </h2>

          <p className="text-xs sm:text-base text-slate-600 mt-2 font-medium leading-relaxed">
            {settings?.aboutSubtitle || 'A Registered Non-Profit Old Age Home Dedicated to Providing Dignified Care & Love to Destitute Senior Citizens'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Dynamic Story, Mission & Vision */}
          <div className="lg:col-span-7 space-y-5">

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {settings?.aboutStory ||
                'Apna Parivar Vriddh Aashram Foundation in Jabalpur (Madhya Pradesh) is dedicated to providing helpless, destitute, and senior citizens with safe shelter, dignified living, 24/7 healthcare, nutritious satvik meals, and genuine familial affection. Our heartfelt mission is to ensure no elderly mother or father ever feels lonely, neglected, or abandoned in their golden years.'}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center font-black shadow-sm">
                    <FiTarget className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-amber-950">Our Mission</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {settings?.missionStatement ||
                    'To provide destitute elderly mothers and fathers with a secure roof, nutritious satvik diet, 24/7 medical supervision, and the tender love and respect of a true family.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-700 to-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <FiCompass className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-amber-950">Our Vision</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {settings?.visionStatement ||
                    'A compassionate society where every senior citizen spends their twilight years free from neglect and helplessness, embraced by dignity, happiness, and peace.'}
                </p>
              </div>
            </div>

            {/* Dynamic Statutory Details Box */}
            <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2.5">
              <span className="text-[11px] font-black text-amber-950 uppercase tracking-widest block">
                Statutory Recognition & 80G Tax Exemption Credentials
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">80G Approval No:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.exemption80G || 'CIT(EXEMP)/80G/912'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">12A Reg. No:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.exemption12A || 'CIT(EXEMP)/12A/884'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">NITI Aayog Darpan:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.nitiAayogDarpanId || 'MP/2022/0319482'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">PAN / Trust Reg:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.panNo || 'AABTA4892P'}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 hover:scale-102 transition"
              >
                <span>Read Full Story</span>
                <FiArrowRight className="w-4 h-4 text-stone-950" />
              </Link>
              <Link
                href="/who-we-are"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50/50 text-stone-900 border border-amber-300 font-bold text-xs transition"
              >
                <span>Who We Are</span>
              </Link>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline px-2 py-1 ml-auto"
              >
                <FiFileText className="w-3.5 h-3.5" />
                <span>View Certifications</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Banner & Pillars */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              <img
                src="/banner.jpg"
                alt="Apna Parivar Vriddh Aashram"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#d97706] text-white text-[10px] font-black uppercase tracking-wider">
                    Service • Dignity • Family
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-snug text-white">
                    Apna Parivar Vriddh Aashram
                  </h3>
                  <p className="text-xs text-amber-200 font-medium">
                    Where Every Elder is Cherished as Family
                  </p>
                </div>
              </div>
            </div>

            {/* Core Action Pillars Grid */}
            <div className="grid grid-cols-2 gap-3">
              {corePillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:border-amber-400 transition">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#d97706] flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 leading-snug">{pillar.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
