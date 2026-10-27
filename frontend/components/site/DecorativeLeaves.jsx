'use client';

import React, { useId } from 'react';

/**
 * Reusable Decorative Leaves & Floral Spike Component
 * 
 * Designed to lavishly frame any corner of a parent container covering a complete 90° arc:
 * - Vertical Purple Leaf (~82° along the vertical edge)
 * - Animated Floral Spike (~68° diagonal) with lilac florets & golden pollen stamens
 * - Broad Radiant Golden-Yellow Leaf (~52° center-diagonal)
 * - Broad Vivid Coral-Orange Leaf (~32° lower-diagonal)
 * - Horizontal Violet-Purple Leaf (~10° along the horizontal bottom edge)
 * - Warm Amber-Orange Base Accent Leaflet tucked at the bottom corner for lush fullness
 * 
 * Clean botanical design: zero rounded blur/blue blobs at the bottom, broad leaf bases emerging
 * directly from the corner, and generous widths for a tropical/botanical aesthetic.
 * 
 * Props:
 * - position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'custom'
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - showFloralSpike: boolean (default true)
 * - showYellowLeaf: boolean (default true)
 * - showOrangeLeaf: boolean (default true)
 * - animated: boolean (default true)
 * - opacity: number (default 0.95)
 * - rotate: number
 * - flipX: boolean
 * - flipY: boolean
 */
export default function DecorativeLeaves({
  position = 'bottom-right',
  size = 'lg',
  showFloralSpike = true,
  showYellowLeaf = true,
  showOrangeLeaf = true,
  animated = true,
  opacity = 0.95,
  rotate = 0,
  flipX = false,
  flipY = false,
  className = '',
  style = {}
}) {
  const uniqueId = useId().replace(/:/g, '_');

  // Corner positioning classes (center origin ensures corner flips stay within container bounds)
  const positionClasses = {
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0 scale-x-[-1]',
    'top-right': 'top-0 right-0 scale-y-[-1]',
    'top-left': 'top-0 left-0 scale-x-[-1] scale-y-[-1]',
    'custom': ''
  };

  // Generous responsive size presets to prominently cover the corner
  const sizeClasses = {
    'sm': 'w-40 h-40 sm:w-52 sm:h-52',
    'md': 'w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80',
    'lg': 'w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px]',
    'xl': 'w-88 h-88 sm:w-[440px] sm:h-[440px] md:w-[520px] md:h-[520px] lg:w-[580px] lg:h-[580px]'
  };

  const posClass = positionClasses[position] || '';
  const szClass = sizeClasses[size] || size;

  // Compute manual flip / rotate transforms if requested
  const transformParts = [];
  if (flipX && !posClass.includes('scale-x-[-1]')) transformParts.push('scaleX(-1)');
  if (flipY && !posClass.includes('scale-y-[-1]')) transformParts.push('scaleY(-1)');
  if (rotate !== 0) transformParts.push(`rotate(${rotate}deg)`);
  const extraTransform = transformParts.join(' ');

  return (
    <div
      className={`pointer-events-none absolute z-10 select-none overflow-visible ${posClass} ${szClass} ${className}`}
      style={{
        opacity,
        transform: extraTransform || undefined,
        ...style
      }}
      aria-hidden="true"
    >
      <style>{`
        /* Overall botanical breathing breeze */
        @keyframes leafBreeze_${uniqueId} {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          50% {
            transform: translate(-5px, -6px) rotate(1.2deg);
          }
        }

        /* 1. Vertical Purple Leaf Sway (~82°) */
        @keyframes leafVerticalSway_${uniqueId} {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            transform-origin: 300px 300px;
          }
          50% {
            transform: rotate(2.6deg) scale(1.02);
            transform-origin: 300px 300px;
          }
        }

        /* 2. Floral Spike Wave (~68°) */
        @keyframes spikeSway_${uniqueId} {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            transform-origin: 300px 300px;
          }
          50% {
            transform: rotate(3.8deg) scale(1.03);
            transform-origin: 300px 300px;
          }
        }

        /* 3. Golden-Yellow Leaf Sway (~52°) */
        @keyframes leafYellowSway_${uniqueId} {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            transform-origin: 300px 300px;
          }
          50% {
            transform: rotate(-3.2deg) scale(1.025);
            transform-origin: 300px 300px;
          }
        }

        /* 4. Vivid Orange Leaf Sway (~32°) */
        @keyframes leafOrangeSway_${uniqueId} {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            transform-origin: 300px 300px;
          }
          50% {
            transform: rotate(2.8deg) scale(1.02);
            transform-origin: 300px 300px;
          }
        }

        /* 5. Horizontal Violet-Purple Leaf Sway (~10°) */
        @keyframes leafHorizontalSway_${uniqueId} {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            transform-origin: 300px 300px;
          }
          50% {
            transform: rotate(-2.2deg) scale(1.018);
            transform-origin: 300px 300px;
          }
        }

        /* 6. Base Accent Leaflet Sway */
        @keyframes leafBaseAccentSway_${uniqueId} {
          0%, 100% {
            transform: rotate(0deg);
            transform-origin: 300px 300px;
          }
          50% {
            transform: rotate(1.8deg) scale(1.015);
            transform-origin: 300px 300px;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
        style={
          animated
            ? { animation: `leafBreeze_${uniqueId} 10s ease-in-out infinite alternate` }
            : {}
        }
      >
        <defs>
          {/* 1. Vertical Purple Leaf Gradient (Pure royal purple/magenta - zero blue cast) */}
          <linearGradient
            id={`leafGradVertPurple_${uniqueId}`}
            x1="300"
            y1="300"
            x2="265"
            y2="35"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#581c87" stopOpacity="0.96" />
            <stop offset="45%" stopColor="#7e22ce" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.82" />
          </linearGradient>

          {/* 2. Floral Spike Stem Gradient */}
          <linearGradient
            id={`spikeStemGrad_${uniqueId}`}
            x1="300"
            y1="300"
            x2="185"
            y2="25"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#701a75" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0.95" />
          </linearGradient>

          {/* 3. Floral Floret Petal Gradient (Violet into Orchid and Sunlight) */}
          <linearGradient
            id={`floretGrad_${uniqueId}`}
            x1="0"
            y1="1"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#86198f" stopOpacity="0.94" />
            <stop offset="55%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0.96" />
          </linearGradient>

          {/* 4. Golden-Yellow Leaf Gradient (Deep amber gold into radiant lemon sunlight) */}
          <linearGradient
            id={`leafGradYellow_${uniqueId}`}
            x1="300"
            y1="300"
            x2="115"
            y2="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#b45309" stopOpacity="0.96" />
            <stop offset="45%" stopColor="#eab308" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.86" />
          </linearGradient>

          {/* 5. Vivid Coral-Orange Leaf Gradient (Warm burnt terracotta into bright radiant tangerine) */}
          <linearGradient
            id={`leafGradOrange_${uniqueId}`}
            x1="300"
            y1="300"
            x2="55"
            y2="150"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#9a3412" stopOpacity="0.96" />
            <stop offset="40%" stopColor="#ea580c" stopOpacity="0.92" />
            <stop offset="85%" stopColor="#f97316" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.84" />
          </linearGradient>

          {/* 6. Horizontal Violet-Purple Leaf Gradient (Warm deep amethyst into radiant violet) */}
          <linearGradient
            id={`leafGradHorizPurple_${uniqueId}`}
            x1="300"
            y1="300"
            x2="40"
            y2="235"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#581c87" stopOpacity="0.96" />
            <stop offset="50%" stopColor="#9333ea" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.82" />
          </linearGradient>

          {/* 7. Base Accent Leaflet Gradient (Fiery amber peach) */}
          <linearGradient
            id={`leafGradBaseAccent_${uniqueId}`}
            x1="300"
            y1="300"
            x2="180"
            y2="190"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#c2410c" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* ================= 1. VERTICAL PURPLE LEAF (~82° ALONG VERTICAL EDGE) ================= */}
        {/* Curving from corner (300, 300) with generous broad belly up to tip at (265, 35) */}
        <g
          style={
            animated
              ? { animation: `leafVerticalSway_${uniqueId} 7.4s ease-in-out infinite alternate` }
              : {}
          }
        >
          {/* Main Leaf Body - Generous width (~95px across mid-belly) */}
          <path
            d="M 300 300 
               C 240 220, 185 120, 265 35 
               C 298 105, 300 200, 300 300 Z"
            fill={`url(#leafGradVertPurple_${uniqueId})`}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* Spine vein */}
          <path
            d="M 300 300 Q 262 165, 265 35"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Lateral veins */}
          <path
            d="M 285 240 Q 260 225, 246 220"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 276 195 Q 248 180, 234 170"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 269 145 Q 242 135, 232 120"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 266 95 Q 250 85, 244 75"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>

        {/* ================= 2. ANIMATED FLOWER SPIKE / FLORAL SPIKE (~68°) ================= */}
        {/* Graceful curved stem reaching up to (185, 25) with paired florets & golden pollen dots */}
        {showFloralSpike && (
          <g
            style={
              animated
                ? { animation: `spikeSway_${uniqueId} 6.2s ease-in-out infinite alternate 0.2s` }
                : {}
            }
          >
            {/* Stem */}
            <path
              d="M 300 300 C 255 185, 215 105, 185 25"
              stroke={`url(#spikeStemGrad_${uniqueId})`}
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            {/* Terminal Top Florets */}
            <path
              d="M 185 25 C 180 18, 175 23, 179 30 C 182 33, 188 31, 185 25 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />
            <path
              d="M 185 25 C 192 19, 198 24, 193 31 C 189 34, 184 31, 185 25 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />

            {/* Floret Pair 2 */}
            <path
              d="M 194 42 C 185 36, 181 46, 188 52 C 193 54, 200 49, 194 42 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />
            <path
              d="M 198 44 C 206 38, 212 48, 205 54 C 200 57, 194 51, 198 44 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />

            {/* Floret Pair 3 */}
            <path
              d="M 207 63 C 196 56, 191 68, 200 76 C 206 79, 214 73, 207 63 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />
            <path
              d="M 212 66 C 223 59, 229 70, 220 79 C 214 82, 207 75, 212 66 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />

            {/* Floret Pair 4 */}
            <path
              d="M 223 88 C 211 81, 205 94, 216 104 C 222 107, 231 100, 223 88 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />
            <path
              d="M 229 93 C 241 85, 248 97, 238 108 C 232 111, 224 103, 229 93 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />

            {/* Floret Pair 5 */}
            <path
              d="M 242 118 C 229 110, 222 125, 234 137 C 241 140, 251 132, 242 118 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />
            <path
              d="M 249 124 C 263 115, 271 129, 260 142 C 253 145, 244 136, 249 124 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />

            {/* Floret Pair 6 */}
            <path
              d="M 262 153 C 248 144, 241 161, 254 174 C 262 177, 272 168, 262 153 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />
            <path
              d="M 270 160 C 285 150, 294 166, 282 179 C 274 183, 264 173, 270 160 Z"
              fill={`url(#floretGrad_${uniqueId})`}
            />

            {/* Golden Pollen Center Dots */}
            <circle cx="186" cy="27" r="2.2" fill="#fde047" />
            <circle cx="196" cy="46" r="2.5" fill="#fef08a" />
            <circle cx="210" cy="70" r="2.8" fill="#fde047" />
            <circle cx="226" cy="97" r="3.0" fill="#fef08a" />
            <circle cx="245" cy="127" r="3.2" fill="#fde047" />
            <circle cx="266" cy="162" r="3.4" fill="#fef08a" />
          </g>
        )}

        {/* ================= 3. BROAD GOLDEN-YELLOW LEAF (~52° CENTER DIAGONAL) ================= */}
        {/* Curving from corner (300, 300) with wide body out to tip at (115, 75) */}
        {showYellowLeaf && (
          <g
            style={
              animated
                ? { animation: `leafYellowSway_${uniqueId} 8.2s ease-in-out infinite alternate 0.4s` }
                : {}
            }
          >
            {/* Broad Leaf Body (~95px width at widest belly) */}
            <path
              d="M 300 300 
                 C 255 195, 140 100, 115 75 
                 C 145 160, 215 255, 300 300 Z"
              fill={`url(#leafGradYellow_${uniqueId})`}
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Spine vein */}
            <path
              d="M 300 300 Q 195 180, 115 75"
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Lateral veins */}
            <path
              d="M 252 238 Q 230 205, 222 185"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 215 195 Q 185 165, 172 145"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 175 145 Q 150 125, 138 108"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ================= 4. BROAD VIVID CORAL-ORANGE LEAF (~32° LOWER-MID DIAGONAL) ================= */}
        {/* Rich vibrant fiery orange leaf fanning out to tip at (55, 150) */}
        {showOrangeLeaf && (
          <g
            style={
              animated
                ? { animation: `leafOrangeSway_${uniqueId} 6.8s ease-in-out infinite alternate 0.7s` }
                : {}
            }
          >
            {/* Broad Leaf Body (~95px width at widest belly) */}
            <path
              d="M 300 300 
                 C 230 235, 115 140, 55 150 
                 C 90 225, 195 285, 300 300 Z"
              fill={`url(#leafGradOrange_${uniqueId})`}
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Spine vein */}
            <path
              d="M 300 300 Q 165 215, 55 150"
              stroke="rgba(255, 255, 255, 0.52)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Lateral veins */}
            <path
              d="M 245 262 Q 205 235, 185 210"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 195 228 Q 155 198, 132 175"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 140 190 Q 110 170, 92 158"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ================= 5. BASE WARM ACCENT LEAFLET (Fills Corner & Base) ================= */}
        {/* Ensures the bottom corner itself is lushly layered with broad overlapping colors */}
        <g
          style={
            animated
              ? { animation: `leafBaseAccentSway_${uniqueId} 8.8s ease-in-out infinite alternate 0.3s` }
              : {}
          }
        >
          <path
            d="M 300 300 
               C 270 240, 205 180, 175 195 
               C 210 245, 255 285, 300 300 Z"
            fill={`url(#leafGradBaseAccent_${uniqueId})`}
            style={{ mixBlendMode: 'multiply' }}
          />
        </g>

        {/* ================= 6. BROAD HORIZONTAL VIOLET-PURPLE LEAF (~10° ALONG BOTTOM EDGE) ================= */}
        {/* Sweeping from corner (300, 300) with wide belly out to tip at (40, 235) */}
        <g
          style={
            animated
              ? { animation: `leafHorizontalSway_${uniqueId} 7.8s ease-in-out infinite alternate 0.5s` }
              : {}
          }
        >
          {/* Broad Leaf Body (~95px width at widest belly) */}
          <path
            d="M 300 300 
               C 225 270, 115 195, 40 235 
               C 105 292, 215 300, 300 300 Z"
            fill={`url(#leafGradHorizPurple_${uniqueId})`}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* Spine vein */}
          <path
            d="M 300 300 Q 165 262, 40 235"
            stroke="rgba(255, 255, 255, 0.48)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Lateral veins */}
          <path
            d="M 235 285 Q 200 262, 175 240"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 175 270 Q 140 245, 118 225"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 115 252 Q 85 238, 68 230"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
