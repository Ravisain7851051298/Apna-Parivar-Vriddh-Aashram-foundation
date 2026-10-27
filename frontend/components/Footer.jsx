'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiChevronRight,
  FiHeart,
  FiShield,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiExternalLink
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa6';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function Footer() {
  const { settings } = useNGO();

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings?.facebook || 'https://facebook.com',
      icon: FaFacebookF,
      bg: 'hover:bg-[#1877F2]',
    },
    {
      name: 'Instagram',
      url: settings?.instagram || 'https://instagram.com',
      icon: FaInstagram,
      bg: 'hover:bg-linear-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]',
    },
    {
      name: 'YouTube',
      url: settings?.youtube || 'https://youtube.com',
      icon: FaYoutube,
      bg: 'hover:bg-[#FF0000]',
    },
    {
      name: 'X (Twitter)',
      url: settings?.twitter || 'https://x.com',
      icon: FaXTwitter,
      bg: 'hover:bg-black',
    },
    {
      name: 'LinkedIn',
      url: settings?.linkedin || 'https://linkedin.com',
      icon: FaLinkedinIn,
      bg: 'hover:bg-[#0A66C2]',
    },
  ].filter((item) => Boolean(item.url));

  return (
    <footer className="bg-slate-950 text-slate-300 font-sans relative overflow-hidden">
      {/* Top Brand Accent Border in Radiant Golden Amber */}
      <div className="h-1.5 w-full bg-linear-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-sm" />

      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= 1. HIGHLIGHT CONTACT CARDS ================= */}
      <div className="border-b border-slate-800/80 py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">

          {/* Aashram Address Card */}
          <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 shadow-sm flex items-center sm:items-start gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
              <FiMapPin className="text-base sm:text-lg md:text-xl" />
            </div>
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <h4 className="text-white text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <span>Aashram Location</span>
                <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold px-1.5 py-0.2 bg-amber-400/10 rounded border border-amber-400/30">
                  {settings?.address ? (settings.address.includes('Jabalpur') ? 'Jabalpur' : 'Sirsa') : 'Jabalpur'}
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-snug sm:leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
                {settings?.address || 'Jay Prakash Nagar, Adhartal, Jabalpur, Madhya Pradesh - 482001'}
              </p>
            </div>
          </div>

          {/* 24x7 Helpline Card */}
          <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 shadow-sm flex items-center sm:items-start gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
              <FiPhone className="text-base sm:text-lg md:text-xl" />
            </div>
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <h4 className="text-white text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>24x7 Elder Helpline</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h4>
              <a
                href={`tel:${settings?.phone || '+918959055269'}`}
                className="text-xs sm:text-sm font-black text-amber-400 hover:text-white transition block"
              >
                {settings?.phone || '+91 8959055269'}
              </a>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">
                Free Aashram Admission &amp; Donation Support
              </span>
            </div>
          </div>

          {/* 80G Tax Exemption Card */}
          <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 shadow-sm flex items-center sm:items-start gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-[#15803d] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
              <FiShield className="text-base sm:text-lg md:text-xl" />
            </div>
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <h4 className="text-white text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <span>80G Tax Exemption</span>
                <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 bg-emerald-400/10 rounded">50% Rebate</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-snug sm:leading-relaxed font-medium truncate">
                Reg: {settings?.exemption80G || 'CIT(EXEMP)/80G/2023-24/G-9401'}
              </p>
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold block truncate">
                Instant Form 10BD Eligible Receipt
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN FOOTER GRID ================= */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-8 sm:gap-8 lg:gap-10 items-start">

          {/* Brand & Mission (Col 4 on md+, full width on mobile) */}
          <div className="col-span-2 md:col-span-4 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl border-2 border-amber-400/80 p-1 bg-white flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
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
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  Apna Parivar Vriddh Aashram
                </h3>
                <p className="text-[11px] text-amber-400 font-bold mt-0.5">
                  {settings?.tagline || 'Selfless Service, Loving Dedication & Dignified Shelter for Senior Citizens'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Apna Parivar Vriddh Aashram Foundation in Jabalpur (M.P.) is dedicated to providing homeless, destitute, and abandoned senior citizens with dignified living, 24/7 medical care, wholesome satvik meals, and authentic family affection.
            </p>

            {/* Compliance Pills */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-1.5">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Section 80G Approved</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-1.5">
                <FiAward className="w-3.5 h-3.5 text-emerald-400" />
                <span>12A Certified</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-1.5">
                <FiShield className="w-3.5 h-3.5 text-amber-400" />
                <span>NITI Aayog Darpan</span>
              </span>
            </div>

            {/* Visiting Hours */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <FiClock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Visiting Hours: <strong>9:00 AM – 6:00 PM</strong> (All 7 Days)</span>
            </div>
          </div>

          {/* Quick Links (Col 3 on md+, 1 col on mobile -> side-by-side with Get Involved) */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div className="border-b-2 border-emerald-500 inline-block pb-1">
              <h3 className="font-black text-sm text-white tracking-wide uppercase">
                Explore Aashram
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Home Page</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">About Our Foundation</span>
                </Link>
              </li>
              <li>
                <Link href="/who-we-are" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Who We Are &amp; Values</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">5 Pillars of Elder Care</span>
                </Link>
              </li>
              <li>
                <Link href="/team-members" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Trustees &amp; Caregivers</span>
                </Link>
              </li>
              <li>
                <Link href="/awards" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Organization Awards &amp; Honors</span>
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">12A &amp; 80G Tax Certificates</span>
                </Link>
              </li>
              <li>
                <Link href="/#reports-section" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Annual Reports &amp; Audits</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Causes & Get Involved (Col 2 on md+, 1 col on mobile -> side-by-side with Explore Aashram) */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="border-b-2 border-emerald-500 inline-block pb-1">
              <h3 className="font-black text-sm text-white tracking-wide uppercase">
                Get Involved
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/campaigns" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Sponsor an Elder</span>
                </Link>
              </li>
              <li>
                <Link href="/donation" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Tithi Bhoj Seva</span>
                </Link>
              </li>
              <li>
                <Link href="/apply-member" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Apply for Member</span>
                </Link>
              </li>
              <li>
                <Link href="/apply-volunteer" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Volunteer With Us</span>
                </Link>
              </li>
              <li>
                <Link href="/event" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Medical Camps</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-emerald-400 transition flex items-start gap-1.5 group">
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-0.5" />
                  <span className="leading-snug">Donor Feedback</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Direct Actions (Col 3 on md+, full width on mobile) */}
          <div className="col-span-2 md:col-span-3 space-y-5">
            <div className="border-b-2 border-emerald-500 inline-block pb-1">
              <h3 className="font-black text-sm text-white tracking-wide uppercase">
                Connect With Us
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Join us in this sacred mission to bring dignified care, joy, and peace to our resident elders.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((s, idx) => {
                const IconComp = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm ${s.bg}`}
                    title={s.name}
                    aria-label={s.name}
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
              <a
                href={`https://wa.me/${(settings?.whatsapp || '918959055269').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 text-slate-300 hover:bg-[#25D366] hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                title="WhatsApp Us"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>

            {/* Donate CTA button in Footer */}
            <div className="space-y-2 pt-1">
              <Link
                href="/donation"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-950/30 transition group"
              >
                <span className="flex items-center gap-2">
                  <FiHeart className="w-4 h-4 text-white fill-white animate-pulse" />
                  <span>Donate for Senior Citizens (80G)</span>
                </span>
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href={`mailto:${settings?.email || 'info@apnaparivarvriddhaashram.org'}`}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition"
              >
                <FiMail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">{settings?.email || 'info@apnaparivarvriddhaashram.org'}</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 3. STATUTORY & COPYRIGHT BOTTOM BAR ================= */}
      <div className="border-t border-slate-900 bg-black/90 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            Copyright © {new Date().getFullYear()}{' '}
            <span className="text-white font-bold">
              {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}
            </span>
            . All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-slate-400 font-medium">
            <Link href="/terms" className="hover:text-amber-400 transition">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-amber-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition">
              Refund &amp; Cancellation
            </Link>
            <Link href="/certificates" className="hover:text-amber-400 transition flex items-center gap-1">
              <span>80G Tax Exemption</span>
              <FiExternalLink className="w-3 h-3 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
