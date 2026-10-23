import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const INITIAL_SETTINGS = {
  ngoName: 'Apna Parivar Vriddh Aashram Foundation',
  ngoNameHi: 'Apna Parivar Vriddh Aashram Foundation',
  tagline: 'Selfless Service, Loving Dedication & Dignified Shelter for Senior Citizens',
  taglineHi: 'Safe Shelter, Wholesome Nutrition, 24x7 Healthcare & Authentic Family Love',
  logoUrl: '/logo.jpg',
  bannerUrl: '/banner.jpg',
  officialSealUrl: '/logo.jpg',
  presidentSignatureUrl: '',
  registrationNo: 'MP/2022/0319482',
  panNo: 'AABTA4892P',
  nitiAayogDarpanId: 'MP/2022/0319482',
  csr1No: 'CSR00049281',
  exemption12A: 'CIT(EXEMP)/12A/2022-23/A-884',
  exemption80G: 'CIT(EXEMP)/80G/2022-23/G-912',
  email: 'info@apnaparivarvriddhaashram.org',
  phone: '+91 8959055269',
  whatsapp: '+918959055269',
  address: 'Behind Adhartal Railway Station, Adhartal, Jabalpur, Madhya Pradesh - 482001',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117387.89!2d79.88!3d23.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a0fb6cb7d%3A0x6b10b7849e79d7e0!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000',
  aboutHeading: 'About Apna Parivar Vriddh Aashram Foundation',
  aboutSubtitle: 'A Registered Non-Profit Old Age Home Dedicated to Providing Dignified Care, Medical Support and Love to Destitute & Elderly Citizens',
  aboutStory: 'Apna Parivar Vriddh Aashram Foundation is dedicated to providing dignified living, security, and authentic family affection to homeless, destitute, and vulnerable senior citizens in Jabalpur, Madhya Pradesh. Our mission is to ensure no elder ever feels alone, unloved, or neglected in their sunset years. We provide 24/7 healthcare, nutritious satvik meals, safe shelter, and heartfelt emotional sanctuary.',
  aboutMissionSummary: 'To provide abandoned and destitute elderly parents with a secure roof, nutritious satvik diet, 24x7 healthcare monitoring, and the warmth, respect, and dignity of a true family.',
  aboutVisionSummary: 'A compassionate society where every senior citizen lives free from helplessness and loneliness, celebrated with honour, health, peace, and lifelong happiness.',
  missionStatement: 'To provide compassionate residential shelter, wholesome nutrition, 24x7 healthcare, and emotional sanctuary to abandoned, destitute, and vulnerable senior citizens, ensuring their twilight years are spent in utmost dignity, joy, and peace.',
  visionStatement: 'A compassionate society where every elder is revered, protected, and provided a caring family environment, free from abandonment and loneliness.',
  bankDetails: {
    accountName: 'APNA PARIVAR VRIDDH AASHRAM FOUNDATION',
    accountNumber: '50200088995678',
    ifscCode: 'HDFC0001842',
    bankName: 'HDFC Bank Ltd.',
    branch: 'Adhartal Branch, Jabalpur, MP'
  },
  upiId: 'apnaparivar@okhdfcbank',
  upiQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=apnaparivar@okhdfcbank%26pn=Apna%20Parivar%20Vriddh%20Aashram%26cu=INR',
  membershipFee: 1100,
  pageViews: 24800,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'ravisain75688@gmail.com',
  smtpPass: 'wmth wfbo khov uugu',
  smtpFromName: 'Apna Parivar Vriddh Aashram',
  adminSecretKey: 'ravi123',
  footerDescription: 'Apna Parivar Vriddh Aashram Foundation is a registered charitable trust dedicated to serving destitute, helpless, and abandoned senior citizens. All donations are 50% tax-exempt under Sections 12A and 80G of the Income Tax Act.',
  footerCopyright: '© 2026 Apna Parivar Vriddh Aashram Foundation. All rights reserved.',
  heroSlides: [
    {
      title: 'Dignity, Love & Safe Sanctuary for Every Elder',
      subtitle: 'Apna Parivar Vriddh Aashram Foundation is dedicated to providing senior citizens with dignified living, 24/7 medical care, wholesome nutrition, and the warmth of a loving family in Jabalpur.',
      imageUrl: '/banner.jpg',
      tag: 'Elder Care is Divine Service',
      ctaPrimaryText: 'Donate Now (80G Tax Exemption)',
      ctaPrimaryLink: '/donation',
      ctaSecondaryText: 'Become a Member (ID Card)',
      ctaSecondaryLink: '/apply-member',
      highlight: 'Safe Shelter • Satvik Meals • 24/7 Healthcare • Family Warmth',
    },
    {
      title: '100% Transparent Giving • 50% Tax Exemption Under 80G',
      subtitle: 'Your compassionate gift can sponsor an elderly mother or father with nutritious food, life-saving medicines, and safe shelter. Receive an instant Form 10BD eligible 80G digital receipt.',
      imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1920&auto=format&fit=crop&q=80',
      tag: '50% Income Tax Rebate',
      ctaPrimaryText: 'Sponsor a Tithi Bhoj Meal',
      ctaPrimaryLink: '/donation',
      ctaSecondaryText: 'View Legal Certifications',
      ctaSecondaryLink: '/certificates',
      highlight: 'Instant Form 10BD Tax Receipt sent directly to your email',
    },
    {
      title: 'Bring Smiles to Senior Citizens as a Volunteer',
      subtitle: 'Spend quality time with resident elders, participate in spiritual satsang and medical camps, or assist in daily care. Apply online and receive your official Volunteer ID card upon approval.',
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&auto=format&fit=crop&q=80',
      tag: 'Join the Mission of Love',
      ctaPrimaryText: 'Apply as Volunteer',
      ctaPrimaryLink: '/apply-volunteer',
      ctaSecondaryText: 'Explore the Aashram',
      ctaSecondaryLink: '/who-we-are',
      highlight: 'Official Digital ID Card & Appointment Letter issued upon admin approval',
    },
  ],
  homeAboutTitle: 'About Apna Parivar Foundation',
  homeAboutStory: 'Apna Parivar Vriddh Aashram Foundation is a home for senior citizens who have no one else to rely on. We provide far more than a roof: we offer a vibrant family, genuine respect, and loving emotional shelter.',
  homeOurValues: 'Compassion, integrity, selfless service, and dignity are our foundational pillars. Serving senior citizens who are like our own parents is our highest calling.',
  homeOurImpact: 'Our foundation has provided secure shelter, free high-level medical care, cataract surgeries, and daily fresh satvik meals to over 200+ elderly mothers and fathers.',
  homeJoinUs: 'Join this sacred cause. Whether through donations, membership, or volunteering, every contribution brings heartfelt smiles to our elders.',
  objectives: [
    {
      title: 'Safe Residential Shelter',
      imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600',
      link: '/services'
    },
    {
      title: '24/7 Healthcare & Medical Support',
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600',
      link: '/services'
    },
    {
      title: 'Nutritious & Fresh Satvik Meals',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600',
      link: '/services'
    },
    {
      title: 'Emotional & Spiritual Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600',
      link: '/who-we-are'
    },
    {
      title: 'Dignified & Respectful Sunset Years',
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600',
      link: '/apply-volunteer'
    }
  ]
};

export const INITIAL_SERVICES = [
  {
    id: 'srv_1',
    title: 'Safe & Comfortable Living Shelter',
    titleEn: 'Safe & Comfortable Living Shelter',
    description: 'Senior-citizen tailored airy living rooms, clean bedding, wheelchair-friendly campus, and 24/7 dedicated security and caretaking.',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_2',
    title: 'Nutritious & Fresh Satvik Diet',
    titleEn: 'Nutritious & Hygienic Meals',
    description: 'Age-appropriate, easily digestible fresh meals: morning breakfast, wholesome lunch, evening tea, and light dinner prepared in a clean hygienic kitchen.',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_3',
    title: '24/7 Healthcare & Medical Checkups',
    titleEn: 'Regular Health Checkups & Nursing',
    description: 'Daily BP and blood sugar monitoring, regular specialist doctor visits, free essential medicines, and emergency ambulance access.',
    icon: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_4',
    title: 'Emotional & Spiritual Care (Satsang & Yoga)',
    titleEn: 'Emotional Support, Satsang & Recreation',
    description: 'Daily morning light yoga, devotional kirtan, spiritual satsang, library facilities, and an uplifting environment to eliminate loneliness.',
    icon: 'Smile',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_5',
    title: 'Dignity, Love & Family Environment',
    titleEn: 'Love, Dignity & Family Environment',
    description: 'Residents are embraced as respected elders of our family, with festive celebrations, birthdays, and loving attention given to every elder.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_6',
    title: 'Dignified Final Rites Support',
    titleEn: 'Dignified Final Rites Support',
    description: 'When destitute resident elders pass away, their last rites are respectfully performed following traditional religious customs with highest honor.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROGRAMS = [
  {
    id: 'prg_1',
    title: 'Sponsor an Elder (Monthly Support)',
    badge: 'Popular Drive',
    description: 'Sponsor the monthly shelter, nutritious meals, and healthcare expenses of a destitute elderly parent for just ₹2,500/month.',
    beneficiaries: '120+ Elders Supported',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prg_2',
    title: 'Tithi Bhoj & Annadan Seva',
    badge: 'Special Occasions',
    description: 'Celebrate your birthday, wedding anniversary, or memorial days of ancestors by sponsoring wholesome satvik meals for all resident elders.',
    beneficiaries: '150+ Daily Meals',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prg_3',
    title: 'Free Senior Eye & Health Screening Camps',
    badge: 'Monthly Medical Camp',
    description: 'Regular cataract screenings, free eyeglasses distribution, general geriatric checkups, and physiotherapy consultations for underprivileged seniors.',
    beneficiaries: '1,800+ Checkups & Treatments',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STORIES = [
  {
    id: 'sty_1',
    title: '74-year-old Kaushalya Mata Found Abandoned on the Roadside Finds a New Family',
    beneficiary: 'Kaushalya Devi (Age 74)',
    date: '12 January 2026',
    category: 'Lifeline Care',
    summary: 'Found destitute and ill near the railway station on a freezing winter night, Kaushalya Mata was brought to our aashram for emergency medical care and warmth. Today, she is healthy, joyful, and actively participates in all activities.',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sty_2',
    title: '80-year-old Rameshwar Ji Regains Sight Through Free Cataract Surgery',
    beneficiary: 'Rameshwar Prasad Ji (Age 80)',
    date: '28 February 2026',
    category: 'Healthcare Seva',
    summary: 'Having lost his vision over two years, Rameshwar Ji was provided free cataract surgery coordinated by top ophthalmologists in Jabalpur. Today he leads an independent, dignified life with restored eyesight.',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_FEEDBACKS = [
  {
    id: 'fb_1',
    name: 'Dr. Alok Agnihotri (Senior Physician)',
    role: 'Patron Member',
    rating: 5,
    comment: 'The peace and fulfillment one experiences upon visiting Apna Parivar Vriddh Aashram is beyond words. Senior citizens are cared for with authentic familial love. Instant 80G tax receipt was provided.',
    date: '10 March 2026'
  },
  {
    id: 'fb_2',
    name: 'Mrs. Anita Chourasia',
    role: 'Regular Donor (Tithi Bhoj)',
    rating: 5,
    comment: 'Hosting a commemorative meal for the elders on my father’s death anniversary was a deeply satisfying experience for our family. The arrangements are transparent, hygienic, and heartwarming.',
    date: '24 March 2026'
  },
  {
    id: 'fb_3',
    name: 'Er. Mayank Shrivastava',
    role: 'Active Volunteer',
    rating: 5,
    comment: 'Applying online as a volunteer was smooth, and I received an official digital ID card upon admin verification. Spending weekends with the elders gives immense purpose and energy to life.',
    date: '05 April 2026'
  }
];

// 1. Fetch Settings
export const fetchSettings = createAsyncThunk(
  'ngo/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.settings) {
        return res.data.settings;
      }
      return rejectWithValue('Failed to load settings');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching settings');
    }
  }
);

// 2. Update Settings
export const updateSettings = createAsyncThunk(
  'ngo/updateSettings',
  async (newSettings, { rejectWithValue }) => {
    try {
      const res = await api.put('/settings', newSettings);
      if (res.data?.success) {
        return res.data.settings;
      }
      return rejectWithValue(res.data?.message || 'Failed to update settings');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error updating settings');
    }
  }
);

// 3. Fetch Certificates
export const fetchCertificates = createAsyncThunk(
  'ngo/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/certificates');
      if (res.data?.success) {
        return res.data.certificates;
      }
      return rejectWithValue('Failed to load certificates');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching certificates');
    }
  }
);

// 4. Issue Certificate (Admin)
export const issueCertificate = createAsyncThunk(
  'ngo/issueCertificate',
  async (certData, { rejectWithValue }) => {
    try {
      const res = await api.post('/certificates', certData);
      if (res.data?.success) {
        return res.data;
      }
      return rejectWithValue(res.data?.message || 'Failed to issue certificate');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error issuing certificate');
    }
  }
);

// 5. Fetch Email Audit Logs (Admin)
export const fetchEmailLogs = createAsyncThunk(
  'ngo/fetchEmailLogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/email-logs');
      if (res.data?.success) {
        return res.data.logs;
      }
      return rejectWithValue('Failed to load email logs');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching email logs');
    }
  }
);

// 6. Fetch Members
export const fetchMembers = createAsyncThunk(
  'ngo/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/members/public').catch(() => api.get('/members'));
      if (res.data?.success || res.data?.members) {
        return res.data.members || [];
      }
      return rejectWithValue('Failed to load members');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching members');
    }
  }
);

// 7. Fetch Campaigns
export const fetchCampaigns = createAsyncThunk(
  'ngo/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/campaigns');
      if (res.data?.success || res.data?.campaigns) {
        return res.data.campaigns || [];
      }
      return rejectWithValue('Failed to load campaigns');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching campaigns');
    }
  }
);

const ngoSlice = createSlice({
  name: 'ngo',
  initialState: {
    settings: INITIAL_SETTINGS,
    certificates: [],
    emailLogs: [],
    members: [],
    campaigns: [],
    services: INITIAL_SERVICES,
    programs: INITIAL_PROGRAMS,
    stories: INITIAL_STORIES,
    feedbacks: INITIAL_FEEDBACKS,
    events: [],
    blogs: [],
    gallery: [],
    teamMembers: [],
    complaints: [],
    lang: 'en',
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setPrograms: (state, action) => {
      state.programs = action.payload;
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setFeedbacks: (state, action) => {
      state.feedbacks = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setGallery: (state, action) => {
      state.gallery = action.payload;
    },
    setTeamMembers: (state, action) => {
      state.teamMembers = action.payload;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    toggleLanguage: (state) => {
      state.lang = state.lang === 'en' ? 'hi' : 'en';
    },
    clearNGOStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
        state.successMessage = 'Settings saved successfully';
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(issueCertificate.fulfilled, (state, action) => {
        if (action.payload?.certificate) {
          state.certificates.unshift(action.payload.certificate);
        }
        state.successMessage = action.payload?.message || 'Certificate issued!';
      })
      .addCase(fetchEmailLogs.fulfilled, (state, action) => {
        state.emailLogs = action.payload;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.campaigns = action.payload;
      });
  }
});

export const {
  setSettings,
  setMembers,
  setCampaigns,
  setServices,
  setPrograms,
  setStories,
  setFeedbacks,
  setEvents,
  setBlogs,
  setGallery,
  setTeamMembers,
  setComplaints,
  toggleLanguage,
  clearNGOStatus
} = ngoSlice.actions;

export default ngoSlice.reducer;
