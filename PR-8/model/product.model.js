const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    // Populate
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    extra_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraCategory",
        required: true
    },
    old_price: {
        type: Number,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema, 'Product');