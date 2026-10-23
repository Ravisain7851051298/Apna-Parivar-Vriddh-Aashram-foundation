'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiHeart,
  FiShield,
  FiArrowLeft,
  FiShare2,
  FiUsers,
  FiCheckCircle,
  FiCheck,
  FiTarget,
  FiAward,
  FiArrowRight,
  FiCopy
} from 'react-icons/fi';
import { FaWhatsapp, FaHouseChimney, FaBowlFood, FaHeartPulse, FaSpa } from 'react-icons/fa6';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { CardSkeleton } from '@/components/common/SkeletonLoader';
import api from '@/services/api';
import toast from 'react-hot-toast';

function CampaignDetailContent({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const campaignId = resolvedParams?.id;

  const { campaigns, settings } = useNGO();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('2100');

  useEffect(() => {
    if (!campaignId) return;

    // Check context first
    const found = campaigns?.find((c) => (c._id || c.id) === campaignId);
    if (found) {
      setCampaign(found);
      setLoading(false);
      return;
    }

    // Fetch from backend
    api.get(`/campaigns/${campaignId}`)
      .then((res) => {
        const data = res.data?.campaign || res.data?.data || res.data;
        if (data && (data._id || data.title)) {
          setCampaign(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load campaign details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [campaignId, campaigns]);

  const copyPageLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Campaign link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = encodeURIComponent(
      `🙏 *Support ${campaign?.title}*\nHelp us provide food, medical aid & shelter to destitute elders.\n100% Tax Exempt under Section 80G.\nDonate & Read more:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdfa] py-16 px-4 max-w-5xl mx-auto">
        <CardSkeleton count={2} />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-[70vh] bg-[#fffdfa] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-amber-200 text-center shadow-lg">
          <FiTarget className="w-12 h-12 mx-auto text-amber-600 mb-3" />
          <h2 className="text-xl font-black text-stone-900">Campaign Not Found</h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            The fundraising campaign you are looking for may have concluded or has been updated.
          </p>
          <Link
            href="/campaigns"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-xs shadow-md transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to All Campaigns</span>
          </Link>
        </div>
      </div>
    );
  }

  const rawImg = campaign.imageUrl || campaign.image || campaign.bannerImage || '/banner.jpg';
  const bannerUrl = rawImg.startsWith('http') || rawImg.startsWith('/') ? rawImg : getContentImageUrl(rawImg);
  const target = campaign.targetAmount || campaign.goalAmount || 100000;
  const raised = campaign.raisedAmount || 0;
  const pct = Math.min(100, Math.round((raised / target) * 100));
  const donorsCount = campaign.donorsCount || 0;

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-900 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Breadcrumb & Back Link */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-950 transition group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Crowdfunding Campaigns</span>
          </Link>

          <div className="inline-flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[11px] uppercase tracking-wider">
              {campaign.category || 'Elder Welfare Drive'}
            </span>
            {campaign.urgent && (
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-black text-[11px] uppercase tracking-wider animate-pulse">
                Urgent Relief Drive
              </span>
            )}
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xl overflow-hidden">
          <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[460px] w-full overflow-hidden bg-slate-900">
            <img
              src={bannerUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/banner.jpg';
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-black uppercase tracking-wider inline-block">
                {campaign.category || 'Senior Welfare Seva'}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
                {campaign.title}
              </h1>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-6 bg-amber-50/50 border-b border-amber-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">
                  Fundraising Progress ({pct}% Achieved)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
                    ₹{Number(raised).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    raised of ₹{Number(target).toLocaleString('en-IN')} goal
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-2xl bg-white border border-amber-300 text-amber-950 font-black text-xs shadow-2xs">
                  👥 {donorsCount} Contributor{donorsCount === 1 ? '' : 's'}
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-xs shadow-2xs">
                  ✓ 80G Tax Exemption
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-amber-200/70 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-600 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Main Content & Donation Action Box */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Description Body (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-950 mb-3 tracking-tight">
                  Cause Overview &amp; Impact
                </h2>
                <div className="text-stone-700 text-sm leading-relaxed prose max-w-none">
                  <MarkdownRenderer content={campaign.description || 'Support this compassionate elder care cause.'} />
                </div>
              </div>

              {/* Tax Exemption Benefits Callout */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-black text-emerald-950 text-sm">
                  <FiShield className="w-4 h-4 text-emerald-700" />
                  <span>100% Tax Exemption under Section 80G</span>
                </div>
                <p className="text-emerald-900/90 leading-relaxed font-medium">
                  Contributions made to Apna Parivar Vriddh Aashram Foundation are eligible for 50% deduction under Section 80G of the Income Tax Act. A verified 80G certificate receipt is issued instantaneously.
                </p>
                <div className="pt-1 text-[11px] text-emerald-800 font-mono font-bold">
                  80G Exemption Order: {settings?.exemption80G || 'CIT(EXEMP)/80G/2022-23'}
                </div>
              </div>

              {/* Social Sharing Bar */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <FiShare2 className="w-4 h-4 text-amber-700" />
                  <span>Share &amp; Champion This Cause:</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={copyPageLink}
                    className="p-2 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-bold flex items-center gap-1 transition"
                  >
                    {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Donation Action Box (4 cols) */}
            <div className="lg:col-span-4 bg-linear-to-b from-amber-50/90 via-white to-amber-50/40 p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-5 sticky top-24">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                  Direct Support
                </span>
                <h3 className="text-lg font-black text-stone-950 mt-0.5">
                  Contribute to This Drive
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Choose a contribution amount to support meals, healthcare, or shelter.
                </p>
              </div>

              {/* Quick Select Amounts */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['500', '1100', '2100', '5100'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomAmount(amt)}
                    className={`py-2 px-3 rounded-xl border font-black transition cursor-pointer ${
                      customAmount === amt
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                        : 'bg-white hover:bg-amber-100/60 border-amber-300 text-stone-900'
                    }`}
                  >
                    ₹{Number(amt).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Or Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-amber-800">₹</span>
                  <input
                    type="number"
                    min="100"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-amber-300 font-mono font-black text-sm text-stone-950 bg-white focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Link
                href={`/donation?campaign=${encodeURIComponent(campaign.title)}&amount=${encodeURIComponent(customAmount || '2100')}`}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <FiHeart className="w-4 h-4 fill-stone-950" />
                <span>Donate ₹{Number(customAmount || 0).toLocaleString('en-IN')} Now</span>
              </Link>

              {/* 80G Receipt Assurance */}
              <div className="pt-4 border-t border-amber-200/60 space-y-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant 80G Receipt via Email</span>
                </div>
                <p>
                  Official receipt and tax exemption certificate are sent immediately upon transaction completion.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CampaignDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffdf5] py-20 px-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <CardSkeleton count={1} />
          </div>
        </div>
      }
    >
      <CampaignDetailContent params={params} />
    </Suspense>
  );
}
