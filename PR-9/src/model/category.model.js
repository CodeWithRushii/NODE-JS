const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category_name: String,
    category_image: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    create_at: String,
    update_at: String,
});

module.exports = mongoose.model('Category', categorySchema, 'Category');