"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiEye,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUser,
  FiX,
  FiXCircle,
  FiAlertCircle,
  FiCornerDownRight,
  FiShield,
  FiUploadCloud,
  FiImage
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";
import { useNGO } from "@/context/NGOContext";

function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

export default function FeedbackManagement() {
  const { currentUser, settings } = useNGO();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'approved' | 'pending' | 'rejected' | 'replied'
  const [searchQuery, setSearchQuery] = useState("");

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    userRole: "Supporter",
    rating: 5,
    comment: "",
    profilePicture: "",
    status: "Approved",
    adminReply: "",
    repliedBy: "",
    repliedByRole: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyModalItem, setReplyModalItem] = useState(null);
  const [replyForm, setReplyForm] = useState({
    reply: "",
    repliedBy: "",
    repliedByRole: ""
  });
  const [submittingReply, setSubmittingReply] = useState(false);

  // Delete Modal State
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/feedback?status=all");
      const list = res.data?.data || res.data?.feedbacks || res.data?.items || [];
      setFeedbacks(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      userRole: "Supporter",
      rating: 5,
      comment: "",
      profilePicture: "",
      status: "Approved",
      adminReply: "",
      repliedBy: currentUser?.name || settings?.presidentName || "Dr. Ravi Saini",
      repliedByRole: currentUser?.role || "Trustee & President"
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      userRole: item.userRole || item.role || "Supporter",
      rating: item.rating || 5,
      comment: item.comment || "",
      profilePicture: item.profilePicture || item.photoUrl || item.userId?.photoUrl || "",
      status: item.status || "Approved",
      adminReply: item.adminReply || item.reply || "",
      repliedBy: item.repliedBy || currentUser?.name || "Dr. Ravi Saini",
      repliedByRole: item.repliedByRole || currentUser?.role || "Trustee & President"
    });
    setModalOpen(true);
  };

  const openReplyModal = (item) => {
    setReplyModalItem(item);
    setReplyForm({
      reply: item.adminReply || item.reply || "",
      repliedBy: item.repliedBy || currentUser?.name || settings?.presidentName || "Dr. Ravi Saini",
      repliedByRole: item.repliedByRole || "Trustee & President"
    });
    setReplyModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingPhoto(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const url = res.data?.url || res.data?.fileUrl;
      if (url) {
        setForm((prev) => ({ ...prev, profilePicture: url }));
        toast.success("User photo uploaded successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.comment?.trim()) {
      toast.error("Reviewer Name and Testimonial message are required");
      return;
    }
    try {
      setSubmitting(true);
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await api.put(`/feedback/${id}`, form);
        toast.success("Testimonial updated successfully!");
      } else {
        await api.post("/feedback", form);
        toast.success("Testimonial published successfully!");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyModalItem) return;
    if (!replyForm.reply?.trim()) {
      toast.error("Reply text cannot be empty");
      return;
    }

    try {
      setSubmittingReply(true);
      const id = replyModalItem._id || replyModalItem.id;
      await api.put(`/feedback/${id}/reply`, {
        reply: replyForm.reply.trim(),
        repliedBy: replyForm.repliedBy.trim() || "Dr. Ravi Saini (Trustee & President)",
        repliedByRole: replyForm.repliedByRole.trim() || "Administrator"
      });
      toast.success("Official reply dispatched and published!");
      setReplyModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleClearReply = async () => {
    if (!replyModalItem) return;
    try {
      setSubmittingReply(true);
      const id = replyModalItem._id || replyModalItem.id;
      await api.put(`/feedback/${id}/reply`, { clearReply: true, reply: "" });
      toast.success("Official reply cleared successfully");
      setReplyModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/feedback/${id}/status`, { status });
      toast.success(`Review ${status.toLowerCase()}!`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    try {
      const id = deleteModalItem._id || deleteModalItem.id;
      await api.delete(`/feedback/${id}`);
      toast.success("Testimonial deleted successfully!");
      setDeleteModalItem(null);
      loadData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = feedbacks.filter((f) => {
    const status = (f.status || "Pending").toLowerCase();
    const hasReply = Boolean(f.adminReply || f.reply);

    let matchStatus = true;
    if (activeTab === "replied") {
      matchStatus = hasReply;
    } else if (activeTab !== "all") {
      matchStatus = status === activeTab.toLowerCase();
    }

    const q = searchQuery.toLowerCase();
    const name = (f.name || "").toLowerCase();
    const comment = (f.comment || "").toLowerCase();
    const replyText = (f.adminReply || f.reply || "").toLowerCase();

    return matchStatus && (name.includes(q) || comment.includes(q) || replyText.includes(q));
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="w-full bg-linear-to-r from-amber-100/90 via-[#fefce8] to-amber-50 p-4 rounded-bl-3xl border-b border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-white text-amber-900 border border-amber-300 shadow-2xs shrink-0">
              <FiMessageSquare className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-stone-950 tracking-tight">Reviews &amp; Testimonials</h1>
              <p className="text-xs text-amber-950/80 font-medium">
                Apna Parivar Vriddh Aashram Foundation • Public Voices, User Avatars &amp; Official Replies
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-stone-700 font-bold text-xs transition cursor-pointer shadow-2xs"
            title="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 text-amber-800 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/feedback"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition shadow-2xs"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>View Public Page</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-stone-600 hover:text-amber-900 bg-white/80 hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition shadow-2xs"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="px-3 space-y-4 pb-12">
        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by reviewer name, comment or reply..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-amber-500 text-black placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: `All (${feedbacks.length})` },
              { id: "approved", label: "Approved" },
              { id: "replied", label: "🛡️ Has Reply" },
              { id: "pending", label: "Pending" },
              { id: "rejected", label: "Rejected" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          {loading ? (
            <div className="p-12 text-center text-slate-700 text-xs space-y-2">
              <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600" />
              <p>Loading testimonials...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-700 text-xs space-y-2">
              <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-black">No testimonials found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((f) => {
                const id = f._id || f.id;
                const status = f.status || "Pending";
                const userPhoto = f.profilePicture || f.photoUrl || f.userId?.photoUrl;
                const hasAdminReply = Boolean(f.adminReply || f.reply);

                return (
                  <div
                    key={id}
                    className="bg-slate-50/80 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 flex flex-col justify-between hover:shadow-md transition text-black space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Stars + Status */}
                      <div className="flex items-center justify-between">
                        <StarRating rating={f.rating || 5} />
                        <div className="flex items-center gap-1.5">
                          {hasAdminReply && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                              <FiShield className="w-2.5 h-2.5" />
                              Replied
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              status.toLowerCase() === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : status.toLowerCase() === "rejected"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-800 italic leading-relaxed min-h-11">
                        &ldquo;{f.comment}&rdquo;
                      </p>

                      {/* Official Admin Reply Card if present */}
                      {hasAdminReply && (
                        <div className="bg-linear-to-br from-amber-50 to-yellow-50/40 p-3 rounded-xl border border-amber-200/90 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-950 border-b border-amber-200/50 pb-1">
                            <span className="flex items-center gap-1 text-amber-900">
                              <FiShield className="w-3.5 h-3.5 text-amber-700" />
                              Official Reply from {f.repliedBy || "Management"}
                            </span>
                            {f.adminRepliedAt && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(f.adminRepliedAt).toLocaleDateString("en-IN")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-start gap-1.5 pl-0.5">
                            <FiCornerDownRight className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                              {f.adminReply || f.reply}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Reviewer Identity with Photo Avatar */}
                      <div className="pt-2.5 border-t border-slate-200/90 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-300 bg-amber-100 text-amber-950 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {userPhoto ? (
                              <img
                                src={getContentImageUrl(userPhoto)}
                                alt={f.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<span>${f.name?.charAt(0) || "U"}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <span>{f.name?.charAt(0) || "U"}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-black truncate" title={f.name}>
                              {f.name}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {f.userRole || f.role || "Supporter"}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {f.createdAt ? new Date(f.createdAt).toLocaleDateString("en-IN") : ""}
                        </span>
                      </div>
                    </div>

                    {/* Action Bar: Approve/Reject, Reply CTA, Edit, Delete */}
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {status !== "Approved" && (
                          <button
                            onClick={() => handleStatusChange(id, "Approved")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition cursor-pointer border border-emerald-200"
                          >
                            Approve
                          </button>
                        )}
                        {status !== "Rejected" && (
                          <button
                            onClick={() => handleStatusChange(id, "Rejected")}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition cursor-pointer border border-rose-200"
                          >
                            Reject
                          </button>
                        )}

                        {/* Dedicated Reply / Edit Reply Button */}
                        <button
                          onClick={() => openReplyModal(f)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer shadow-2xs ${
                            hasAdminReply
                              ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                              : "bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 border border-amber-400"
                          }`}
                          title={hasAdminReply ? "Edit official reply" : "Reply to testimonial"}
                        >
                          <FiCornerDownRight className="w-3 h-3" />
                          <span>{hasAdminReply ? "Edit Reply" : "Reply"}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(f)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-white border border-transparent hover:border-slate-200 transition"
                          title="Edit Testimonial & Details"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModalItem(f)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MODAL 1: REPLY TO TESTIMONIAL (ADMIN MANAGEMENT DESK) */}
        {/* ------------------------------------------------------------- */}
        {replyModalOpen && replyModalItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                  <FiCornerDownRight className="w-4 h-4 text-amber-700" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-black">
                    {replyModalItem.adminReply ? "Edit Official Reply" : "Reply to Testimonial"}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Respond on behalf of Apna Parivar Vriddh Aashram Management.
                  </p>
                </div>
              </div>

              {/* Review Context Card */}
              <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300 bg-amber-100 text-amber-950 font-black text-xs flex items-center justify-center shrink-0">
                    {replyModalItem.profilePicture || replyModalItem.photoUrl || replyModalItem.userId?.photoUrl ? (
                      <img
                        src={getContentImageUrl(replyModalItem.profilePicture || replyModalItem.photoUrl || replyModalItem.userId?.photoUrl)}
                        alt={replyModalItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{replyModalItem.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-black block">{replyModalItem.name}</span>
                    <span className="text-[10px] text-slate-500">{replyModalItem.userRole || "Supporter"}</span>
                  </div>
                </div>
                <p className="text-slate-700 italic border-l-2 border-amber-400 pl-2 text-[11px] leading-relaxed">
                  &ldquo;{replyModalItem.comment}&rdquo;
                </p>
              </div>

              <form onSubmit={handleReplySubmit} className="space-y-4 text-xs text-black">
                <div>
                  <label className="font-extrabold text-black block mb-1">
                    Official Admin Reply Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={replyForm.reply}
                    onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                    placeholder="Write a warm, dignified acknowledgment expressing gratitude for their support or blessing..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-black block mb-1">Responder Name</label>
                    <input
                      type="text"
                      value={replyForm.repliedBy}
                      onChange={(e) => setReplyForm({ ...replyForm, repliedBy: e.target.value })}
                      placeholder="e.g. Dr. Ravi Saini"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-black block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={replyForm.repliedByRole}
                      onChange={(e) => setReplyForm({ ...replyForm, repliedByRole: e.target.value })}
                      placeholder="e.g. Trustee & President"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {replyModalItem.adminReply ? (
                    <button
                      type="button"
                      disabled={submittingReply}
                      onClick={handleClearReply}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition cursor-pointer text-xs"
                    >
                      Delete Reply
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyModalOpen(false)}
                      className="px-4 py-2 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReply}
                      className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      {submittingReply ? "Saving..." : "Dispatch Reply"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL 2: ADD / EDIT TESTIMONIAL WITH USER IMAGE */}
        {/* ------------------------------------------------------------- */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black my-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-black mb-1">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <p className="text-xs text-slate-600 mb-6">
                Publish or curate community feedback, user avatar, and responses.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs text-black">
                {/* Reviewer Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-black block mb-1">Reviewer Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Dr. Manish Sharma"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-black block mb-1">Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Regular 80G Donor / Volunteer"
                      value={form.userRole}
                      onChange={(e) => setForm({ ...form, userRole: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-black block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. supporter@gmail.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-black block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                    />
                  </div>
                </div>

                {/* User Image Upload & Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <label className="font-extrabold text-black block">
                    Reviewer Photo / Avatar
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-amber-100 flex items-center justify-center shrink-0">
                      {form.profilePicture ? (
                        <img
                          src={getContentImageUrl(form.profilePicture)}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <FiUser className="w-6 h-6 text-amber-700" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-stone-700 hover:bg-amber-50 font-bold text-xs cursor-pointer transition shadow-2xs">
                        <FiUploadCloud className="w-4 h-4 text-amber-600" />
                        <span>{uploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or enter Image URL (e.g. https://... or /uploads/...)"
                        value={form.profilePicture}
                        onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-amber-500 text-[11px] text-black bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-black block mb-1">Star Rating (1 - 5)</label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-bold text-black bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Stars {r === 5 ? "⭐⭐⭐⭐⭐" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-extrabold text-black block mb-1">Publication Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-bold text-black bg-white"
                    >
                      <option value="Approved">Approved (Public Live)</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Review Message */}
                <div>
                  <label className="font-extrabold text-black block mb-1">Testimonial Message *</label>
                  <textarea
                    rows={3}
                    required
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    placeholder="Write the testimonial reflection..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                  />
                </div>

                {/* Optional Admin Reply directly in edit */}
                <div>
                  <label className="font-extrabold text-black block mb-1">
                    Official Admin Reply (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={form.adminReply}
                    onChange={(e) => setForm({ ...form, adminReply: e.target.value })}
                    placeholder="Official response displayed on the testimonial..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-amber-500 font-medium text-black bg-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : editingItem ? "Update Testimonial" : "Publish Testimonial"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL 3: DELETE CONFIRMATION */}
        {/* ------------------------------------------------------------- */}
        {deleteModalItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
                <FiTrash2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-black">Delete Testimonial?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently delete the testimonial from{" "}
                <strong>{deleteModalItem.name}</strong>?
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
