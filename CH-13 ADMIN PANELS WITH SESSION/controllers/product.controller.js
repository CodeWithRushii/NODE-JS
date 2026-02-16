const categoryModel = require('../model/category.model');
const subCategoryModel = require('../model/subcategory.model');
const extraCategoryModel = require('../model/extracategory.model');
const Product = require('../model/product.model');
const fs = require('fs');

module.exports.addProductPage = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        const subcategories = await subCategoryModel.find();
        const extracategories = await extraCategoryModel.find();

        return res.render('product/addProductPage', { categories, subcategories, extracategories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/product/addProductPage');
    }
}

module.exports.addProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }
        console.log("req.file =>", req.file);


        console.log("Product data being saved:", req.body);

        const newProduct = await Product.create(req.body);

        if (newProduct) {
            req.flash('success', 'Product Inserted Successfully..');
        } else {
            req.flash('error', 'Product Insertion Failed..');
        }
        return res.redirect('/product/addProductPage');

    } catch (err) {
        console.log("Error in addProduct : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/product/addProductPage');
    }
}

module.exports.viewProductPage = async (req, res) => {
    try {
        const allProduct = await Product.find()
            .populate('category_id', "category_name category_image")
            .populate('subcategory_id', "subcategory_name subcategory_image")
            .populate('extra_category_id', "extra_category_name");

        return res.render("product/viewProductPage", { allProduct });

    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/product/addProductPage');
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.query.Id);

        if (deleted && deleted.image) {
            fs.unlink(deleted.image, () => { });
        }
        req.flash('success', `${deleted.product_name} Deleted Successfully..`);
        return res.redirect('/product/viewProductPage');
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/product/viewProductPage');
    }
}

module.exports.editProductPage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.Id);
        const categories = await categoryModel.find();
        const subcategories = await subCategoryModel.find();
        const extracategories = await extraCategoryModel.find();

        return res.render('product/editProductPage', { product, categories, subcategories, extracategories });
    } catch (err) {
        console.log("Error : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/product/viewProductPage');
    }
}

module.exports.editProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }

        console.log("Product data being updated:", req.body);
        const updated = await Product.findByIdAndUpdate(req.params.Id, req.body);

        if (updated) {
            req.flash('success', 'Product Updated Successfully..');
        } else {
            req.flash('error', 'Product Updation Failed..');
        }
        return res.redirect('/product/viewProductPage');

    } catch (err) {
        console.log("Error in editProduct : ", err);
        req.flash('error', "Something went wrong !!");
        return res.redirect('/product/viewProductPage');
    }
}