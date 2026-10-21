'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiCheckCircle,
  FiShield,
  FiXCircle,
  FiAward,
  FiHeart,
  FiUser,
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiLoader
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { api, getContentImageUrl } from '@/lib/authApi';

export default function VerificationPage() {
  const params = useParams();
  const { type, id } = params;
  const { members, certificates, donations, settings } = useNGO();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkVerification() {
      setLoading(true);

      // Check Redux/context state first
      if (type === 'member' || type === 'letter' || type === 'volunteer') {
        const localFound = members?.find(
          m => m.memberId === id || m.volunteerId === id || m._id === id
        );
        if (localFound && (localFound.status === 'active' || localFound.status === 'approved')) {
          if (isMounted) {
            setData({
              name: localFound.name,
              id: localFound.volunteerId || localFound.memberId || localFound._id,
              role: localFound.role || (type === 'volunteer' ? 'Active Volunteer' : 'Member'),
              designation: localFound.designation || (type === 'volunteer' ? 'Elder Care Volunteer' : 'Patron Member'),
              bloodGroup: localFound.bloodGroup || 'O+',
              state: localFound.state || 'Madhya Pradesh',
              photoUrl: localFound.photoUrl,
              verifiedAt: localFound.verifiedAt || localFound.createdAt
            });
            setVerified(true);
            setLoading(false);
            return;
          }
        }
      } else if (type === 'certificate') {
        const localCert = certificates?.find(c => c.certificateNo === id);
        if (localCert) {
          if (isMounted) {
            setData(localCert);
            setVerified(true);
            setLoading(false);
            return;
          }
        }
      } else if (type === 'donation') {
        const localDon = donations?.find(d => d.receiptNumber === id);
        if (localDon) {
          if (isMounted) {
            setData(localDon);
            setVerified(true);
            setLoading(false);
            return;
          }
        }
      }

      // Query live backend endpoint
      try {
        const endpoint = `/verify/${type}/${encodeURIComponent(id)}`;
        const res = await api.get(endpoint);
        if (res.data && res.data.success) {
          if (isMounted) {
            if (type === 'member' || type === 'volunteer' || type === 'letter') {
              const mem = res.data.member || res.data;
              setData({
                name: mem.name,
                id: mem.volunteerId || mem.memberId || id,
                role: mem.role,
                designation: mem.designation,
                bloodGroup: mem.bloodGroup,
                state: mem.state || 'Madhya Pradesh',
                photoUrl: mem.photoUrl,
                verifiedAt: mem.verifiedAt
              });
            } else if (type === 'certificate') {
              setData(res.data.certificate || res.data);
            } else if (type === 'donation') {
              setData(res.data.donation || res.data);
            }
            setVerified(true);
          }
        } else {
          if (isMounted) setVerified(false);
        }
      } catch (err) {
        if (isMounted) setVerified(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      checkVerification();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [type, id, members, certificates, donations]);

  const orgName = settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation';
  const regNumber = settings?.trustRegistrationNumber || 'Reg: 12A & 80G Certified';

  let title = 'Document & Credential Verification';
  if (type === 'volunteer') title = 'Official Volunteer ID Card Verification';
  else if (type === 'member') title = 'Official Member ID Card Verification';
  else if (type === 'letter') title = 'Official Appointment Letter Verification';
  else if (type === 'certificate') title = 'Official Certificate of Appreciation';
  else if (type === 'donation') title = '80G Tax Exemption Donation Receipt';

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-amber-50/20 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#0F2E5A] via-[#D97706] to-[#DC2626]" />

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-5 pt-2">
          <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-amber-500 shadow-xs shrink-0">
            <Image
              src="/logo.jpg"
              alt="Apna Parivar Vriddh Aashram Foundation"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-left">
            <h2 className="font-black text-sm text-[#0F2E5A] leading-tight">
              {orgName}
            </h2>
            <p className="text-[10px] font-semibold text-slate-500">
              Elder Care &amp; Senior Citizen Welfare Trust (Jabalpur, MP)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <FiLoader className="w-10 h-10 text-[#0F2E5A] animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-600">
              Validating credential with Central Trust Registry...
            </p>
          </div>
        ) : verified && data ? (
          <div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <FiCheckCircle className="w-9 h-9" />
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 inline-block mb-1">
              Verified &amp; Authentic Record
            </span>

            <h1 className="text-base sm:text-lg font-black text-slate-900 mb-4">
              {title}
            </h1>

            {/* Volunteer / Member Profile Details */}
            {(type === 'volunteer' || type === 'member' || type === 'letter') && (
              <div className="space-y-3.5 text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3.5 pb-3 border-b border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getContentImageUrl(data.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={data.name || 'Credential Holder'}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D97706] shadow-xs"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                    }}
                  />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{data.name}</h3>
                    <span className="text-[#DC2626] font-bold block text-xs">
                      {data.designation || (type === 'volunteer' ? 'Elder Care Volunteer' : 'Verified Member')}
                    </span>
                    <span className="font-mono text-slate-600 text-[11px] font-bold">
                      {data.id || id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Role</span>
                    <strong className="text-slate-900 font-bold">{data.role || (type === 'volunteer' ? 'Volunteer' : 'Member')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                    <strong className="text-[#DC2626] font-bold">{data.bloodGroup || 'O+'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Jurisdiction</span>
                    <strong className="text-slate-900">{data.state || 'Madhya Pradesh'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                    <strong className="text-emerald-700 font-bold flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> Authorized &amp; Active
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Certificate Details */}
            {type === 'certificate' && (
              <div className="space-y-3 text-xs text-left bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <div className="font-mono text-emerald-800 font-bold text-[11px]">
                  {data.certificateNo || id}
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{data.recipientName}</h3>
                <div className="text-emerald-900 font-bold">{data.awardTitle}</div>
                <p className="text-slate-700 leading-relaxed text-xs">{data.description}</p>
                <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-emerald-200">
                  Issue Date: {data.issueDate ? new Date(data.issueDate).toLocaleDateString('en-IN') : 'Official Issue'}
                </div>
              </div>
            )}

            {/* Donation Receipt Details */}
            {type === 'donation' && (
              <div className="space-y-3 text-xs text-left bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <div className="font-mono text-emerald-800 font-bold text-[11px]">
                  {data.receiptNumber || id}
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{data.donorName}</h3>
                <div className="text-2xl font-black text-emerald-700">
                  ₹{Number(data.amount || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-slate-700">
                  Donor PAN: <strong className="font-mono text-slate-900">{data.panNumber || 'NA'}</strong>
                </div>
                <div className="text-slate-700">
                  Cause: <strong className="text-slate-900">{data.campaignTitle || 'Elder Care Support'}</strong>
                </div>
                <div className="text-[11px] text-emerald-800 font-bold pt-2 border-t border-emerald-200 flex items-center gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Valid 80G Tax Exemption Digital Receipt</span>
                </div>
              </div>
            )}

            {/* Security Footer Notice */}
            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              Trust HQ: Behind Adhartal Railway Station, Jabalpur, MP | 80G &amp; 12A Certified
            </div>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <FiXCircle className="w-9 h-9" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 mb-2">
              Invalid or Unverified Record!
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              No authenticated record found for ID <strong className="font-mono text-slate-900">{id}</strong> on our official NGO registry. This card, certificate, or receipt may be expired, revoked, or invalid.
            </p>
          </div>
        )}

        <div className="mt-5 pt-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
