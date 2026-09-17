const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * One-click demo login for FARMER or STAFF
 */
async function demoLogin(req, res, next) {
  try {
    const { role } = req.body || {};
    const user = await authService.demoLogin(role);
    return res.status(200).json({
      success: true,
      message: `Logged in as demo ${user.role.toLowerCase()}`,
      user,
    });
  } catch (err) {
    console.error('[Auth Error] demoLogin:', err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Demo authentication failed',
    });
  }
}

/**
 * Send OTP after validating Aadhaar + Mobile Number + Consent
 */
async function sendOtp(req, res, next) {
  try {
    const { phone, aadhaar, consent } = req.body || {};
    const result = await authService.sendOtp({ phone, aadhaar, consent });
    return res.status(200).json({
      success: true,
      message: result.message,
      phone: result.phone,
      maskedPhone: result.maskedPhone,
      maskedAadhaar: result.maskedAadhaar,
      aadhaarLast4: result.aadhaarLast4,
      otp: result.otp,
      mode: result.mode,
    });
  } catch (err) {
    console.error('[Auth Error] sendOtp:', err.message);
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Failed to send OTP',
    });
  }
}

/**
 * Verify OTP and authenticate farmer
 */
async function verifyOtp(req, res, next) {
  try {
    const { phone, otp, aadhaarLast4, role, name } = req.body || {};
    const user = await authService.verifyOtp(phone, otp, aadhaarLast4, role, name);
    return res.status(200).json({
      success: true,
      message: 'Identity and OTP verified successfully',
      user,
    });
  } catch (err) {
    console.error('[Auth Error] verifyOtp:', err.message);
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'OTP verification failed',
    });
  }
}

/**
 * Direct login by phone (legacy fallback)
 */
async function login(req, res, next) {
  try {
    const { phone, role, name, otp, aadhaarLast4 } = req.body || {};
    let user;
    if (otp) {
      user = await authService.verifyOtp(phone, otp, aadhaarLast4, role, name);
    } else {
      user = await authService.loginByPhone(phone, role, name);
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user,
    });
  } catch (err) {
    console.error('[Auth Error] login:', err.message);
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Login failed',
    });
  }
}

async function signup(req, res) {
  try {
    const user = await authService.signup(req.body || {});
    return res.status(201).json({ success: true, message: 'Account created successfully', user });
  } catch (err) {
    console.error('[Auth Error] signup:', err.message);
    return res.status(err.statusCode || 400).json({ success: false, message: err.message || 'Signup failed' });
  }
}

async function passwordLogin(req, res) {
  try {
    const user = req.body?.role === 'FARMER'
      ? await authService.loginWithAadhaarPassword(req.body || {})
      : await authService.loginWithPassword(req.body || {});
    return res.status(200).json({ success: true, message: 'Logged in successfully', user });
  } catch (err) {
    console.error('[Auth Error] passwordLogin:', err.message);
    return res.status(err.statusCode || 401).json({ success: false, message: err.message || 'Login failed' });
  }
}

/**
 * Aadhaar-only authentication for farmer
 */
async function aadhaarLogin(req, res, next) {
  try {
    const { aadhaar, consent } = req.body || {};
    const user = await authService.loginByAadhaar(aadhaar, consent);
    return res.status(200).json({
      success: true,
      message: 'Aadhaar identity verified successfully',
      user,
      maskedAadhaar: `XXXX XXXX ${user.aadhaarLast4 || '1234'}`,
    });
  } catch (err) {
    console.error('[Auth Error] aadhaarLogin:', err.message);
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Aadhaar verification failed',
    });
  }
}

/**
 * Get current user profile
 */
async function getCurrentUser(req, res, next) {
  try {
    const phone = req.query.phone || req.headers['x-user-phone'];
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number parameter is required',
      });
    }

    const prisma = require('../prisma');
    const user = await prisma.user.findUnique({
      where: { phone: String(phone) },
      include: { farmerProfile: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { aadhaarHash, passwordHash, ...sanitizedUser } = user;
    return res.status(200).json({
      success: true,
      user: sanitizedUser,
    });
  } catch (err) {
    console.error('[Auth Error] getCurrentUser:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch user',
    });
  }
}

module.exports = {
  demoLogin,
  aadhaarLogin,
  sendOtp,
  verifyOtp,
  login,
  signup,
  passwordLogin,
  getCurrentUser,
};

