const express = require('express');
const { registerAdmin, loginAdmin, fetchAllAdmin, forgotPassword, verifyOTP, newPassword, deleteAdmin, updateAdmin, activeOrInActiveAdmin, adminProfile, changePassword, } = require('../../../controllers/auth/admin/admin.controller');
const { storage } = require('../../../middleware/storage.middleware');
const multer = require('multer');

const adminRoute = express.Router();

const upload = multer({ storage });

adminRoute.post('/register', upload.single('profile_image'), registerAdmin);
adminRoute.post('/login', loginAdmin);
adminRoute.post('/forgot-password', forgotPassword);
adminRoute.post('/verify-otp', verifyOTP);
adminRoute.post('/new-password', newPassword);

// localhost:8000/api/auth/admin/register
// localhost:8000/api/auth/admin/login


// REST APIs
adminRoute.get('/', fetchAllAdmin);
adminRoute.delete('/', deleteAdmin);
adminRoute.patch('/:id', updateAdmin);
adminRoute.put('/', activeOrInActiveAdmin);
adminRoute.get('/profile', adminProfile);

adminRoute.post('/change-password', changePassword);

module.exports = adminRoute;