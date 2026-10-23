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
  ],
  homeAboutTitle: 'About Apna Parivar Foundation',
  homeAboutStory: 'Apna Parivar Vriddh Aashram Foundation is a home for senior citizens who have no one else to rely on. We provide far more than a roof: we offer a vibrant family, genuine respect, and loving emotional shelter.',
  homeOurValues: 'Compassion, integrity, selfless service, and dignity are our foundational pillars. Serving senior citizens who are like our own parents is our highest calling.',
  homeOurImpact: 'Our foundation has provided secure shelter, free high-level medical care, cataract surgeries, and daily fresh satvik meals to over 200+ elderly mothers and fathers.',
  homeJoinUs: 'Join this sacred cause. Whether through donations, membership, or volunteering, every contribution brings heartfelt smiles to our elders.',
  objectives: []
};

export const INITIAL_SERVICES = [];
export const INITIAL_PROGRAMS = [];
export const INITIAL_STORIES = [];
export const INITIAL_FEEDBACKS = [];

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
