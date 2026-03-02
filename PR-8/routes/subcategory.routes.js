const express = require('express');

const { addSubCategoryPage, addSubCategory, viewSubCategoryPage, deleteSubCategory, editSubCategoryPage, updateSubCategory } = require('../controllers/subCategory.controller');

const subCategoryRoute = express.Router();

subCategoryRoute.get('/addSubCategoryPage', addSubCategoryPage);
subCategoryRoute.post('/addSubCategory', addSubCategory);

subCategoryRoute.get('/viewSubCategoryPage', viewSubCategoryPage);

subCategoryRoute.get('/deleteSubCategory', deleteSubCategory);

subCategoryRoute.get('/editSubCategory/:subcategoryId', editSubCategoryPage);
subCategoryRoute.post('/editSubCategory/:subcategoryId', updateSubCategory);

module.exports = subCategoryRoute;