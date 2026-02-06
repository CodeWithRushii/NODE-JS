const mongoose = require('mongoose');

const catagorySchema = mongoose.Schema({
    category_name: String,
    category_image: String
});

module.exports = mongoose.model('Catagory', catagorySchema, 'Catagory')