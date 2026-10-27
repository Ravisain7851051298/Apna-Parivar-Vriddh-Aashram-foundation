'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiCalendar,
  FiMapPin,
  FiShare2,
  FiArrowLeft,
  FiUsers,
  FiCheckCircle,
  FiLock,
  FiCheck,
  FiCopy
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { CardSkeleton } from '@/components/common/SkeletonLoader';
import DecorativeLeaves from '@/components/site/DecorativeLeaves';
import api from '@/services/api';
import toast from 'react-hot-toast';

function EventDetailContent({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = resolvedParams?.id;
  const actionParam = searchParams.get('action');
  const { events, currentUser, settings } = useNGO();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    // Check context first
    const found = events?.find((e) => (e._id || e.id) === eventId);
    if (found) {
      setEvent(found);
      const isAlready = currentUser && found.attendees?.some(
        (att) => (att.user && att.user === currentUser.id) ||
          (att.email && att.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
          (att.phone && att.phone === currentUser.phone)
      );
      setHasJoined(Boolean(isAlready));
      setAttendeeCount(found.attendees?.length || 0);
      setLoading(false);
      return;
    }

    // Fetch from backend
    api.get(`/events/${eventId}`)
      .then((res) => {
        const data = res.data?.event || res.data?.data || res.data;
        if (data && (data._id || data.title)) {
          setEvent(data);
          const isAlready = currentUser && data.attendees?.some(
            (att) => (att.user && att.user === currentUser.id) ||
              (att.email && att.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
              (att.phone && att.phone === currentUser.phone)
          );
          setHasJoined(Boolean(isAlready));
          setAttendeeCount(data.attendees?.length || 0);
        }
      })
      .catch((err) => {
        console.error('Failed to load event details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId, events, currentUser]);

  // Handle post-login auto join if action=join was requested
  useEffect(() => {
    if (actionParam === 'join' && currentUser && event && !hasJoined && !joining) {
      handleJoinEvent();
    }
  }, [actionParam, currentUser, event, hasJoined]);

  const handleJoinEvent = async () => {
    if (!currentUser) {
      const redirectUrl = `/event/${eventId}?action=join`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    try {
      setJoining(true);
      const res = await api.post(`/events/${eventId}/join`, {
        name: currentUser.name || 'Verified Member',
        email: currentUser.email,
        phone: currentUser.phone || '9999999999',
        message: 'Joined via Event Details Portal'
      });

      if (res.data?.success || res.status === 200 || res.status === 201) {
        setHasJoined(true);
        setAttendeeCount((prev) => prev + 1);
        toast.success(`You have successfully joined "${event?.title || 'this event'}"!`);
      } else {
        toast.error(res.data?.message || 'Could not join event.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to join event.';
      if (msg.toLowerCase().includes('already registered')) {
        setHasJoined(true);
        toast.success('You are already registered for this event!');
      } else {
        toast.error(msg);
      }
    } finally {
      setJoining(false);
    }
  };

  const copyPageLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Event link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const defaultLoc = settings?.ngoName || 'Apna Parivar Vriddh Aashram';
    const text = encodeURIComponent(
      `🗓️ *${event?.title}*\n📍 ${event?.location || settings?.address || defaultLoc}\n📅 ${event?.date || ''}\n\nJoin this event with us:\n${url}`
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

  if (!event) {
    return (
      <div className="min-h-[70vh] bg-[#fffdfa] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-amber-200 text-center shadow-lg">
          <FiCalendar className="w-12 h-12 mx-auto text-amber-600 mb-3" />
          <h2 className="text-xl font-black text-stone-900">Event Not Found</h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            The event you are looking for may have concluded or has been updated.
          </p>
          <Link
            href="/event"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-xs shadow-md transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to All Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const rawImg = event.imageUrl || event.image || (Array.isArray(event.images) && event.images[0]) || '/banner.jpg';
  const bannerUrl = rawImg.startsWith('http') || rawImg.startsWith('/') ? rawImg : getContentImageUrl(rawImg);
  const otherImages = Array.isArray(event.images) && event.images.length > 1 ? event.images : [];

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-900 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Breadcrumb & Back Link */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/event"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-950 transition group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Events &amp; Programs</span>
          </Link>

          <div className="inline-flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[11px] uppercase tracking-wider">
              {event.category || 'Aashram Welfare Program'}
            </span>
            {hasJoined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px]">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>You are Registered</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Card - Largest rounded card with image */}
        <div className="relative bg-white rounded-3xl border border-amber-200/90 shadow-xl overflow-hidden">
          <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[460px] w-full overflow-hidden bg-slate-900">
            <img
              src={bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/banner.jpg';
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-black uppercase tracking-wider inline-block">
                {event.category || 'Elder Care Drive'}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-amber-100 bg-amber-50/50 p-4 sm:p-5 border-b border-amber-100 text-xs">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 font-bold block uppercase tracking-wider">Date &amp; Schedule</span>
                <strong className="text-stone-950 font-black text-sm">{event.date || 'Scheduled Soon'}</strong>
                {event.time && <span className="block text-stone-600 text-[11px]">{event.time}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 font-bold block uppercase tracking-wider">Venue Location</span>
                <strong className="text-stone-950 font-black text-xs line-clamp-1">
                  {event.location || settings?.address || settings?.ngoName || 'Apna Parivar Vriddh Aashram'}
                </strong>
                <span className="block text-stone-600 text-[11px] line-clamp-1">
                  {event.locationAddress || settings?.address || 'Ward No. 12, Near Bus Stand, Ellenabad, Sirsa, Haryana - 125102'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 font-bold block uppercase tracking-wider">Community Attendance</span>
                <strong className="text-stone-950 font-black text-sm">
                  {attendeeCount} Participant{attendeeCount === 1 ? '' : 's'}
                </strong>
                <span className="block text-emerald-700 text-[11px] font-bold">Free Participation</span>
              </div>
            </div>
          </div>

          {/* Main Content & Registration Side Column */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Description Body (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-950 mb-3 tracking-tight">
                  About This Gathering &amp; Program
                </h2>
                <div className="text-stone-700 text-sm leading-relaxed prose max-w-none">
                  <MarkdownRenderer content={event.description || 'Join our senior welfare gathering.'} />
                </div>
              </div>

              {/* Multiple Event Photos Gallery if present */}
              {otherImages.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-amber-100">
                  <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider">
                    Event Gallery Photographs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {otherImages.map((img, i) => (
                      <div key={i} className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-amber-200">
                        <img
                          src={getContentImageUrl(img)}
                          alt={`${event.title} photo ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Sharing Bar */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <FiShare2 className="w-4 h-4 text-amber-700" />
                  <span>Share This Event with Friends &amp; Family:</span>
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

            {/* Registration Card (4 cols) */}
            <div className="lg:col-span-4 bg-linear-to-b from-amber-50/90 via-white to-amber-50/40 p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-5 sticky top-24">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                  Participation Desk
                </span>
                <h3 className="text-lg font-black text-stone-950 mt-0.5">
                  Join As Attendee / Volunteer
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Open for all residents, compassionate citizens, youth volunteers, and senior families.
                </p>
              </div>

              {/* Status Banner */}
              {hasJoined ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-emerald-800">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>You are Registered!</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    We look forward to welcoming you at the aashram on {event.date || 'the scheduled date'}.
                  </p>
                </div>
              ) : currentUser ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 block">Registering as:</span>
                    <strong className="text-stone-950 block text-xs">{currentUser.name}</strong>
                    <span className="text-stone-600 text-[11px] block">{currentUser.email} • {currentUser.phone || 'Phone on file'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleJoinEvent}
                    disabled={joining}
                    className="w-full py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiUsers className="w-4 h-4 text-stone-950" />
                    <span>{joining ? 'Registering Attendance...' : 'Confirm & Join Event (Free)'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <FiLock className="w-3.5 h-3.5 text-amber-800" />
                      <span>Login Required to Register</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      Please log in or create an account to record your attendance and receive official confirmation.
                    </p>
                  </div>

                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/event/${eventId}?action=join`)}`}
                    className="w-full py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 text-center"
                  >
                    <FiUsers className="w-4 h-4 text-stone-950" />
                    <span>Login to Join Event</span>
                  </Link>

                  <p className="text-center text-[11px] text-stone-500">
                    Don&apos;t have an account?{' '}
                    <Link
                      href={`/register?redirect=${encodeURIComponent(`/event/${eventId}?action=join`)}`}
                      className="text-amber-800 font-bold hover:underline"
                    >
                      Register Here →
                    </Link>
                  </p>
                </div>
              )}

              {/* Seva Help Box */}
              <div className="pt-4 border-t border-amber-200/60 space-y-2.5 text-xs">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Questions or Directions?
                </span>
                <p className="text-[11px] text-stone-600">
                  Call our 24x7 seva helpline for transport guidance, directions, or elder assistance:
                </p>
                <div className="space-y-1.5 pt-1">
                  <a
                    href={`tel:${(settings?.phone || '+91 8959055269').replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 font-black text-amber-950 hover:text-amber-700 hover:underline text-xs"
                  >
                    <span>📞 {settings?.phone || '+91 8959055269'}</span>
                  </a>
                  {settings?.email && (
                    <div className="block">
                      <a
                        href={`mailto:${settings.email}`}
                        className="inline-flex items-center gap-1.5 font-bold text-stone-700 hover:text-amber-800 hover:underline text-[11px]"
                      >
                        <span>✉️ {settings.email}</span>
                      </a>
                    </div>
                  )}
                  {settings?.address && (
                    <p className="text-[11px] text-stone-500 flex items-start gap-1 pt-0.5">
                      <span className="shrink-0">📍</span>
                      <span>{settings.address}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botanical Animated Flower & Decorative Leaves in bottom-right corner of the largest round card */}
          <DecorativeLeaves
            position="bottom-right"
            size="md"
            showFlower={true}
            showFloralSpike={true}
            animated={true}
            opacity={0.88}
          />
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage({ params }) {
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
      <EventDetailContent params={params} />
    </Suspense>
  );
}
