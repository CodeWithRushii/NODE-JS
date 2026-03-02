const express = require('express');
const routes = express.Router();

routes.use('/student', require('./student.route'));

module.exports = routes;