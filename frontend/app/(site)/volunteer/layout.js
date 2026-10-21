import { SITE_CONFIG, generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Volunteer with Us - Elder Care & Vriddh Seva',
  description:
    'Join Apna Parivar Vriddh Aashram Foundation as an active volunteer. Serve destitute senior citizens, assist in medical care, daily satvik meals, and earn verified certificates.',
  alternates: {
    canonical: '/volunteer',
  },
  openGraph: {
    title: 'Volunteer with Apna Parivar Vriddh Aashram Foundation (अपना परिवार वृद्ध आश्रम)',
    description:
      'Empower yourself through selfless elder care. Become an active volunteer and earn verified service credentials.',
    url: `${SITE_CONFIG.url}/volunteer`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Volunteer', path: '/volunteer' },
];

const volunteerFaqs = [
  {
    question: 'Who can volunteer with Apna Parivar Vriddh Aashram Foundation?',
    answer:
      'Any compassionate individual, student, doctor, nurse, or professional who wants to dedicate time and love towards destitute senior citizens can join.',
  },
  {
    question: 'Do volunteers receive a certificate?',
    answer:
      'Yes, all active volunteers who participate in ashram care, medical camps, or Annakshetra drives receive an official verified Certificate of Service.',
  },
];

export default function VolunteerLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <JsonLd data={generateFaqSchema(volunteerFaqs)} />
      {children}
    </>
  );
}
