const express = require('express');
const passport = require('passport');
const upload = require('../Middleware/multer.middleware');

const { addAdminPage, viewAdminPage, insertAdmin, deleteAdmin, editAdminPage, updateAdmin } = require('../controllers/admin.controller');

const route = express.Router();
// Add Admin Page
route.get('/addAdminPage', addAdminPage);

// View Admin Page
route.get('/viewAdminPage', viewAdminPage);

// Insert Admin
route.post('/addAdmin', upload.single('profileimg'), insertAdmin);

// Delete Admin
route.get('/deleteAdmin', deleteAdmin);

// Edit Admin Page
route.get('/editAdmin/:adminId', editAdminPage);

// Update Admin
route.post('/editAdmin/:adminId', upload.single('profileimg'), updateAdmin);

module.exports = route;
