"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiAward,
  FiCalendar,
  FiMapPin,
  FiShield,
  FiCheckCircle,
  FiShare2,
  FiArrowLeft,
  FiExternalLink,
  FiHeart,
  FiCopy,
  FiCheck,
  FiFileText,
  FiUsers,
  FiInfo
} from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import api from "@/services/api";
import { useNGO } from "@/context/NGOContext";
import { getContentImageUrl } from "@/lib/authApi";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";

export default function AwardDetailsClient() {
  const params = useParams();
  const id = params?.id;
  const { awards: allAwards } = useNGO();

  const [award, setAward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch single award
  useEffect(() => {
    let isMounted = true;

    const fetchAward = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/awards/${id}`);
        if (isMounted && res.data?.award) {
          setAward(res.data.award);
          return;
        }
      } catch (err) {
        console.warn("API single fetch error, fallback to context:", err?.message);
      }

      // Fallback: search in NGOContext awards
      if (Array.isArray(allAwards)) {
        const found = allAwards.find((a) => (a._id || a.id) === id);
        if (isMounted && found) {
          setAward(found);
        }
      }

      if (isMounted) setLoading(false);
    };

    fetchAward().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id, allAwards]);

  // Other related awards for sidebar
  const otherAwards = useMemo(() => {
    if (!Array.isArray(allAwards)) return [];
    return allAwards
      .filter((a) => (a._id || a.id) !== id && a.isOrgAward === true && a.isActive !== false)
      .slice(0, 3);
  }, [allAwards, id]);

  // Copy Link to clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Social share URLs
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = award ? `${award.title} - Conferred to Apna Parivar Vriddh Aashram` : "Award Recognition";
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareTitle}\n${currentUrl}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareTitle
  )}&url=${encodeURIComponent(currentUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-200 rounded w-3/4" />
          <div className="h-96 bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!award) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md w-full border border-amber-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-2xl">
            <FiAward className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Award Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            The award you are looking for might have been updated, moved, or is temporarily unavailable.
          </p>
          <div className="pt-2">
            <Link
              href="/awards"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to All Awards</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imgUrl = getContentImageUrl(award.awardImage || award.image) || "/logo.jpg";
  const awardedBy = award.awardedBy || "Government / Institutional Social Welfare Council";
  const year = award.year || "2025";
  const fullStory = award.fullContent || award.description || "";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* ================= 1. HEADER & BREADCRUMBS ================= */}
      <section className="bg-linear-to-b from-[#1c1917] via-[#292524] to-[#1c1917] text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto space-y-5">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-stone-400 flex-wrap">
            <Link href="/" className="hover:text-amber-300 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/awards" className="hover:text-amber-300 transition">
              Organization Awards
            </Link>
            <span>/</span>
            <span className="text-amber-300 truncate max-w-xs">{award.title}</span>
          </nav>

          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-linear-to-r from-amber-400 to-yellow-300 text-stone-950 font-black text-xs uppercase tracking-wider shadow-sm">
              <FiAward className="w-3.5 h-3.5 text-stone-950" />
              <span>{year} • {award.tier || "Honor"}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-stone-200 border border-white/20 text-xs font-bold">
              <FiShield className="w-3.5 h-3.5 text-amber-400" />
              <span>{award.category || "Senior Citizen Welfare"}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {award.title}
          </h1>

          {/* Conferred By Highlights */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-stone-300 font-medium pt-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold uppercase text-[11px] tracking-wider">Conferred By:</span>
              <strong className="text-white font-bold">{awardedBy}</strong>
            </div>

            {award.venue && (
              <div className="flex items-center gap-1.5 text-stone-300">
                <FiMapPin className="w-4 h-4 text-amber-400" />
                <span>{award.venue}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 2. MAIN CONTENT GRID ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Award Details (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Award Image Display */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/90 shadow-xl">
              <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                <img
                  src={imgUrl}
                  alt={award.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/logo.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-bold flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official Verified Citation</span>
                  </span>

                  <span className="font-extrabold text-amber-300 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
                    {year}
                  </span>
                </div>
              </div>

              {/* Award Summary Citation Box */}
              {award.description && (
                <div className="p-6 sm:p-8 bg-amber-50/70 border-b border-amber-200/80 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <FiAward className="w-3.5 h-3.5" />
                    <span>Citation Summary</span>
                  </span>
                  <div className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
                    &quot;{award.description}&quot;
                  </div>
                </div>
              )}

              {/* Full Content / Ceremony Story */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FiFileText className="w-6 h-6 text-amber-600" />
                    <span>About This Honor &amp; Social Impact</span>
                  </h2>

                  <div className="text-slate-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
                    {fullStory ? (
                      <MarkdownRenderer content={fullStory} />
                    ) : (
                      <p>
                        This honor was conferred in recognition of the tireless dedication of Apna Parivar Vriddh
                        Aashram Foundation towards providing destitute, homeless, and abandoned senior citizens with
                        shelter, dignity, medical treatment, and loving care.
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Conferring Authority
                    </span>
                    <strong className="text-sm font-bold text-slate-900 block">{awardedBy}</strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Venue &amp; Location
                    </span>
                    <strong className="text-sm font-bold text-slate-900 block">
                      {award.venue || "Jabalpur, Madhya Pradesh"}
                    </strong>
                  </div>
                </div>

                {/* Citation Document Download/View Button */}
                {award.certificateUrl && (
                  <div className="p-5 rounded-2xl bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Official Certificate / Citation Document</span>
                      </span>
                      <p className="text-xs text-slate-600">
                        View or download the official authenticated digital citation issued for this award.
                      </p>
                    </div>

                    <a
                      href={getContentImageUrl(award.certificateUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm shrink-0"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      <span>View Citation Document</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Social Share Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                  <FiShare2 className="w-4 h-4 text-amber-700" />
                  <span>Share this achievement with others:</span>
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-xs"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#1877F2] hover:opacity-90 text-white transition shadow-xs"
                    title="Share on Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-white transition shadow-xs"
                    title="Share on X"
                  >
                    <FaXTwitter className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 transition shadow-xs cursor-pointer"
                  >
                    {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/awards"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 transition shadow-xs"
              >
                <FiArrowLeft className="w-4 h-4 text-amber-700" />
                <span>Back to All Organization Awards</span>
              </Link>
              <Link
                href="/"
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                Back to Home Page
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Foundation Credentials Card */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
                  <FiShield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Apna Parivar Vriddh Aashram
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Registered Foundation • Jabalpur (M.P.)
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Dedicated grassroots sanctuary providing homeless, disabled, and destitute senior citizens with free
                residential care, medical rehabilitation, and loving familial respect.
              </p>

              <div className="space-y-2 text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">80G Tax Exemption:</span>
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5" /> Approved
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">12A Registration:</span>
                  <span className="text-amber-800 font-black">Certified</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">NITI Aayog Darpan:</span>
                  <span className="text-blue-800 font-black">Verified NGO</span>
                </div>
              </div>
            </div>

            {/* Other Awards Card */}
            {otherAwards.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <FiAward className="w-4 h-4 text-amber-600" />
                  <span>Other Conferred Honors</span>
                </h3>

                <div className="space-y-3">
                  {otherAwards.map((other) => {
                    const oImg = getContentImageUrl(other.awardImage || other.image) || "/logo.jpg";
                    return (
                      <Link
                        key={other._id || other.id}
                        href={`/awards/${other._id || other.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-amber-50/80 transition border border-transparent hover:border-amber-200 group"
                      >
                        <img
                          src={oImg}
                          alt={other.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/logo.jpg";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-amber-800 uppercase block">
                            {other.year || "Honor"}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate leading-snug">
                            {other.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {other.awardedBy}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <Link
                    href="/awards"
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <span>View all organization awards</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Donation / Tithi Bhoj CTA */}
            <div className="bg-linear-to-br from-amber-700 to-yellow-600 rounded-3xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-200 block">
                  Support Our Mission
                </span>
                <h3 className="text-base font-black leading-snug">
                  Help Us Keep Serving Destitute Elders
                </h3>
                <p className="text-xs text-amber-100/90 leading-relaxed font-normal">
                  Your tax-exempt contribution directly provides nutritious satvik meals, medical nursing, and peaceful shelter.
                </p>
              </div>

              <div className="relative z-10 pt-2">
                <Link
                  href="/donation"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-yellow-50 text-stone-950 font-black text-xs transition shadow-md"
                >
                  <FiHeart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span>Donate with 80G Tax Exemption</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
