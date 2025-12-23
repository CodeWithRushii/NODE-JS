const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    ProductBrand: {
        type: String,
        required: true
    },
    ProductPrice: {
        type: Number,
        required: true,
    },
    ProductCategory: {
        type: String,
        required: true
    },
    ProductImage: {
        type: String,
        required: true
    }
});

const Product = mongoose.model("Product", ProductSchema, "Products");

module.exports = Product;
