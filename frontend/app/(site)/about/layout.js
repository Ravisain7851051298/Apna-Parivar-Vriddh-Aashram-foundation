import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'About Us | Our Story, Mission & Vriddh Aashram Journey',
  description:
    'Learn about Apna Parivar Vriddh Aashram Foundation (अपना परिवार वृद्ध आश्रम फाउंडेशन) - our mission, senior citizen shelter, medical care, and transparent 12A & 80G certified operations.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Apna Parivar Vriddh Aashram Foundation (अपना परिवार वृद्ध आश्रम)',
    description:
      'Learn about Apna Parivar Vriddh Aashram Foundation, our mission of senior citizen shelter, nutritious satvik meals, medical care, and dignity in Jabalpur, MP.',
    url: `${SITE_CONFIG.url}/about`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
];

export default function AboutLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
