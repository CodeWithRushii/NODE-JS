const express = require('express');

const route = express.Router();

route.use("/user", require('./user/user.route'));
route.use("/task", require('./task/task.route'));

module.exports = route;