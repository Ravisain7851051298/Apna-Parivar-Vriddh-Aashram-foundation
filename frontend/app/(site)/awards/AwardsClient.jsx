"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiAward,
  FiSearch,
  FiCheckCircle,
  FiShield,
  FiCalendar,
  FiMapPin,
  FiArrowRight,
  FiFilter,
  FiExternalLink,
  FiHeart,
  FiX
} from "react-icons/fi";
import { useNGO } from "@/context/NGOContext";
import { getContentImageUrl } from "@/lib/authApi";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { CardSkeleton, EmptyState } from "@/components/common/SkeletonLoader";

export default function AwardsClient() {
  const { awards, loading } = useNGO();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter specifically for organization awards
  const orgAwards = useMemo(() => {
    if (!Array.isArray(awards)) return [];
    return awards
      .filter((a) => a.isOrgAward === true && a.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [awards]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    orgAwards.forEach((a) => {
      if (a.category) set.add(a.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [orgAwards]);

  // Filtered awards based on search & category
  const filteredAwards = useMemo(() => {
    return orgAwards.filter((award) => {
      const q = searchQuery.toLowerCase().trim();
      const title = (award.title || "").toLowerCase();
      const by = (award.awardedBy || "").toLowerCase();
      const desc = (award.description || "").toLowerCase();
      const year = (award.year || "").toLowerCase();
      const venue = (award.venue || "").toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        by.includes(q) ||
        desc.includes(q) ||
        year.includes(q) ||
        venue.includes(q);

      if (!matchesSearch) return false;

      if (selectedCategory !== "All" && award.category?.trim() !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [orgAwards, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative bg-linear-to-b from-[#1c1917] via-[#292524] to-[#1c1917] text-white pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6 text-center">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400">
            <Link href="/" className="hover:text-amber-400 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-amber-300">Organization Awards &amp; Honors</span>
          </nav>

          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest shadow-inner">
              <FiAward className="w-4 h-4 text-amber-400" />
              <span>National &amp; State Recognitions</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Honors &amp; Awards Conferred to{" "}
            <span className="bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Apna Parivar Vriddh Aashram
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Citations, trophies, and humanitarian honors presented by government ministries, social welfare councils, and
            international philanthropic federations for selfless shelter, nutritious bhoj, and 24x7 medical rehabilitation
            of destitute elders.
          </p>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-stone-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section 80G Certified</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <FiAward className="w-3.5 h-3.5 text-amber-400" />
              <span>12A Registered Foundation</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <FiShield className="w-3.5 h-3.5 text-yellow-400" />
              <span>NITI Aayog Darpan Recognized</span>
            </span>
          </div>
        </div>
      </section>

      {/* ================= 2. SEARCH & FILTER SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search awards by name, conferring organization, venue..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm font-medium outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Total Results Counter */}
            <div className="text-xs font-bold text-slate-500 shrink-0 px-2 text-right">
              Showing <span className="text-amber-800 font-black">{filteredAwards.length}</span>{" "}
              {filteredAwards.length === 1 ? "Award" : "Awards"}
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] shrink-0 mr-1 flex items-center gap-1">
                <FiFilter className="w-3.5 h-3.5" />
                <span>Category:</span>
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-amber-700 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= 3. AWARDS GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <CardSkeleton count={4} />
        ) : filteredAwards.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-amber-200 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-2xl">
              <FiAward className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800">No Awards Found</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {searchQuery || selectedCategory !== "All"
                  ? "No awards matched your search filters. Try clearing your search keyword."
                  : "Organization awards are being updated. Please check back shortly."}
              </p>
            </div>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAwards.map((award, idx) => {
              const aId = award._id || award.id || idx;
              const img = getContentImageUrl(award.awardImage || award.image) || "/logo.jpg";
              const aTitle = award.title || "National Excellence Award";
              const awardedBy = award.awardedBy || "Government / Institutional Body";
              const year = award.year || "2025";

              return (
                <div
                  key={aId}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Award Image Header */}
                    <div className="relative h-60 bg-slate-100 overflow-hidden">
                      <img
                        src={img}
                        alt={aTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/logo.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                      {/* Top Floating Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {year && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-950 bg-linear-to-r from-amber-400 to-yellow-300 shadow-sm flex items-center gap-1.5">
                            <FiAward className="w-3.5 h-3.5 text-stone-950" />
                            <span>{year}</span>
                          </span>
                        )}
                        {award.tier && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-xs border border-white/20">
                            {award.tier}
                          </span>
                        )}
                      </div>

                      {/* Conferred By Overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-0.5">
                          Conferred By
                        </span>
                        <p className="text-xs font-black text-white truncate drop-shadow-sm">
                          {awardedBy}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-amber-800 uppercase tracking-wide truncate max-w-[70%]">
                          {award.category || "Elder Care & Social Welfare"}
                        </span>
                        {award.venue && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                            <FiMapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{award.venue}</span>
                          </span>
                        )}
                      </div>

                      <h2 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-amber-800 transition leading-snug line-clamp-2">
                        {aTitle}
                      </h2>

                      {award.description && (
                        <div className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                          <MarkdownRenderer content={award.description} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Citation</span>
                    </span>

                    <Link
                      href={`/awards/${aId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-900 group-hover:text-white text-xs font-black transition-all duration-200"
                    >
                      <span>Read Full Details</span>
                      <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= 4. FOUNDATION MISSION & CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-linear-to-r from-amber-800 via-amber-700 to-yellow-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-black text-yellow-300 uppercase tracking-widest">
              <FiHeart className="w-3.5 h-3.5" />
              <span>Dedicated to Our Respected Elders</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Every Award Belongs to the Elders We Serve &amp; The Donors Who Stand With Us
            </h3>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-normal">
              These honors reflect our unconditional pledge: to ensure no destitute senior citizen in Jabalpur sleeps hungry,
              lacks medical care, or dies in loneliness. Join hands with us to bring light to more elderly lives.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/donation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-stone-950 text-xs font-black transition shadow-lg hover:shadow-xl hover:scale-102"
              >
                <FiHeart className="w-4 h-4 text-stone-950 fill-stone-950" />
                <span>Sponsor an Elder / Tithi Bhoj</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold transition backdrop-blur-xs"
              >
                <span>Learn About Our Foundation</span>
                <FiArrowRight className="w-4 h-4 text-yellow-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
