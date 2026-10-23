const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, default: 'global_ngo_settings', unique: true },
  ngoName: { type: String, default: 'Apna Parivar Vriddh Aashram Foundation' },
  ngoNameHi: { type: String, default: 'अपना परिवार वृद्ध आश्रम फाउंडेशन' },
  tagline: { type: String, default: 'Dedicated to Dignity, Care, Health & Love for Senior Citizens' },
  taglineHi: { type: String, default: 'सेवा • सम्मान • परिवार — जहाँ हर बुजुर्ग है, हमारा अपना' },
  logoUrl: { type: String, default: '/logo.jpg' },
  officialSealUrl: { type: String, default: '/logo.jpg' },
  presidentSignatureUrl: { type: String, default: '' },
  registrationNo: { type: String, default: 'MP/JBP/VRIDDH/2024/0912' },
  panNo: { type: String, default: 'AAZCA1294F' },
  nitiAayogDarpanId: { type: String, default: 'MP/2024/0398210' },
  csr1No: { type: String, default: 'CSR00078912' },
  exemption12A: { type: String, default: 'CIT(EXEMP)/12A/2023-24/A-1102' },
  exemption80G: { type: String, default: 'CIT(EXEMP)/80G/2023-24/G-9401' },
  email: { type: String, default: 'apnaparivarvriddhaashramfounda@gmail.com' },
  phone: { type: String, default: '+91 8959055269' },
  whatsapp: { type: String, default: '+918959055269' },
  facebook: { type: String, default: 'https://facebook.com' },
  twitter: { type: String, default: 'https://x.com' },
  instagram: { type: String, default: 'https://instagram.com' },
  youtube: { type: String, default: 'https://youtube.com' },
  linkedin: { type: String, default: 'https://linkedin.com' },
  telegram: { type: String, default: '' },
  address: { type: String, default: 'Jay Prakash Nagar, Adhartal, Jabalpur, Madhya Pradesh - 482001, India' },
  googleMapEmbed: {
    type: String,
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117400!2d79.9!3d23.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a3d077b9d%3A0x6b10b7849e79d7e0!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000'
  },
  bankDetails: {
    accountName: { type: String, default: 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION' },
    accountNumber: { type: String, default: '50200099881122' },
    ifscCode: { type: String, default: 'HDFC0002481' },
    bankName: { type: String, default: 'HDFC Bank Ltd.' },
    branch: { type: String, default: 'Adhartal Branch, Jabalpur, MP' }
  },
  upiId: { type: String, default: 'apnaparivar@hdfcbank' },
  upiQrImage: { type: String, default: 'default' },
  membershipFee: { type: Number, default: 1100 },
  aboutHeading: { type: String, default: 'About Apna Parivar Vriddh Aashram Foundation (अपना परिवार वृद्ध आश्रम फाउंडेशन)' },
  aboutSubtitle: { type: String, default: 'A Dedicated Shelter of Love, Medical Care, and Family Warmth for Abandoned & Destitute Senior Citizens' },
  aboutStory: { type: String, default: 'Apna Parivar Vriddh Aashram Foundation is dedicated to elder care with love and dignity in Jabalpur, Madhya Pradesh. Operating under five foundational pillars: Safe Living, Nutritious Satvik Food, 24x7 Medical & Geriatric Healthcare, Mental & Emotional Companionship, and Family-like Respect.' },
  missionStatement: { type: String, default: 'To provide comprehensive residential elder care, medical assistance, compassionate companionship, and unconditional dignity to senior citizens, ensuring no elderly individual spends their golden years in neglect or loneliness.' },
  visionStatement: { type: String, default: 'A compassionate society where every elder is cherished as family, living with respect, joy, good health, and peace of mind.' },

  // CMS Pages: Who We Are
  whoWeAreHeading: { type: String, default: 'Who We Are — Apna Parivar Vriddh Aashram Foundation' },
  whoWeAreSubtitle: { type: String, default: 'Affiliated with ZDC Welfare Foundation • Seva, Samman, Parivar' },
  whoWeAreStory: {
    type: String,
    default: 'Apna Parivar Vriddh Aashram Foundation (अपना परिवार वृद्ध आश्रम फाउंडेशन) was founded on the sacred belief that every elderly person deserves respect, compassion, and a loving home. Affiliated with ZDC Welfare Foundation in Jabalpur, Madhya Pradesh, we provide safe residential shelter, doctor-advised satvik meals, round-the-clock geriatric healthcare, and daily emotional companionship.\n\nOur elder residents find not just a roof over their heads, but a warm, joyful family where festivals are celebrated with enthusiasm, health is monitored with vigilance, and human dignity is held paramount.\n\nWe operate with 100% financial and statutory transparency under 12A, 80G, and CSR-1 guidelines.'
  },
  whoWeAreVision: {
    type: String,
    default: 'To create a world where every senior citizen lives with unconditional dignity, utmost comfort, excellent health, and joyful family warmth.'
  },
  whoWeAreMission: {
    type: String,
    default: 'To provide safe accommodation, hygienic nutrition, regular medical checkups, spiritual companionship, and love to senior citizens without any commercial motive.'
  },
  whoWeAreValues: {
    type: String,
    default: 'Seva (Selfless Service): Serving our elders with deep reverence and empathy.\nSamman (Dignity & Respect): Protecting the honor and emotional wellbeing of every senior.\nParivar (Family Warmth): Treating every resident as our own cherished family member.\nParidharshita (Transparency): Complete accountability in every donation and administrative action.'
  },
  whoWeAreBannerUrl: {
    type: String,
    default: '/banner.jpg'
  },

  // CMS Pages: Privacy Policy
  privacyPolicyTitle: { type: String, default: 'Privacy Policy & Donor Protection' },
  privacyPolicySubtitle: { type: String, default: 'Apna Parivar Vriddh Aashram Foundation is dedicated to safeguarding donor privacy, donor PAN data, and resident dignity.' },
  privacyLastUpdated: { type: String, default: 'October 2026' },
  privacyPolicyContent: {
    type: String,
    default: '## 1. Information We Collect\nWhen you interact with Apna Parivar Vriddh Aashram Foundation through donations, membership registrations, volunteer drives, or elder care inquiries, we collect information necessary to fulfill our statutory non-profit functions:\n- Personal Identity: Full name, date of birth, gender, blood group, and residential address.\n- Contact Information: Verified mobile phone number, WhatsApp contact, and email address.\n- Statutory Tax Data (for 80G Receipts): Permanent Account Number (PAN Card No.) and postal address, mandatory under the Income Tax Act, 1961 (Form 10BD reporting).\n- Payment Transaction Data: Unique transaction ID, payment method (UPI, Netbanking, Debit/Credit Card), timestamp, and donation amount.\n\n## 2. How We Use Your Information\nAll details collected are used strictly for legitimate charitable administration:\n- Generating and delivering instant, digitally signed Section 80G tax exemption donation receipts.\n- Issuing verified digital membership ID cards, appointment letters, and appreciation certificates.\n- Reporting donor contribution records to the Income Tax Department via Form 10BD for donor tax deductions.\n- Communicating program updates, health camp alerts, and aashram festival invitations.'
  },

  // CMS Pages: Terms & Conditions
  termsTitle: { type: String, default: 'Terms & Conditions of Service' },
  termsSubtitle: { type: String, default: 'Guidelines governing the use of the Apna Parivar Vriddh Aashram Foundation portal, online donations, and member services.' },
  termsEffectiveDate: { type: String, default: 'October 2026' },
  termsContent: {
    type: String,
    default: '## 1. Acceptance of Terms\nBy accessing, browsing, registering as a member, or donating on this website, you agree to be legally bound by these Terms and Conditions.\n\n## 2. Online Donations & 80G Tax Receipts\n- All donations contributed through this portal are applied directly towards senior citizen residential shelter, meals, medicines, and medical care.\n- Donations are eligible for 50% income tax deduction under Section 80G of the Indian Income Tax Act, 1961.\n\n## 3. Code of Conduct for Members & Volunteers\n- Every registered Member and Volunteer must conduct themselves in alignment with the humanitarian principles of elder care and compassion.\n- Official Member ID Cards and Appointment Letters remain the intellectual property of Apna Parivar Vriddh Aashram Foundation.'
  },

  // SMTP Email Settings for Admin
  smtpHost: { type: String, default: 'smtp.gmail.com' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: 'apnaparivarvriddhaashramfounda@gmail.com' },
  smtpPass: { type: String, default: '' },
  smtpFromName: { type: String, default: 'Apna Parivar Vriddh Aashram Foundation' },

  // Signatory & President Details
  presidentName: { type: String, default: 'Trustee President (Apna Parivar Foundation)' },

  // Admin Master Secret Key
  adminSecretKey: { type: String, default: 'ravi123' },

  // Admin-managed Hero Carousel Slides
  heroSlides: [
    {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      tag: { type: String, default: '' },
      ctaPrimaryText: { type: String, default: '' },
      ctaPrimaryLink: { type: String, default: '' },
      ctaSecondaryText: { type: String, default: '' },
      ctaSecondaryLink: { type: String, default: '' },
      highlight: { type: String, default: '' }
    }
  ],

  // Homepage About Us text sections
  homeAboutTitle: { type: String, default: 'About Us' },
  homeAboutStory: {
    type: String,
    default: 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION is a passionate advocate for positive change, dedicated to making a tangible difference in the world. We are driven by a singular mission: to empower youth and communities to thrive through sustainable development initiatives, education, healthcare access, and social justice.'
  },
  homeOurValues: {
    type: String,
    default: 'At APNA PARIVAR VRIDDH AASHRAM FOUNDATION, our core values of compassion, integrity, and youth empowerment guide everything we do. We believe in the power of collective action to address pressing challenges and create lasting impact.'
  },
  homeOurImpact: {
    type: String,
    default: 'Through strategic partnerships, grassroots initiatives, and the dedication of our volunteer team, we have achieved significant milestones touching the lives of thousands of individuals.'
  },
  homeJoinUs: {
    type: String,
    default: 'Join us in our mission to create a brighter, more empowered nation for all. Together, we can make a difference.'
  },

  // Objectives List
  objectives: [
    {
      title: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      link: { type: String, default: '' }
    }
  ],

  pageViews: { type: Number, default: 18450 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);

