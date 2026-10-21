const Setting = require('../models/Setting');
const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');

const initDatabase = async () => {
  try {
    // 1. Check if any Admin Account exists in MongoDB
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount === 0) {
      console.log('ℹ️ No default admin account seeded. Create a secure admin account via POST /api/auth/create-admin using header X-ADMIN-SECRET-KEY.');
    } else {
      console.log(`✅ MongoDB initialized with ${adminCount} verified administrator account(s).`);
    }

    // 2. Ensure Official Trust Settings exist in MongoDB
    let setting = await Setting.findOne();
    if (!setting) {
      await Setting.create({
        ngoName: process.env.NGO_NAME || 'Apna Parivar Vriddh Aashram Foundation',
        tagline: 'सेवा • सम्मान • परिवार (जहाँ हर बुजुर्ग है, हमारा अपना)',
        registrationNumber: 'MP/JBP/VRIDDH/2024/0912',
        section80GNumber: 'CIT(EXEMP)/80G/2023-24/G-9401',
        section12ANumber: 'CIT(EXEMP)/12A/2023-24/A-1102',
        panNumber: 'AAZCA1294F',
        tanNumber: 'JBPA09876E',
        email: 'apnaparivarvriddhaashramfounda@gmail.com',
        phone: '+91 8959055269',
        address: 'Jay Prakash Nagar, Adhartal, Jabalpur, Madhya Pradesh - 482001',
        bankName: 'HDFC Bank Ltd.',
        accountNumber: '50200099881122',
        ifscCode: 'HDFC0002481',
        branch: 'Adhartal Branch, Jabalpur, MP',
        upiId: 'apnaparivar@hdfcbank',
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || 'apnaparivarvriddhaashramfounda@gmail.com',
        smtpPass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
        smtpFromName: 'Apna Parivar Vriddh Aashram Foundation',
        adminSecretKey: process.env.X_ADMIN_SECRET_KEY || 'ravi123'
      });
      console.log('✅ Official Trust Settings initialized in MongoDB.');
    } else {
      if (process.env.X_ADMIN_SECRET_KEY && setting.adminSecretKey !== process.env.X_ADMIN_SECRET_KEY) {
        setting.adminSecretKey = process.env.X_ADMIN_SECRET_KEY;
        await setting.save();
        console.log(`🔄 Synced Setting.adminSecretKey to environment variable (${process.env.X_ADMIN_SECRET_KEY}).`);
      }
    }

    // 3. Ensure Dynamic Membership Plans exist in MongoDB
    const planCount = await MembershipPlan.countDocuments();
    if (planCount === 0) {
      await MembershipPlan.insertMany([
        {
          title: 'Sahyogi Sadasya (Annual Care Supporter)',
          titleHi: 'सहयोगी सदस्य (वार्षिक सेवा समर्थक)',
          price: 1100,
          validityMonths: 12,
          benefits: [
            'Digital Identity Card with Verification QR Code',
            'Formal Letter of Appointment & Elder Care Volunteer Badge',
            'Monthly Aashram Seva Updates & Activity Reports'
          ],
          benefitsHi: [
            'सत्यापन क्यूआर कोड युक्त डिजिटल पहचान पत्र',
            'आधिकारिक नियुक्ति पत्र एवं वृद्ध सेवा बैज',
            'आश्रम की मासिक गतिविधियों एवं सेवा की रिपोर्ट'
          ],
          isPopular: false
        },
        {
          title: 'Seva Sanrakshak (Active Elder Patron)',
          titleHi: 'सेवा संरक्षक सदस्य (सक्रिय संरक्षक)',
          price: 5100,
          validityMonths: 24,
          benefits: [
            'Executive Dual-Sided ID Card (Print Ready)',
            'Official Sealed Appointment Letter with Trustee Reference No.',
            'Tithi Bhoj / Birthday Meal Sponsoring Privileges',
            '80G Tax Exemption Certificate for full contribution'
          ],
          benefitsHi: [
            'कार्यकारी दोतरफा पहचान पत्र (प्रिंट योग्य)',
            'संस्था मुहर एवं हस्ताक्षर युक्त नियुक्ति पत्र',
            'तिथि भोज / जन्मदिवस पर वृद्धजनों हेतु विशेष भोजन प्रायोजन',
            'योगदान पर धारा 80G आयकर छूट रसीद'
          ],
          isPopular: true
        },
        {
          title: 'Ajeevan Mukhya Sanrakshak (Life Guardian Patron)',
          titleHi: 'आजीवन मुख्य संरक्षक (आजीवन अभिभावक)',
          price: 11000,
          validityMonths: 60,
          benefits: [
            'Gold Life Guardian Digital ID Badge with Verification QR',
            'Foundation Seva Samman Certificate & Plaque',
            'Advisory Trustee Council invitation at Annual Aashram Samaroh',
            'Direct access to Aashram Management & Senior Resident Care'
          ],
          benefitsHi: [
            'स्वर्ण आजीवन मुख्य संरक्षक पहचान पत्र (क्यूआर युक्त)',
            'आश्रम सेवा सम्मान प्रमाण पत्र',
            'वार्षिक आश्रम सम्मेलन में सलाहकार समिति आमंत्रण',
            'आश्रम प्रबंधन एवं वरिष्ठ बुजुर्गों से सीधा संपर्क'
          ],
          isPopular: false
        }
      ]);
      console.log('✅ Dynamic Elder Care Membership Plans initialized in MongoDB.');
    }

    // 4. Ensure donations collection receiptNumber index is sparse unique
    try {
      const Donation = require('../models/Donation');
      const donCol = Donation.collection;
      const donIndexes = await donCol.indexes();
      const receiptIdx = donIndexes.find(i => i.name === 'receiptNumber_1');
      if (receiptIdx && !receiptIdx.sparse) {
        await donCol.dropIndex('receiptNumber_1');
        await donCol.createIndex({ receiptNumber: 1 }, { unique: true, sparse: true });
        console.log('✅ Synchronized donations.receiptNumber index to sparse unique.');
      }
    } catch {
      // index already configured
    }
  } catch (error) {
    console.error('⚠️ Database init error:', error.message);
  }
};

module.exports = { initDatabase };
