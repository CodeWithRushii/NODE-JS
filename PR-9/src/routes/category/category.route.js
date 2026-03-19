const express = require('express');
const { addCategory } = require('../../controllers/category/category.controller');

const categoryRoute = express.Router();

categoryRoute.post('/', addCategory);

module.exports = categoryRoute;