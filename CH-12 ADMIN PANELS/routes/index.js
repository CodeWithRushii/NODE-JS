const express = require('express');
const multer = require('multer');

const { dashboardPage, addAdminPage, viewAdminPage, addAdmin, deleteAdmin, editAdminPage, updateAdmin, loginPage, checkLogin, logout, changepassword, changepasswordpage, profilepage, verifyEmail, newPasswordPage, changeNewPassword, otpPage, otpVerify } = require('../controllers/admin.controller');

const route = express.Router();

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/admin/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: myStorage });

//auth
route.get('/', loginPage);
route.post('/login', checkLogin);

//logout
route.get('/logout', logout);

//Change-Password
route.get('/changepasswordpage', changepasswordpage);
route.post('/changepassword', changepassword);

// forgot password
route.post('/verify-email', verifyEmail);

//otp page
route.get('/otppage', otpPage);
route.post('/otpverify', otpVerify);

// New Password Page
route.get('/newPasswordPage', newPasswordPage);
route.post('/changeNewPassword', changeNewPassword);

//myprofile
route.get('/profile', profilepage)

//Dashbord Page
route.get('/dashboard', dashboardPage);

//AddAdmin Page
route.get('/addAdminPage', addAdminPage);

//ViewAdmin Page
route.get('/viewAdminPage', viewAdminPage);

// Insert Admin
route.post('/addAdmin', upload.single('profileimg'), addAdmin);

// Delete Admin
route.get('/deleteAdmin', deleteAdmin);

// Edit Admin
route.get('/editAdmin/:id', editAdminPage);
route.post('/editAdmin/:id', upload.single('profileimg'), updateAdmin);
module.exports = route;