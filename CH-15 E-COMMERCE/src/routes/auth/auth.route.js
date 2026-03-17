const express = require('express');

const authRoute = express.Router();

authRoute.use('/admin', require('./admin/admin.route'));
authRoute.use('/user', require('./user/user.route'));

module.exports = authRoute;