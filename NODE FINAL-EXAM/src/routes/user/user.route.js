const express = require('express');
const { registerUser, loginUser } = require('../../controller/user/user.controller');

const user = express.Router();

user.post("/register", registerUser);
user.post("/login", loginUser);

module.exports = user;