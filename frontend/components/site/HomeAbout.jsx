'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiTarget,
  FiCompass,
  FiArrowRight,
  FiAward,
  FiHeart,
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function HomeAbout() {
  const { settings } = useNGO();

  const corePillars = [
    {
      title: 'सुरक्षित आवास',
      desc: 'वरिष्ठ नागरिकों की सुरक्षा व सुविधा अनुसार हवादार व स्वच्छ कक्ष।',
      icon: FiShield,
    },
    {
      title: '24/7 स्वास्थ्य जांच',
      desc: 'नियमित बीपी, शुगर मॉनिटरिंग, डॉक्टर विजिट एवं एम्बुलेंस सुविधा।',
      icon: FiHeart,
    },
    {
      title: 'सात्विक भोजन सेवा',
      desc: 'स्वच्छ रसोई में तैयार दैनिक 3 समय का पौष्टिक व सुपाच्य आहार।',
      icon: FiAward,
    },
    {
      title: 'सत्संग एवं योग',
      desc: 'मानसिक शांति व आनंद हेतु दैनिक योग, भजन-कीर्तन व सत्संग।',
      icon: FiTarget,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200" aria-label="About Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <FiShield className="w-4 h-4 text-amber-700" />
            <span>12A एवं 80G प्रमाणित धर्मार्थ ट्रस्ट (Jabalpur, M.P.)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {settings?.aboutHeading || 'About Apna Parivar Vriddh Aashram'}
          </h2>

          <p className="text-xs sm:text-base text-slate-600 mt-3 font-medium leading-relaxed">
            {settings?.aboutSubtitle || 'A Registered Non-Profit Old Age Home Dedicated to Providing Dignified Care & Love to Destitute Senior Citizens'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Dynamic Story, Mission & Vision */}
          <div className="lg:col-span-7 space-y-6">

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {settings?.aboutStory ||
                'अपना परिवार वृद्ध आश्रम फाउंडेशन जबलपुर (मध्य प्रदेश) में असहाय, निराश्रित एवं वृद्धजनों को गरिमापूर्ण जीवन, सुरक्षा और पारिवारिक स्नेह प्रदान करने के संकल्प के साथ संचालित है। हमारा उद्देश्य यह सुनिश्चित करना है कि जीवन के इस पड़ाव पर कोई भी बुजुर्ग अकेला या उपेक्षित महसूस न करे। हम 24 घंटे चिकित्सा, सात्विक भोजन, सुरक्षित आवास और भावनात्मक संबल प्रदान करते हैं।'}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-stone-950 flex items-center justify-center font-black shadow-sm">
                    <FiTarget className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-amber-950">हमारा मिशन (Mission)</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {settings?.missionStatement ||
                    'निराश्रित एवं वृद्ध माता-पिता को सुरक्षित छत, पौष्टिक सात्विक आहार, 24 घंटे स्वास्थ्य जांच एवं परिवार का प्यार और सम्मान उपलब्ध कराना।'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <FiCompass className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-amber-950">हमारा विजन (Vision)</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {settings?.visionStatement ||
                    'एक ऐसा समाज जहाँ किसी भी बुजुर्ग को वृद्धावस्था में लाचारी और एकाकीपन का सामना न करना पड़े, बल्कि वे सम्मान और खुशहाली के साथ जीवन व्यतीत करें।'}
                </p>
              </div>
            </div>

            {/* Dynamic Statutory Details Box */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-[11px] font-black text-amber-950 uppercase tracking-widest block">
                वैधानिक मान्यता एवं 80G कर छूट विवरण
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">80G Approval No:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.exemption80G || 'CIT(EXEMP)/80G/912'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">12A Reg. No:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.exemption12A || 'CIT(EXEMP)/12A/884'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">NITI Aayog Darpan:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.nitiAayogDarpanId || 'MP/2022/0319482'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold">PAN / Trust Reg:</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{settings?.panNo || 'AABTA4892P'}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 hover:scale-102 transition"
              >
                <span>विस्तृत फाउंडेशन परिचय</span>
                <FiArrowRight className="w-4 h-4 text-stone-950" />
              </Link>
              <Link
                href="/who-we-are"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50/50 text-stone-900 border border-amber-300 font-bold text-xs transition"
              >
                <span>Who We Are</span>
              </Link>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline px-2 py-1 ml-auto"
              >
                <FiFileText className="w-3.5 h-3.5" />
                <span>प्रमाण पत्र देखें</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Banner & Pillars */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              <img
                src="/banner.jpg"
                alt="Apna Parivar Vriddh Aashram"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#d97706] text-white text-[10px] font-black uppercase tracking-wider">
                    सेवा • सम्मान • परिवार
                  </span>
                  <h3 className="text-lg font-black leading-snug text-white">
                    अपना परिवार वृद्ध आश्रम
                  </h3>
                  <p className="text-xs text-amber-200 font-medium">
                    जहाँ हर बुजुर्ग है, हमारा अपना
                  </p>
                </div>
              </div>
            </div>

            {/* Core Action Pillars Grid */}
            <div className="grid grid-cols-2 gap-3">
              {corePillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 transition">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#d97706] flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 leading-snug">{pillar.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
