const Admin = require('../model/admin.model');
const fs = require('fs');


// Add Admin Page
module.exports.addAdminPage = async (req, res) => {
    try {
        return res.render('admin/addAdminPage');
    } catch (err) {
        console.log("Add Admin Page Error:", err);
        return res.redirect('/dashboard');
    }
};

// View Admin Page
module.exports.viewAdminPage = async (req, res) => {
    try {
        let allAdmin = await Admin.find();
        allAdmin = allAdmin.filter(a => a.email !== res.locals.admin.email);
        return res.render('admin/viewAdminPage', { allAdmin });
    } catch (err) {
        console.log("View Admin Error:", err);
        return res.redirect('/dashboard');
    }
};

// Insert Admin
module.exports.insertAdmin = async (req, res) => {
    try {
        req.body.profileimg = req.file.path;
        await Admin.create(req.body);
        req.flash('success', "Admin Inserted Successfully..");
        return res.redirect('/admin/addAdminPage');
    } catch (err) {
        console.log("Insert Admin Error:", err);
        req.flash('error', "Admin Insertion Failed..");
        return res.redirect('/admin/addAdminPage');
    }
};

// Delete Admin
module.exports.deleteAdmin = async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(req.query.Id);

        if (deleted && deleted.profileimg) {
            fs.unlink(deleted.profileimg, () => { });
        }
        req.flash('success', `${deleted.fname} Deleted Successfully..`);
        return res.redirect('/admin/viewAdminPage');
    } catch (err) {

        console.log("Delete Admin Error:", err);
        req.flash('error', "Admin Deletion Failed..");
        return res.redirect('/admin/viewAdminPage');
    }
};

// Edit Admin Page
module.exports.editAdminPage = async (req, res) => {
    try {
        const singleAdmin = await Admin.findById(req.params.adminId);
        return res.render('admin/editAdminPage', { singleAdmin });
    } catch (err) {
        console.log("Edit Admin Page Error:", err);
        return res.redirect('/admin/viewAdminPage');
    }
};

// update Admin
module.exports.updateAdmin = async (req, res) => {
    try {
        if (req.file) {
            req.body.profileimg = req.file.path;
            const old = await Admin.findByIdAndUpdate(req.params.adminId, req.body);
            if (old) fs.unlink(old.profileimg, () => { });
            req.flash('success', `${req.body.fname} Updated Successfully..`);
        } else {
            req.flash('success', `${req.body.fname} Updated Successfully..`);
            await Admin.findByIdAndUpdate(req.params.adminId, req.body);
        }

        return (req.params.adminId === res.locals.admin.id)
            ? res.redirect('/profile')
            : res.redirect('/admin/viewAdminPage');

    } catch (err) {
        console.log("Update Admin Error:", err);
        return res.redirect('/admin/viewAdminPage');
    }
};