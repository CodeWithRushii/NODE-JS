const express = require('express');
const upload = require('../Middleware/category.middleware.js');
const { addSubCategoryPage, addSubCategory, viewSubCategoryPage } = require('../controllers/subCategory.controller');

const subCategoryRoute = express.Router();

subCategoryRoute.get('/addSubCategoryPage', addSubCategoryPage);
subCategoryRoute.post('/addSubCategory', addSubCategory);

subCategoryRoute.get('/viewSubCategoryPage', viewSubCategoryPage);


module.exports = subCategoryRoute;