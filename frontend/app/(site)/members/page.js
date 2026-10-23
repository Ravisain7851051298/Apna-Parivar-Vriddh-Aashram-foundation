'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CardSkeleton, EmptyState } from '@/components/common/SkeletonLoader';
import {
  FiUsers,
  FiSearch,
  FiShield,
  FiCheckCircle,
  FiMapPin,
  FiAward,
  FiUserPlus,
  FiArrowRight,
  FiRefreshCw,
  FiFilter,
  FiLock,
  FiAlertTriangle
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function PublicMembersPage() {
  const { settings, currentUser } = useNGO();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');

  const fetchPublicMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members/public?limit=100');
      if (res.data?.success && Array.isArray(res.data.members)) {
        setMembers(res.data.members);
      }
    } catch (err) {
      console.warn('Public members fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicMembers();
  }, []);

  const uniqueStates = useMemo(() => {
    const states = new Set();
    members.forEach((m) => {
      if (m.state) states.add(m.state);
    });
    return ['All', ...Array.from(states)];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.memberId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.district?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = stateFilter === 'All' || m.state === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [members, searchQuery, stateFilter]);

  const isMember = Boolean(
    currentUser?.role === 'Member' ||
    currentUser?.role === 'Admin' ||
    (currentUser?.isMember && !currentUser?.memberId?.startsWith('APVAF-DON-') && !currentUser?.memberId?.startsWith('BYK-DON-')) ||
    (currentUser?.membershipApplication?.status === 'approved')
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 shadow-2xs">
            <FiUsers className="w-3.5 h-3.5 text-amber-700" />
            <span>Official Cadre &amp; Verified Foundation Members</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Registered Members
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Dedicated supporters, caregivers, and patrons supporting 24x7 residential shelter, nutritious food, medical care, and dignity for elderly citizens in Jabalpur, MP.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={isMember ? '/profile/member' : '/apply-member'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-amber-950 text-xs font-black shadow-md shadow-amber-500/20 transition transform hover:scale-102"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>{isMember ? 'My Member Profile' : 'Apply for Official Membership'}</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <FiFilter className="w-3.5 h-3.5" />
              <span>State:</span>
            </span>
            {uniqueStates.slice(0, 6).map((st) => (
              <button
                key={st}
                onClick={() => setStateFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${stateFilter === st
                    ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-amber-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Members Cards Grid */}
        {loading ? (
          <CardSkeleton count={4} />
        ) : filteredMembers.length === 0 ? (
          <EmptyState itemName="Registered Members" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((m, idx) => {
              const isExpired = Boolean(
                m.isExpired ||
                m.membershipStatus === 'expired' ||
                m.status === 'expired' ||
                (m.membershipExpiresAt && new Date(m.membershipExpiresAt).getTime() < Date.now())
              );

              return (
                <div
                  key={m._id || m.memberId || idx}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between group ${
                    isExpired
                      ? 'border-rose-300/80 hover:border-rose-500 bg-rose-50/20'
                      : 'border-slate-200 hover:border-amber-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full border-2 p-0.5 overflow-hidden shadow-sm bg-white ${
                        isExpired ? 'border-rose-400 grayscale-30' : 'border-amber-400'
                      }`}>
                        <img
                          src={getContentImageUrl(m.photoUrl) || '/logo.jpeg'}
                          alt={m.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.jpeg';
                          }}
                        />
                      </div>
                      {isExpired ? (
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-xs" title="Expired Member • ID Card Locked">
                          <FiLock className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center text-xs shadow-xs" title="Verified Member">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
                        {m.name}
                      </h3>
                      {isExpired ? (
                        <span className="font-mono text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                          <FiAlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Expired Member</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full inline-block mt-1">
                          {m.memberId || 'VERIFIED MEMBER'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-semibold line-clamp-1">
                      {m.designation || (isExpired ? 'Membership Expired' : 'Active Social Worker')}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{m.district ? `${m.district}, ${m.state}` : m.state || 'India'}</span>
                    </span>
                    {isExpired ? (
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">
                        Plan Expired
                      </span>
                    ) : m.bloodGroup ? (
                      <span className="font-mono font-bold text-[#d50000] bg-red-50 px-1.5 py-0.2 rounded text-[10px]">
                        {m.bloodGroup}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
