'use client';

import React from 'react';
import Link from 'next/link';
import { FiShield, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import ContentRenderer from '@/components/ContentRenderer';
import DecorativeLeaves from '@/components/site/DecorativeLeaves';
import DecorativeRings from '@/components/site/DecorativeRings';

export default function PrivacyPolicyPage() {
  const { settings } = useNGO();
  const ngoName = settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation';

  const defaultPolicyContent = `## 1. Information We Collect
When you interact with ${ngoName} through donations, membership registrations, volunteer drives, or contact inquiries, we collect information necessary to fulfill our statutory non-profit functions:
- **Personal Identity:** Full name, date of birth, gender, blood group, and residential address.
- **Contact Information:** Verified mobile phone number, WhatsApp contact, and email address.
- **Statutory Tax Data (for 80G Receipts):** Permanent Account Number (PAN Card No.) and postal address, mandatory under the Income Tax Act, 1961 (Form 10BD reporting).
- **Payment Transaction Data:** Unique transaction ID, payment method (UPI, Netbanking, Debit/Credit Card), timestamp, and donation amount. We do NOT store credit card numbers, CVVs, or net banking passwords on our servers.

## 2. How We Use Your Information
All personal and financial details collected by the Foundation are used strictly for legitimate charitable administration:
- Generating and delivering instant, digitally signed Section 80G tax exemption donation receipts.
- Issuing verified digital membership ID cards, appointment letters, and appreciation certificates.
- Reporting donor contribution records to the Income Tax Department via Form 10BD for donor tax deductions.
- Communicating program updates, emergency medical appeals, and humanitarian elder care bulletins.
- Investigating grievances, feedback, and community service inquiries submitted to the administration.

## 3. Payment Gateway Security & Encryption
Online payments on this portal are processed via Reserve Bank of India (RBI) authorized payment gateways (including Razorpay & UPI rails) utilizing industry-grade 256-bit SSL encryption. ${ngoName} adheres to PCI-DSS compliance standards ensuring seamless, tamper-proof electronic transactions.

## 4. Non-Disclosure & Data Confidentiality
We enforce a strict non-disclosure policy. ${ngoName} does **never rent, sell, trade, or commercially share** our donor or member records with any third-party marketing agency. Information is disclosed solely when mandated by Indian law or competent regulatory bodies (e.g., Income Tax Department, NITI Aayog).

## 5. Your Rights & Grievance Redressal
Donors and registered members maintain the right to review their records, request correction of inaccurate details, or download their cumulative donation statements. For questions or grievance escalation, please reach out directly to our grievance desk below.`;

  const activeContent = settings?.privacyPolicyContent || defaultPolicyContent;

  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#fffef7] via-[#fffbf0] to-[#fef8e7]/30 py-16 selection:bg-amber-500 selection:text-slate-900 overflow-hidden">
      {/* Background Decorative Rings */}
      <DecorativeRings variant="page-corners" />

      {/* Top Left Botanical Flower & Leaves */}
      <DecorativeLeaves
        position="top-left"
        size="sm"
        showFlower={true}
        showFloralSpike={true}
        animated={true}
        opacity={0.88}
      />

      {/* Bottom Right Leaf Accents */}
      <DecorativeLeaves
        position="bottom-right"
        size="md"
        showFlower={false}
        animated={true}
        opacity={0.78}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 font-extrabold text-xs mb-3 border border-amber-300/80">
            <FiShield className="w-4 h-4 text-amber-700" />
            <span>Statutory Compliance &amp; Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {settings?.privacyPolicyTitle || 'Privacy Policy & Data Security'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-2xl mx-auto font-medium">
            {settings?.privacyPolicySubtitle || `${ngoName} (अपना परिवार वृद्ध आश्रम फाउंडेशन) is dedicated to maintaining full transparency, safeguarding donor privacy, and protecting personal data.`}
          </p>
          <div className="text-[11px] text-slate-600 mt-2 font-mono">
            Last Updated: {settings?.privacyLastUpdated || 'October 2026'} • Valid for All Online Donations &amp; Member Registrations
          </div>
        </div>

        {/* Dynamic Content Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-xl shadow-amber-900/5 space-y-8">
          <ContentRenderer content={activeContent} />

          {/* Grievance Redressal Direct Contact Block */}
          <div className="pt-6 border-t border-amber-200/70">
            <h3 className="text-sm font-black text-slate-900 mb-3">
              Official Grievance &amp; Compliance Escalation Desk
            </h3>
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60 space-y-2.5 font-medium text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <FiMail className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Grievance Email: <a href={`mailto:${settings?.email || 'apnaparivarfoundation@gmail.com'}`} className="text-amber-800 font-bold underline">{settings?.email || 'apnaparivarfoundation@gmail.com'}</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <FiPhone className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Helpline: <a href={`tel:${settings?.phone || '+91 94160 55551'}`} className="text-slate-900 font-bold">{settings?.phone || '+91 94160 55551'}</a></span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <FiMapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Head Office: {settings?.address || 'Ward No. 12, Near Bus Stand, Ellenabad, Sirsa, Haryana - 125102'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            ← Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
