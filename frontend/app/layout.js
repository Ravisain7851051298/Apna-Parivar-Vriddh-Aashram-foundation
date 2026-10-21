import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/store/ReduxProvider';
import { NGOProvider } from '@/context/NGOContext';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG, defaultOrganizationSchema, defaultWebSiteSchema } from '@/lib/seoData';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const baseUrl = new URL(SITE_CONFIG.url);

export const metadata = {
  metadataBase: baseUrl,
  title: {
    default: 'Apna Parivar Vriddh Aashram Foundation | अपना परिवार वृद्ध आश्रम फाउंडेशन',
    template: '%s | Apna Parivar Vriddh Aashram Foundation',
  },
  description:
    'सेवा • सम्मान • परिवार (जहाँ हर बुजुर्ग है, हमारा अपना) - Apna Parivar Vriddh Aashram Foundation in Jabalpur, MP provides residential elder shelter, doctor-advised satvik meals, geriatric medical care, and emotional family warmth. 12A & 80G Tax Exemption Certified NGO.',
  applicationName: 'Apna Parivar Vriddh Aashram Foundation',
  authors: [{ name: 'Apna Parivar Vriddh Aashram Foundation', url: SITE_CONFIG.url }],
  creator: 'Apna Parivar Vriddh Aashram Foundation',
  publisher: 'Apna Parivar Vriddh Aashram Foundation',
  category: 'Non-Governmental Organization',
  keywords: [
    'Apna Parivar Vriddh Aashram Foundation',
    'अपना परिवार वृद्ध आश्रम',
    'Vriddh Aashram Jabalpur',
    'Old Age Home in Jabalpur',
    'Senior Citizen Care NGO',
    '80G tax exemption donation',
    '12A registered NGO',
    'Tithi Bhoj booking',
    'Sponsor an elder food and medicine',
    'Volunteer for senior citizens',
    'Elderly shelter Madhya Pradesh',
    'ZDC Welfare Foundation affiliated',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'hi-IN': '/',
    },
  },
  openGraph: {
    title: 'Apna Parivar Vriddh Aashram Foundation | अपना परिवार वृद्ध आश्रम',
    description:
      'सेवा • सम्मान • परिवार — Dedicated to Dignity, Care, Health & Love for Senior Citizens in Jabalpur, MP.',
    url: SITE_CONFIG.url,
    siteName: 'Apna Parivar Vriddh Aashram Foundation',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'Apna Parivar Vriddh Aashram Foundation Logo',
      },
      {
        url: '/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Apna Parivar Vriddh Aashram Foundation Official Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Parivar Vriddh Aashram Foundation | अपना परिवार वृद्ध आश्रम',
    description:
      'Dedicated to Dignity, Care, Health & Love for Senior Citizens. 12A & 80G Certified Non-Profit.',
    images: ['/banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.className} ${plusJakartaSans.variable}`}>
      <head>
        <JsonLd data={defaultOrganizationSchema} />
        <JsonLd data={defaultWebSiteSchema} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black">
        <ReduxProvider>
          <NGOProvider>
            {children}
            <Toaster position="top-right" />
          </NGOProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
