import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Donate Online - 50% Tax Exemption Under Section 80G',
  description:
    'Contribute to Apna Parivar Vriddh Aashram Foundation. 100% transparent donation directly funding senior citizen shelter, medical care, and daily satvik meals. Instant 80G tax receipt provided.',
  alternates: {
    canonical: '/donation',
  },
  openGraph: {
    title: 'Donate to Apna Parivar Vriddh Aashram Foundation | 80G Tax Deductible Donation',
    description:
      'Support destitute elderly parents in Jabalpur, MP. Claim 50% income tax deduction under Section 80G.',
    url: `${SITE_CONFIG.url}/donation`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Donate Online', path: '/donation' },
];

export default function DonationLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
