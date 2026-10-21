'use client';

import React from 'react';
import Link from 'next/link';
import { FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNGO } from '../context/NGOContext';

export default function FloatingActions() {
  const { settings } = useNGO();
  const whatsappNum = settings?.whatsapp?.replace(/[^0-9]/g, '') || '918959055269';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to know more about elder care programs, 80G tax-deductible donations, and membership at Apna Parivar Vriddh Aashram Foundation Jabalpur.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 no-print">
      {/* Floating Call Button in Radiant Golden Amber */}
      <a
        href={`tel:${settings?.phone || '+918959055269'}`}
        className="w-13 h-13 rounded-full bg-linear-to-tr from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-700 hover:to-yellow-500 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white ring-2 ring-amber-300/60 group"
        title="24x7 Aashram Helpline"
      >
        <FiPhone className="w-5 h-5 text-stone-950 group-hover:rotate-12 transition-transform" />
      </a>

      {/* Floating WhatsApp Button in Emerald with Golden Ring */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-linear-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-950/40 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group border-2 border-white ring-2 ring-emerald-300/40"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
}
