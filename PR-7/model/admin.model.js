const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    gender: { type: String, required: true },
    hobby: { type: Array, required: true },
    city: { type: String, required: true },
    about: { type: String, required: true },
    profileimg: { type: String, required: true },
});

module.exports = mongoose.model('Admin', adminSchema, 'Admin');