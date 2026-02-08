const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    subcategory_name: {
        type: String,
        required: true
    },
    // Populate
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

module.exports = mongoose.model('SubCategory', subCategorySchema, 'SubCategory');