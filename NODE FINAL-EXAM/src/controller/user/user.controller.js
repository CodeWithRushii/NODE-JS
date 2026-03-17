const { msg } = require("../../utils/msg");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const statusCode = require('http-status-codes');
const { successResponse, errorResponse } = require('../../utils/response');
const UserAuthService = require('../../services/user.service');

const userAuthService = new UserAuthService();

module.exports.registerUser = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 14);

        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss A');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');

        const newUser = await userAuthService.registerUser(req.body);

        if (!newUser) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, msg.USER_REGISTER_FAILED));
        }

        return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, msg.USER_REGISTER_SUCCESS, newUser));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, msg.SERVER_ERROR));
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email, isDelete: false, isActive: true }, false);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, msg.USER_NOT_FOUND));
        }

        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, msg.USER_LOGIN_FAILED));
        }

        // JWT Token
        const payload = {
            id: user.id,
            isAdmin: false
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });


        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, msg.USER_LOGIN_SUCCESS, { token }));

    } catch (err) {
        console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, msg.SERVER_ERROR));

    }
}