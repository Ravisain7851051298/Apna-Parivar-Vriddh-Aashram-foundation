'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiUsers,
  FiCompass,
  FiTarget,
  FiShield,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiAward,
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import ContentRenderer from '@/components/ContentRenderer';

export default function WhoWeArePage() {
  const { settings } = useNGO();

  const fallbackStory = `अपना परिवार वृद्ध आश्रम फाउंडेशन (Apna Parivar Vriddh Aashram Foundation) जबलपुर (मध्य प्रदेश) में असहाय, निराश्रित एवं वृद्धजनों को गरिमापूर्ण, स्वस्थ और स्नेहपूर्ण जीवन प्रदान करने के संकल्प के साथ स्थापित किया गया है। हमारा उद्देश्य यह सुनिश्चित करना है कि जीवन के इस पड़ाव पर कोई भी बुजुर्ग अकेला, बेसहारा या उपेक्षित महसूस न करे।

यहाँ रहने वाले प्रत्येक वृद्धजन को सुरक्षित एवं वातानुकूलित आवास, दैनिक तीन समय का ताजा सात्विक आहार, 24 घंटे मेडिकल जांच व नर्सिंग केयर, नियमित योग, सत्संग और भजन-कीर्तन के माध्यम से पारिवारिक खुशहाली दी जाती है।

हम 100% पारदर्शी, आयकर धारा 12A एवं 80G के अंतर्गत पंजीकृत चैरिटेबल ट्रस्ट हैं, जहाँ दान का प्रत्येक पैसा वृद्धजनों की सेवा में प्रत्यक्ष रूप से समर्पित होता है।`;

  const fallbackMission = settings?.missionStatement || 'निराश्रित एवं वृद्ध माता-पिता को सुरक्षित छत, पौष्टिक सात्विक आहार, 24 घंटे स्वास्थ्य जांच एवं परिवार का प्यार और सम्मान उपलब्ध कराना।';
  const fallbackVision = settings?.visionStatement || 'एक ऐसा समाज जहाँ किसी भी बुजुर्ग को वृद्धावस्था में लाचारी और एकाकीपन का सामना न करना पड़े, बल्कि वे सम्मान और खुशहाली के साथ जीवन व्यतीत करें।';

  const fallbackValues = `वृद्ध सेवा ही माधव सेवा: माता-पिता तुल्य वरिष्ठ नागरिकों की सेवा ही ईश्वर की सबसे बड़ी आराधना है।
पारदर्शिता एवं सत्यनिष्ठा: 100% वैधानिक अनुपालन, आयकर 80G कर छूट रसीद एवं सार्वजनिक जवाबदेही।
पारिवारिक स्नेह एवं सम्मान: आश्रम नहीं, बल्कि प्रेम, अपनत्व और उल्लास से भरा एक संपूर्ण परिवार।
समग्र स्वास्थ्य एवं संबल: 24/7 चिकित्सा, फिजियोथेरेपी, निःशुल्क दवाइयां और आध्यात्मिक सत्संग।`;

  const storyContent = settings?.whoWeAreStory || fallbackStory;
  const missionContent = settings?.whoWeAreMission || fallbackMission;
  const visionContent = settings?.whoWeAreVision || fallbackVision;
  const valuesContent = settings?.whoWeAreValues || fallbackValues;

  const bannerImg = settings?.whoWeAreBannerUrl 
    ? getContentImageUrl(settings.whoWeAreBannerUrl) 
    : '/banner.jpg';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-600 selection:text-white">
      
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-xs">
              <FiUsers className="w-4 h-4 text-amber-700" />
              <span>Who We Are • {settings?.ngoNameHi || 'अपना परिवार वृद्ध आश्रम'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0F2E5A] tracking-tight leading-tight">
              {settings?.whoWeAreHeading || 'हमारे बारे में — अपना परिवार वृद्ध आश्रम'}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {settings?.whoWeAreSubtitle || 'निःस्वार्थ सेवा, समर्पण और बुजुर्गों को ससम्मान आश्रय एवं परिवार जैसा प्यार'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/donation"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-lg shadow-emerald-700/25 hover:scale-102 transition"
              >
                <FiHeart className="w-4 h-4 fill-white" />
                <span>Support Our Cause (80G Tax-Deductible)</span>
              </Link>
              <Link
                href="/volunteer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-slate-200 font-bold text-xs shadow-xs hover:scale-102 transition"
              >
                <FiUsers className="w-4 h-4 text-emerald-700" />
                <span>Join as Volunteer</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs hover:scale-102 transition"
              >
                <FiFileText className="w-4 h-4 text-slate-600" />
                <span>Legal Accreditations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. MAIN STORY & BANNER ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Dynamic Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <FiCompass className="w-3.5 h-3.5 text-emerald-700" />
                <span>Our Identity &amp; Living Journey</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Channeling Youth Energy into Lasting Social Equity
              </h2>

              {/* Dynamic Content rendered from Admin Settings */}
              <div className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
                <ContentRenderer content={storyContent} />
              </div>
            </div>

            {/* Right: Banner Image & Fast Facts */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImg}
                  alt={settings?.whoWeAreHeading || 'अपना परिवार वृद्ध आश्रम'}
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/banner.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 px-2 py-0.5 rounded-md">
                      वृद्ध सेवा ही माधव सेवा
                    </span>
                    <h3 className="text-sm font-black text-white">
                      {settings?.ngoName || 'अपना परिवार वृद्ध आश्रम फाउंडेशन'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      सुरक्षित आवास, पौष्टिक भोजन, 24/7 स्वास्थ्य जांच एवं परिवार जैसा प्यार।
                    </p>
                  </div>
                </div>
              </div>

              {/* Statutory Trust Card */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3.5 shadow-xs">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FiShield className="text-emerald-700 w-4 h-4" />
                  <span>Statutory Certifications</span>
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">12A Reg No.</span>
                    <span className="font-mono font-bold text-slate-900 truncate block text-[11px] mt-0.5">
                      {settings?.exemption12A || 'CIT(EXEMP)/12A/2021-22/A-492'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">80G Tax Exemption</span>
                    <span className="font-mono font-bold text-emerald-700 truncate block text-[11px] mt-0.5">
                      {settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">NITI Aayog Darpan</span>
                    <span className="font-mono font-bold text-slate-900 truncate block text-[11px] mt-0.5">
                      {settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">PAN Card</span>
                    <span className="font-mono font-bold text-slate-900 uppercase truncate block text-[11px] mt-0.5">
                      {settings?.panNo || 'AAATB4321Q'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. MISSION & VISION DUAL CARDS ---------------- */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Our Compass
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Mission &amp; Vision Statements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The foundational guiding stars directing every program and humanitarian intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                <FiTarget className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {missionContent}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4" />
                <span>Measurable Grassroots Impact</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                <FiCompass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {visionContent}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4" />
                <span>Self-Reliant &amp; United Nation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. CORE VALUES & ETHOS ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Core Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                The Non-Negotiable Values Guiding Our Volunteers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe that good intentions without disciplined execution and high ethics achieve little. Every volunteer and leader adheres to our transparent principles.
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <FiAward className="w-4 h-4 text-emerald-700" />
                  <span>National President Signatory</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {settings?.presidentName || 'Ravi Saini (National President & Trustee)'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <ContentRenderer content={valuesContent} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 5. CONTACT & HELPLINE BAR ---------------- */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Have questions about our foundation or initiatives?
              </h3>
              <p className="text-xs text-slate-600">
                Reach out directly to our national central desk or visit our registered headquarters.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${settings?.phone || '+91 93196 98759'}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                <FiPhone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{settings?.phone || '+91 93196 98759'}</span>
              </a>
              <a
                href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-md shadow-emerald-700/20"
              >
                <FiMail className="w-3.5 h-3.5" />
                <span>Email Administration</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
