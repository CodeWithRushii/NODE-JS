const statusCode = require('http-status-codes');
const moment = require('moment');
const { errorResponse, successResponse } = require('../../utils/response');
const { MSG } = require('../../utils/msg');
const CategoryService = require('../../services/category/category.service');

const categoryService = new CategoryService();

module.exports.addCategory = async (req, res) => {
    try {
        if (req.user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.UNAUTHORIZED_ACCESS));
        }

        console.log(req.body);

        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss A');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');

        await categoryService.insertNewCategory(req.body);

        return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, MSG.CATEGORY_CREATE_SUCCESS));

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.getAllCategory = (req, res) => {
    try {

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.updateCategory = (req, res) => {
    try {

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

module.exports.deleteCategory = (req, res) => {
    try {

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}