const mongoose = require('mongoose');

const extraCategorySchema = mongoose.Schema({
    extra_category_name: {
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
    }
});

module.exports = mongoose.model('ExtraCategory', extraCategorySchema, 'ExtraCategory');