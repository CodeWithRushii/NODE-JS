const Admin = require('../model/admin.model');
const fs = require('fs');
const nodemailer = require('nodemailer');

function sessionRemove(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log("Session destroy error:", err);
            return res.redirect('/dashboard');
        }
        return res.redirect('/');
    });
}

// Login Page
module.exports.loginPage = async (req, res) => {
    try {

        return res.render('auth/login');
    } catch (err) {
        console.log("Login Page Error:", err);
        return res.redirect('/');
    }
};

// Login Logic 
module.exports.checkLogin = async (req, res) => {
    try {
        req.flash('success', "Login Successfully..");
        return res.redirect('/dashboard');

    } catch (err) {
        console.log("Login Error:", err);
        return res.redirect('/');
    }
};

// Logout
module.exports.logout = (req, res) => {
    sessionRemove(req, res);
};

//CHANGE PASSWORD
module.exports.changePasswordPage = async (req, res) => {
    try {
        return res.render('auth/changepassword');
    } catch (err) {
        console.log("Change Password Page Error:", err);
        return res.redirect('/');
    }
};

// Change Password
module.exports.changePassword = async (req, res) => {
    try {
        const admin = res.locals.admin;
        const { currentpass, newpass, confpass } = req.body;

        if (currentpass !== admin.password) {
            req.flash('error', "Current password is incorrect.");
            console.log("Current password mismatch");
            return res.redirect('/changepasswordpage');
        }

        if (newpass === admin.password) {
            req.flash('error', "New password cannot be same as old password.");
            console.log("New password same as old");
            return res.redirect('/changepasswordpage');
        }

        if (newpass !== confpass) {
            req.flash('error', "Confirm password does not match.");
            console.log("Confirm password mismatch");
            return res.redirect('/changepasswordpage');
        }

        const updated = await Admin.findByIdAndUpdate(
            admin._id,
            { password: newpass },
            { new: true }
        );

        if (updated) {

            console.log("Password changed successfully");
            sessionRemove(req, res);
        } else {
            return res.redirect('/dashboard');
        }

    } catch (err) {
        console.log("Change Password Error:", err);
        return res.redirect('/');
    }
};

//FORGOT PASSWORD (OTP)
module.exports.verifyEmail = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            req.flash('error', 'Admin not found with this email address.');
            console.log("Admin not found");
            return res.redirect('/');
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "dedaniyarushi4@gmail.com",
                pass: "uadgjecdudlczbef" // App Password
            }
        });

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        const info = await transporter.sendMail({
            from: '"Admin Panel" <dedaniyarushi4@gmail.com>',
            to: req.body.email,
            subject: "OTP Verification",
            html: `<!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>DarkPan OTP</title>
            </head>
            <body style="margin:0; padding:0; background:#0f1115; font-family:Arial, Helvetica, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1c24; border-radius:8px; overflow:hidden;">
            <tr>
            <td style="padding:25px; text-align:center; background:#14161d;">
            <h2 style="margin:0; color:#ff3b30;">DarkPan</h2>
            <p style="margin:5px 0 0; color:#aaa;">Password Reset OTP</p>
            </td>
            </tr>
                    
            <tr>
            <td style="padding:30px; color:#ffffff;">
            <p>Hi, ${admin.fname}</p>
                    
            <p style="color:#ccc;">
            You requested to reset your password. Use the OTP below.
            </p>
                    
            <div style="text-align:center; margin:30px 0;">
            <div style="display:inline-block; background:#0f1115; padding:18px 40px;
            font-size:28px; letter-spacing:8px; font-weight:bold; border-radius:6px; color:#ff3b30;">
            ${OTP}
            </div>
            </div>
                    
            <p style="color:#bbb;">OTP valid for 10 minutes.</p>
                    
            <p style="margin-top:30px; color:#ccc;">
            Thanks,<br>
            <strong style="color:#ff3b30;">DarkPan Team</strong>
            </p>
            </td>
            </tr>
                    
            <tr>
            <td style="padding:15px; background:#14161d; text-align:center; font-size:12px; color:#777;">
            © 2026 DarkPan Admin Panel
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
            </body>
            </html>`
        });

        console.log("Mail sent:", info.messageId);

        req.session.otp = OTP;
        req.session.resetId = admin.id;

        return res.redirect('/otppage');

    } catch (err) {
        console.log("Verify Email Error:", err);
        return res.redirect('/');
    }
};

// otp page
module.exports.OTPPage = (req, res) => {
    try {
        if (!req.session.otp) return res.redirect('/');
        return res.render('auth/OTPPage');
    } catch (err) {
        console.log("OTP Page Error:", err);
        return res.redirect('/');
    }
};

// OTP Verify
module.exports.OTPVerify = async (req, res) => {
    try {
        console.log(req.body);

        if (req.body.OTP !== req.session.otp) {
            req.flash('error', 'Invalid OTP. Please try again.');
            console.log("Invalid Otp");
            return res.redirect('/otppage');
        }
        req.session.otp = null;

        return res.redirect('/newPasswordPage');

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// New Password Page
module.exports.newPasswordPage = (req, res) => {
    try {
        if (!req.session.resetId) {
            return res.redirect('/')

        };
        return res.render('auth/newPasswordPage');
    } catch (err) {
        console.log("New Password Page Error:", err);
        return res.redirect('/');
    }
};

// Change New Password
module.exports.changeNewPassword = async (req, res) => {
    try {
        if (!req.session.resetId) {
            console.log("Invalid session");
            return res.redirect('/otppage');
        }
        const { new_password, confirm_password } = req.body;

        if (new_password !== confirm_password) {
            req.flash('error', 'Confirm password does not match.');
            console.log("Password mismatch");
            return res.redirect('/newPasswordPage');
        }

        await Admin.findByIdAndUpdate(req.session.resetId, {
            password: new_password
        });

        req.session.resetId = null;
        return res.redirect('/');

    } catch (err) {
        console.log("Change New Password Error:", err);
        return res.redirect('/');
    }
};

// Dashboard Page
module.exports.dashboardPage = async (req, res) => {
    try {
        return res.render('dashboard');
    } catch (err) {
        console.log("Dashboard Error:", err);
        return res.redirect('/');
    }
};

// Profile Page
module.exports.profilePage = async (req, res) => {
    try {
        return res.render('profile/myprofile');
    } catch (err) {
        console.log("Profile Error:", err);
        return res.redirect('/');
    }
};

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
        return res.redirect('/addAdminPage');
    } catch (err) {
        console.log("Insert Admin Error:", err);
        req.flash('error', "Admin Insertion Failed..");
        return res.redirect('/addAdminPage');
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
        return res.redirect('/viewAdminPage');
    } catch (err) {

        console.log("Delete Admin Error:", err);
        req.flash('error', "Admin Deletion Failed..");
        return res.redirect('/viewAdminPage');
    }
};

// Edit Admin Page
module.exports.editAdminPage = async (req, res) => {
    try {
        const singleAdmin = await Admin.findById(req.params.adminId);
        return res.render('admin/editAdminPage', { singleAdmin });
    } catch (err) {
        console.log("Edit Admin Page Error:", err);
        return res.redirect('/viewAdminPage');
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
            : res.redirect('/viewAdminPage');

    } catch (err) {
        console.log("Update Admin Error:", err);
        return res.redirect('/viewAdminPage');
    }
};