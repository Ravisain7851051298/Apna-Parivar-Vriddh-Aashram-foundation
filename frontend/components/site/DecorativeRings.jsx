import React from 'react';

/**
 * Reusable Multi-Shape Decorative Background Rings Component
 * Incorporates Dark Yellow (Amber/Gold) and Purple (Violet/Purple) concentric rings,
 * rotated squircles, and pill shapes for a modern, luxury depth aesthetic.
 */
export default function DecorativeRings({ variant = 'page-corners', className = '' }) {
  if (variant === 'card') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* Top-Right Corner: Concentric Dark Yellow & Purple Squircles + Circles */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border-2 border-amber-500/30 pointer-events-none" />
        <div className="absolute -top-9 -right-9 w-36 h-36 rounded-3xl rotate-12 border-2 border-purple-500/25 pointer-events-none" />
        <div className="absolute -top-5 -right-5 w-26 h-26 rounded-full border-2 border-yellow-500/35 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 rounded-2xl rotate-45 border border-purple-600/30 pointer-events-none" />

        {/* Bottom-Left Corner: Concentric Dark Yellow & Purple Shapes */}
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full border-2 border-purple-500/25 pointer-events-none" />
        <div className="absolute -bottom-9 -left-9 w-36 h-36 rounded-3xl -rotate-12 border-2 border-amber-500/30 pointer-events-none" />
        <div className="absolute -bottom-5 -left-5 w-26 h-26 rounded-full border-2 border-purple-600/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-2xl rotate-12 border border-amber-600/35 pointer-events-none" />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* Dropdown corner ambient rings: Dark Yellow & Purple Shapes */}
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-2 border-purple-500/20 ring-8 ring-amber-400/10 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-3xl rotate-12 border-2 border-amber-500/25 pointer-events-none" />
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border border-purple-500/25 pointer-events-none" />

        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-2 border-amber-500/20 ring-8 ring-purple-400/10 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-3xl -rotate-12 border-2 border-purple-500/25 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border border-amber-500/25 pointer-events-none" />

        {/* Big Size Center Concentric Rings in Dropdown (Dark Yellow & Purple) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-115 h-115 rounded-full border-2 border-amber-500/20 ring-16 ring-purple-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-90 h-90 rounded-3xl rotate-12 border-2 border-purple-500/25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-65 h-65 rounded-full border-2 border-yellow-500/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-45 h-45 rounded-2xl rotate-45 border-2 border-purple-600/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-25 h-25 rounded-full border-2 border-amber-600/35 pointer-events-none" />
      </div>
    );
  }

  if (variant === 'donation') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* Giant Top-Center Dark Yellow & Purple Big Rings */}
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-162.5 h-162.5 rounded-full border-3 border-amber-500/25 ring-28 ring-purple-500/10 pointer-events-none" />
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-130 h-130 rounded-3xl rotate-12 border-3 border-purple-500/30 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-97.5 h-97.5 rounded-full border-2 border-yellow-500/35 pointer-events-none" />
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-65 h-65 rounded-2xl rotate-45 border-2 border-purple-600/35 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-35 h-35 rounded-full border-2 border-amber-600/40 pointer-events-none" />

        {/* Giant Top-Left Big Rings */}
        <div className="absolute -top-40 -left-40 w-135 h-135 rounded-full border-3 border-purple-500/25 ring-24 ring-amber-400/15 pointer-events-none" />
        <div className="absolute -top-28 -left-28 w-100 h-100 rounded-3xl -rotate-12 border-2 border-amber-500/30 pointer-events-none" />
        <div className="absolute -top-14 -left-14 w-65 h-65 rounded-full border-2 border-purple-600/35 pointer-events-none" />

        {/* Giant Top-Right Big Rings */}
        <div className="absolute -top-40 -right-40 w-135 h-135 rounded-full border-3 border-amber-500/25 ring-24 ring-purple-400/15 pointer-events-none" />
        <div className="absolute -top-28 -right-28 w-100 h-100 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
        <div className="absolute -top-14 -right-14 w-65 h-65 rounded-full border-2 border-yellow-500/35 pointer-events-none" />

        {/* Mid-page Big Rings floating */}
        <div className="absolute top-1/3 -left-32 w-115 h-115 rounded-full border-2 border-amber-500/20 pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-3xl rotate-12 border-2 border-purple-500/25 pointer-events-none" />

        <div className="absolute top-2/3 -right-32 w-115 h-115 rounded-full border-2 border-purple-500/20 pointer-events-none" />
        <div className="absolute top-2/3 -right-20 w-80 h-80 rounded-3xl -rotate-12 border-2 border-amber-500/25 pointer-events-none" />

        {/* Bottom Giant Big Rings */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-155 h-155 rounded-full border-3 border-amber-500/25 ring-24 ring-purple-500/10 pointer-events-none" />
        <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-120 h-120 rounded-3xl -rotate-12 border-2 border-purple-500/30 pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-85 h-85 rounded-full border-2 border-yellow-500/35 pointer-events-none" />
      </div>
    );
  }

  if (variant === 'auth' || variant === 'apply') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* Top-Left: Large Dark Yellow & Purple Rings */}
        <div className="absolute -top-36 -left-36 w-120 h-120 rounded-full border-2 border-amber-500/25 ring-20 ring-purple-500/10 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-90 h-90 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-60 h-60 rounded-full border-2 border-yellow-500/35 pointer-events-none" />
        <div className="absolute top-2 left-2 w-35 h-35 rounded-2xl rotate-45 border-2 border-purple-600/35 pointer-events-none" />

        {/* Top-Right: Pill and Squircle Shapes */}
        <div className="absolute -top-32 -right-32 w-105 h-105 rounded-full border-2 border-purple-500/25 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-75 h-75 rounded-3xl -rotate-12 border-2 border-amber-500/30 pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-45 h-45 rounded-full border-2 border-purple-600/35 pointer-events-none" />

        {/* Bottom-Left: Pill and Concentric Rings */}
        <div className="absolute -bottom-36 -left-36 w-110 h-110 rounded-full border-2 border-purple-500/25 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-3xl -rotate-12 border-2 border-amber-500/30 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-50 h-50 rounded-full border-2 border-purple-600/35 pointer-events-none" />

        {/* Bottom-Right: Large Dark Yellow & Purple Rings */}
        <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full border-2 border-amber-500/30 ring-20 ring-purple-500/10 pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-95 h-95 rounded-3xl rotate-12 border-2 border-purple-500/35 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-65 h-65 rounded-full border-2 border-yellow-500/40 pointer-events-none" />
        <div className="absolute -bottom-4 -right-4 w-37.5 h-37.5 rounded-2xl rotate-45 border-2 border-purple-600/35 pointer-events-none" />
      </div>
    );
  }

  // Default: 'page-corners'
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Top-Left: Multi-Shape Dark Yellow & Purple Rings */}
      <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full border-2 border-amber-500/30 ring-24 ring-purple-500/10 pointer-events-none" />
      <div className="absolute -top-28 -left-28 w-95 h-95 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-65 h-65 rounded-full border-2 border-yellow-500/35 pointer-events-none" />
      <div className="absolute top-0 left-0 w-37.5 h-37.5 rounded-2xl rotate-45 border border-purple-600/30 pointer-events-none" />

      {/* Top-Right: Alternating Purple & Dark Yellow Rings */}
      <div className="absolute -top-40 -right-40 w-120 h-120 rounded-full border-2 border-purple-500/30 ring-20 ring-amber-400/15 pointer-events-none" />
      <div className="absolute -top-28 -right-28 w-90 h-90 rounded-3xl -rotate-12 border-2 border-amber-500/35 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full border-2 border-purple-600/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-35 h-35 rounded-2xl rotate-12 border border-yellow-500/35 pointer-events-none" />

      {/* Bottom-Left: Alternating Purple & Dark Yellow Rings */}
      <div className="absolute -bottom-40 -left-40 w-120 h-120 rounded-full border-2 border-purple-500/30 ring-20 ring-amber-400/15 pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-90 h-90 rounded-3xl -rotate-12 border-2 border-amber-500/35 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border-2 border-purple-600/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-35 h-35 rounded-2xl rotate-12 border border-yellow-500/35 pointer-events-none" />

      {/* Bottom-Right: Multi-Shape Dark Yellow & Purple Rings */}
      <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full border-2 border-amber-500/30 ring-24 ring-purple-500/10 pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-95 h-95 rounded-3xl rotate-12 border-2 border-purple-500/30 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-65 h-65 rounded-full border-2 border-yellow-500/35 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-37.5 h-37.5 rounded-2xl rotate-45 border border-purple-600/30 pointer-events-none" />
    </div>
  );
}
