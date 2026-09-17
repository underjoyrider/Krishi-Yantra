const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// One-click demo logins (Farmer or Staff)
router.post('/demo', authController.demoLogin);

// Aadhaar-only verification login
router.post('/aadhaar-login', authController.aadhaarLogin);
router.post('/verify-aadhaar', authController.aadhaarLogin);

// Login by phone / credentials
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/password-login', authController.passwordLogin);

// Send OTP
router.post('/otp', authController.sendOtp);
router.post('/send-otp', authController.sendOtp);

// Verify OTP
router.post('/verify', authController.verifyOtp);
router.post('/verify-otp', authController.verifyOtp);

// Current User Profile
router.get('/me', authController.getCurrentUser);

module.exports = router;
