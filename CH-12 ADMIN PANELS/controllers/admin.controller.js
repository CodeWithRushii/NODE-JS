const Admin = require('../model/admin.model');
const fs = require('fs');

// Dashboard
module.exports.dashboardPage = (req, res) => {
    return res.render('dashboard');
}

// Add Admin Page
module.exports.addAdminPage = (req, res) => {
    return res.render('addAdminPage');
}

// View Admin Page
module.exports.viewAdminPage = async (req, res) => {
    try {
        const allAdmin = await Admin.find();
        return res.render('viewAdminPage', { allAdmin });
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// Add Admin
module.exports.addAdmin = async (req, res) => {
    try {

        console.log(req.file);

        req.body.profileimg = req.file.path;

        const addAdmin = await Admin.create(req.body);

        if (addAdmin) {
            console.log("Admin Inserted Successfully..");
        } else {
            console.log("Admin Insertion Failed..");
        }
        return res.redirect('/addAdminPage');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/addAdminPage');
    }
}

// Delete Admin
module.exports.deleteAdmin = async (req, res) => {
    try {
        const deletedUser = await Admin.findByIdAndDelete(req.query.Id);

        console.log(deletedUser);

        if (deletedUser) {
            fs.unlink(deletedUser.profileimg, () => { });
            console.log("Admin deleted successfully...");
        } else {
            console.log("Admin deletion failed...");
        }

        return res.redirect('/viewAdminPage');

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/viewAdminPage');
    }
}

// Edit Admin Page
module.exports.editAdminPage = async (req, res) => {
    try {
        console.log(req.params);

        const singleAdmin = await Admin.findById(req.params.Id);

        return res.render('editAdminPage', { singleAdmin });

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/viewAdminPage');
    }
}

// Update Admin
module.exports.updateAdmin = async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.body);
        console.log(req.file);

        if (req.file) {

            req.body.profileimg = req.file.path;

            const updatedData = await Admin.findByIdAndUpdate(req.params.Id, req.body);

            if (updatedData) {
                fs.unlink(updatedData.profileimg, () => { });
                console.log("Admin Updated Successfully...");
            } else {
                console.log("Admin Updation Failed...");
            }
        } else {
            const updatedData = await Admin.findByIdAndUpdate(req.params.Id, req.body, { new: true });

            if (updatedData) {
                console.log("Admin Updated Successfully...");
            } else {
                console.log("Admin Updation Failed...");
            }
        }

        return res.redirect('/viewAdminPage');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/viewAdminPage');
    }
}