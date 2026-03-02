const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category_name: String,
    category_image: String
});

module.exports = mongoose.model('Category', categorySchema, 'Category')