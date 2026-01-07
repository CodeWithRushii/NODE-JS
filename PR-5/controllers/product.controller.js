const Product = require('../models/Product.model');
const fs = require('fs');
const path = require('path');

const productFormPage = (req, res) => {
    try {
        res.render('ProductForm');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

// ADD PRODUCT
const addProduct = async (req, res) => {
    try {
        req.body.image = req.file.path;
        await Product.create(req.body);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

// VIEW PRODUCTS
const viewProduct = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.render('ProductView', { allProducts });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.query.id);

        if (deleteProduct && deleteProduct.image) {
            fs.unlink(deleteProduct.image, () => { });
            console.log("Product deleted successfully...");
        } else {
            console.log("Product deletion failed...");
        }

        return res.redirect('/');

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}


// EDIT PRODUCT PAGE
const editProductPage = async (req, res) => {
    console.log(req.params);

    const product = await Product.findById(req.params.id);

    console.log(product);

    if (product) {
        return res.render('ProductEdit', { product });
    } else {
        return res.redirect('/');
    }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);

        if (req.file) {
            req.body.image = req.file.path;


            const updatedproduct = await Product.findByIdAndUpdate(req.params.id, req.body);


            if (updatedproduct) {
                fs.unlink(updatedproduct.image, (err) => { });
                console.log("Product updated successfully...");
            }
            else {
                console.log("Product updation failed...");
            }

        } else {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (updatedProduct) {
                console.log("Product updated successfully...");
            } else {
                console.log("Product updation failed...");
            }
        }

        return res.redirect('/');
    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
}



module.exports = {
    productFormPage,
    addProduct,
    viewProduct,
    deleteProduct,
    editProductPage,
    updateProduct
}