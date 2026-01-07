const express = require('express');
const multer = require('multer');

const { dashboardPage, addAdminPage, viewAdminPage, addAdmin, deleteAdmin, editAdmin, editAdminPage, updateAdmin } = require('../controllers/admin.controller');

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

route.get('/', dashboardPage);
route.get('/addAdminPage', addAdminPage);
route.get('/viewAdminPage', viewAdminPage);

// Insert Admin
route.post('/addAdmin', upload.single('profileimg'), addAdmin);

// Delete Admin
route.get('/deleteAdmin', deleteAdmin);

// Edit Admin
route.get('/editAdmin/:Id', editAdminPage);
route.post('/editAdmin/:Id', upload.single('profileimg'), updateAdmin);
module.exports = route;