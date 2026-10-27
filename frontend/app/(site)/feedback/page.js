'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiMessageSquare,
  FiStar,
  FiPlus,
  FiTrash2,
  FiUser,
  FiCheckCircle,
  FiMail,
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiShield,
  FiGrid,
  FiCornerDownRight,
  FiLogIn,
  FiSettings,
  FiUploadCloud
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';
import DecorativeRings from '@/components/site/DecorativeRings';

// High quality initial seed feedbacks with admin replies and timestamps
const DEFAULT_FEEDBACKS = [
  {
    id: 'fb_1',
    name: 'Dr. Manish Sharma',
    email: 'dr.manish.sharma@healthplus.org',
    role: 'Regular 80G Donor',
    rating: 5,
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    comment: 'The transparency and dedicated elder care of Apna Parivar Vriddh Aashram Foundation is commendable. The 80G tax receipt was generated instantly and every rupee was accounted for in their senior meal and healthcare drive.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    adminReply: 'Thank you Dr. Manish! Your generous contributions support destitute senior citizens with shelter and nutritious satvik meals. We deeply value your ongoing trust.',
    adminRepliedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    repliedBy: 'Dr. Ravi Saini (Trustee & President)'
  },
  {
    id: 'fb_2',
    name: 'Suman Lata',
    email: 'suman.lata2026@gmail.com',
    role: 'Active Caregiver Volunteer',
    rating: 5,
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    comment: 'Volunteering with this ashram gave me a meaningful platform to serve elderly mothers and fathers with love, satsang, and genuine dignity. Highly inspiring initiative.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
    adminReply: 'Suman ji, our ashram is blessed with compassionate volunteers like you. Thank you for dedicating your time to our venerable parents!',
    adminRepliedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    repliedBy: 'Ashram Seva Coordinator'
  },
  {
    id: 'fb_3',
    name: 'Rajeev Khandelwal',
    email: 'rajeev.khandelwal@khandelwalenterprises.in',
    role: 'CSR Partner & Trustee',
    rating: 5,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    comment: 'All statutory compliances (12A, 80G, NITI Aayog Darpan) are meticulously maintained. Our corporate CSR contribution directly financed specialized geriatric medical beds and health equipment.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    adminReply: 'We appreciate Khandelwal Enterprises for sponsoring the medical ward setup. The statutory audit report is published in the dashboard.',
    adminRepliedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    repliedBy: 'Dr. Ravi Saini (Trustee & President)'
  },
  {
    id: 'fb_4',
    name: 'Pooja Verma',
    email: 'pooja.verma@techcorp.in',
    role: 'Annakshetra Supporter',
    rating: 5,
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    comment: 'Sponsored a feast day meal at the ashram for my mother’s birthday. The hygiene, pure satvik food, and prayers from the elders touched our entire family.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString() // 5 days ago
  },
  {
    id: 'fb_5',
    name: 'Vikramaditya Rathore',
    email: 'rathore.vikram@gmail.com',
    role: 'Well-wisher & Supporter',
    rating: 5,
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    comment: 'Visiting the ashram and celebrating festivals with the elderly residents was deeply moving. Proud to be associated with Apna Parivar Vriddh Aashram Foundation.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString() // 7 days ago
  },
  {
    id: 'fb_6',
    name: 'Ananya Mukherjee',
    email: 'ananya.m@delhiuni.ac.in',
    role: 'Student Volunteer',
    rating: 5,
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    comment: 'The free book distribution and educational remedial classes transformed dozens of lives in local settlements. Genuine, transparent, and inspiring NGO leadership.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString() // 10 days ago
  }
];

export default function FeedbackPage() {
  const {
    feedbacks = [],
    settings,
    addFeedback,
    replyFeedback,
    deleteFeedback,
    currentUser
  } = useNGO();

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'admin';
  const isAuthenticated = !!currentUser;

  // Responsive slider state: 2 in small devices, 3 in large devices
  const [itemsPerView, setItemsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // View More / Filter State
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', '5star', 'donor', 'volunteer', 'replied'
  const [displayCount, setDisplayCount] = useState(6);

  // Form Submission State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState(currentUser?.role === 'Member' ? 'Registered Member' : 'Donor & Well-wisher');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [profilePicture, setProfilePicture] = useState(currentUser?.photoUrl || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline Admin Reply Modal / Drawer on Public Site
  const [replyingFeedbackId, setReplyingFeedbackId] = useState(null);
  const [inlineReplyText, setInlineReplyText] = useState('');
  const [isSubmittingInlineReply, setIsSubmittingInlineReply] = useState(false);

  // Synchronize authenticated user info into form if logged in
  useEffect(() => {
    if (!currentUser) return;
    const timer = setTimeout(() => {
      setName((prev) => prev || currentUser.name || '');
      setEmail((prev) => prev || currentUser.email || '');
      setProfilePicture((prev) => prev || currentUser.photoUrl || '');
    }, 0);
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadingPhoto(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.data?.url || res.data?.fileUrl;
      if (url) {
        setProfilePicture(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Merge Context Feedbacks with Seed Defaults & Normalize
  const mergedFeedbacks = useMemo(() => {
    const list = [...(feedbacks.length ? feedbacks : DEFAULT_FEEDBACKS)];
    return list.map((fb, idx) => {
      const fallbackSeed = DEFAULT_FEEDBACKS[idx % DEFAULT_FEEDBACKS.length];
      return {
        ...fb,
        id: fb._id || fb.id || `fb_${idx}`,
        name: fb.name || 'Anonymous Supporter',
        email: fb.email || fallbackSeed.email,
        role: fb.role || fb.userRole || 'Community Supporter',
        rating: Number(fb.rating) || 5,
        profilePicture: fb.profilePicture || fb.photoUrl || fb.userId?.photoUrl || fallbackSeed.profilePicture || '',
        comment: fb.comment || '',
        createdAt: fb.createdAt || fb.date || fallbackSeed.createdAt,
        adminReply: fb.adminReply || '',
        adminRepliedAt: fb.adminRepliedAt || null,
        repliedBy: fb.repliedBy || ''
      };
    });
  }, [feedbacks]);

  // Sort Feedbacks: Latest First Mode
  const latestFeedbacks = useMemo(() => {
    return [...mergedFeedbacks].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
  }, [mergedFeedbacks]);

  // Filtered Feedbacks for Grid View
  const filteredFeedbacks = useMemo(() => {
    return latestFeedbacks.filter((fb) => {
      if (selectedFilter === '5star') return fb.rating === 5;
      if (selectedFilter === 'donor') return fb.role?.toLowerCase().includes('donor') || fb.role?.toLowerCase().includes('csr');
      if (selectedFilter === 'volunteer') return fb.role?.toLowerCase().includes('volunteer');
      if (selectedFilter === 'replied') return !!fb.adminReply;
      return true;
    });
  }, [latestFeedbacks, selectedFilter]);

  // Responsive Breakpoints Listener (2 in small devices, 3 in large devices)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Small devices: 2
      } else {
        setItemsPerView(3); // Large devices: 3
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, latestFeedbacks.length - itemsPerView);

  // Slider Navigation
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Autoplay Slider Loop
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  // Format Date and Time helpers
  const formatDateTime = (dateVal) => {
    if (!dateVal) return { dateStr: 'Recent', timeStr: '' };
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return { dateStr: dateVal, timeStr: '' };

    const dateStr = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return { dateStr, timeStr };
  };

  // Submit Feedback Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    setIsSubmitting(true);
    const newFeedback = {
      name: name.trim(),
      email: email.trim() || (currentUser?.email || `${name.toLowerCase().replace(/\s+/g, '')}@community.in`),
      role: role.trim() || 'Well-wisher & Donor',
      userRole: role.trim(),
      comment: comment.trim(),
      rating: Number(rating),
      profilePicture: (profilePicture || currentUser?.photoUrl || '').trim(),
      createdAt: new Date().toISOString(),
      date: new Date().toISOString()
    };

    if (currentUser?.id || currentUser?._id) {
      newFeedback.userId = currentUser.id || currentUser._id;
    }

    await addFeedback(newFeedback);

    if (!currentUser) {
      setName('');
      setEmail('');
    }
    setComment('');
    setRating(5);
    setIsSubmitting(false);
    setSubmitted(true);
    setCurrentIndex(0); // Jump to first item to see the new review immediately
  };

  // Inline Admin Reply Submit
  const handleInlineReply = async (e, fbId) => {
    e.preventDefault();
    if (!inlineReplyText.trim()) return;

    setIsSubmittingInlineReply(true);
    await replyFeedback(fbId, {
      reply: inlineReplyText.trim(),
      repliedBy: currentUser?.name || 'Ravi Saini (Trustee & President)',
      repliedByRole: currentUser?.role || 'Administrator'
    });

    setIsSubmittingInlineReply(false);
    setReplyingFeedbackId(null);
    setInlineReplyText('');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/40 via-stone-50 to-amber-50/30 py-10 sm:py-16 text-stone-800 relative overflow-hidden">
      {/* Decorative Dark Yellow & Purple Multi-Shape Concentric Rings on Page Corners */}
      {/* Top-Left: Large Dark Yellow & Purple Rings with Circles + Rotated Squircles */}
      <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full border-2 border-amber-500/35 ring-24 ring-purple-500/15 pointer-events-none" />
      <div className="absolute -top-28 -left-28 w-95 h-95 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-65 h-65 rounded-full border-2 border-yellow-500/40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-37.5 h-37.5 rounded-2xl rotate-45 border-2 border-purple-600/35 pointer-events-none" />

      {/* Top-Right: Alternating Purple & Dark Yellow Shapes */}
      <div className="absolute -top-40 -right-40 w-120 h-120 rounded-full border-2 border-purple-500/30 ring-20 ring-amber-400/15 pointer-events-none" />
      <div className="absolute -top-28 -right-28 w-90 h-90 rounded-3xl -rotate-12 border-2 border-amber-500/35 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full border-2 border-purple-600/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-35 h-35 rounded-2xl rotate-12 border border-yellow-500/35 pointer-events-none" />

      {/* Bottom-Left: Alternating Purple & Dark Yellow Shapes */}
      <div className="absolute -bottom-40 -left-40 w-120 h-120 rounded-full border-2 border-purple-500/30 ring-20 ring-amber-400/15 pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-90 h-90 rounded-3xl -rotate-12 border-2 border-amber-500/35 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border-2 border-purple-600/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-35 h-35 rounded-2xl rotate-12 border border-yellow-500/35 pointer-events-none" />

      {/* Bottom-Right: Large Dark Yellow & Purple Rings with Circles + Rotated Squircles */}
      <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full border-2 border-amber-500/35 ring-24 ring-purple-500/15 pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-95 h-95 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-65 h-65 rounded-full border-2 border-yellow-500/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-35.5 h-35.5 rounded-2xl rotate-45 border-2 border-purple-600/35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold shadow-2xs">
            <FiMessageSquare className="w-3.5 h-3.5 text-amber-700" />
            <span>Community Voice &amp; Verified Trust</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Reviews &amp; Public <span className="text-amber-700">Testimonials</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Real feedback and verified experiences shared by our contributors, regular donors, youth volunteers, and CSR partners across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-slate-800">
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </span>
              <strong className="text-slate-900 ml-0.5">4.9 / 5.0</strong>
              <span className="text-slate-400">• Verified Donor Reviews</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-slate-800">
              <FiShield className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Management Responses Active</span>
            </div>

            {isAdmin && (
              <Link
                href="/dashboard/feedback"
                className="flex items-center gap-1.5 bg-amber-100 text-amber-950 hover:bg-amber-200 px-4 py-2 rounded-full font-bold transition shadow-sm"
              >
                <FiSettings className="w-3.5 h-3.5 text-amber-800" />
                <span>Admin Feedback Panel →</span>
              </Link>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: LATEST FEEDBACKS FIRST IN RIGHT-TO-LEFT SLIDER */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 shadow-xl shadow-amber-950/6 space-y-6 border-none relative overflow-hidden">
          {/* Decorative Corner Concentric Dark Yellow & Purple Shapes on Slider Box */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-2 border-amber-500/35 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-38 h-38 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-yellow-500/40 pointer-events-none" />

          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-2 border-purple-500/30 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-38 h-38 rounded-3xl -rotate-12 border-2 border-amber-500/35 pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border border-purple-600/35 pointer-events-none" />

          {/* Slider Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                  Latest Feedbacks (Live Stream)
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Community Experiences &amp; Management Replies
              </h2>
              <p className="text-xs text-slate-500">
                Sorted latest first with verified user identity, timestamps, and official management responses.
              </p>
            </div>

            {/* Slider Controls & Counter */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
                Showing {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, latestFeedbacks.length)} of {latestFeedbacks.length}
              </span>

              <div className="flex items-center gap-1.5 bg-amber-50/80 p-1 rounded-2xl">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white text-slate-700 hover:text-amber-800 hover:bg-amber-100 shadow-xs transition cursor-pointer border-none"
                  title="Previous Reviews"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white text-slate-700 hover:text-amber-800 hover:bg-amber-100 shadow-xs transition cursor-pointer border-none"
                  title="Next Reviews"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slider Container (2 in small devices, 3 in large devices) */}
          <div className="overflow-hidden w-full relative z-10">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {latestFeedbacks.map((fb, idx) => {
                const { dateStr, timeStr } = formatDateTime(fb.createdAt || fb.date);
                const isNewest = idx === 0;
                const fbId = fb.id || fb._id;

                return (
                  <div
                    key={fbId || idx}
                    className="w-full sm:w-1/2 lg:w-1/3 shrink-0 p-2 sm:p-2.5"
                  >
                    <div className="bg-stone-50/70 hover:bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between relative group border-none overflow-hidden">
                      {/* Decorative corner rings inside individual card (Dark yellow & purple multi-shape) */}
                      <DecorativeRings variant="card" />

                      {isNewest && (
                        <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 shadow-2xs">
                          Latest Review
                        </span>
                      )}

                      <div className="space-y-3 relative z-10">
                        {/* Rating Stars & Role Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3.5 h-3.5 ${i < (fb.rating || 5)
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300'
                                  }`}
                              />
                            ))}
                          </div>

                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-950">
                            {fb.role}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-slate-700 leading-relaxed font-medium italic min-h-12.5">
                          &ldquo;{fb.comment}&rdquo;
                        </p>

                        {/* Official Admin Reply Banner with Admin Photo, Name & Borderless Container */}
                        {(fb.adminReply || fb.reply) && (
                          <div className="mt-3 bg-linear-to-r from-amber-50 via-amber-100/50 to-yellow-50/70 p-4 rounded-2xl space-y-2 border-none shadow-xs">
                            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-900 pb-1">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-white ring-2 ring-amber-400 p-0.5 shadow-xs shrink-0">
                                  <img
                                    src={getContentImageUrl(settings?.presidentPhotoUrl || settings?.logoUrl || '/logo.jpeg')}
                                    alt={fb.repliedBy || 'Admin Official'}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = '/logo.jpg';
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-amber-950 font-black text-xs">
                                      {fb.repliedBy || settings?.presidentName || 'Dr. Ravi Saini'}
                                    </span>
                                    <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 font-bold text-[8px]">
                                      Official Response
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-amber-800 font-medium">
                                    {fb.repliedByRole || 'Trustee & President Desk'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono hidden sm:inline-block">
                                {formatDateTime(fb.adminRepliedAt).dateStr}
                              </span>
                            </div>
                            <div className="flex items-start gap-2 pl-0.5 pt-0.5">
                              <FiCornerDownRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-slate-700 leading-relaxed font-medium italic">
                                &ldquo;{fb.adminReply || fb.reply}&rdquo;
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* User Identity, Email, Date & Time */}
                      <div className="mt-4 pt-3.5 space-y-2 relative z-10">
                        {/* User Name & Admin actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-300/80 bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                              {fb.profilePicture || fb.photoUrl ? (
                                <img
                                  src={getContentImageUrl(fb.profilePicture || fb.photoUrl)}
                                  alt={fb.name}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
                                  }}
                                />
                              ) : (
                                <span>{fb.name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900 truncate max-w-37.5" title={fb.name}>
                                {fb.name}
                              </h4>
                            </div>
                          </div>

                          {/* Admin Inline Action Controls */}
                          {isAdmin && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingFeedbackId(replyingFeedbackId === fbId ? null : fbId);
                                  setInlineReplyText(fb.adminReply || fb.reply || '');
                                }}
                                className="text-amber-900 hover:text-amber-950 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 cursor-pointer transition shadow-2xs border-none"
                              >
                                {fb.adminReply || fb.reply ? 'Edit Reply' : 'Reply'}
                              </button>

                              <button
                                onClick={() => deleteFeedback(fbId)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer border-none"
                                title="Delete review"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline Reply Form on Card (when admin clicks reply) */}
                        {isAdmin && replyingFeedbackId === fbId && (
                          <form
                            onSubmit={(e) => handleInlineReply(e, fbId)}
                            className="p-3 rounded-2xl bg-amber-50/90 shadow-sm space-y-2 mt-2 border-none"
                          >
                            <label className="text-[10px] font-bold text-amber-950 block">
                              Write Official Admin Reply:
                            </label>
                            <textarea
                              rows={2}
                              required
                              value={inlineReplyText}
                              onChange={(e) => setInlineReplyText(e.target.value)}
                              placeholder="Write your response as NGO Administrator..."
                              className="w-full text-xs p-2.5 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 border-none shadow-2xs"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setReplyingFeedbackId(null)}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-600 cursor-pointer shadow-2xs border-none"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmittingInlineReply}
                                className="px-3.5 py-1 rounded-lg text-[10px] font-bold bg-linear-to-r from-amber-500 to-yellow-500 text-amber-950 cursor-pointer shadow-xs hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 border-none"
                              >
                                {isSubmittingInlineReply ? 'Saving...' : 'Post Reply'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* User Email with Mail Icon (Masked for privacy unless admin) */}
                        {fb.email && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate font-mono">
                            <FiMail className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate" title={isAdmin ? fb.email : ''}>
                              {isAdmin
                                ? fb.email
                                : fb.email.replace(/(.{2})(.*)(?=@)/, (_m, a, b) => a + '*'.repeat(Math.max(3, b.length)))}
                            </span>
                          </div>
                        )}

                        {/* Time & Date Stamps */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-semibold">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3 text-slate-400" />
                            {dateStr}
                          </span>
                          {timeStr && (
                            <span className="flex items-center gap-1 font-mono text-slate-400">
                              <FiClock className="w-3 h-3 text-slate-400" />
                              {timeStr}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slider Footer: Indicators & Toggle More Feedbacks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 relative z-10">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer border-none ${currentIndex === i ? 'w-6 bg-amber-600' : 'w-2 bg-amber-100 hover:bg-amber-200'
                    }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Buttons to Display More Feedbacks */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowAllFeedbacks((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold shadow-2xs transition cursor-pointer border-none"
              >
                <FiGrid className="w-3.5 h-3.5 text-amber-700" />
                <span>{showAllFeedbacks ? 'Collapse Feedback Directory' : `Display All Feedbacks (${latestFeedbacks.length})`}</span>
              </button>

              <a
                href="#feedback-form"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 text-xs font-black shadow-md shadow-amber-500/20 transition cursor-pointer border-none"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Write Feedback</span>
              </a>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EXPANDED FEEDBACKS DIRECTORY (Triggered by "Display More" Button) */}
        {/* ------------------------------------------------------------- */}
        {showAllFeedbacks && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 shadow-xl shadow-amber-950/6 space-y-6 animate-fadeIn border-none relative overflow-hidden">
            {/* Decorative Corner Dark Yellow & Purple Multi-Shape Concentric Rings on Directory Box */}
            <DecorativeRings variant="dropdown" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 relative z-10">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Full Community Feedback Directory ({filteredFeedbacks.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter by category, verified 80G donors, or official management responses.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1 sm:pb-0">
                {[
                  { key: 'all', label: `All (${latestFeedbacks.length})` },
                  { key: 'replied', label: '🛡️ Replied by Admin' },
                  { key: '5star', label: '⭐ 5 Stars' },
                  { key: 'donor', label: '80G Donors' },
                  { key: 'volunteer', label: 'Volunteers' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedFilter(tab.key)}
                    className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-bold border-none ${selectedFilter === tab.key
                      ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-amber-950 shadow-xs'
                      : 'bg-amber-50/80 text-stone-700 hover:bg-amber-100'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Feedbacks (2 in small devices, 3 in large devices) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
              {filteredFeedbacks.slice(0, displayCount).map((fb, idx) => {
                const { dateStr, timeStr } = formatDateTime(fb.createdAt || fb.date);
                const fbId = fb.id || fb._id;

                return (
                  <div
                    key={fbId || idx}
                    className="bg-stone-50/70 hover:bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-none relative overflow-hidden group"
                  >
                    {/* Decorative corner rings inside card (Dark yellow & purple multi-shape) */}
                    <DecorativeRings variant="card" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3.5 h-3.5 ${i < (fb.rating || 5)
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-950">
                          {fb.role}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium italic min-h-11.25">
                        &ldquo;{fb.comment}&rdquo;
                      </p>

                      {/* Official Admin Reply in Grid with Admin Photo & Name, Borderless */}
                      {(fb.adminReply || fb.reply) && (
                        <div className="mt-3 bg-linear-to-r from-amber-50 via-amber-100/50 to-yellow-50/70 p-4 rounded-2xl space-y-2 border-none shadow-xs">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-900 pb-1">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-white ring-2 ring-amber-400 p-0.5 shadow-xs shrink-0">
                                <img
                                  src={getContentImageUrl(settings?.presidentPhotoUrl || settings?.logoUrl || '/logo.jpeg')}
                                  alt={fb.repliedBy || 'Admin Official'}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/logo.jpg';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-amber-950 font-black text-xs">
                                    {fb.repliedBy || settings?.presidentName || 'Dr. Ravi Saini'}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 font-bold text-[8px]">
                                    Official Response
                                  </span>
                                </div>
                                <p className="text-[9px] text-amber-800 font-medium">
                                  {fb.repliedByRole || 'Trustee & President Desk'}
                                </p>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono hidden sm:inline-block">
                              {formatDateTime(fb.adminRepliedAt).dateStr}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 pl-0.5 pt-0.5">
                            <FiCornerDownRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-700 leading-relaxed font-medium italic">
                              &ldquo;{fb.adminReply || fb.reply}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3.5 space-y-2 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-300/80 bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                            {fb.profilePicture || fb.photoUrl ? (
                              <img
                                src={getContentImageUrl(fb.profilePicture || fb.photoUrl)}
                                alt={fb.name}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
                                }}
                              />
                            ) : (
                              <span>{fb.name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-900 truncate max-w-37.5" title={fb.name}>
                            {fb.name}
                          </h4>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingFeedbackId(replyingFeedbackId === fbId ? null : fbId);
                                setInlineReplyText(fb.adminReply || fb.reply || '');
                              }}
                              className="text-amber-900 hover:text-amber-950 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 cursor-pointer transition shadow-2xs border-none"
                            >
                              {fb.adminReply || fb.reply ? 'Edit Reply' : 'Reply'}
                            </button>
                            <button
                              onClick={() => deleteFeedback(fbId)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer border-none"
                              title="Delete review"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* User Email (Masked for privacy unless admin) */}
                      {fb.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate">
                          <FiMail className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">
                            {isAdmin
                              ? fb.email
                              : fb.email.replace(/(.{2})(.*)(?=@)/, (_m, a, b) => a + '*'.repeat(Math.max(3, b.length)))}
                          </span>
                        </div>
                      )}

                      {/* Date & Time */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-semibold">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                        {timeStr && (
                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            <FiClock className="w-3 h-3 text-slate-400" />
                            {timeStr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button for Grid */}
            {displayCount < filteredFeedbacks.length && (
              <div className="text-center pt-4 relative z-10">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + 6)}
                  className="px-7 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer border-none"
                >
                  Load More Feedbacks ({filteredFeedbacks.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: AUTHENTICATED USER FEEDBACK SUBMISSION FORM */}
        {/* ------------------------------------------------------------- */}
        <div id="feedback-form" className="bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-10 shadow-2xl shadow-amber-950/8 max-w-2xl mx-auto space-y-6 border-none relative overflow-hidden">
          {/* Decorative Corner Dark Yellow & Purple Multi-Shape Rings on Form Box */}
          <DecorativeRings variant="dropdown" />

          <div className="text-center space-y-1 pb-2 relative z-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Share Your Experience &amp; Blessings
            </h3>
            <p className="text-xs text-slate-500">
              Your feedback is published directly to motivate our youth volunteers and strengthen donor transparency.
            </p>
          </div>

          {/* Authentication Status Banner */}
          {isAuthenticated ? (
            <div className="bg-amber-50/80 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs relative z-10 shadow-xs border-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs ring-2 ring-amber-400">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <span>Logged In as {currentUser.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200 text-amber-950 font-bold">
                      Verified {currentUser.role || 'Member'}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-mono">{currentUser.email}</span>
                </div>
              </div>

              <span className="text-[10px] text-amber-900 font-bold px-2.5 py-1 bg-white rounded-xl shadow-2xs">
                Auto-Verified Review
              </span>
            </div>
          ) : (
            <div className="bg-amber-50/70 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10 shadow-xs border-none">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <FiUser className="w-4 h-4 text-amber-700" />
                <span>Posting as Guest. Have an Apna Parivar Vriddh Aashram account?</span>
              </div>
              <Link
                href="/login?redirect=/feedback"
                className="inline-flex items-center gap-1 text-amber-900 font-black hover:underline whitespace-nowrap bg-white px-3 py-1 rounded-xl shadow-2xs"
              >
                <FiLogIn className="w-3.5 h-3.5" />
                <span>Log in to Verify Review</span>
              </Link>
            </div>
          )}

          {submitted ? (
            <div className="bg-amber-50/90 text-amber-950 p-7 rounded-3xl text-center text-xs space-y-3 relative z-10 shadow-xs border-none">
              <FiCheckCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <div className="font-black text-base text-amber-950">
                Thank You! Your Review Has Been Published Successfully.
              </div>
              <p className="text-slate-600 max-w-md mx-auto text-xs leading-relaxed">
                Your feedback has been added directly to our real-time community stream. Our management team audits every review and frequently provides official replies.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-6 py-2.5 bg-linear-to-r from-amber-500 to-yellow-500 text-amber-950 rounded-2xl font-black transition cursor-pointer shadow-md hover:from-amber-600 hover:to-yellow-600 border-none"
              >
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Manish Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 bg-stone-50/80 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 text-xs border-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Your Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. manish.sharma@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 bg-stone-50/80 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 text-xs border-none shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Affiliation / Role */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Your Role / Relationship with NGO
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50/80 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 text-xs cursor-pointer border-none shadow-2xs"
                >
                  <option value="Regular 80G Donor">Regular 80G Donor</option>
                  <option value="Active Youth Volunteer">Active Youth Volunteer</option>
                  <option value="Registered Member">Registered Member</option>
                  <option value="CSR Partner & Corporate Donor">CSR Partner &amp; Corporate Donor</option>
                  <option value="Event / Blood Donor">Event / Blood Donor</option>
                  <option value="Well-wisher & Supporter">Well-wisher &amp; Supporter</option>
                </select>
              </div>

              {/* Profile Photo / Avatar */}
              <div className="p-4 rounded-2xl bg-amber-50/50 space-y-2 border-none shadow-2xs">
                <label className="font-bold text-slate-800 block text-xs">
                  Your Photo / Avatar (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-400 bg-amber-100 flex items-center justify-center shrink-0 shadow-xs">
                    {profilePicture ? (
                      <img
                        src={getContentImageUrl(profilePicture)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <FiUser className="w-6 h-6 text-amber-700" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-stone-800 hover:bg-amber-100 font-bold text-xs cursor-pointer transition shadow-xs border-none">
                      <FiUploadCloud className="w-3.5 h-3.5 text-amber-600" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Your Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Shows next to your review in the community stream and homepage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Rating Experience *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`py-2.5 px-2 rounded-2xl font-bold flex items-center justify-center gap-1 cursor-pointer transition text-xs border-none ${rating === star
                        ? 'bg-amber-100 text-amber-950 shadow-xs ring-2 ring-amber-400'
                        : 'bg-stone-50 text-slate-700 hover:bg-amber-50'
                        }`}
                    >
                      <FiStar
                        className={`w-3.5 h-3.5 ${rating >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`}
                      />
                      <span>{star} ★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Your Feedback / Testimonial *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your thoughts on transparency, volunteering experience, tax deduction receipts, or social impact..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 bg-stone-50/80 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 text-xs border-none shadow-2xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-none"
              >
                <FiSend className="w-4 h-4" />
                <span>{isSubmitting ? 'Posting Review...' : 'Publish Testimonial (Live Stream)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
