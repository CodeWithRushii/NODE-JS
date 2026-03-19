const AdminAuthService = require("../../../services/auth/admin/admin.service");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response");
const { sendOTPMail, sendRegisterAdminMail } = require("../../../utils/mailer");

const moment = require('moment');
const bcrypt = require('bcrypt');
const statusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');

const adminAuthService = new AdminAuthService();

module.exports.registerAdmin = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        console.log(req.file.path);

        const admin = await adminAuthService.fetchSingleAdmin({ email: req.body.email, isDelete: false, isActive: true }, true);

        if (admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_ALREADY_EXISTS));
        }

        const password = req.body.password;

        req.body.password = await bcrypt.hash(req.body.password, 11);

        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss A');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');

        req.body.profile_image = req.file.path;

        const newAdmin = await adminAuthService.registerAdmin(req.body);

        if (!newAdmin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_REGISTRATION_FAILED));
        }

        await sendRegisterAdminMail(req.body.email, password);

        return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.loginAdmin = async (req, res) => {
    try {
        console.log(req.body);

        const admin = await adminAuthService.fetchSingleAdmin({ email: req.body.email, isDelete: false, isActive: true }, false);

        console.log(admin);

        if (!admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_NOT_FOUND));
        }

        const isPassword = await bcrypt.compare(req.body.password, admin.password);

        if (!isPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_LOGIN_FAILED));
        }

        // JWT Token
        const payload = {
            id: admin.id,
            isAdmin: true,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        console.log(token);

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_LOGIN_SUCCESS, { token }));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const admin = await adminAuthService.fetchSingleAdmin({ email: req.body.email, isDelete: false, isActive: true }, false);

        if (!admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_NOT_FOUND));
        }

        if (admin.attempt_expire < Date.now()) { // 11:17 < 09:00
            admin.attempt = 0;
        }

        if (admin.attempt >= 3) { // 3 >= 3
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.MANY_TIME_OTP));
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);

        await sendOTPMail(req.body.email, OTP);

        admin.attempt++; // attempt = 3

        const expireOTPTime = new Date(Date.now() + 1000 * 60 * 2); //09:30 = 09:32

        await adminAuthService.updateAdmin(admin.id, { OTP: OTP, OTP_Expire: expireOTPTime, attempt: admin.attempt, attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.OTP_SEND));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.verifyOTP = async (req, res) => {
    try {
        console.log(req.body);

        const admin = await adminAuthService.fetchSingleAdmin({ email: req.body.email, isDelete: false, isActive: true }, false);

        if (!admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_NOT_FOUND));
        }

        if (admin.verify_attempt_expire < Date.now()) { // 11:17 < 09:00
            admin.verify_attempt = 0;
        }

        if (admin.verify_attempt >= 3) { // 3 >= 3
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.MANY_TIME_OTP));
        }

        if (admin.OTP_Expire < Date.now()) { // 09:50 < 09:48
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.OTP_EXPIRED));
        }

        admin.verify_attempt++;

        await adminAuthService.updateAdmin(admin.id, { verify_attempt: admin.verify_attempt, verify_attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });


        if (req.body.OTP !== admin.OTP) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.INVALID_OTP));
        }

        await adminAuthService.updateAdmin(admin.id, { OTP: 0, OTP_Expire: null, verify_attempt: admin.verify_attempt, verify_attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.VERIFY_OTP));




    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.newPassword = async (req, res) => {
    try {
        console.log(req.body);

        const admin = await adminAuthService.fetchSingleAdmin({ email: req.body.email, isDelete: false, isActive: true }, true);

        req.body.new_password = await bcrypt.hash(req.body.new_password, 11);

        const updatedPassword = await adminAuthService.updateAdmin(admin._id, { password: req.body.new_password });

        if (!updatedPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_PASSWORD_UPDATE_FAILED));
        }

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_PASSWORD_UPDATED));


    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.fetchAllAdmin = async (req, res) => {
    try {

        console.log("Admin : ", req.admin);
        console.log("User : ", req.user);

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }

        const allAdmin = await adminAuthService.fetchAllAdmin();

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_FETCH_SUCCESS, allAdmin));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.deleteAdmin = async (req, res) => {
    try {

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }
        console.log(req.query);

        const admin = await adminAuthService.fetchSingleAdmin({ _id: req.query.id, isDelete: false, isActive: true }, true);

        if (!admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_NOT_FOUND));
        }

        const deletedAdmin = await adminAuthService.updateAdmin(req.query.id, { isDelete: true, isActive: false });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_DELETE_SUCCESS, deletedAdmin));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.updateAdmin = async (req, res) => {
    try {

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }
        console.log(req.params);
        console.log(req.body);

        const admin = await adminAuthService.fetchSingleAdmin({ _id: req.params.id, isDelete: false, isActive: true }, true);

        if (!admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_NOT_FOUND));
        }

        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');

        const updatedAmdin = await adminAuthService.updateAdmin(req.params.id, req.body);

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_UPDATE_SUCCESS, updatedAmdin));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.activeOrInActiveAdmin = async (req, res) => {
    try {

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }
        console.log(req.query);

        const admin = await adminAuthService.fetchSingleAdmin({ _id: req.query.id, isDelete: false }, true);

        if (!admin) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_NOT_FOUND));
        }

        const updatedAdmin = await adminAuthService.updateAdmin(req.query.id, { isActive: !admin.isActive, update_at: moment().format('DD/MM/YYYY, h:mm:ss A') });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, `${admin.first_name} ${admin.last_name} is ${updatedAdmin.isActive ? 'active' : 'inactive'}`));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.adminProfile = async (req, res) => {
    try {
        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_PROFILE_FETCH_SUCCESS, req.admin));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.changePassword = async (req, res) => {
    try {
        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }

        const admin = await adminAuthService.fetchSingleAdmin({ _id: req.admin.id }, false);

        const isPassword = await bcrypt.compare(req.body.current_password, admin.password);

        if (!isPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.CHANGE_PASSWORD_FAILED));
        }

        req.body.new_password = await bcrypt.hash(req.body.new_password, 11);

        await adminAuthService.updateAdmin(req.admin.id, { password: req.body.new_password });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.CHANGE_PASSWORD));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}