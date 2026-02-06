const express = require('express');
const passport = require('passport');
const upload = require('../Middleware/category.middleware.js');

const { addCategoryPage, insertCategory } = require('../controllers/catagory.controller.js');

const route = express.Router();
// Add Category Page
route.get('/addCategoryPage', addCategoryPage);

// Insert Category
route.post('/addCategory', upload.single('category_image'), insertCategory);

module.exports = route;