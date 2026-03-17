const UserAuthService = require("../../../services/auth/user/user.service");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response");
const { sendOTPMail } = require("../../../utils/mailer");

const moment = require('moment');
const bcrypt = require('bcrypt');
const statusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');

const userAuthService = new UserAuthService();

module.exports.registerUser = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email, isDelete: false, isActive: true }, true);

        if (user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_ALREADY_EXISTS));
        }

        req.body.password = await bcrypt.hash(req.body.password, 11);

        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss A');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');

        const newUser = await userAuthService.registerUser(req.body);

        if (!newUser) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_REGISTER_FAILED));
        }

        return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, MSG.USER_REGISTER_SUCCESS, newUser));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email, isDelete: false, isActive: true }, false);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_LOGIN_FAILED));
        }

        // JWT Token
        const payload = {
            id: user.id,
            isAdmin: false
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });


        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_LOGIN_SUCCESS, { token }));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const user = await userAuthService.fetchSingleUser({ email: req.body.email, isDelete: false, isActive: true }, false);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        if (user.attempt_expire < Date.now()) { // 11:17 < 09:00
            user.attempt = 0;
        }

        if (user.attempt >= 3) { // 3 >= 3
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.MANY_TIME_OTP));
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);

        await sendOTPMail(req.body.email, OTP);

        user.attempt++; // attempt = 3

        const expireOTPTime = new Date(Date.now() + 1000 * 60 * 2); //09:30 = 09:32

        await userAuthService.updateUser(user.id, { OTP: OTP, OTP_Expire: expireOTPTime, attempt: user.attempt, attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.OTP_SEND));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.verifyOTP = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email, isDelete: false, isActive: true }, false);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        if (user.verify_attempt_expire < Date.now()) { // 11:17 < 09:00
            user.verify_attempt = 0;
        }

        if (user.verify_attempt >= 3) { // 3 >= 3
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.MANY_TIME_OTP));
        }

        if (user.OTP_Expire < Date.now()) { // 09:50 < 09:48
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.OTP_EXPIRED));
        }

        user.verify_attempt++;

        await userAuthService.updateUser(user.id, { verify_attempt: user.verify_attempt, verify_attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });


        if (req.body.OTP !== user.OTP) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.INVALID_OTP));
        }

        await userAuthService.updateUser(user.id, { OTP: 0, OTP_Expire: null, verify_attempt: user.verify_attempt, verify_attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.VERIFY_OTP));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

    }
}

module.exports.newPassword = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email, isDelete: false, isActive: true }, true);

        console.log(user);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        req.body.new_password = await bcrypt.hash(req.body.new_password, 11);

        const updatedPassword = await userAuthService.updateUser(user.id, { password: req.body.new_password });

        if (!updatedPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_PASSWORD_UPDATE_FAILED));
        }

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_PASSWORD_UPDATED));


    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.fetchAllUser = async (req, res) => {
    try {
        console.log(req.admin);
        console.log(req.user);

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }

        const allUsers = await userAuthService.fetchAllUser();

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_FETCH_SUCCESS, allUsers));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.deleteUser = async (req, res) => {
    try {

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }
        console.log(req.query);

        const user = await userAuthService.fetchSingleUser({ _id: req.query.id, isDelete: false, isActive: true }, true);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        const deletedUser = await userAuthService.updateUser(req.query.id, { isDelete: true, isActive: false });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_DELETE_SUCCESS, deletedUser));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.updateUser = async (req, res) => {
    try {

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }
        console.log(req.query);
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ _id: req.query.id, isDelete: false, isActive: true }, true);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');
        const updatedUser = await userAuthService.updateUser(req.query.id, req.body);

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_UPDATE_SUCCESS, updatedUser));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.activeOrInActiveUser = async (req, res) => {
    try {

        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }
        console.log(req.query);

        const user = await userAuthService.fetchSingleUser({ _id: req.query.id, isDelete: false }, true);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        const updatedUser = await userAuthService.updateUser(req.query.id, { isActive: !user.isActive, update_at: moment().format('DD/MM/YYYY, h:mm:ss A') });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, `${user.first_name} ${user.last_name} is ${updatedUser.isActive ? 'active' : 'inactive'}`));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.userProfile = async (req, res) => {
    try {
        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_PROFILE_FETCH_SUCCESS, req.user));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.changePassword = async (req, res) => {
    try {

        const user = await userAuthService.fetchSingleUser({ _id: req.user.id }, false);

        const isPassword = await bcrypt.compare(req.body.current_password, user.password);

        if (!isPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.CHANGE_PASSWORD_FAILED));
        }

        req.body.new_password = await bcrypt.hash(req.body.new_password, 11);

        await userAuthService.updateUser(req.user.id, { password: req.body.new_password });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.CHANGE_PASSWORD));
    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}