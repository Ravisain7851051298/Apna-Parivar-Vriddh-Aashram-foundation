"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiAward,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiExternalLink,
  FiEye,
  FiUploadCloud,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiGrid,
  FiList,
  FiShield,
  FiCheck,
  FiLayers
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";
import { useNGO } from "@/context/NGOContext";

const CATEGORY_OPTIONS = [
  "Senior Citizen Rehabilitation & Welfare",
  "Institutional Elder Care Benchmark",
  "Humanitarian Elder Relief",
  "Social Compassion & Elder Care",
  "Geriatric Healthcare & Palliative Aid",
  "Community Social Welfare",
  "State Social Service Honor",
  "National Welfare Citation"
];

const TIER_OPTIONS = [
  "National Honor",
  "State Award",
  "Humanitarian Trophy",
  "Special Citation",
  "Excellence Award",
  "Lifetime Seva Honor",
  "Institutional Citation"
];

export default function OrgAwardsManagement() {
  const { refreshAwards } = useNGO();
  const [loading, setLoading] = useState(true);
  const [awards, setAwards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All | Active | Inactive
  const [viewMode, setViewMode] = useState("grid"); // grid | table

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Quick View Modal
  const [viewingAward, setViewingAward] = useState(null);

  // Delete Confirm Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Uploading state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const initialFormState = {
    title: "",
    awardedBy: "",
    year: new Date().getFullYear().toString(),
    venue: "Jabalpur, Madhya Pradesh",
    dateConferred: "",
    category: "Senior Citizen Rehabilitation & Welfare",
    tier: "State Award",
    awardImage: "",
    certificateUrl: "",
    description: "",
    fullContent: "",
    citation: "",
    badgeColor: "gold",
    badgeIcon: "FiAward",
    points: 100,
    order: 0,
    isActive: true,
    isOrgAward: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch awards
  const fetchOrgAwards = async () => {
    try {
      setLoading(true);
      // Fetch specifically all org awards (including inactive)
      const res = await api.get("/awards", {
        params: {
          isOrgAward: true,
          includeInactive: true,
          all: true
        }
      });
      const list = res.data?.awards || res.data?.data || [];
      // Ensure only isOrgAward are kept
      const orgList = Array.isArray(list) ? list.filter((a) => a.isOrgAward !== false) : [];
      setAwards(orgList);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load organization awards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgAwards();
  }, []);

  // Filtered Awards
  const filteredAwards = useMemo(() => {
    return awards.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const title = (item.title || "").toLowerCase();
      const by = (item.awardedBy || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const year = (item.year || "").toLowerCase();

      const matchesSearch = !q || title.includes(q) || by.includes(q) || cat.includes(q) || desc.includes(q) || year.includes(q);
      if (!matchesSearch) return false;

      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      if (statusFilter === "Active" && item.isActive === false) return false;
      if (statusFilter === "Inactive" && item.isActive !== false) return false;

      return true;
    });
  }, [awards, searchQuery, selectedCategory, statusFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = awards.length;
    const active = awards.filter((a) => a.isActive !== false).length;
    const uniqueBodies = new Set(awards.map((a) => (a.awardedBy || "").trim()).filter(Boolean)).size;
    const years = awards.map((a) => a.year).filter(Boolean);
    const latestYear = years.length ? Math.max(...years.map((y) => parseInt(y, 10) || 0)) : "-";

    return { total, active, uniqueBodies, latestYear };
  }, [awards]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingAward(null);
    setFormData({
      ...initialFormState,
      order: awards.length + 1
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (award) => {
    setEditingAward(award);
    setFormData({
      title: award.title || "",
      awardedBy: award.awardedBy || "",
      year: award.year || "",
      venue: award.venue || "",
      dateConferred: award.dateConferred ? new Date(award.dateConferred).toISOString().split("T")[0] : "",
      category: award.category || "Senior Citizen Rehabilitation & Welfare",
      tier: award.tier || "State Award",
      awardImage: award.awardImage || award.image || "",
      certificateUrl: award.certificateUrl || "",
      description: award.description || "",
      fullContent: award.fullContent || "",
      citation: award.citation || "",
      badgeColor: award.badgeColor || "gold",
      badgeIcon: award.badgeIcon || "FiAward",
      points: award.points || 100,
      order: award.order ?? 0,
      isActive: award.isActive !== false,
      isOrgAward: true
    });
    setModalOpen(true);
  };

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (JPG, PNG, WebP)");
      return;
    }

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "awards");

      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const url = res.data?.url || res.data?.fileUrl;
      if (url) {
        setFormData((prev) => ({ ...prev, awardImage: url }));
        toast.success("Award image uploaded successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload award image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Quick toggle active status
  const handleToggleActive = async (award) => {
    const newStatus = !award.isActive;
    try {
      const res = await api.put(`/awards/${award._id}`, { isActive: newStatus });
      if (res.data?.success) {
        toast.success(`Award is now ${newStatus ? "Active (Displayed)" : "Hidden"}`);
        setAwards((prev) =>
          prev.map((a) => (a._id === award._id ? { ...a, isActive: newStatus } : a))
        );
        refreshAwards?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Save Award (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter the award name / title");
      return;
    }
    if (!formData.awardedBy.trim()) {
      toast.error("Please enter who conferred the award (Sanstha / Organization / Council)");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        isOrgAward: true,
        image: formData.awardImage
      };

      if (editingAward) {
        const res = await api.put(`/awards/${editingAward._id}`, payload);
        toast.success(res.data?.message || "Organization award updated successfully");
      } else {
        const res = await api.post("/awards", payload);
        toast.success(res.data?.message || "Organization award added successfully");
      }

      setModalOpen(false);
      await fetchOrgAwards();
      refreshAwards?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save organization award");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Award
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/awards/${deleteTarget._id}`);
      toast.success(res.data?.message || "Award deleted successfully");
      setDeleteTarget(null);
      await fetchOrgAwards();
      refreshAwards?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete award");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ================= 1. PAGE TITLE & HEADER ================= */}
      <div className="bg-linear-to-r from-amber-700 via-amber-600 to-yellow-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <FiShield className="w-3.5 h-3.5 text-yellow-300" />
              <span>Finance &amp; Statutory Accreditations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <FiAward className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 shrink-0" />
              <span>Organization Awards &amp; Honors</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl font-medium leading-relaxed">
              Manage awards, state honors, and humanitarian citations conferred upon{" "}
              <strong className="text-white">Apna Parivar Vriddh Aashram Foundation</strong> by government bodies,
              philanthropic councils, and institutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/awards"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold transition shadow-xs backdrop-blur-xs"
            >
              <FiExternalLink className="w-4 h-4 text-yellow-300" />
              <span>View Public Page</span>
            </Link>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-stone-950 text-xs font-black transition shadow-lg hover:shadow-xl hover:scale-102 cursor-pointer"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" />
              <span>Add New Org Award</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. STATS ROW ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
            <FiAward className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Org Honors
            </span>
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Active on Site
            </span>
            <span className="text-2xl font-black text-emerald-700">{stats.active}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-blue-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl shrink-0">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Conferring Sansthas
            </span>
            <span className="text-2xl font-black text-slate-900">{stats.uniqueBodies}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl shrink-0">
            <FiCalendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Latest Recognition
            </span>
            <span className="text-2xl font-black text-purple-900">{stats.latestYear}</span>
          </div>
        </div>
      </div>

      {/* ================= 3. SEARCH & CONTROLS ================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search awards by title, conferring sanstha, category..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm font-medium outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter awards by active status"
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Hidden Only</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter awards by category"
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 cursor-pointer max-w-[200px]"
            >
              <option value="All">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchOrgAwards}
              title="Refresh list"
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-600" : ""}`} />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  viewMode === "table" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. AWARDS LIST (GRID / TABLE) ================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-44 bg-slate-200 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredAwards.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl">
            <FiAward className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              No Organization Awards Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All" || statusFilter !== "All"
                ? "Try adjusting your filters or search keywords to find what you're looking for."
                : "No organization awards have been registered yet. Click below to add the first award."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Org Award</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((item) => {
            const imgUrl = getContentImageUrl(item.awardImage || item.image) || "/logo.jpg";
            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/logo.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Year & Tier Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {item.year && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-950 bg-linear-to-r from-amber-300 to-yellow-300 shadow-xs flex items-center gap-1">
                          <FiAward className="w-3 h-3 text-amber-900" />
                          <span>{item.year}</span>
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-xs border border-white/20">
                        {item.tier || "Honor"}
                      </span>
                    </div>

                    {/* Active Status Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        title={item.isActive !== false ? "Click to Hide" : "Click to Display"}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition shadow-xs cursor-pointer ${
                          item.isActive !== false
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {item.isActive !== false ? (
                          <>
                            <FiCheck className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <FiX className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Conferred By Badge Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-0.5">
                        Conferred By
                      </span>
                      <p className="text-xs font-bold text-white truncate drop-shadow-sm">
                        {item.awardedBy || "Government / Institutional Body"}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-amber-800 uppercase tracking-wide truncate max-w-[70%]">
                        {item.category || "Social Service"}
                      </span>
                      {item.venue && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                          <FiMapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{item.venue}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 transition leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewingAward(item)}
                      title="Quick Preview"
                      className="p-2 rounded-xl text-slate-500 hover:text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/awards/${item._id}`}
                      target="_blank"
                      title="View public details page"
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition cursor-pointer"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="inline-flex items-center gap-1 p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Award"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Award Details</th>
                  <th className="py-3.5 px-4">Conferred By (Sanstha)</th>
                  <th className="py-3.5 px-4">Year &amp; Tier</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAwards.map((item) => {
                  const imgUrl = getContentImageUrl(item.awardImage || item.image) || "/logo.jpg";
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imgUrl}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/logo.jpg";
                            }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.title}</span>
                            {item.venue && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <FiMapPin className="w-2.5 h-2.5 text-amber-600" />
                                <span>{item.venue}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 inline-block">
                          {item.awardedBy || "N/A"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">{item.year || "-"}</span>
                        <span className="text-[10px] text-slate-500 block">{item.tier || "Standard"}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-medium">{item.category}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            item.isActive !== false
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.isActive !== false ? "Active" : "Hidden"}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingAward(item)}
                            title="Preview"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/awards/${item._id}`}
                            target="_blank"
                            title="View public details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 5. ADD / EDIT MODAL DRAWER ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 bg-linear-to-r from-amber-700 via-amber-600 to-yellow-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-300">
                  <FiAward className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">
                    {editingAward ? "Edit Organization Award" : "Add New Organization Award"}
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    National &amp; state recognitions conferred to Apna Parivar Vriddh Aashram
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              {/* Award Title */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Award / Citation Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Madhya Pradesh Rajya Samaj Seva Gaurav Samman"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Conferred By (Sanstha / Group) */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Conferred By (Sanstha / Ministry / Council / Group) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.awardedBy}
                  onChange={(e) => setFormData({ ...formData, awardedBy: e.target.value })}
                  placeholder="e.g. Government of Madhya Pradesh & State Social Welfare Council"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Grid 3: Year, Venue, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Venue / City</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Bhopal, M.P."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Date Conferred</label>
                  <input
                    type="date"
                    value={formData.dateConferred}
                    onChange={(e) => setFormData({ ...formData, dateConferred: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Grid 2: Category, Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-semibold"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Honor Tier</label>
                  <input
                    type="text"
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    placeholder="State Award / National Honor"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Image Upload & Preview */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Award Image / Trophy Photo</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 transition cursor-pointer">
                      <FiUploadCloud className="w-4 h-4 text-amber-700" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">or enter image URL directly:</span>
                  </div>

                  <input
                    type="text"
                    value={formData.awardImage}
                    onChange={(e) => setFormData({ ...formData, awardImage: e.target.value })}
                    placeholder="/uploads/awards/... or https://..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono outline-none focus:border-amber-500"
                  />

                  {formData.awardImage && (
                    <div className="relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm">
                      <img
                        src={getContentImageUrl(formData.awardImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/logo.jpg";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, awardImage: "" })}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Short Summary (for cards) */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Card Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short 1-2 sentence summary displayed on cards across the website..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-medium leading-relaxed"
                />
              </div>

              {/* Full Content / Citation (for details page) */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Full Citation &amp; Ceremony Story (View Award Details Page)
                </label>
                <textarea
                  rows={5}
                  value={formData.fullContent}
                  onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                  placeholder="Complete writeup of the award ceremony, dignitaries present, the social work and elder care initiatives recognized, citations read, and organizational milestones..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none font-medium leading-relaxed font-sans"
                />
              </div>

              {/* Certificate URL & Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">Citation / Certificate Document URL</label>
                  <input
                    type="text"
                    value={formData.certificateUrl}
                    onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                    placeholder="URL to certificate PDF or image"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Display Status</span>
                  <span className="text-[11px] text-slate-600">
                    When active, this award is featured on the home page and public awards directory.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {submitting && <FiRefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingAward ? "Update Org Award" : "Save Org Award"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 6. QUICK PREVIEW MODAL ================= */}
      {viewingAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-200 relative my-auto">
            <button
              type="button"
              onClick={() => setViewingAward(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Top image */}
            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100 border border-amber-200">
              <img
                src={getContentImageUrl(viewingAward.awardImage || viewingAward.image) || "/logo.jpg"}
                alt={viewingAward.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase text-amber-950 bg-amber-300">
                  {viewingAward.year || "Award"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900/70">
                  {viewingAward.tier}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wide block">
                Conferred By: {viewingAward.awardedBy}
              </span>
              <h3 className="text-xl font-black text-slate-900">{viewingAward.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {viewingAward.description}
              </p>
              {viewingAward.fullContent && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {viewingAward.fullContent}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Venue: {viewingAward.venue || "Jabalpur, M.P."}
              </span>
              <Link
                href={`/awards/${viewingAward._id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
              >
                <span>Full Details Page</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. DELETE CONFIRMATION MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-rose-200 text-center my-auto">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl">
              <FiTrash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Delete Organization Award?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete{" "}
                <strong className="text-slate-900">&quot;{deleteTarget.title}&quot;</strong>? This action will remove
                it from the home page and public awards directory.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {deleting && <FiRefreshCw className="w-4 h-4 animate-spin" />}
                <span>Yes, Delete Award</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
