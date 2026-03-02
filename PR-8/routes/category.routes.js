const express = require('express');
const passport = require('passport');
const upload = require('../Middleware/category.middleware.js');

const { addCategoryPage, insertCategory, viewCategoryPage, deleteCategory, editCategoryPage, updateCategory } = require('../controllers/category.controller.js');


const route = express.Router();
// Add Category Page
route.get('/addCategoryPage', addCategoryPage);

// Insert Category
route.post('/addCategory', upload.single('category_image'), insertCategory);

// View Category Page
route.get('/viewCategoryPage', viewCategoryPage);

// Delete Category
route.get('/deleteCategory', deleteCategory);

// Edit Category Page
route.get('/editCategory/:categoryId', editCategoryPage);

// Update Category
route.post('/editCategory/:categoryId', upload.single('category_image'), updateCategory);


module.exports = route;
