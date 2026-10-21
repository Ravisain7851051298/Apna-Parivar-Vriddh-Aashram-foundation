import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Media Gallery - Photo & Video Archives',
  description:
    'Visual journey of Apna Parivar Vriddh Aashram Foundation: photos, ashram life, satvik meal service, festival celebrations, and moments of elderly care.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Media Gallery | Apna Parivar Vriddh Aashram Foundation',
    description:
      'Glimpse our work in action through high-resolution photos and heartwarming moments of senior citizen care in Jabalpur, MP.',
    url: `${SITE_CONFIG.url}/gallery`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Media Gallery', path: '/gallery' },
];

export default function GalleryLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
