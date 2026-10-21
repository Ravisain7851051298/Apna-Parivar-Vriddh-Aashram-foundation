import React from 'react';
import HomeClient from './HomeClient';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG, generateFaqSchema } from '@/lib/seoData';

export const metadata = {
  title: 'Apna Parivar Vriddh Aashram Foundation | अपना परिवार वृद्ध आश्रम - 12A & 80G Certified Old Age Home',
  description:
    'अपना परिवार वृद्ध आश्रम फाउंडेशन जबलपुर (म.प्र.) में असहाय, निराश्रित एवं वृद्धजनों को गरिमापूर्ण, स्वस्थ और स्नेहपूर्ण जीवन प्रदान करने हेतु समर्पित है। सुरक्षित आवास, सात्विक भोजन, 24/7 चिकित्सा एवं परिवार जैसा प्यार। 100% पारदर्शी दान 80G कर छूट सहित।',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Apna Parivar Vriddh Aashram Foundation | अपना परिवार वृद्ध आश्रम',
    description:
      'निःस्वार्थ सेवा, समर्पण और बुजुर्गों को सम्मान। सुरक्षित आवास, पौष्टिक भोजन, संपूर्ण स्वास्थ्य एवं परिवार जैसा प्यार। Instant 80G tax-exempt donation receipts.',
    url: SITE_CONFIG.url,
    siteName: 'Apna Parivar Vriddh Aashram Foundation',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Apna Parivar Vriddh Aashram Foundation',
      },
    ],
  },
};

const homeFaqs = [
  {
    question: 'अपना परिवार वृद्ध आश्रम फाउंडेशन (Apna Parivar Vriddh Aashram Foundation) क्या है?',
    answer:
      'अपना परिवार वृद्ध आश्रम फाउंडेशन जबलपुर (मध्य प्रदेश) में पंजीकृत एक धर्मार्थ ट्रस्ट है जो असहाय, निराश्रित एवं वृद्धजनों को निःशुल्क सुरक्षित आवास, सात्विक भोजन, 24/7 चिकित्सा एवं परिवार जैसा प्यार प्रदान करता है।',
  },
  {
    question: 'क्या आश्रम में दिए गए दान पर आयकर धारा 80G के तहत छूट मिलती है?',
    answer:
      'हाँ, अपना परिवार वृद्ध आश्रम फाउंडेशन को दिया गया प्रत्येक दान आयकर अधिनियम की धारा 80G के अंतर्गत 50% कर मुक्त है। दान करते ही तुरंत डिजिटल 80G रसीद ईमेल पर प्राप्त होती है।',
  },
  {
    question: 'आश्रम में स्वयंसेवक (Volunteer) या सदस्य (Member) कैसे बन सकते हैं?',
    answer:
      'आप हमारी वेबसाइट पर बिना लॉगिन किए या लॉगिन करके ऑनलाइन आवेदन कर सकते हैं। एडमिन अनुमोदन उपरांत आपको आधिकारिक डिजिटल ID कार्ड एवं नियुक्ति पत्र ईमेल पर प्राप्त होगा।',
  },
  {
    question: 'क्या अतिथि (Guest) के रूप में बिना लॉगिन किए आवेदन किया जा सकता है?',
    answer:
      'हाँ! दानदाता, स्वयंसेवक एवं सदस्य बिना लॉगिन किए आवेदन कर सकते हैं। सिस्टम आपके ईमेल पर सुरक्षित पासवर्ड भेज देगा। यदि आप एक से अधिक बार आवेदन करते हैं तो अंतिम ईमेल किया गया पासवर्ड मान्य होगा।',
  },
];

export default function HomePage() {
  const faqSchema = generateFaqSchema(homeFaqs);

  return (
    <>
      <JsonLd data={faqSchema} />
      <HomeClient />
    </>
  );
}
