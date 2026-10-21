import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Contact Us & Public Feedback',
  description:
    'Get in touch with Apna Parivar Vriddh Aashram Foundation in Jabalpur, Madhya Pradesh. Send your feedback, visit the ashram, sponsor meals, or ask questions.',
  alternates: {
    canonical: '/feedback',
  },
  openGraph: {
    title: 'Contact & Feedback | Apna Parivar Vriddh Aashram Foundation',
    description:
      'We welcome questions, suggestions, volunteer inquiries, meal sponsorships, and visits. Reach out to our team.',
    url: `${SITE_CONFIG.url}/feedback`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Feedback & Contact', path: '/feedback' },
];

export default function FeedbackLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
