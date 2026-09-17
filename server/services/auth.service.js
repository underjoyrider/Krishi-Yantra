const crypto = require('crypto');
const prisma = require('../prisma');

const DEMO_FARMER_PHONE = '9876543210';
const DEMO_STAFF_PHONE = '9876543211';
const DEMO_VENDOR_PHONE = '9876543212';

function sanitizeUser(user) {
  const { aadhaarHash, passwordHash, ...safeUser } = user;
  return safeUser;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash || '').split(':');
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return expected.length === derived.length && crypto.timingSafeEqual(derived, expected);
}

function validateCredentials(phone, password) {
  const cleanedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  if (cleanedPhone.length !== 10) {
    const err = new Error('Please enter a valid 10-digit mobile number.');
    err.statusCode = 400;
    throw err;
  }
  if (typeof password !== 'string' || password.length < 6) {
    const err = new Error('Password must contain at least 6 characters.');
    err.statusCode = 400;
    throw err;
  }
  return cleanedPhone;
}

async function createCustomerId() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const customerId = `FARM${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await prisma.user.findUnique({ where: { customerId } });
    if (!existing) return customerId;
  }
  const error = new Error('Unable to allocate a customer ID. Please try again.');
  error.statusCode = 500;
  throw error;
}

async function signup({ name, phone, aadhaar, password, role = 'FARMER', village, cropType, email }) {
  const normalizedRole = String(role).toUpperCase() === 'VENDOR' ? 'VENDOR' : 'FARMER';
  let cleanedPhone = phone;
  let aadhaarHash = null;
  let aadhaarLast4 = null;

  if (normalizedRole === 'FARMER') {
    cleanedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    if (cleanedPhone.length !== 10) {
      const error = new Error('Please enter a valid 10-digit mobile number.');
      error.statusCode = 400;
      throw error;
    }
    const cleanedAadhaar = String(aadhaar || '').replace(/\D/g, '');
    if (cleanedAadhaar.length !== 12) {
      const error = new Error('Please enter a valid 12-digit Aadhaar number.');
      error.statusCode = 400;
      throw error;
    }
    if (typeof password !== 'string' || password.length < 6) {
      const error = new Error('Password must contain at least 6 characters.');
      error.statusCode = 400;
      throw error;
    }
    aadhaarHash = crypto.createHash('sha256').update(cleanedAadhaar).digest('hex');
    aadhaarLast4 = cleanedAadhaar.slice(-4);
    const existingAadhaar = await prisma.user.findFirst({ where: { aadhaarHash } });
    if (existingAadhaar) {
      const error = new Error('An account with this Aadhaar number already exists.');
      error.statusCode = 409;
      throw error;
    }
  } else {
    cleanedPhone = validateCredentials(phone, password);
  }

  const existing = await prisma.user.findUnique({ where: { phone: cleanedPhone } });
  if (existing) {
    const err = new Error('An account with these credentials already exists.');
    err.statusCode = 409;
    throw err;
  }

  const safeName = String(name || '').trim();
  if (safeName.length < 2) {
    const err = new Error('Please enter your full name.');
    err.statusCode = 400;
    throw err;
  }

  const safeVillage = String(village || 'Shivapur').trim();
  const customerId = normalizedRole === 'FARMER' ? await createCustomerId() : null;
  const user = await prisma.user.create({
    data: {
      name: safeName,
      phone: cleanedPhone,
      phoneNumber: cleanedPhone,
      customerId,
      aadhaarHash,
      aadhaarLast4,
      aadhaarVerified: normalizedRole === 'FARMER',
      email: email ? String(email).trim() : null,
      village: safeVillage,
      district: 'Mandya',
      state: 'Karnataka',
      role: normalizedRole,
      passwordHash: hashPassword(password),
      mobileVerified: true,
      verificationStatus: 'VERIFIED',
      ...(normalizedRole === 'FARMER'
        ? { farmerProfile: { create: { village: safeVillage, cropType: cropType || 'Paddy / Rice' } } }
        : {}),
    },
    include: { farmerProfile: true },
  });
  return sanitizeUser(user);
}

async function loginWithPassword({ phone, password, role }) {
  const cleanedPhone = validateCredentials(phone, password);
  const expectedRole = String(role || 'FARMER').toUpperCase() === 'VENDOR' ? 'VENDOR' : 'FARMER';
  const user = await prisma.user.findUnique({ where: { phone: cleanedPhone }, include: { farmerProfile: true } });
  if (!user || user.role !== expectedRole || !verifyPassword(password, user.passwordHash)) {
    const err = new Error('Mobile number, password, or portal selection is incorrect.');
    err.statusCode = 401;
    throw err;
  }
  return sanitizeUser(user);
}

async function loginWithAadhaarPassword({ aadhaar, password }) {
  const cleanedAadhaar = String(aadhaar || '').replace(/\D/g, '');
  if (cleanedAadhaar.length !== 12) {
    const error = new Error('Please enter a valid 12-digit Aadhaar number.');
    error.statusCode = 400;
    throw error;
  }
  if (typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must contain at least 6 characters.');
    error.statusCode = 400;
    throw error;
  }
  const aadhaarHash = crypto.createHash('sha256').update(cleanedAadhaar).digest('hex');
  const user = await prisma.user.findFirst({ where: { aadhaarHash }, include: { farmerProfile: true } });
  if (!user) {
    const error = new Error('No farmer account exists for this Aadhaar number. Please sign up before attempting to log in.');
    error.statusCode = 404;
    throw error;
  }
  if (user.role !== 'FARMER' || !verifyPassword(password, user.passwordHash)) {
    const error = new Error('Aadhaar number or password is incorrect.');
    error.statusCode = 401;
    throw error;
  }
  return sanitizeUser(user);
}

/**
 * Perform one-click demo login for FARMER or STAFF
 */
async function demoLogin(role = 'FARMER') {
  const requestedRole = String(role).toUpperCase();
  const normalizedRole = requestedRole === 'STAFF' ? 'STAFF' : requestedRole === 'VENDOR' ? 'VENDOR' : 'FARMER';
  const targetPhone = normalizedRole === 'STAFF' ? DEMO_STAFF_PHONE : normalizedRole === 'VENDOR' ? DEMO_VENDOR_PHONE : DEMO_FARMER_PHONE;

  let user = await prisma.user.findUnique({
    where: { phone: targetPhone },
    include: { farmerProfile: true },
  });

  if (!user) {
    if (normalizedRole === 'STAFF' || normalizedRole === 'VENDOR') {
      user = await prisma.user.create({
        data: {
          name: normalizedRole === 'VENDOR' ? 'Demo Procurement Vendor' : 'Shivapur Center Operator',
          phone: targetPhone,
          phoneNumber: targetPhone,
          email: normalizedRole === 'VENDOR' ? 'vendor.shivapur@krishiyantra.gov.in' : 'operator.shivapur@krishiyantra.gov.in',
          village: 'Shivapur',
          district: 'Mandya',
          state: 'Karnataka',
          role: normalizedRole,
          aadhaarLast4: '9876',
          aadhaarVerified: true,
          mobileVerified: true,
          verificationStatus: 'VERIFIED',
        },
        include: { farmerProfile: true },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: 'Ravi Kumar',
          phone: DEMO_FARMER_PHONE,
          phoneNumber: DEMO_FARMER_PHONE,
          email: 'ravi.kumar@krishiyantra.gov.in',
          village: 'Shivapur Taluk',
          district: 'Mandya',
          state: 'Karnataka',
          role: 'FARMER',
          aadhaarLast4: '1234',
          aadhaarVerified: true,
          mobileVerified: true,
          verificationStatus: 'VERIFIED',
          farmerProfile: {
            create: {
              village: 'Shivapur Taluk',
              district: 'Mandya',
              state: 'Karnataka',
              cropType: 'Paddy / Rice',
              language: 'en',
            },
          },
        },
        include: { farmerProfile: true },
      });
    }
  } else {
    // Ensure verified fields are set
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        aadhaarLast4: user.aadhaarLast4 || '1234',
        aadhaarVerified: true,
        mobileVerified: true,
        verificationStatus: 'VERIFIED',
      },
      include: { farmerProfile: true },
    });
  }

  // Strip sensitive aadhaarHash before returning
  return sanitizeUser(user);
}

/**
 * Send OTP after validating BOTH Aadhaar Number and Mobile Number with consent
 */
async function sendOtp(payload) {
  // Support both object payload and direct phone argument
  const phone = typeof payload === 'object' ? payload.phone : payload;
  const aadhaar = typeof payload === 'object' ? payload.aadhaar : null;
  const consent = typeof payload === 'object' ? payload.consent : true;

  // 1. Validate Aadhaar Number
  const cleanedAadhaar = String(aadhaar || '').replace(/\D/g, '');
  if (!cleanedAadhaar || cleanedAadhaar.length !== 12) {
    const err = new Error('Please enter a valid 12-digit Aadhaar number.');
    err.statusCode = 400;
    throw err;
  }

  // 2. Validate Mobile Number
  const cleanedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanedPhone || cleanedPhone.length !== 10) {
    const err = new Error('Please enter a valid 10-digit mobile number.');
    err.statusCode = 400;
    throw err;
  }

  // 3. Validate Consent
  if (consent !== true && consent !== 'true') {
    const err = new Error('Please provide consent to Aadhaar and mobile-based identity verification.');
    err.statusCode = 400;
    throw err;
  }

  // 4. Compute secure SHA-256 hash of Aadhaar (Zero raw Aadhaar stored)
  const aadhaarHash = crypto.createHash('sha256').update(cleanedAadhaar).digest('hex');
  const aadhaarLast4 = cleanedAadhaar.slice(-4);

  // 5. Generate 6-digit OTP (SIH Demo Mode: 123456)
  const demoOtp = '123456';
  const otpHash = crypto.createHash('sha256').update(demoOtp).digest('hex');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // 6. Record verification challenge in database
  try {
    await prisma.otpVerification.create({
      data: {
        phone: cleanedPhone,
        otpHash,
        aadhaarLast4,
        attempts: 0,
        expiresAt,
        verified: false,
      },
    });
  } catch (e) {
    // Non-fatal if table write fails
  }

  const maskedPhone = `XXXXX ${cleanedPhone.slice(-5)}`;
  const maskedAadhaar = `XXXX XXXX ${aadhaarLast4}`;

  return {
    success: true,
    phone: cleanedPhone,
    maskedPhone,
    maskedAadhaar,
    aadhaarLast4,
    otp: demoOtp, // Clearly provided for SIH Prototype demonstration
    mode: 'SIH_PROTOTYPE_DEMO',
    message: `OTP sent successfully to registered mobile +91 ${maskedPhone}`,
  };
}

/**
 * Verify OTP and authenticate user
 */
async function verifyOtp(phone, otp, aadhaarLast4 = '1234', role = 'FARMER', name = null) {
  const cleanedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanedPhone || cleanedPhone.length !== 10) {
    const err = new Error('Please enter a valid 10-digit mobile number.');
    err.statusCode = 400;
    throw err;
  }

  const code = String(otp || '').trim();
  if (!code) {
    const err = new Error('Please enter the 6-digit OTP.');
    err.statusCode = 400;
    throw err;
  }

  // Check OTP challenge against database if available
  try {
    const latestChallenge = await prisma.otpVerification.findFirst({
      where: { phone: cleanedPhone, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (latestChallenge) {
      if (latestChallenge.expiresAt < new Date()) {
        const err = new Error('OTP expired. Please request a new OTP.');
        err.statusCode = 400;
        throw err;
      }
      if (latestChallenge.attempts >= 5) {
        const err = new Error('Too many attempts. Please request a new OTP.');
        err.statusCode = 400;
        throw err;
      }

      // Increment attempt
      await prisma.otpVerification.update({
        where: { id: latestChallenge.id },
        data: { attempts: latestChallenge.attempts + 1 },
      });
    }
  } catch (e) {
    if (e.statusCode) throw e;
  }

  // Validate OTP: Accept standard demo code 123456 or legacy 1234
  if (code !== '123456' && code !== '1234') {
    const err = new Error('Incorrect OTP. Please enter demo code 123456.');
    err.statusCode = 400;
    throw err;
  }

  // Mark latest challenge verified
  try {
    const latest = await prisma.otpVerification.findFirst({
      where: { phone: cleanedPhone, verified: false },
      orderBy: { createdAt: 'desc' },
    });
    if (latest) {
      await prisma.otpVerification.update({
        where: { id: latest.id },
        data: { verified: true },
      });
    }
  } catch (e) {}

  // Find or create farmer user
  const user = await findOrCreateUser(cleanedPhone, role, name, aadhaarLast4);
  return sanitizeUser(user);
}

/**
 * Direct phone login helper (legacy fallback)
 */
async function loginByPhone(phone, role = 'FARMER', name = null) {
  const cleanedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanedPhone || cleanedPhone.length !== 10) {
    const err = new Error('Please enter a valid 10-digit mobile number.');
    err.statusCode = 400;
    throw err;
  }

  const user = await findOrCreateUser(cleanedPhone, role, name);
  return sanitizeUser(user);
}

/**
 * Find existing user or create a new user profile
 */
async function findOrCreateUser(phone, role = 'FARMER', name = null, aadhaarLast4 = '1234') {
  const requestedRole = (role || 'FARMER').toUpperCase();
  const normalizedRole = requestedRole === 'STAFF' ? 'STAFF' : requestedRole === 'VENDOR' ? 'VENDOR' : 'FARMER';

  let user = await prisma.user.findUnique({
    where: { phone },
    include: { farmerProfile: true },
  });

  if (!user) {
    const defaultName = name || (normalizedRole === 'FARMER' ? `Farmer ${phone.slice(-4)}` : `Staff ${phone.slice(-4)}`);

    user = await prisma.user.create({
      data: {
        name: defaultName,
        phone,
        phoneNumber: phone,
        role: normalizedRole,
        village: 'Shivapur',
        district: 'Mandya',
        state: 'Karnataka',
        aadhaarLast4: aadhaarLast4 || '1234',
        aadhaarVerified: true,
        mobileVerified: true,
        verificationStatus: 'VERIFIED',
        ...(normalizedRole === 'FARMER'
          ? {
              farmerProfile: {
                create: {
                  village: 'Shivapur',
                  district: 'Mandya',
                  state: 'Karnataka',
                  cropType: 'Paddy / Rice',
                  language: 'en',
                },
              },
            }
          : {}),
      },
      include: { farmerProfile: true },
    });
  } else {
    // Keep verified credentials in sync
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        aadhaarLast4: aadhaarLast4 || user.aadhaarLast4 || '1234',
        aadhaarVerified: true,
        mobileVerified: true,
        verificationStatus: 'VERIFIED',
      },
      include: { farmerProfile: true },
    });
  }

  return user;
}

/**
 * Authenticate farmer securely via Aadhaar number alone with consent
 */
async function loginByAadhaar(aadhaar, consent) {
  // 1. Validate Aadhaar Number: exactly 12 digits, digits only
  const cleanedAadhaar = String(aadhaar || '').replace(/\D/g, '');
  if (!cleanedAadhaar || cleanedAadhaar.length !== 12) {
    const err = new Error('Please enter a valid 12-digit Aadhaar number.');
    err.statusCode = 400;
    throw err;
  }

  // 2. Validate Consent
  if (consent !== true && consent !== 'true') {
    const err = new Error('Please provide consent to continue.');
    err.statusCode = 400;
    throw err;
  }

  // 3. Compute secure SHA-256 hash (Never store raw Aadhaar)
  const aadhaarHash = crypto.createHash('sha256').update(cleanedAadhaar).digest('hex');
  const aadhaarLast4 = cleanedAadhaar.slice(-4);

  // 4. In SIH prototype demo mode, associate with demo farmer Ravi Kumar (preserves active booking B-104)
  let user = await prisma.user.findFirst({
    where: { phone: DEMO_FARMER_PHONE },
    include: { farmerProfile: true },
  });

  if (!user) {
    user = await demoLogin('FARMER');
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        aadhaarLast4,
        aadhaarHash,
        aadhaarVerified: true,
        verificationStatus: 'VERIFIED',
      },
      include: { farmerProfile: true },
    });
  }

  return sanitizeUser(user);
}

module.exports = {
  demoLogin,
  loginByAadhaar,
  sendOtp,
  verifyOtp,
  loginByPhone,
  findOrCreateUser,
  signup,
  loginWithPassword,
  loginWithAadhaarPassword,
  DEMO_FARMER_PHONE,
  DEMO_STAFF_PHONE,
  DEMO_VENDOR_PHONE,
};

