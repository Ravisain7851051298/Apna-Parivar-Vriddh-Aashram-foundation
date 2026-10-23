'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function GoogleTranslate() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize hidden Google Translate Element once
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'hi,en,bn,te,mr,ta,ur,gu,pa,kn,ml',
              autoDisplay: false,
            },
            'google_translate_hidden_element'
          );
        } catch (e) {
          console.error('Google Translate Init error:', e);
        }
      }
    };

    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  // Read initial language from cookie if set
  useEffect(() => {
    try {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/i);
      if (match && match[1]) {
        setSelectedLang(match[1]);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Set Google translate cookie and trigger select change
  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    setIsOpen(false);

    try {
      if (langCode === 'en') {
        // Reset cookie for pure English default
        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = `googtrans=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
        window.location.reload();
        return;
      }

      // Set the googtrans cookie for both root and current domain
      const cookieValue = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/;`;

      // Try directly targeting the hidden combo box
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        // If combo isn't populated yet, reload to let the cookie take effect cleanly
        window.location.reload();
      }
    } catch (err) {
      console.error('Language change error:', err);
    }
  };

  const activeLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div className="relative z-50 inline-block text-left" ref={dropdownRef}>
      {/* Hidden Official Mount Node */}
      <div id="google_translate_hidden_element" className="hidden" />

      {/* Modern Compact Custom Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-300 hover:border-amber-500 bg-white/95 hover:bg-white text-stone-900 text-xs font-bold transition shadow-2xs cursor-pointer group"
        aria-label="Select Language"
      >
        <FiGlobe className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-bold">{activeLangObj.native}</span>
        <FiChevronDown className={`w-3 h-3 text-stone-500 group-hover:text-amber-800 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-amber-200 shadow-2xl py-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 ring-1 ring-amber-500/20">
          <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-900 border-b border-amber-100 mb-1">
            Translate Website
          </div>
          <div className="max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-left transition cursor-pointer ${isSelected
                    ? 'bg-amber-100/90 text-amber-950 font-black'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                    }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-stone-400 font-mono">({lang.label})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
