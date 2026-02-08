const Category = require("../model/category.model");
const SubCategory = require("../model/subcategory.model");
const fs = require('fs');

module.exports.addSubCategoryPage = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.render('subcategory/addSubCategoryPage', { categories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/addSubCategoryPage');
    }
}

module.exports.addSubCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.subcategory_image = req.file.path;
        }

        const newSubCategory = await SubCategory.create(req.body);

        if (newSubCategory) {
            req.flash('success', 'SubCategory Inserted Successfully..');
        } else {
            req.flash('error', 'SubCategory Insertion Failed..');
        }
        return res.redirect('/subcategory/addSubCategoryPage');

    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/addSubCategoryPage');
    }
}

module.exports.viewSubCategoryPage = async (req, res) => {
    try {
        const allSubCategory = await SubCategory.find().populate('category_id', "category_name category_image");

        return res.render("subcategory/viewSubCategoryPage", { allSubCategory });

    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/subcategory/addSubCategoryPage');
    }
}