const Category = require('../model/category.model');
const fs = require('fs');

// Add Category Page
module.exports.addCategoryPage = async (req, res) => {
    try {
        return res.render('category/addCategory');
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

// View Category Page
module.exports.viewCategoryPage = async (req, res) => {
    try {
        const allCategory = await Category.find();
        return res.render('category/viewCategory', { allCategory });
    } catch (err) {
        console.log("View Category Error:", err);
        return res.redirect('/dashboard');
    }
};

// Delete Category
module.exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.query.Id);

        if (deleted && deleted.category_image) {
            fs.unlink(deleted.category_image, () => { });
        }
        req.flash('success', `${deleted.category_name} Deleted Successfully..`);
        return res.redirect('/category/viewCategoryPage');
    } catch (err) {
        console.log("Delete Category Error:", err);
        req.flash('error', "Category Deletion Failed..");
        return res.redirect('/category/viewCategoryPage');
    }
};

// Edit Category Page
module.exports.editCategoryPage = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            req.flash('error', "Category Not Found..");
            return res.redirect('/category/viewCategoryPage');
        }
        return res.render('category/editCategory', { category });
    } catch (err) {
        console.log("Edit Category Page Error:", err);
        return res.redirect('/category/viewCategoryPage');
    }
};

// Update Category
module.exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            req.flash('error', "Category Not Found..");
            return res.redirect('/category/viewCategoryPage');
        }

        if (req.file) {
            req.body.category_image = req.file.path;
            if (category.category_image) {
                fs.unlink(category.category_image, () => { });
            }
        }

        await Category.findByIdAndUpdate(req.params.categoryId, req.body);
        req.flash('success', "Category Updated Successfully..");
        return res.redirect('/category/viewCategoryPage');
    } catch (err) {
        console.log("Update Category Error:", err);
        req.flash('error', "Category Update Failed..");
        return res.redirect('/category/viewCategoryPage');
    }
};