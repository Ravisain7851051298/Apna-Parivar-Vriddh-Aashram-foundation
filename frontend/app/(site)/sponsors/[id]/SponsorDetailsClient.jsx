"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiShield,
  FiAward,
  FiCheckCircle,
  FiExternalLink,
  FiArrowLeft,
  FiShare2,
  FiCopy,
  FiCheck,
  FiHeart,
  FiCalendar,
  FiArrowRight,
  FiLayers,
  FiFileText
} from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import api from "@/services/api";
import { useNGO } from "@/context/NGOContext";
import { getContentImageUrl } from "@/lib/authApi";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

export default function SponsorDetailsClient({ sponsorId }) {
  const params = useParams();
  const id = sponsorId || params?.id;
  const { sponsorships: allSponsors } = useNGO();

  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch sponsor data
  useEffect(() => {
    let isMounted = true;

    const fetchSponsor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/sponsorships/${id}`);
        const data = res.data?.data || res.data?.item;
        if (isMounted && data) {
          setSponsor(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API single sponsor fetch error, falling back to context:", err?.message);
      }

      // Fallback 1: Direct fetch to API endpoint
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const directRes = await fetch(`${apiUrl.replace(/\/+$/, '')}/sponsorships/${id}`);
        if (directRes.ok) {
          const directData = await directRes.json();
          const item = directData?.data || directData?.item;
          if (isMounted && item) {
            setSponsor(item);
            setLoading(false);
            return;
          }
        }
      } catch (directErr) {
        console.warn("Direct fetch error:", directErr?.message);
      }

      // Fallback 2: Find in context
      if (Array.isArray(allSponsors)) {
        const found = allSponsors.find((s) => (s._id || s.id) === id);
        if (isMounted && found) {
          setSponsor(found);
          setLoading(false);
          return;
        }
      }

      if (isMounted) setLoading(false);
    };

    fetchSponsor();

    return () => {
      isMounted = false;
    };
  }, [id, allSponsors]);

  // Copy link
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Other related sponsors
  const otherSponsors = useMemo(() => {
    if (!Array.isArray(allSponsors)) return [];
    return allSponsors.filter((s) => (s._id || s.id) !== id && s.isActive !== false).slice(0, 3);
  }, [allSponsors, id]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = sponsor ? `${sponsor.organizationName || sponsor.title} - CSR Partner with Apna Parivar Vriddh Aashram` : "CSR Partner";
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${currentUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded-full" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl" />
            <div className="h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
            <FiShield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Partner Details Not Found</h2>
          <p className="text-xs text-slate-600">
            The requested corporate partnership profile could not be loaded or may have been updated.
          </p>
          <Link
            href="/#sponsorships-section"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black text-xs shadow-md transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Home Page</span>
          </Link>
        </div>
      </div>
    );
  }

  const orgName = sponsor.organizationName || sponsor.name || sponsor.title || "Corporate Partner";
  const logoUrl = getContentImageUrl(sponsor.logoUrl || sponsor.image || sponsor.logo) || "/logo.jpg";
  const tier = sponsor.tier || "CSR Partner";
  const supportType = sponsor.supportType || "Elder Healthcare & Nutrition";
  const initiativeTitle = sponsor.title || "Sustained Healthcare & Daily Nutritional Care for Resident Elders";
  const website = sponsor.websiteUrl || sponsor.link || "";

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6 sm:pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-amber-800 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/#sponsorships-section" className="hover:text-amber-800 transition">
              Sponsors &amp; CSR Partners
            </Link>
            <span>/</span>
            <span className="text-amber-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {orgName}
            </span>
          </nav>

          <Link
            href="/#sponsorships-section"
            className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 hover:text-amber-950 transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Sponsors</span>
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-amber-200/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-amber-100/40 via-yellow-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Logo Display Box */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white border-2 border-amber-200/90 shadow-sm flex items-center justify-center p-4 shrink-0 overflow-hidden">
              <img
                src={logoUrl}
                alt={orgName}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            </div>

            {/* Header Details */}
            <div className="space-y-3 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-linear-to-r from-amber-400 to-yellow-300 text-stone-950 shadow-2xs">
                  <FiAward className="w-3.5 h-3.5" />
                  <span>{tier} Partner</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300/80">
                  {supportType}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified CSR Collaboration</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {orgName}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-amber-900 leading-snug">
                {initiativeTitle}
              </p>

              {website && (
                <div className="pt-1 flex items-center justify-center sm:justify-start">
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline"
                  >
                    <span>Visit Official Website: {new URL(website).hostname}</span>
                    <FiExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Partnership Narrative & Impact Pillars (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Impact Pillars Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-amber-600" />
                <span>Core Supported Programs &amp; Initiatives</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Elderly Healthcare
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    Physician rounds, diagnostic checkups &amp; daily maintenance medicines.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Satvik Nutrition
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    Freshly cooked nutritious meals, warm milk, and dietary supplements.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Dignified Living
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    Clean bedding, hygienic facilities, heating &amp; therapeutic aids.
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description / Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FiFileText className="w-5 h-5 text-amber-600" />
                <span>Partnership Scope &amp; Contribution Overview</span>
              </h2>

              {sponsor.description ? (
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                  <MarkdownRenderer content={sponsor.description} />
                </div>
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">
                  Through this institutional partnership, {orgName} actively enables Apna Parivar Vriddh Aashram Foundation to expand daily medical assistance, satvik nutrition, and dignified accommodation for homeless and abandoned senior citizens.
                </p>
              )}
            </div>

            {/* Gratitude & Impact Quote Banner */}
            <div className="bg-linear-to-r from-amber-600 via-amber-700 to-yellow-600 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200">
                <FiHeart className="w-4 h-4 fill-amber-200" />
                <span>Heartfelt Gratitude</span>
              </div>
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                “We extend our deepest gratitude to {orgName} for standing shoulder-to-shoulder with our senior citizens. Their benevolent institutional contribution guarantees that no elder in our sanctuary ever has to worry about healthcare or meals.”
              </p>
              <div className="text-xs text-amber-100 font-bold pt-1">
                — Managing Board of Trustees, Apna Parivar Vriddh Aashram Foundation
              </div>
            </div>

          </div>

          {/* Right Column: Quick Info & CSR Compliance Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Partner Quick Facts */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FiLayers className="w-4 h-4 text-amber-600" />
                <span>Partnership Summary</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Organization</span>
                  <span className="font-bold text-slate-900 text-right">{orgName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Partnership Tier</span>
                  <span className="font-bold text-amber-800">{tier} Level</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Channel</span>
                  <span className="font-bold text-slate-800">{supportType}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    <span>Active Partner</span>
                  </span>
                </div>
              </div>

              {website && (
                <div className="pt-2">
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
                  >
                    <span>Visit Partner Website</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* CSR Compliance & 80G Tax Exemption Card */}
            <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                <FiShield className="w-4 h-4 text-amber-700" />
                <span>Statutory &amp; CSR Assurance</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Section 80G Certified:</strong> Donations eligible for 50% tax deductions under Indian IT Act.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>MCA CSR-1 Registered:</strong> Eligible recipient for Corporate CSR Mandates (Schedule VII).</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Form 10BD &amp; Audit Trail:</strong> Complete CA-certified utilization reports provided annually.</span>
                </div>
              </div>
            </div>

            {/* Share Partnership Section */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FiShare2 className="w-4 h-4 text-amber-600" />
                <span>Share Partnership</span>
              </h3>

              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition"
                >
                  <FaXTwitter className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition cursor-pointer"
                  title="Copy link"
                >
                  {copied ? <FiCheck className="w-4 h-4 text-emerald-600" /> : <FiCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Other Partners Section if any */}
        {otherSponsors.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Other Corporate Partners &amp; Patrons
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Esteemed organizations joining hands to support senior citizens.
                </p>
              </div>
              <Link
                href="/#sponsorships-section"
                className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherSponsors.map((os) => {
                const osId = os._id || os.id;
                const osName = os.organizationName || os.title || "Partner";
                const osLogo = getContentImageUrl(os.logoUrl || os.image || os.logo) || "/logo.jpg";
                const osTier = os.tier || "CSR Partner";

                return (
                  <Link
                    key={osId}
                    href={`/sponsors/${osId}`}
                    className="group bg-white p-4 rounded-2xl border border-amber-200/80 hover:border-amber-400 shadow-2xs hover:shadow-md transition flex items-center gap-3.5"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-50 p-2 flex items-center justify-center shrink-0 border border-slate-100">
                      <img
                        src={osLogo}
                        alt={osName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/logo.jpg";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-amber-800">
                        {osName}
                      </h4>
                      <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
                        {osTier} Level
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
