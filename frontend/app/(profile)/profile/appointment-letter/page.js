'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FiPrinter,
  FiFileText,
  FiCheckCircle,
  FiLock,
  FiCreditCard,
  FiUserCheck,
  FiArrowRight,
  FiShield
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function AppointmentLetterPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;
  const searchParams = useSearchParams();
  const letterRef = useRef(null);

  useEffect(() => {
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  // Membership & Volunteer eligibility checks (strictly prevent donor ID APVAF-DON- / BYK-DON- from being treated as member)
  const isMemberVerified = Boolean(
    effectiveUser?.role === 'Member' ||
    effectiveUser?.role === 'Admin' ||
    (effectiveUser?.isMember && !effectiveUser?.memberId?.startsWith('APVAF-DON-') && !effectiveUser?.memberId?.startsWith('BYK-DON-')) ||
    (effectiveUser?.membershipApplication?.status === 'approved') ||
    (effectiveUser?.memberId && (effectiveUser.memberId.startsWith('APVAF-MEM-') || effectiveUser.memberId.startsWith('BYK-MEM-') || effectiveUser.memberId.startsWith('MEM-')))
  );

  const isVolunteerVerified = Boolean(
    effectiveUser?.role === 'Volunteer' ||
    effectiveUser?.isVolunteer ||
    effectiveUser?.volunteerApplication?.status === 'approved' ||
    (effectiveUser?.volunteerId && !effectiveUser?.volunteerId?.startsWith('APVAF-DON-') && !effectiveUser?.volunteerId?.startsWith('BYK-DON-'))
  );

  const isCoordinatorVerified = Boolean(
    effectiveUser?.role === 'Coordinator' ||
    effectiveUser?.role?.toLowerCase?.() === 'coordinator' ||
    effectiveUser?.isCoordinator ||
    effectiveUser?.coordinatorApplication?.status === 'approved' ||
    (effectiveUser?.coordinatorId && !effectiveUser?.coordinatorId?.startsWith('APVAF-DON-'))
  );

  const paramType = searchParams.get('type');
  const defaultTab = paramType
    ? paramType.toLowerCase()
    : (isCoordinatorVerified ? 'coordinator' : (isVolunteerVerified && !isMemberVerified ? 'volunteer' : 'member'));
  const [selectedTab, setSelectedTab] = useState(null);
  const activeTab = selectedTab || defaultTab;
  const setActiveTab = setSelectedTab;

  useEffect(() => {
    if (paramType) {
      setSelectedTab(paramType.toLowerCase());
    }
  }, [paramType]);
  const [origin] = useState(() => (typeof window !== 'undefined' ? window.location.origin : ''));

  const rawMemberId = effectiveUser?.memberId;
  const memberId = (rawMemberId && !rawMemberId.startsWith('APVAF-DON-') && !rawMemberId.startsWith('BYK-DON-'))
    ? rawMemberId
    : (effectiveUser?.membershipApplication?.assignedMemberId || 'APVAF-MEM-PENDING');

  const rawVolId = effectiveUser?.volunteerId || effectiveUser?.volunteerApplication?.assignedVolunteerId || effectiveUser?.volunteerApplication?.volunteerId;
  const volunteerId = (rawVolId && !rawVolId.startsWith('APVAF-DON-') && !rawVolId.startsWith('BYK-DON-'))
    ? rawVolId
    : (effectiveUser?.role === 'Volunteer' && rawMemberId && !rawMemberId.startsWith('APVAF-DON-') && !rawMemberId.startsWith('BYK-DON-')
      ? rawMemberId
      : `APVAF-VOL-${effectiveUser?.phone ? effectiveUser.phone.slice(-4) : '2026'}`);

  const rawCoordId = effectiveUser?.coordinatorId || effectiveUser?.coordinatorApplication?.assignedCoordinatorId;
  const coordinatorId = (rawCoordId && !rawCoordId.startsWith('APVAF-DON-'))
    ? rawCoordId
    : `APVAF-CRD-${effectiveUser?.phone ? effectiveUser.phone.slice(-4) : '2026'}`;

  const coordinatorVerificationUrl = `${origin || 'https://apnaparivarvriddhaashram.org'}/verify/coordinator/${coordinatorId}`;

  const isCurrentLetterVerified = activeTab === 'coordinator'
    ? isCoordinatorVerified
    : (activeTab === 'member' ? isMemberVerified : isVolunteerVerified);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold mb-2 border border-amber-300 shadow-xs">
            <FiFileText className="w-3.5 h-3.5 text-amber-700" />
            <span>Formal Credentials Desk</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Official Appointment &amp; Offer Letters
          </h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Formal statutory appointment letters bearing the seal and signature of the National President &amp; Board of Trustees.
          </p>
        </div>

        {isCurrentLetterVerified && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition self-start sm:self-auto cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print {activeTab === 'coordinator' ? 'Coordinator Appointment Letter' : (activeTab === 'member' ? 'Member Appointment Letter' : 'Volunteer Offer Letter')}</span>
          </button>
        )}
      </div>

      {/* ----------------- TRIPLE APPOINTMENT LETTER SWITCHER TABS (CENTERED) ----------------- */}
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs w-full max-w-3xl mx-auto">
          {/* Coordinator Appointment Tab */}
          <button
            onClick={() => setActiveTab('coordinator')}
            className={`flex-1 min-w-35 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'coordinator'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md ring-1 ring-amber-400/50'
                : 'text-stone-700 hover:text-amber-950 hover:bg-white/80'
              }`}
          >
            <FiShield className="w-4 h-4 text-amber-800" />
            <span>Coordinator Appointment</span>
            {isCoordinatorVerified && (
              <span className={`w-2 h-2 rounded-full ${activeTab === 'coordinator' ? 'bg-stone-950' : 'bg-emerald-500'}`}></span>
            )}
          </button>

          {/* Member Appointment Tab */}
          <button
            onClick={() => setActiveTab('member')}
            className={`flex-1 min-w-35 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'member'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md ring-1 ring-amber-400/50'
                : 'text-stone-700 hover:text-amber-950 hover:bg-white/80'
              }`}
          >
            <FiCreditCard className="w-4 h-4" />
            <span>Member Appointment</span>
            {isMemberVerified && (
              <span className={`w-2 h-2 rounded-full ${activeTab === 'member' ? 'bg-stone-950' : 'bg-emerald-500'}`}></span>
            )}
          </button>

          {/* Volunteer Offer Tab */}
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex-1 min-w-35 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'volunteer'
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md ring-1 ring-amber-400/50'
                : 'text-stone-700 hover:text-amber-950 hover:bg-white/80'
              }`}
          >
            <FiUserCheck className="w-4 h-4" />
            <span>Volunteer Offer Letter</span>
            {isVolunteerVerified && (
              <span className={`w-2 h-2 rounded-full ${activeTab === 'volunteer' ? 'bg-stone-950' : 'bg-emerald-500'}`}></span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: MEMBER APPOINTMENT LETTER ==================== */}
      {activeTab === 'member' && (
        <>
          {!isMemberVerified ? (
            <div className="space-y-6">
              <div className="bg-linear-to-b from-amber-50/70 to-yellow-50/40 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-amber-500 to-yellow-500 text-stone-950 flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-amber-500/20">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                    Executive Desk Notice
                  </span>
                  <h3 className="text-lg font-black text-stone-900">
                    Official Member Appointment Letter Not Unlocked
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Formal Member Appointment Letters carrying the official seal of the National President are legally binding documents issued upon trustee approval of your constitutional membership application.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/apply-member"
                    className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <span>Apply for Official Membership</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/profile/member"
                    className="px-6 py-2.5 rounded-2xl bg-white text-stone-800 border border-amber-300 font-bold text-xs hover:bg-amber-50 hover:border-amber-400 transition"
                  >
                    View Membership Requirements
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50/90 border border-amber-300 text-amber-950 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-3xl mx-auto shadow-xs">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Official Foundation Member Appointment Letter is verified, digitally stamped by the National President, and recorded in the Trust Register.
                </span>
              </div>

              <div
                ref={letterRef}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl max-w-3xl mx-auto text-stone-900 print:shadow-none print:border-none print:p-4 space-y-6"
              >
                {/* Letterhead Header */}
                <div className="border-b-2 border-amber-500 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                      alt="Trust Logo"
                      className="w-12 h-12 rounded-full object-cover border border-amber-500 shadow-xs"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
                      }}
                    />
                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-amber-700 tracking-wide leading-tight uppercase">
                        {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}
                      </h1>
                      <h2 className="text-xs sm:text-sm font-bold text-stone-700">
                        {settings?.tagline || 'Apna Parivar Vriddh Aashram (National Charitable Trust)'}
                      </h2>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-700 font-semibold">
                    Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>{settings?.registrationNo || '421/2019'}</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br />
                    Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
                  </div>

                  <div className="text-[10px] text-stone-600 font-medium pt-1">
                    Head Office - {settings?.address || 'Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001'} • Helpline: {settings?.phone || '+91 93196 98759'}
                  </div>
                </div>

                {/* Reference & Date */}
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <div>
                    Ref. No: <span className="font-mono text-amber-800 font-bold">APVAF/MEM-APPT/2026/{memberId.replace('BYK-', '').replace('APVAF-', '')}</span>
                  </div>
                  <div>
                    Date: <span className="text-stone-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Recipient */}
                <div className="text-xs space-y-1 font-medium text-stone-700">
                  <p className="font-bold text-stone-900">To,</p>
                  <h3 className="text-sm font-black text-stone-900">{effectiveUser?.name}</h3>
                  <p className="text-amber-800 font-mono font-bold">Member ID: {memberId}</p>
                  <p className="text-stone-700">{effectiveUser?.address || 'Krishna Vihar, Pala Road, Aligarh'}</p>
                  <p className="text-stone-700">{effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'Uttar Pradesh'}</p>
                </div>

                {/* Subject */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl">
                  <p className="text-xs font-black text-amber-950">
                    SUBJECT: FORMAL LETTER OF APPOINTMENT AS &ldquo;{effectiveUser?.designation?.toUpperCase() || 'ACTIVE SOCIAL WORKER'}&rdquo; (MEMBERSHIP TIER: {effectiveUser?.membershipPlan?.toUpperCase() || 'OFFICIAL TRUST MEMBER'})
                  </p>
                </div>

                {/* Letter Body */}
                <div className="text-xs text-stone-700 space-y-3 leading-relaxed font-medium">
                  <p>
                    Dear <strong>{effectiveUser?.name}</strong>,
                  </p>
                  <p>
                    We are pleased to inform you that upon careful review and verification of your application and statutory contribution receipt, the Board of Trustees and the National Executive Committee of <strong>{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</strong> have formally approved your appointment as an active member in our nationwide mission.
                  </p>
                  <p>
                    In this esteemed role, you are entrusted with representing the core mission of our organization—providing shelter, compassionate healthcare, and dignity to vulnerable senior citizens, organizing voluntary relief helplines, promoting community welfare, and extending humanitarian support across India.
                  </p>

                  <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-1.5 font-medium text-stone-800">
                    <p className="font-black text-amber-950 text-[11px] uppercase tracking-wider mb-1">Terms of Appointment:</p>
                    <p>1. <strong>Tenure &amp; Validity:</strong> Your appointment is active under the charter of the Foundation and subject to renewal in accordance with your chosen plan.</p>
                    <p>2. <strong>Code of Ethics:</strong> You agree to uphold absolute transparency, humanitarian dignity, and non-partisan social service at all times.</p>
                    <p>3. <strong>Identity Badge:</strong> Your digital ID Card bears a unique statutory anti-tamper QR code linking to our national verification registry.</p>
                  </div>

                  <p>
                    We warmly welcome you into our family of nation-builders and look forward to your exemplary leadership in transforming society.
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-8 border-t border-amber-200 flex items-end justify-between">
                  {/* Trust Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                      alt="Official Seal"
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                      }}
                    />
                    <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider mt-1 block">
                      Official Seal of the Trust
                    </span>
                  </div>

                  {/* President Signature */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt="President Signature"
                      className="h-10 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                      }}
                    />
                    <div className="mt-1">
                      <h4 className="text-xs font-black text-stone-900">
                        {settings?.presidentName || 'Ravi Saini (National President & Trustee)'}
                      </h4>
                      <p className="text-[10px] text-amber-800 font-bold">National President &amp; Trustee</p>
                      <p className="text-[9px] text-stone-600 font-medium">{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 2: VOLUNTEER OFFER / APPOINTMENT LETTER ==================== */}
      {activeTab === 'volunteer' && (
        <>
          {!isVolunteerVerified ? (
            <div className="space-y-6">
              <div className="bg-linear-to-b from-amber-50/70 to-yellow-50/40 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-amber-500 to-yellow-500 text-stone-950 flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-amber-500/20">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                    Volunteer Desk Notice
                  </span>
                  <h3 className="text-lg font-black text-stone-900">
                    Volunteer Offer Letter Not Unlocked
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Formal Volunteer Offer Letters carrying official trust credentials are issued to active field volunteers after review of volunteer applications and identity documents.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/apply-volunteer"
                    className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <span>Apply for Volunteer Enrolment</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/profile/volunteer"
                    className="px-6 py-2.5 rounded-2xl bg-white text-stone-800 border border-amber-300 font-bold text-xs hover:bg-amber-50 hover:border-amber-400 transition"
                  >
                    View Volunteer Program Info
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50/90 border border-amber-300 text-amber-950 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-3xl mx-auto shadow-xs">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Official Grassroots Volunteer Offer &amp; Appointment Letter is active, authorized by the National President, and recorded in the Volunteer Wing Register.
                </span>
              </div>

              <div
                ref={letterRef}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl max-w-3xl mx-auto text-stone-900 print:shadow-none print:border-none print:p-4 space-y-6"
              >
                {/* Letterhead Header */}
                <div className="border-b-2 border-amber-500 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                      alt="Trust Logo"
                      className="w-12 h-12 rounded-full object-cover border border-amber-500 shadow-xs"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
                      }}
                    />
                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-amber-700 tracking-wide leading-tight uppercase">
                        {settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}
                      </h1>
                      <h2 className="text-xs sm:text-sm font-bold text-stone-700">
                        {settings?.tagline || 'Apna Parivar Vriddh Aashram (Grassroots Volunteer Wing)'}
                      </h2>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-700 font-semibold">
                    Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>{settings?.registrationNo || '421/2019'}</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br />
                    Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
                  </div>

                  <div className="text-[10px] text-stone-600 font-medium pt-1">
                    Head Office - {settings?.address || 'Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001'} • Helpline: {settings?.phone || '+91 93196 98759'}
                  </div>
                </div>

                {/* Reference & Date */}
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <div>
                    Ref. No: <span className="font-mono text-amber-800 font-bold">APVAF/VOL-APPT/2026/{volunteerId.replace('BYK-', '').replace('APVAF-', '')}</span>
                  </div>
                  <div>
                    Date: <span className="text-stone-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Recipient */}
                <div className="text-xs space-y-1 font-medium text-stone-700">
                  <p className="font-bold text-stone-900">To,</p>
                  <h3 className="text-sm font-black text-stone-900">{effectiveUser?.name}</h3>
                  <p className="text-amber-800 font-mono font-bold">Volunteer ID: {volunteerId}</p>
                  <p className="text-stone-700">{effectiveUser?.address || 'Krishna Vihar, Pala Road, Aligarh'}</p>
                  <p className="text-stone-700">{effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'Uttar Pradesh'}</p>
                </div>

                {/* Subject */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl">
                  <p className="text-xs font-black text-amber-950">
                    SUBJECT: APPOINTMENT &amp; OFFER LETTER AS &ldquo;ACTIVE YOUTH VOLUNTEER&rdquo; (DIVISION: {effectiveUser?.district?.toUpperCase() || 'ALIGARH'} CHAPTER)
                  </p>
                </div>

                {/* Letter Body */}
                <div className="text-xs text-stone-700 space-y-3 leading-relaxed font-medium">
                  <p>
                    Dear <strong>{effectiveUser?.name}</strong>,
                  </p>
                  <p>
                    On behalf of the Board of Trustees and the National Executive Committee of <strong>{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</strong>, we are pleased to appoint you as an <strong>Active Grassroots Volunteer</strong> in our National Social Wing.
                  </p>
                  <p>
                    We acknowledge with gratitude your willingness to offer your voluntary services, expertise, and leadership for community empowerment. You are authorized to coordinate field outreach programs, assist in care and shelter coordination, support senior welfare drives, and extend humanitarian services.
                  </p>

                  <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-1.5 font-medium text-stone-800">
                    <p className="font-black text-amber-950 text-[11px] uppercase tracking-wider mb-1">Volunteer Terms &amp; Scope of Service:</p>
                    <p>1. <strong>Field Authorization:</strong> You are officially assigned Volunteer ID: <strong>{volunteerId}</strong>. You may carry your digital volunteer badge for ground authentication during relief drives and hospital coordination.</p>
                    <p>2. <strong>Social Citations:</strong> Active hours and exceptional contributions will be honored with official National Certificates of Appreciation and volunteer citations.</p>
                    <p>3. <strong>Honorary Commitment:</strong> This volunteer position is an honorary public service dedication driven by compassionate humanitarian ideals.</p>
                  </div>

                  <p>
                    We extend our warmest wishes and trust your dedication will ignite hope, dignity, and empowerment across communities.
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-8 border-t border-amber-200 flex items-end justify-between">
                  {/* Trust Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                      alt="Official Seal"
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                      }}
                    />
                    <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider mt-1 block">
                      Official Seal of the Trust
                    </span>
                  </div>

                  {/* President Signature */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt="President Signature"
                      className="h-10 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                      }}
                    />
                    <div className="mt-1">
                      <h4 className="text-xs font-black text-stone-900">
                        {settings?.presidentName || 'Ravi Saini (National President & Trustee)'}
                      </h4>
                      <p className="text-[10px] text-amber-800 font-bold">National President &amp; Trustee</p>
                      <p className="text-[9px] text-stone-600 font-medium">{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 3: COORDINATOR APPOINTMENT LETTER ==================== */}
      {activeTab === 'coordinator' && (
        <>
          {!isCoordinatorVerified ? (
            <div className="space-y-6">
              <div className="bg-linear-to-b from-amber-50/70 to-yellow-50/40 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-amber-500 to-yellow-500 text-stone-950 flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-amber-500/20">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                    Coordinator Desk Notice
                  </span>
                  <h3 className="text-lg font-black text-stone-900">
                    Official Coordinator Appointment Letter Not Issued
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Statutory Coordinator Appointment Letters are formally ratified by the Board of Trustees to confer regional operational authorities and official credentials.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/apply-coordinator"
                    className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <span>Apply for Official Coordinator</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ================= VERIFIED COORDINATOR APPOINTMENT LETTER ================= */
            <div
              ref={letterRef}
              className="bg-white rounded-3xl border-2 border-amber-400 p-8 sm:p-12 max-w-4xl mx-auto shadow-xl print:p-0 print:border-none print:shadow-none print:max-w-none text-stone-900"
            >
              <div className="border-4 border-amber-500/40 p-6 sm:p-8 rounded-2xl relative space-y-6 bg-[#fffefb]">
                {/* Letterhead Header */}
                <div className="text-center pb-6 border-b-2 border-amber-600/60 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-amber-900 tracking-tight uppercase">
                    Apna Parivar Vriddh Aashram Foundation
                  </h2>
                  <p className="text-xs font-black uppercase tracking-wider text-amber-950">
                    Seva • Samman • Parivar • Regional Coordination Council
                  </p>
                  <p className="text-[10px] text-stone-600 font-medium">
                    Registered Public Charitable Trust • Reg. No: MP/JBP/VRIDDH/2024/0912 • NITI Aayog Verified NGO<br />
                    Head Office: Jay Prakash Nagar, Adhartal, Jabalpur, Madhya Pradesh - 482001 | Phone: +91 8959055269
                  </p>
                </div>

                {/* Reference & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-stone-700 gap-2 pt-2">
                  <span>Ref No: <strong className="font-mono text-amber-900">BYK/CRD-APPT/2026/{coordinatorId}</strong></span>
                  <span>Date of Ratification: <strong className="text-black">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                </div>

                {/* Recipient Details */}
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs space-y-1">
                  <p className="font-black text-amber-950 text-sm">{effectiveUser?.name}</p>
                  <p className="text-stone-700 font-bold">Designation: {effectiveUser?.designation || 'District / Field Coordinator'} | Coordinator ID: <span className="font-mono font-bold text-amber-900">{coordinatorId}</span></p>
                  <p className="text-stone-600 font-medium">Area of Jurisdiction: {effectiveUser?.coordinatorArea || effectiveUser?.district || 'Aligarh District'}, {effectiveUser?.state || 'Uttar Pradesh'}</p>
                  <p className="text-stone-600 font-medium">Mobile: {effectiveUser?.phone || 'N/A'} | Email: {effectiveUser?.email}</p>
                </div>

                {/* Subject */}
                <div className="text-center py-2">
                  <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide underline decoration-amber-500 decoration-2 underline-offset-4">
                    Subject: Formal Statutory Appointment as Official Regional &amp; Field Coordinator
                  </h3>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed text-justify">
                  <p>
                    Dear <strong>{effectiveUser?.name}</strong>,
                  </p>
                  <p>
                    The Board of Trustees and the National Executive Committee of <strong>Apna Parivar Vriddh Aashram Foundation</strong> are pleased to officially ratify and confirm your appointment as an <strong>Official Regional &amp; Field Coordinator</strong> of the Foundation.
                  </p>
                  <p>
                    In recognition of your community leadership, organizational capabilities, and dedicated commitment towards elderly welfare and societal empowerment, you have been enrolled in the Official Trust Register under Coordinator ID: <strong className="font-mono text-amber-900">{coordinatorId}</strong> with the designation of <strong>&ldquo;{effectiveUser?.designation || 'District / Field Coordinator'}&rdquo;</strong>.
                  </p>

                  <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-2 text-xs">
                    <h4 className="font-black text-amber-900 uppercase tracking-wide">
                      Delegated Authorities &amp; Operational Charter:
                    </h4>
                    <p>1. <strong>Member Outreach &amp; Enrollment:</strong> Authorized to nominate and register new members into the Foundation through the verified Coordinator Portal.</p>
                    <p>2. <strong>Verification &amp; Liaison:</strong> Assisting local applicants in submitting KYC identity documents and facilitating field coordination with the Central Trustee Office.</p>
                    <p>3. <strong>Elder Care Initiatives:</strong> Leading regional seva drives, medical aid distribution, and old-age home assistance under national directives.</p>
                    <p>4. <strong>Authenticated Portal Access:</strong> Authorized access to coordinator dashboard to review members enrolled under your leadership.</p>
                  </div>

                  <p className="text-xs text-stone-600 italic">
                    Please note that while Coordinators register and submit membership enrollments, final statutory verification and ID card minting remain under the jurisdiction of the National Executive Council &amp; Board of Trustees.
                  </p>
                </div>

                {/* Signatures, Seal & QR Code */}
                <div className="pt-8 border-t border-amber-200 flex flex-wrap items-end justify-between gap-6">
                  {/* Left: Anti-Tamper QR Code */}
                  <div className="text-center">
                    <div className="p-2 bg-white rounded-xl border border-amber-300 inline-block shadow-2xs">
                      <QRCodeSVG
                        value={coordinatorVerificationUrl}
                        size={80}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase tracking-wider mt-1 block">
                      Scan to Verify Online
                    </span>
                  </div>

                  {/* Center: Trust Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                      alt="Official Seal"
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                      }}
                    />
                    <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider mt-1 block">
                      Official Trust Seal
                    </span>
                  </div>

                  {/* Right: President Signature */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt="President Signature"
                      className="h-10 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                      }}
                    />
                    <div className="mt-1">
                      <h4 className="text-xs font-black text-stone-900">
                        {settings?.presidentName || 'Ravi Saini (National President & Trustee)'}
                      </h4>
                      <p className="text-[10px] text-amber-800 font-bold">National President &amp; Board of Trustees</p>
                      <p className="text-[9px] text-stone-600 font-medium">{settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
