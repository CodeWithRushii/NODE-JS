const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');

const route = express.Router();

route.use('/auth', require('./auth/auth.route'));

// Auth Middleware
route.use(authMiddleware);

route.use('/admin', require('./auth/admin/admin.route'));
route.use('/user', require('./auth/user/user.route'));
route.use('/category', require('./category/category.route'));

module.exports = route;