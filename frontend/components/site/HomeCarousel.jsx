'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContentImageUrl } from '@/lib/authApi';
import { FiChevronLeft, FiChevronRight, FiHeart, FiShield, FiArrowRight } from 'react-icons/fi';

const DEFAULT_SLIDES = [
  {
    imageUrl: '/banner.jpg',
    tag: 'सेवा • सम्मान • परिवार',
    title: 'जहाँ हर बुजुर्ग है, हमारा अपना',
    subtitle: 'अपना परिवार वृद्ध आश्रम जबलपुर में असहाय, निराश्रित एवं वरिष्ठ नागरिकों को सुरक्षित आवास, 24/7 चिकित्सा, सात्विक भोजन और परिवार जैसा स्नेह प्रदान करता है।',
    ctaPrimaryText: 'सहयोग करें (80G कर छूट)',
    ctaPrimaryLink: '/donation',
    ctaSecondaryText: 'आश्रम के बारे में जानें',
    ctaSecondaryLink: '/about',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1920&auto=format&fit=crop&q=80',
    tag: '100% पारदर्शी दान • 80G Tax Exemption',
    title: 'मुस्कुराते चेहरे... यही है हमारी पहचान',
    subtitle: 'जीवन के इस पड़ाव पर किसी भी वृद्ध माता-पिता को अकेलापन न सताए। आपका एक छोटा सा दान किसी बुजुर्ग के एक माह के भोजन व दवाइयों का संबल बन सकता है।',
    ctaPrimaryText: 'तिथि भोजन सेवा स्पॉन्सर करें',
    ctaPrimaryLink: '/donation',
    ctaSecondaryText: 'सक्रिय अभियान देखें',
    ctaSecondaryLink: '/campaigns',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&auto=format&fit=crop&q=80',
    tag: '24/7 स्वास्थ्य जांच एवं देखभाल',
    title: 'नियमित स्वास्थ्य जांच, सात्विक भोजन व सम्मान',
    subtitle: 'फिजियोथेरेपी, दैनिक बीपी/शुगर मॉनिटरिंग, विशेषज्ञ डॉक्टरों का विजिट, एवं नित्य आध्यात्मिक सत्संग व योग से भरपूर एक गरिमापूर्ण वातावरण।',
    ctaPrimaryText: 'स्वयंसेवक (Volunteer) बनें',
    ctaPrimaryLink: '/apply-volunteer',
    ctaSecondaryText: 'सेवाएं एवं सुविधाएं',
    ctaSecondaryLink: '/services',
  },
];

export default function HomeCarousel({ slides = [] }) {
  const displaySlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || displaySlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, displaySlides.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % displaySlides.length);
  };

  return (
    <div
      className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] overflow-hidden bg-slate-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {displaySlides.map((slide, idx) => {
        const isActive = idx === currentIdx;
        const rawImg = slide.imageUrl || slide.image || '/banner.jpg';
        const imgUrl = rawImg.startsWith('http') || rawImg.startsWith('/') ? rawImg : getContentImageUrl(rawImg);

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            {/* Banner Background Image */}
            <img
              src={imgUrl}
              alt={slide.title || `Apna Parivar Vriddh Aashram Banner ${idx + 1}`}
              className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${isActive ? 'scale-105' : 'scale-100'
                }`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].imageUrl;
              }}
            />

            {/* Gradient Dark Overlay with Brand Tones */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-black/30" />

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 text-white animate-in fade-in slide-in-from-bottom-4 duration-700">

                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 text-xs font-black shadow-lg border border-amber-300/80">
                    <FiShield className="w-3.5 h-3.5 text-stone-950" />
                    <span>{slide.tag || 'सेवा • सम्मान • परिवार'}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md text-white">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow-sm">
                    {slide.subtitle}
                  </p>

                  {/* Action CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={slide.ctaPrimaryLink || '/donation'}
                      className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/40 transform hover:scale-105 transition-all"
                    >
                      <FiHeart className="w-4 h-4 fill-stone-950 text-stone-950 animate-pulse" />
                      <span>{slide.ctaPrimaryText || 'दान करें (80G कर छूट)'}</span>
                    </Link>

                    <Link
                      href={slide.ctaSecondaryLink || '/about'}
                      className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 font-bold text-xs sm:text-sm transition-all"
                    >
                      <span>{slide.ctaSecondaryText || 'आश्रम के बारे में'}</span>
                      <FiArrowRight className="w-4 h-4 text-amber-300" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>

          </div>
        );
      })}

      {/* Navigation Arrows */}
      {displaySlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-amber-600 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 cursor-pointer shadow-xl hover:scale-110"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-amber-600 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 cursor-pointer shadow-xl hover:scale-110"
            aria-label="Next Slide"
          >
            <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Dots Indicator with Saffron & Amber active state */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentIdx
                    ? 'w-10 bg-linear-to-r from-[#f59e0b] to-[#d97706] shadow-md shadow-amber-500/50'
                    : 'w-2.5 bg-white/50 hover:bg-white'
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
