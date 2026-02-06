const Category = require('../model/catagory.model');
const fs = require('fs');

// Add Category Page
module.exports.addCategoryPage = async (req, res) => {
    try {
        return res.render('catagory/addCategory');
    } catch (err) {
        console.log("Add Category Page Error:", err);
        return res.redirect('/dashboard');
    }
};

// Insert Category
module.exports.insertCategory = async (req, res) => {
    try {
        req.body.category_image = req.file.path;
        await Category.create(req.body);
        req.flash('success', "Category Inserted Successfully..");
        return res.redirect('/category/addCategoryPage');
    } catch (err) {
        console.log("Insert Category Error:", err);
        req.flash('error', "Category Insertion Failed..");
        return res.redirect('/category/addCategoryPage');
    }
};