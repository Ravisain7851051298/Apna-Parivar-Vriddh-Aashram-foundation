'use client';

import React from 'react';
import { FiClock, FiInbox } from 'react-icons/fi';

/**
 * Skeleton Loader Component
 * Displays animated placeholder cards while data is being fetched from the server.
 */
export function CardSkeleton({ count = 3, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs animate-pulse space-y-4 overflow-hidden"
        >
          {/* Image placeholder */}
          <div className="w-full h-48 rounded-2xl bg-amber-100/70" />

          {/* Badge & Meta */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-amber-100/80 rounded-full" />
            <div className="h-4 w-16 bg-amber-100/60 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 w-4/5 bg-stone-200 rounded-lg" />
            <div className="h-4 w-2/3 bg-stone-100 rounded-lg" />
          </div>

          {/* Description lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full bg-stone-100 rounded" />
            <div className="h-3 w-5/6 bg-stone-100 rounded" />
            <div className="h-3 w-3/4 bg-stone-100 rounded" />
          </div>

          {/* Bottom Button */}
          <div className="pt-2">
            <div className="h-10 w-full bg-amber-100/80 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Skeleton Loader for admin tables
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-amber-100 overflow-hidden animate-pulse">
      <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-amber-200/60 rounded flex-1" />
        ))}
      </div>
      <div className="divide-y divide-amber-100/50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-3 bg-stone-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Universal Empty State
 * "Display only real data if not present then simply display no item name is present yet coming soon"
 */
export function EmptyState({
  itemName = 'items',
  message,
  icon: Icon = FiInbox,
  actionButton = null,
  className = ''
}) {
  const displayMsg = message || `No ${itemName} are present yet, coming soon.`;

  return (
    <div
      className={`rounded-3xl border border-amber-200/90 bg-linear-to-b from-amber-50/60 to-yellow-50/30 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs space-y-3.5 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20 ring-4 ring-amber-200/50">
        <Icon className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
        <FiClock className="w-3 h-3 text-amber-800" />
        <span>Coming Soon</span>
      </div>

      <h3 className="text-base sm:text-lg font-black text-stone-950 capitalize">
        No {itemName} Present Yet
      </h3>

      <p className="text-xs text-stone-600 font-medium max-w-md mx-auto leading-relaxed">
        {displayMsg}
      </p>

      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
}

export default CardSkeleton;
