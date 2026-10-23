'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiUploadCloud,
  FiImage,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiLayers,
  FiActivity,
  FiCalendar,
  FiAward,
  FiShield,
  FiBookOpen,
  FiCompass,
  FiEdit2,
  FiX,
  FiExternalLink
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';
import toast from 'react-hot-toast';

function ManageContentInner() {
  const { settings, updateSettings, currentUser, uploadFile } = useNGO();
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState('carousel');
  const [uploadingField, setUploadingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // My Awards (Org Honors) State
  const [orgAwards, setOrgAwards] = useState([]);
  const [loadingOrgAwards, setLoadingOrgAwards] = useState(false);
  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [uploadingAwardFile, setUploadingAwardFile] = useState(false);
  const [awardForm, setAwardForm] = useState({
    title: '',
    awardedBy: '',
    year: '2026',
    category: 'Elder Care & Humanitarian Seva',
    tier: 'National Honor',
    description: '',
    awardImage: '',
    certificateUrl: '',
    order: 0,
    isOrgAward: true,
    isActive: true
  });

  const [form, setForm] = useState({
    heroSlides: settings?.heroSlides || [],
    aboutHeading: settings?.aboutHeading || 'About Apna Parivar Vriddh Aashram Foundation',
    aboutSubtitle: settings?.aboutSubtitle || 'Elder Care, Dignity, Medical Support & Caring Family Atmosphere for Destitute Seniors',
    aboutStory: settings?.aboutStory || '',
    missionStatement: settings?.missionStatement || '',
    visionStatement: settings?.visionStatement || '',
    homeAboutTitle: settings?.homeAboutTitle || 'About Us',
    homeAboutStory: settings?.homeAboutStory || '',
    homeOurValues: settings?.homeOurValues || '',
    homeOurImpact: settings?.homeOurImpact || '',
    homeJoinUs: settings?.homeJoinUs || '',
    whoWeAreHeading: settings?.whoWeAreHeading || 'Who We Are — Apna Parivar Vriddh Aashram Foundation',
    whoWeAreSubtitle: settings?.whoWeAreSubtitle || 'A Sanctuary of Dignity, Care, and Loving Family Atmosphere for Elderly Citizens',
    whoWeAreStory: settings?.whoWeAreStory || '',
    whoWeAreVision: settings?.whoWeAreVision || '',
    whoWeAreMission: settings?.whoWeAreMission || '',
    whoWeAreValues: settings?.whoWeAreValues || '',
    whoWeAreBannerUrl: settings?.whoWeAreBannerUrl || '/banner.jpg',
    objectives: settings?.objectives || [
      {
        title: 'Safe Residential Living',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
        link: '/services'
      },
      {
        title: 'Satvik Meals & Nutrition',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600',
        link: '/services'
      },
      {
        title: '24/7 Geriatric Healthcare',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
        link: '/services'
      },
      {
        title: 'Yoga & Spiritual Wellbeing',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
        link: '/who-we-are'
      },
      {
        title: 'Dignity & Lifelong Care',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        link: '/donation'
      }
    ],
    privacyPolicyTitle: settings?.privacyPolicyTitle || 'Privacy Policy & Data Security',
    privacyPolicySubtitle: settings?.privacyPolicySubtitle || 'Apna Parivar Vriddh Aashram Foundation is dedicated to maintaining full transparency, safeguarding donor privacy, and protecting personal data.',
    privacyLastUpdated: settings?.privacyLastUpdated || 'October 2026',
    privacyPolicyContent: settings?.privacyPolicyContent || '',
    termsTitle: settings?.termsTitle || 'Terms & Conditions of Service',
    termsSubtitle: settings?.termsSubtitle || 'Rules, guidelines, and legal agreements governing the use of the Apna Parivar Vriddh Aashram Foundation website, online donations, and member services.',
    termsEffectiveDate: settings?.termsEffectiveDate || 'October 2026',
    termsContent: settings?.termsContent || ''
  });

  useEffect(() => {
    if (settings) {
      setForm(prev => ({
        ...prev,
        heroSlides: settings.heroSlides?.length ? settings.heroSlides : prev.heroSlides,
        aboutHeading: settings.aboutHeading ?? prev.aboutHeading,
        aboutSubtitle: settings.aboutSubtitle ?? prev.aboutSubtitle,
        aboutStory: settings.aboutStory ?? prev.aboutStory,
        missionStatement: settings.missionStatement ?? prev.missionStatement,
        visionStatement: settings.visionStatement ?? prev.visionStatement,
        homeAboutTitle: settings.homeAboutTitle ?? prev.homeAboutTitle,
        homeAboutStory: settings.homeAboutStory ?? prev.homeAboutStory,
        homeOurValues: settings.homeOurValues ?? prev.homeOurValues,
        homeOurImpact: settings.homeOurImpact ?? prev.homeOurImpact,
        homeJoinUs: settings.homeJoinUs ?? prev.homeJoinUs,
        whoWeAreHeading: settings.whoWeAreHeading ?? prev.whoWeAreHeading,
        whoWeAreSubtitle: settings.whoWeAreSubtitle ?? prev.whoWeAreSubtitle,
        whoWeAreStory: settings.whoWeAreStory ?? prev.whoWeAreStory,
        whoWeAreVision: settings.whoWeAreVision ?? prev.whoWeAreVision,
        whoWeAreMission: settings.whoWeAreMission ?? prev.whoWeAreMission,
        whoWeAreValues: settings.whoWeAreValues ?? prev.whoWeAreValues,
        whoWeAreBannerUrl: settings.whoWeAreBannerUrl ?? prev.whoWeAreBannerUrl,
        objectives: settings.objectives?.length ? settings.objectives : prev.objectives,
        privacyPolicyTitle: settings.privacyPolicyTitle ?? prev.privacyPolicyTitle,
        privacyPolicySubtitle: settings.privacyPolicySubtitle ?? prev.privacyPolicySubtitle,
        privacyLastUpdated: settings.privacyLastUpdated ?? prev.privacyLastUpdated,
        privacyPolicyContent: settings.privacyPolicyContent ?? prev.privacyPolicyContent,
        termsTitle: settings.termsTitle ?? prev.termsTitle,
        termsSubtitle: settings.termsSubtitle ?? prev.termsSubtitle,
        termsEffectiveDate: settings.termsEffectiveDate ?? prev.termsEffectiveDate,
        termsContent: settings.termsContent ?? prev.termsContent
      }));
    }
  }, [settings]);

  const loadOrgAwards = async () => {
    try {
      setLoadingOrgAwards(true);
      const res = await api.get('/awards');
      const list = res.data?.awards || res.data?.data || [];
      const filtered = Array.isArray(list) ? list.filter(a => a.isOrgAward || a.awardedBy) : [];
      setOrgAwards(filtered);
    } catch (err) {
      console.warn('Failed to load org awards:', err);
    } finally {
      setLoadingOrgAwards(false);
    }
  };

  useEffect(() => {
    loadOrgAwards();
  }, []);

  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['carousel', 'about', 'whoWeAre', 'objectives', 'legal', 'myAwards'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const openCreateAwardModal = () => {
    setEditingAward(null);
    setAwardForm({
      title: '',
      awardedBy: '',
      year: new Date().getFullYear().toString(),
      category: 'Elder Care & Humanitarian Seva',
      tier: 'National Honor',
      description: '',
      awardImage: '',
      certificateUrl: '',
      order: orgAwards.length,
      isOrgAward: true,
      isActive: true
    });
    setAwardModalOpen(true);
  };

  const openEditAwardModal = (awd) => {
    setEditingAward(awd);
    setAwardForm({
      title: awd.title || '',
      awardedBy: awd.awardedBy || '',
      year: awd.year || '',
      category: awd.category || 'Elder Care & Humanitarian Seva',
      tier: awd.tier || 'National Honor',
      description: awd.description || '',
      awardImage: awd.awardImage || awd.image || '',
      certificateUrl: awd.certificateUrl || '',
      order: awd.order || 0,
      isOrgAward: true,
      isActive: awd.isActive !== undefined ? awd.isActive : true
    });
    setAwardModalOpen(true);
  };

  const handleAwardFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAwardFile(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/upload', fd);
      const url = res.data?.url || res.data?.filePath || res.data?.data?.url;
      if (url) {
        setAwardForm(prev => ({ ...prev, [field]: url }));
        toast.success(`${field === 'awardImage' ? 'Award photo' : 'Certificate'} uploaded successfully!`);
      } else {
        toast.error('Upload succeeded but no file URL returned');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploadingAwardFile(false);
    }
  };

  const handleSaveAward = async (e) => {
    e.preventDefault();
    if (!awardForm.title.trim()) {
      toast.error('Award title is required');
      return;
    }
    try {
      setUploadingAwardFile(true);
      const payload = {
        ...awardForm,
        isOrgAward: true,
        order: Number(awardForm.order) || 0
      };
      if (editingAward) {
        const id = editingAward._id || editingAward.id;
        await api.put(`/awards/${id}`, payload);
        toast.success('Foundation award updated successfully!');
      } else {
        await api.post('/awards', payload);
        toast.success('New foundation award added successfully!');
      }
      setAwardModalOpen(false);
      setEditingAward(null);
      loadOrgAwards();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save award');
    } finally {
      setUploadingAwardFile(false);
    }
  };

  const handleDeleteAward = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the award "${title}"?`)) return;
    try {
      await api.delete(`/awards/${id}`);
      toast.success('Foundation award deleted successfully');
      setOrgAwards(prev => prev.filter(a => (a._id || a.id) !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete award');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateSettings(form);
      if (res?.success) {
        toast.success('Content & Media CMS updated successfully!');
      } else {
        toast.error(res?.message || 'Failed to update content');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#fffdfa]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-amber-200">
          <FiAlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <h2 className="text-lg font-black text-stone-900">Administrator Access Required</h2>
          <p className="text-xs text-stone-600 mt-2">Only administrators can manage content and CMS pages.</p>
          <Link
            href="/login"
            className="mt-5 inline-block px-5 py-2.5 bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20"
          >
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  // Child content modules list for fast navigation
  const childModules = [
    { label: 'Campaigns CMS', href: '/dashboard/campaigns', desc: 'Manage donation drives & fundraisers', icon: FiFileText },
    { label: 'Our Services', href: '/dashboard/services', desc: 'Elder living, healthcare & meals care', icon: FiActivity },
    { label: 'Events & Programs', href: '/dashboard/events', desc: 'Bhoj seva, health camps & gatherings', icon: FiCalendar },
    { label: 'News & Press Releases', href: '/dashboard/blogs', desc: 'Articles, news bulletins & media notes', icon: FiBookOpen },
    { label: 'Photo & Video Gallery', href: '/dashboard/gallery', desc: 'High-res photos of residents & activities', icon: FiImage },
    { label: 'My Awards', href: '/dashboard/managecontent?tab=myAwards', desc: 'National recognitions, state awards & citations received by Apna Ghar Ashram Foundation', icon: FiAward },
    { label: 'Sponsorships & Partners', href: '/dashboard/sponsorships', desc: 'Corporate sponsors, CSR patrons & partners', icon: FiAward },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Header Banner */}
      <div className="bg-linear-to-r from-amber-100/90 via-[#fefce8] to-amber-50 p-4 rounded-2xl border border-amber-200/90 shadow-xs mx-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-black border border-amber-300 mb-1.5">
            <FiLayers className="w-3.5 h-3.5 text-amber-800" />
            <span>Manage Content &amp; Media CMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            National Content Management Hub
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Configure Hero Carousel, About Us story, Who We Are sanctuary, core objectives, and statutory policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 text-stone-950" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Content'}</span>
          </button>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-stone-600 hover:text-amber-900 bg-stone-100 hover:bg-amber-50 px-3.5 py-2.5 rounded-2xl border border-stone-200 transition"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* 2. Child Content Pages Quick Navigation Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <FiLayers className="w-3.5 h-3.5 text-amber-700" />
            <span>Content Child Modules (Pages)</span>
          </span>
          <span className="text-[11px] text-stone-500 font-semibold">7 Dynamic Sub-Systems</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {childModules.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group p-4 bg-white rounded-2xl border border-amber-200/80 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/70 group-hover:bg-linear-to-tr group-hover:from-amber-500 group-hover:to-yellow-400 text-amber-800 group-hover:text-stone-950 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <ModIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-stone-950 group-hover:text-amber-900 truncate">
                      {mod.label}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                      {mod.desc}
                    </p>
                  </div>
                </div>
                <span className="w-6 h-6 rounded-full bg-amber-50 group-hover:bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 transition-colors">
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Main CMS Tab Switcher */}
      <div className="bg-white p-1.5 rounded-2xl border border-amber-200/90 shadow-2xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'carousel', label: '1. Hero Carousel Banners' },
          { id: 'about', label: '2. About Us & Mission' },
          { id: 'whoWeAre', label: '3. "Who We Are" Page' },
          { id: 'objectives', label: '4. Core Objectives' },
          { id: 'legal', label: '5. Privacy & Terms Policies' },
          { id: 'myAwards', label: '6. My Awards (Aashram Honors)' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${activeTab === t.id
                ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black shadow-xs'
                : 'bg-stone-100/80 text-stone-700 hover:bg-amber-100 hover:text-amber-950'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Panels */}
      <div className="space-y-4">
        {/* TAB 1: HERO CAROUSEL BANNERS */}
        {activeTab === 'carousel' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-stone-950">Hero Carousel Banners</h3>
                <p className="text-xs text-stone-500">Add, upload, and order high-resolution homepage banner slides.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newSlide = {
                    title: 'Apna Parivar Vriddh Aashram Foundation',
                    subtitle: 'Dedicated shelter of love, medical care, and family warmth for destitute elderly citizens.',
                    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920',
                    tag: 'National Elder Care Foundation',
                    ctaPrimaryText: 'Sponsor a Meal (80G)',
                    ctaPrimaryLink: '/donation',
                    ctaSecondaryText: 'Explore Aashram',
                    ctaSecondaryLink: '/who-we-are',
                    highlight: '100% Tax Exemption under Section 80G'
                  };
                  setForm(prev => ({
                    ...prev,
                    heroSlides: [...prev.heroSlides, newSlide]
                  }));
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-xl text-xs font-black shadow-xs hover:from-amber-600 hover:to-yellow-600 transition cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add New Slide</span>
              </button>
            </div>

            <div className="space-y-5">
              {form.heroSlides.map((slide, sIdx) => (
                <div key={sIdx} className="p-5 rounded-2xl bg-stone-50/70 border border-amber-200/80 space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-black text-xs text-amber-950">
                      Slide #{sIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete Slide #${sIdx + 1}?`)) {
                          setForm(prev => ({
                            ...prev,
                            heroSlides: prev.heroSlides.filter((_, i) => i !== sIdx)
                          }));
                        }
                      }}
                      className="text-rose-700 hover:text-rose-900 flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete Slide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-4 space-y-2">
                      <div className="aspect-video rounded-xl overflow-hidden bg-stone-200 border border-amber-200">
                        {slide.imageUrl ? (
                          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <FiImage className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <label className="block cursor-pointer">
                        <span className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 hover:bg-amber-50 shadow-2xs">
                          <FiUploadCloud className="w-3.5 h-3.5 text-amber-700" />
                          <span>{uploadingField === `slide_${sIdx}` ? 'Uploading...' : 'Upload Slide Banner'}</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingField(`slide_${sIdx}`);
                            try {
                              const res = await uploadFile(file);
                              if (res?.success && res.url) {
                                setForm(prev => {
                                  const updated = [...prev.heroSlides];
                                  updated[sIdx] = { ...updated[sIdx], imageUrl: res.url };
                                  return { ...prev, heroSlides: updated };
                                });
                                toast.success('Slide image uploaded!');
                              }
                            } catch (err) {
                              toast.error('Upload failed');
                            } finally {
                              setUploadingField(null);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or Image URL"
                        value={slide.imageUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm(prev => {
                            const updated = [...prev.heroSlides];
                            updated[sIdx] = { ...updated[sIdx], imageUrl: val };
                            return { ...prev, heroSlides: updated };
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                      />
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">Slide Title</label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm(prev => {
                              const updated = [...prev.heroSlides];
                              updated[sIdx] = { ...updated[sIdx], title: val };
                              return { ...prev, heroSlides: updated };
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white font-bold"
                          placeholder="e.g. Apna Parivar Vriddh Aashram Foundation"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">Slide Subtitle</label>
                        <textarea
                          rows={2}
                          value={slide.subtitle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm(prev => {
                              const updated = [...prev.heroSlides];
                              updated[sIdx] = { ...updated[sIdx], subtitle: val };
                              return { ...prev, heroSlides: updated };
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                          placeholder="Brief mission subtitle..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={slide.tag || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm(prev => {
                                const updated = [...prev.heroSlides];
                                updated[sIdx] = { ...updated[sIdx], tag: val };
                                return { ...prev, heroSlides: updated };
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                            placeholder="e.g. National Social Welfare"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Highlight Text</label>
                          <input
                            type="text"
                            value={slide.highlight || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm(prev => {
                                const updated = [...prev.heroSlides];
                                updated[sIdx] = { ...updated[sIdx], highlight: val };
                                return { ...prev, heroSlides: updated };
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                            placeholder="e.g. 100% Tax Exemption"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Primary Button Text</label>
                          <input
                            type="text"
                            value={slide.ctaPrimaryText || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm(prev => {
                                const updated = [...prev.heroSlides];
                                updated[sIdx] = { ...updated[sIdx], ctaPrimaryText: val };
                                return { ...prev, heroSlides: updated };
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                            placeholder="e.g. Donate Now"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">Primary Button Link</label>
                          <input
                            type="text"
                            value={slide.ctaPrimaryLink || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm(prev => {
                                const updated = [...prev.heroSlides];
                                updated[sIdx] = { ...updated[sIdx], ctaPrimaryLink: val };
                                return { ...prev, heroSlides: updated };
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                            placeholder="/donation"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT US & STORY */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="font-black text-sm text-stone-950">About Us &amp; Organization Story</h3>
              <p className="text-xs text-stone-500">Configure foundational narrative, mission statement, and core values.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">About Heading</label>
                <input
                  type="text"
                  value={form.aboutHeading}
                  onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">About Subtitle</label>
                <input
                  type="text"
                  value={form.aboutSubtitle}
                  onChange={(e) => setForm({ ...form, aboutSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-900 block mb-1.5">Detailed Story / Background</label>
              <textarea
                rows={4}
                value={form.aboutStory}
                onChange={(e) => setForm({ ...form, aboutStory: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
                placeholder="Story of the foundation..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">Mission Statement</label>
                <textarea
                  rows={3}
                  value={form.missionStatement}
                  onChange={(e) => setForm({ ...form, missionStatement: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">Vision Statement</label>
                <textarea
                  rows={3}
                  value={form.visionStatement}
                  onChange={(e) => setForm({ ...form, visionStatement: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: "WHO WE ARE" PAGE CMS (Moved from settings to content) */}
        {activeTab === 'whoWeAre' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="font-black text-sm text-stone-950">&quot;Who We Are&quot; Dedicated Page CMS</h3>
              <p className="text-xs text-stone-500">Configure content rendered on the /who-we-are sanctuary portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">Main Page Heading</label>
                <input
                  type="text"
                  value={form.whoWeAreHeading}
                  onChange={(e) => setForm({ ...form, whoWeAreHeading: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={form.whoWeAreSubtitle}
                  onChange={(e) => setForm({ ...form, whoWeAreSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-900 block mb-1.5">Our Story &amp; Origins</label>
              <textarea
                rows={4}
                value={form.whoWeAreStory}
                onChange={(e) => setForm({ ...form, whoWeAreStory: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">Sanctuary Vision</label>
                <textarea
                  rows={3}
                  value={form.whoWeAreVision}
                  onChange={(e) => setForm({ ...form, whoWeAreVision: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-900 block mb-1.5">Sanctuary Mission</label>
                <textarea
                  rows={3}
                  value={form.whoWeAreMission}
                  onChange={(e) => setForm({ ...form, whoWeAreMission: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-900 block mb-1.5">Core Values</label>
              <textarea
                rows={3}
                value={form.whoWeAreValues}
                onChange={(e) => setForm({ ...form, whoWeAreValues: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 4: OBJECTIVES */}
        {activeTab === 'objectives' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-stone-950">Core Operational Objectives</h3>
                <p className="text-xs text-stone-500">Key pillars displayed on the site detailing our humanitarian work.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    objectives: [
                      ...prev.objectives,
                      {
                        title: 'New Welfare Objective',
                        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
                        link: '/services'
                      }
                    ]
                  }));
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-xl text-xs font-black shadow-xs hover:from-amber-600 hover:to-yellow-600 transition cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add Objective</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.objectives.map((obj, oIdx) => (
                <div key={oIdx} className="p-4 rounded-2xl bg-stone-50/70 border border-amber-200/80 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-black text-xs text-amber-950">Objective #{oIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          objectives: prev.objectives.filter((_, i) => i !== oIdx)
                        }));
                      }}
                      className="text-rose-700 hover:text-rose-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-600 block mb-1">Title</label>
                      <input
                        type="text"
                        value={obj.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm(prev => {
                            const updated = [...prev.objectives];
                            updated[oIdx] = { ...updated[oIdx], title: val };
                            return { ...prev, objectives: updated };
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-600 block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={obj.imageUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm(prev => {
                            const updated = [...prev.objectives];
                            updated[oIdx] = { ...updated[oIdx], imageUrl: val };
                            return { ...prev, objectives: updated };
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-600 block mb-1">Link Destination</label>
                      <input
                        type="text"
                        value={obj.link || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm(prev => {
                            const updated = [...prev.objectives];
                            updated[oIdx] = { ...updated[oIdx], link: val };
                            return { ...prev, objectives: updated };
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                        placeholder="/services"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEGAL POLICIES (Moved from settings to content) */}
        {activeTab === 'legal' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="font-black text-sm text-stone-950">Statutory Legal Policies (Privacy &amp; Terms)</h3>
              <p className="text-xs text-stone-500">Live regulatory policies governing online contributions and visitor protections.</p>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-stone-50/60 border border-amber-200/70">
              <span className="font-black text-xs text-amber-950 uppercase tracking-wider block">
                1. Privacy Policy &amp; Donor Protection
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Privacy Title"
                  value={form.privacyPolicyTitle}
                  onChange={(e) => setForm({ ...form, privacyPolicyTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  placeholder="Last Updated (e.g. October 2026)"
                  value={form.privacyLastUpdated}
                  onChange={(e) => setForm({ ...form, privacyLastUpdated: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                />
              </div>
              <textarea
                rows={5}
                placeholder="Markdown / Detailed content of privacy policy..."
                value={form.privacyPolicyContent}
                onChange={(e) => setForm({ ...form, privacyPolicyContent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white font-mono leading-relaxed"
              />
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-stone-50/60 border border-amber-200/70">
              <span className="font-black text-xs text-amber-950 uppercase tracking-wider block">
                2. Terms &amp; Conditions of Service
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Terms Title"
                  value={form.termsTitle}
                  onChange={(e) => setForm({ ...form, termsTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  placeholder="Effective Date"
                  value={form.termsEffectiveDate}
                  onChange={(e) => setForm({ ...form, termsEffectiveDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                />
              </div>
              <textarea
                rows={5}
                placeholder="Markdown / Detailed content of terms & conditions..."
                value={form.termsContent}
                onChange={(e) => setForm({ ...form, termsContent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 6: MY AWARDS (AASHRAM HONORS) */}
        {activeTab === 'myAwards' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-[11px] font-black border border-amber-300 mb-1">
                  <FiAward className="w-3.5 h-3.5 text-amber-800" />
                  <span>My Awards (Foundation Recognitions)</span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-stone-950">
                  Awards &amp; Honors Received by Apna Parivar Vriddh Aashram
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Manage awards, state honors, CSR felicitations, and citations received by the trust from external bodies.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={loadOrgAwards}
                  className="px-3.5 py-2.5 rounded-xl border border-amber-200 bg-stone-50 hover:bg-amber-50 text-stone-800 text-xs font-bold transition cursor-pointer"
                  title="Reload Awards"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={openCreateAwardModal}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
                >
                  <FiPlus className="w-4 h-4 text-stone-950" />
                  <span>Add Award Received</span>
                </button>
              </div>
            </div>

            {loadingOrgAwards ? (
              <div className="py-12 text-center text-xs font-bold text-amber-800">
                Loading foundation honors &amp; awards...
              </div>
            ) : orgAwards.length === 0 ? (
              <div className="p-10 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                  <FiAward className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-sm">No Foundation Awards Added Yet</h4>
                  <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
                    Add honors, medals, citations, and awards received by Apna Parivar Vriddh Aashram Foundation to display them proudly on the homepage and public portals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateAwardModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add First Foundation Award</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgAwards.map((awd) => {
                  const id = awd._id || awd.id;
                  return (
                    <div
                      key={id}
                      className="p-5 rounded-2xl border border-amber-200 bg-linear-to-b from-white to-amber-50/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                            {awd.tier || 'Honor'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {awd.year && (
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {awd.year}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${awd.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                              {awd.isActive !== false ? 'Public' : 'Draft'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          {awd.awardImage || awd.image ? (
                            <img
                              src={getContentImageUrl(awd.awardImage || awd.image)}
                              alt={awd.title}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl border-2 border-amber-200 shrink-0">
                              <FiAward className="w-7 h-7" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-stone-950 leading-snug truncate">
                              {awd.title}
                            </h4>
                            {awd.awardedBy && (
                              <p className="text-[11px] font-bold text-amber-900 mt-0.5 truncate">
                                By {awd.awardedBy}
                              </p>
                            )}
                            <p className="text-[10px] text-stone-500 font-medium uppercase mt-0.5">
                              {awd.category || 'Elder Welfare'}
                            </p>
                          </div>
                        </div>

                        {awd.description && (
                          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-medium">
                            {awd.description}
                          </p>
                        )}

                        {awd.certificateUrl && (
                          <a
                            href={getContentImageUrl(awd.certificateUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 hover:underline pt-1"
                          >
                            <FiExternalLink className="w-3.5 h-3.5" />
                            <span>View Official Certificate / Decree</span>
                          </a>
                        )}
                      </div>

                      <div className="pt-3 border-t border-amber-100 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditAwardModal(awd)}
                          className="px-3 py-1.5 rounded-xl border border-amber-200 text-stone-700 hover:bg-amber-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <FiEdit2 className="w-3.5 h-3.5 text-amber-800" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAward(id, awd.title)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-xl shadow-amber-500/25 transition cursor-pointer disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 text-stone-950" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All CMS Content'}</span>
        </button>
      </div>

      {/* ADD / EDIT MY AWARDS MODAL */}
      {awardModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-amber-200 shadow-2xl relative text-stone-950 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-amber-200 flex items-center justify-between bg-amber-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-stone-950">
                    {editingAward ? 'Edit Foundation Award' : 'Add Foundation Award (My Awards)'}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    Award or honor conferred upon Apna Parivar Vriddh Aashram
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAwardModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-950 hover:bg-amber-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAward} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs font-medium">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Award / Honor Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rashtriya Samaj Seva Ratna Award"
                  value={awardForm.title}
                  onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-amber-500 text-stone-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Conferred By (Authority / Body) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Government of Madhya Pradesh"
                    value={awardForm.awardedBy}
                    onChange={(e) => setAwardForm({ ...awardForm, awardedBy: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-amber-500 text-stone-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Year Received</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={awardForm.year}
                    onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-amber-500 text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Honor Tier</label>
                  <select
                    value={awardForm.tier}
                    onChange={(e) => setAwardForm({ ...awardForm, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 font-bold text-stone-900 bg-white"
                  >
                    <option value="National Honor">National Honor</option>
                    <option value="State Award">State Award</option>
                    <option value="Special Honor">Special Honor</option>
                    <option value="Diamond">Diamond Tier</option>
                    <option value="Platinum">Platinum Tier</option>
                    <option value="Gold">Gold Tier</option>
                    <option value="Silver">Silver Tier</option>
                    <option value="Bronze">Bronze Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Elder Welfare & Seva"
                    value={awardForm.category}
                    onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-amber-500 text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Citation / Description</label>
                <textarea
                  rows={3}
                  placeholder="In recognition of selfless service to destitute elderly, providing healthcare, nutritious meals, and dignified living..."
                  value={awardForm.description}
                  onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-amber-500 text-stone-900 bg-white"
                />
              </div>

              {/* Award Trophy / Photo Upload */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                <label className="block font-bold text-stone-800">Trophy / Plaque / Award Photo</label>
                <div className="flex items-center gap-3">
                  {awardForm.awardImage ? (
                    <img
                      src={getContentImageUrl(awardForm.awardImage)}
                      alt="Trophy Preview"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-amber-300 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <FiImage className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingAwardFile}
                      onChange={(e) => handleAwardFileUpload(e, 'awardImage')}
                      className="block w-full text-xs text-stone-600 file:mr-2.5 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste direct image URL"
                      value={awardForm.awardImage}
                      onChange={(e) => setAwardForm({ ...awardForm, awardImage: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 text-xs bg-white text-stone-800"
                    />
                  </div>
                </div>
              </div>

              {/* Certificate / Citation PDF or Image */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                <label className="block font-bold text-stone-800">Official Certificate / Citation Document</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      disabled={uploadingAwardFile}
                      onChange={(e) => handleAwardFileUpload(e, 'certificateUrl')}
                      className="block w-full text-xs text-stone-600 file:mr-2.5 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste certificate document / PDF link"
                      value={awardForm.certificateUrl}
                      onChange={(e) => setAwardForm({ ...awardForm, certificateUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 text-xs bg-white text-stone-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={awardForm.isActive}
                    onChange={(e) => setAwardForm({ ...awardForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Display Publicly on Website</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700">Display Order:</span>
                  <input
                    type="number"
                    value={awardForm.order}
                    onChange={(e) => setAwardForm({ ...awardForm, order: Number(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 rounded-lg border border-amber-200 text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setAwardModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-amber-200 text-stone-700 font-bold text-xs hover:bg-amber-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingAwardFile}
                  className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <FiAward className="w-4 h-4 text-stone-950" />
                  <span>{uploadingAwardFile ? 'Saving Award...' : editingAward ? 'Save Changes' : 'Confirm & Add Award'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageContentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-amber-800">Loading CMS...</div>}>
      <ManageContentInner />
    </Suspense>
  );
}
