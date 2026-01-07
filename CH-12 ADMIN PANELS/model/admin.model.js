const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    firstname: String,
    lname: String,
    email: String,
    password: String,
    contact: String,
    gender: String,
    hobby: Array,
    city: String,
    about: String,
    profileimg: String
});

module.exports = mongoose.model('Admin', adminSchema, 'Admin');