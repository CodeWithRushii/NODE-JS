const express = require('express');
const passport = require('passport');
const upload = require('../Middleware/multer.middleware');

const { loginPage, checkLogin, logout, changePasswordPage, changePassword, verifyEmail, OTPPage, OTPVerify, newPasswordPage, changeNewPassword, profilePage, dashboardPage } = require('../controllers/auth.controller');

const route = express.Router();
// Login Page
route.get('/', passport.checkAuthIsNotDone, loginPage);

// Login Logic
route.post('/login', passport.checkAuthIsNotDone, passport.authenticate('localAuth', { failureRedirect: '/', failureFlash: true }), checkLogin);

// Logout
route.get('/logout', passport.checkAuthIsDone, logout);

// Change Password Page
route.get('/changepasswordpage', passport.checkAuthIsDone, changePasswordPage);

// Change Password
route.post('/changepassword', passport.checkAuthIsDone, changePassword);

// Verify Email
route.post('/verify-email', passport.checkAuthIsNotDone, verifyEmail);

// OTP Page
route.get('/otppage', passport.checkAuthIsNotDone, OTPPage);

// OTP Verify
route.post('/otpverify', passport.checkAuthIsNotDone, OTPVerify);

// New Password Page
route.get('/newPasswordPage', passport.checkAuthIsNotDone, newPasswordPage);

// Change New Password
route.post('/changeNewPassword', passport.checkAuthIsNotDone, changeNewPassword);

// Profile Page
route.get('/profile', passport.checkAuthIsDone, profilePage);

// Dashboard Page
route.get('/dashboard', passport.checkAuthIsDone, dashboardPage);

// Category Routes
route.use('/category', passport.checkAuthIsDone, require('./category.routes'));

// SubCategory Routes
route.use('/subcategory', passport.checkAuthIsDone, require('./subcategory.routes'));

// Admin Routes
route.use('/admin', passport.checkAuthIsDone, require('./admin.routes'));
module.exports = route;
