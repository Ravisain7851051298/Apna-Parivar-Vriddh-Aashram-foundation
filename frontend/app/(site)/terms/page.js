'use client';

import React from 'react';
import Link from 'next/link';
import { FiFileText, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import ContentRenderer from '@/components/ContentRenderer';
import DecorativeLeaves from '@/components/site/DecorativeLeaves';
import DecorativeRings from '@/components/site/DecorativeRings';

export default function TermsPage() {
  const { settings } = useNGO();
  const ngoName = settings?.ngoName || 'Apna Parivar Vriddh Aashram Foundation';

  const defaultTermsContent = `## 1. Acceptance of Terms
By accessing, browsing, registering as a member, or donating on this website, you agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms, you should discontinue using this portal.

## 2. Online Donations & 80G Tax Receipts
- All donations contributed through this portal are applied directly towards humanitarian elder care, healthcare assistance, food nutrition, and senior community welfare programs.
- Donations are eligible for 50% income tax deduction under Section 80G of the Indian Income Tax Act, 1961 (Approval Order: **${settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881'}**).
- To receive a valid Section 80G tax certificate, donors must provide their valid Indian Permanent Account Number (PAN) and postal address during payment.
- Official digitally verified donation receipts bearing unique receipt numbers and QR codes are issued immediately upon successful transaction completion.

## 3. Non-Refundable Donation Policy
As donations are voluntary charitable contributions committed promptly towards elderly residential care, healthcare supplies, and nutrition, they are generally **non-refundable**. However, in verified instances of technical error (such as erroneous double deductions through the payment gateway), a written refund request can be filed within 7 calendar days accompanied by transaction proof.

## 4. Code of Conduct for Members & Volunteers
- Every registered Member and Volunteer must conduct themselves in alignment with the humanitarian ideals and peaceful constitution of the Foundation.
- Official Member ID Cards, Appointment Letters, and certificates issued by the Foundation remain the intellectual property of ${ngoName}.
- Members are strictly prohibited from using foundation identification, seals, or letterheads for personal commercial exploitation, unauthorized political lobbying, or illegal activities. Any misuse results in immediate termination of membership and statutory action.

## 5. Protection of Official Logo, Seals & Signatures
All trademarks, logos, official stamps/seals, digital signatures of executive trustees, website graphics, and software workflows displayed across this portal are exclusively owned by ${ngoName}. Unauthorized reproduction, modification, or counterfeit duplication is actionable under Indian Copyright and Intellectual Property laws.

## 6. Governing Law & Legal Jurisdiction
These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute or arbitration, the courts having jurisdiction in **Sirsa, Haryana** shall have exclusive jurisdiction.`;

  const activeContent = settings?.termsContent || defaultTermsContent;

  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#fffef7] via-[#fffbf0] to-[#fef8e7]/30 py-16 selection:bg-amber-500 selection:text-slate-900 overflow-hidden">
      {/* Background Decorative Rings */}
      <DecorativeRings variant="page-corners" />

      {/* Top Left Leaf Accents */}
      <DecorativeLeaves
        position="top-left"
        size="sm"
        showFlower={false}
        animated={true}
        opacity={0.75}
      />

      {/* Bottom Right Botanical Flower & Leaves */}
      <DecorativeLeaves
        position="bottom-right"
        size="md"
        showFlower={true}
        showFloralSpike={true}
        animated={true}
        opacity={0.88}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 font-extrabold text-xs mb-3 border border-amber-300/80">
            <FiFileText className="w-4 h-4 text-amber-700" />
            <span>Legal Agreement &amp; Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {settings?.termsTitle || 'Terms & Conditions of Service'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-2xl mx-auto font-medium">
            {settings?.termsSubtitle || `Rules, guidelines, and legal agreements governing the use of the ${ngoName} website, online donations, and member services.`}
          </p>
          <div className="text-[11px] text-slate-600 mt-2 font-mono">
            Effective Date: {settings?.termsEffectiveDate || 'October 2026'} • Statutory Non-Profit Jurisdiction
          </div>
        </div>

        {/* Dynamic Content Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-xl shadow-amber-900/5 space-y-8">
          <ContentRenderer content={activeContent} />

          {/* Legal Contact Card */}
          <div className="pt-6 border-t border-amber-200/70">
            <h3 className="text-sm font-black text-slate-900 mb-3">
              Official Legal &amp; Administrative Correspondence
            </h3>
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60 space-y-2.5 font-medium text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <FiMail className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Contact Email: <a href={`mailto:${settings?.email || 'apnaparivarfoundation@gmail.com'}`} className="text-amber-800 font-bold underline">{settings?.email || 'apnaparivarfoundation@gmail.com'}</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <FiPhone className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Telephone: <a href={`tel:${settings?.phone || '+91 94160 55551'}`} className="text-slate-900 font-bold">{settings?.phone || '+91 94160 55551'}</a></span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <FiMapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Registered Office: {settings?.address || 'Ward No. 12, Near Bus Stand, Ellenabad, Sirsa, Haryana - 125102'}</span>
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
