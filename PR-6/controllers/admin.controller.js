const cookieParser = require('cookie-parser');
const Admin = require('../model/admin.model');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Login Page
module.exports.loginPage = async (req, res) => {

    try {
        const admin = await Admin.findById(req.cookies.adminId);
        console.log(req.cookie);


        if (req.cookies.adminId && admin) {
            return res.redirect('/dashboard',);
        }

        return res.render('auth/login');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// Login 
module.exports.checkLogin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            console.log("Admin not found...");
            return res.redirect('/');
        }

        if (admin.password != req.body.password) {
            console.log("Pasword not matched...");
            return res.redirect('/');
        }

        res.cookie('adminId', admin._id);
        return res.redirect('/dashboard');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

//Change-Password page
module.exports.changepasswordpage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }
        return res.render('auth/changepassword', { admin });
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/dashboard');
    }
}

//change-Password 
module.exports.changepassword = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }

        const { currentpass, newpass, confpass } = req.body;

        if (currentpass != admin.password) {
            console.log(admin.password)
            console.log('Current Password Is Not Matched Original Password!!');
            return res.redirect('/changepasswordpage')
        }

        if (newpass === admin.password) {
            console.log("New Password or original Password Is Matched!! try Again");
            return res.redirect('/changepasswordpage')
        }

        if (confpass != newpass) {
            console.log("Confirm Password Note Matched New Password!!");
            return res.redirect('/changepasswordpage')
        }

        const ChangePass = await Admin.findByIdAndUpdate(admin._id, { password: newpass }, { new: true });
        console.log(ChangePass);

        if (ChangePass) {
            console.log("Password Updated!!!");
        } else {
            console.log("Password Updation failed!!!");
        }

        return res.redirect('/')

    } catch (error) {
        console.log("Delete error:", error);
        return res.redirect('/');
    }

}

// Verify Email
module.exports.verifyEmail = async (req, res) => {

    console.log(req.body);

    try {
        const admin = await Admin.findOne(req.body);

        if (!admin) {
            console.log("Admin not found....");
            return res.redirect('/');
        }

        // Send OTP

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "dedaniyarushi4@gmail.com",
                pass: "uadgjecdudlczbef"
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

                                <table width="600" cellpadding="0" cellspacing="0"
                                    style="background:#1a1c24; border-radius:8px; overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="padding:25px; text-align:center; background:#14161d;">
                                            <h2 style="margin:0; color:#ff3b30;">DarkPan</h2>
                                            <p style="margin:5px 0 0; color:#aaa;">Password Reset OTP</p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:30px; color:#ffffff;">
                                            <p style="font-size:16px;">Hi, ${admin.fname}</p>

                                            <p style="font-size:15px; line-height:1.6; color:#ccc;">
                                                You requested to reset your password for your DarkPan admin account.
                                                Use the OTP below to continue.
                                            </p>

                                            <div style="text-align:center; margin:30px 0;">
                                                <div
                                                    style="display:inline-block; background:#0f1115; padding:18px 40px; font-size:28px; letter-spacing:8px; font-weight:bold; border-radius:6px; color:#ff3b30;">
                                                    ${OTP}
                                                </div>
                                            </div>

                                            <p style="font-size:14px; color:#bbb;">
                                                This OTP is valid for 10 minutes. Do not share it with anyone.
                                            </p>

                                            <p style="font-size:14px; margin-top:25px; color:#bbb;">
                                                If you did not request this, please ignore this email.
                                            </p>

                                            <p style="margin-top:30px; font-size:14px; color:#ccc;">
                                                Thanks,<br>
                                                <strong style="color:#ff3b30;">DarkPan Team</strong>
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
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
                    </html>
`, // HTML version of the message
        });

        console.log(info.messageId);

        res.cookie("OTP", OTP);
        res.cookie("id", admin.id);

        return res.redirect('/otppage'); // OTP Verify Page

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// OTP Page
module.exports.otpPage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (admin) {
            return res.redirect('/dashboard');
        }
        return res.render('auth/OTPPage');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// OTP Verify
module.exports.otpVerify = async (req, res) => {
    try {
        console.log("User Side : ", req.body);
        console.log("Developer Side : ", req.cookies);

        if (req.body.adminotp !== req.cookies.OTP) {
            console.log("OTP not match...");
            return res.redirect('/otppage');
        }

        // Change Password
        return res.redirect('/newPasswordPage');

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// New Password Page
module.exports.newPasswordPage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);
        if (admin) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('OTP');
        return res.render('auth/newPasswordPage');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

// Change New Password Logic
module.exports.changeNewPassword = async (req, res) => {
    try {
        console.log(req.body);

        if (req.body.new_password !== req.body.confirm_password) {
            console.log("Password not matched");
            return res.redirect('/newPasswordPage');
        }

        console.log(req.cookies);

        const updatePassword = await Admin.findByIdAndUpdate(req.cookies.id, { password: req.body.new_password }, { new: true });

        res.clearCookie('id');
        if (updatePassword) {
            console.log("Password Update...");
            return res.redirect('/');
        } else {
            console.log("Password Not Update...");
            return res.redirect('/');
        }

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}

//myprofile
module.exports.profilepage = async (req, res) => {
    try {
        const adminId = req.cookies.adminId;

        if (!adminId) {
            return res.redirect('/');
        }

        const admin = await Admin.findById(adminId);
        const allAdmin = await Admin.find();   // for the cards

        if (!admin) {
            return res.redirect('/');
        }

        return res.render('profile/myprofile', { admin, allAdmin });

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error :", err);
        return res.redirect('/');
    }
};


//Logout
module.exports.logout = (req, res) => {
    res.clearCookie('adminId');
    return res.redirect('/');
}

// Dashboard Page
module.exports.dashboardPage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }
        return res.render('dashboard', { admin });
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/dashboard');
    }
}

// Add Admin Page
module.exports.addAdminPage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }
        return res.render('admin/addAdminPage', { admin });
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/addAdminPage');
    }
}

// View Admin Page
module.exports.viewAdminPage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }
        let allAdmin = await Admin.find();
        allAdmin = allAdmin.filter((subadmin) => subadmin.email != admin.email);

        return res.render('admin/viewAdminPage', { allAdmin, admin },);
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/viewAdminPage');
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
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }
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

    console.log("EDITING ADMIN ID:", req.params.id);
    console.log("LOGGED ADMIN ID:", req.cookies.adminId);

    try {
        const admin = await Admin.findById(req.cookies.adminId);

        if (req.cookies.adminId == undefined && !admin) {
            return res.redirect('/');
        }
        console.log(req.params);

        const singleAdmin = await Admin.findById(req.params.id);

        return res.render('admin/editAdminPage', { singleAdmin, admin });

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/editAdminPage');
    }
}

// Update Admin
module.exports.updateAdmin = async (req, res) => {
    try {
        const adminId = req.cookies.adminId;


        if (req.file) {
            req.body.profileimg = req.file.path;

            console.log(req.body.profileimg)

            const updatedData = await Admin.findByIdAndUpdate(req.params.id, req.body);

            console.log(updatedData);

            if (updatedData) {
                fs.unlink(updatedData.profileimg, () => { });
                console.log("Admin Updated Successfully...");
            } else {
                console.log("Admin Updation Failed...");
            }
        } else {
            const updatedData = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (updatedData) {
                console.log("Admin Updated Successfully...");
            } else {
                console.log("Admin Updation Failed...");
            }
        }

        if (adminId != req.params.id) {
            return res.redirect('/viewAdminPage');
        }
        return res.redirect('/profile');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/viewAdminPage');
    }
}