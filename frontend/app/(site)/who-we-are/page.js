'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiUsers,
  FiCompass,
  FiTarget,
  FiShield,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiAward,
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import ContentRenderer from '@/components/ContentRenderer';

export default function WhoWeArePage() {
  const { settings } = useNGO();

  const fallbackStory = `Apna Parivar Vriddh Aashram Foundation in Jabalpur (Madhya Pradesh) was established with a sacred pledge to provide destitute, helpless, and senior citizens with a dignified, healthy, and loving life. Our mission is to ensure that in this crucial chapter of life, no elder ever feels abandoned, helpless, or lonely.

Every resident elder is provided with clean and secure living quarters, three freshly cooked nutritious satvik meals daily, 24/7 medical supervision and nursing care, regular physiotherapy, morning yoga, and daily devotional satsang to nurture emotional and spiritual well-being.

We are a 100% transparent charitable trust registered under Income Tax Act Sections 12A and 80G, where every contribution directly impacts the health, comfort, and happiness of senior citizens.`;

  const fallbackMission = settings?.missionStatement || 'To provide helpless elderly mothers and fathers with secure shelter, nutritious satvik meals, 24/7 healthcare, and the enduring warmth, dignity, and love of an authentic family.';
  const fallbackVision = settings?.visionStatement || 'A compassionate society where every senior citizen spends their golden years free from abandonment and neglect, embraced by dignity, happiness, and peace.';

  const fallbackValues = `Divine Service to Elders: Serving elderly mothers and fathers is the highest form of worship and divine compassion.
Complete Transparency & Integrity: 100% statutory compliance, official Form 10BD 80G tax exemption receipts, and total social accountability.
Familial Warmth & Dignity: Not an impersonal institution, but a vibrant, loving home filled with respect, care, and family celebrations.
Holistic Healthcare & Well-being: 24/7 medical supervision, physiotherapy, complimentary medicines, and daily spiritual satsang.`;

  const storyContent = settings?.whoWeAreStory || fallbackStory;
  const missionContent = settings?.whoWeAreMission || fallbackMission;
  const visionContent = settings?.whoWeAreVision || fallbackVision;
  const valuesContent = settings?.whoWeAreValues || fallbackValues;

  const bannerImg = settings?.whoWeAreBannerUrl 
    ? getContentImageUrl(settings.whoWeAreBannerUrl) 
    : '/banner.jpg';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/70 via-white to-slate-50 py-12 sm:py-16 border-b border-amber-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-xs">
              <FiUsers className="w-4 h-4 text-amber-700" />
              <span>Who We Are • {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {settings?.whoWeAreHeading || 'About Our Foundation & Mission'}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {settings?.whoWeAreSubtitle || 'Selfless Service, Loving Dedication, Dignified Shelter and Familial Affection for Destitute Elders'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/donation"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:scale-102 transition"
              >
                <FiHeart className="w-4 h-4 fill-stone-950" />
                <span>Support Our Cause (80G Tax-Deductible)</span>
              </Link>
              <Link
                href="/apply-volunteer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-amber-50/50 text-slate-900 border-2 border-amber-200 hover:border-amber-400 font-bold text-xs shadow-xs hover:scale-102 transition"
              >
                <FiUsers className="w-4 h-4 text-amber-700" />
                <span>Join as Volunteer</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs hover:scale-102 transition"
              >
                <FiFileText className="w-4 h-4 text-amber-700" />
                <span>Legal Accreditations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. MAIN STORY & BANNER ---------------- */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left: Dynamic Story */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <FiCompass className="w-3.5 h-3.5 text-amber-700" />
                <span>Our Identity & Living Journey</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Dedicated to Providing Dignity, Healthcare & Loving Shelter to Senior Citizens
              </h2>

              {/* Dynamic Content rendered from Admin Settings */}
              <div className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
                <ContentRenderer content={storyContent} />
              </div>
            </div>

            {/* Right: Banner Image & Fast Facts */}
            <div className="lg:col-span-5 space-y-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImg}
                  alt={settings?.whoWeAreHeading || 'Apna Parivar Vriddh Aashram'}
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/banner.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-950 bg-amber-400 px-2.5 py-0.5 rounded-md">
                      Service • Dignity • Family
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}
                    </h3>
                    <p className="text-[11px] text-slate-200">
                      Safe shelter, nutritious satvik meals, 24/7 medical supervision & familial love.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statutory Trust Card */}
              <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <FiShield className="text-amber-700 w-4 h-4" />
                  <span>Statutory Certifications & Tax Benefits</span>
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-amber-200">
                    <span className="text-[10px] text-stone-500 block font-semibold">12A Reg No.</span>
                    <span className="font-mono font-bold text-stone-900 truncate block text-[11px] mt-0.5">
                      {settings?.exemption12A || 'CIT(EXEMP)/12A/884'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-amber-200">
                    <span className="text-[10px] text-stone-500 block font-semibold">80G Tax Exemption</span>
                    <span className="font-mono font-bold text-amber-800 truncate block text-[11px] mt-0.5">
                      {settings?.exemption80G || 'CIT(EXEMP)/80G/912'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-amber-200">
                    <span className="text-[10px] text-stone-500 block font-semibold">NITI Aayog Darpan</span>
                    <span className="font-mono font-bold text-stone-900 truncate block text-[11px] mt-0.5">
                      {settings?.nitiAayogDarpanId || 'MP/2022/0319482'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-amber-200">
                    <span className="text-[10px] text-stone-500 block font-semibold">PAN Card</span>
                    <span className="font-mono font-bold text-stone-900 uppercase truncate block text-[11px] mt-0.5">
                      {settings?.panNo || 'AABTA4892P'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. MISSION & VISION DUAL CARDS ---------------- */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Our Compass
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Mission &amp; Vision Statements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The foundational guiding principles directing every care program and humanitarian service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                <FiTarget className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {missionContent}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-800">
                <FiCheckCircle className="w-4 h-4" />
                <span>Measurable Grassroots Impact</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                <FiCompass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {visionContent}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-800">
                <FiCheckCircle className="w-4 h-4" />
                <span>Dignified & Cherished Senior Living</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. CORE VALUES & ETHOS ---------------- */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Core Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                The Core Principles Guiding Our Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe that pure compassion backed by disciplined execution and statutory transparency creates a sanctuary of true dignity and joy.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <FiAward className="w-4 h-4 text-amber-700" />
                  <span>Chief Managing Trustee Signatory</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {settings?.presidentName || 'Ravi Saini (Founder & Chief Managing Trustee)'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <ContentRenderer content={valuesContent} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 5. CONTACT & HELPLINE BAR ---------------- */}
      <section className="py-10 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Have questions about admission, donations, or volunteering?
              </h3>
              <p className="text-xs text-slate-600">
                Connect directly with our 24/7 caregiving desk or visit our registered Aashram campus.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${settings?.phone || '+918959055269'}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                <FiPhone className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings?.phone || '+91 8959055269'}</span>
              </a>
              <a
                href={`mailto:${settings?.email || 'info@apnaparivarvriddhaashram.org'}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20"
              >
                <FiMail className="w-3.5 h-3.5 text-stone-950" />
                <span>Email Aashram Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
