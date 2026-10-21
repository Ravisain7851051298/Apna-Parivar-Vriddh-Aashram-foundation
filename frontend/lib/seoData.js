export const SITE_CONFIG = {
  name: 'Apna Parivar Vriddh Aashram Foundation',
  hindiName: 'अपना परिवार वृद्ध आश्रम फाउंडेशन',
  shortName: 'APVAF',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://apnaparivarvriddhaashram.org',
  tagline: 'सेवा • सम्मान • परिवार (जहाँ हर बुजुर्ग है, हमारा अपना)',
  description: 'Apna Parivar Vriddh Aashram Foundation is dedicated to the care, shelter, nutritious satvik meals, 24x7 healthcare, and emotional dignity of senior citizens in Jabalpur, Madhya Pradesh. 12A & 80G certified NGO.',
  phone: '+91 8959055269',
  email: 'apnaparivarvriddhaashramfounda@gmail.com',
  address: {
    streetAddress: 'Jay Prakash Nagar, Adhartal',
    addressLocality: 'Jabalpur',
    addressRegion: 'Madhya Pradesh',
    postalCode: '482001',
    addressCountry: 'IN',
  },
  registrationNo: 'MP/JBP/VRIDDH/2024/0912',
  nitiAayogDarpanId: 'MP/2024/0398210',
  csrNumber: 'CSR00078912',
  panNumber: 'AAZCA1294F',
  taxExemption12A: 'CIT(EXEMP)/12A/2023-24/A-1102',
  taxExemption80G: 'CIT(EXEMP)/80G/2023-24/G-9401',
};

export const defaultOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: SITE_CONFIG.name,
  alternateName: [SITE_CONFIG.hindiName, SITE_CONFIG.shortName, 'Apna Parivar Vriddh Aashram'],
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.jpeg`,
  image: `${SITE_CONFIG.url}/logo.jpeg`,
  description: SITE_CONFIG.description,
  taxID: `${SITE_CONFIG.taxExemption80G} | ${SITE_CONFIG.taxExemption12A}`,
  foundingDate: '2021',
  nonprofitStatus: 'Nonprofit501c3',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.address.streetAddress,
    addressLocality: SITE_CONFIG.address.addressLocality,
    addressRegion: SITE_CONFIG.address.addressRegion,
    postalCode: SITE_CONFIG.address.postalCode,
    addressCountry: SITE_CONFIG.address.addressCountry,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'Helpline & Member Inquiries',
      email: SITE_CONFIG.email,
      areaServed: 'IN',
      availableLanguage: ['Hindi', 'English'],
    },
    {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'Emergency Blood Support',
      areaServed: 'IN',
      availableLanguage: ['Hindi', 'English'],
    },
  ],
  sameAs: [
    'https://facebook.com',
    'https://instagram.com',
    'https://twitter.com',
    'https://linkedin.com',
  ],
  knowsAbout: [
    'Youth Empowerment in India',
    'Underprivileged Children Free Education',
    'Emergency Voluntary Blood Donation',
    'Women Livelihood & Skill Development',
    'Section 80G Tax Deductible NGO Donation',
    'Grassroots Community Welfare Programs',
  ],
};

export const defaultWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  alternateName: SITE_CONFIG.hindiName,
  url: SITE_CONFIG.url,
  inLanguage: ['en-IN', 'hi-IN'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_CONFIG.url}/campaigns?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };
}

export function generateFaqSchema(faqList) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
