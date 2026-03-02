const express = require('express');
const { addStudent, fetchStudent, deleteStudent, updateStudent, singleStudent } = require('../controller/student.controller');
const studentroute = express.Router();

studentroute.post('/', addStudent);
studentroute.get('/', fetchStudent);
studentroute.delete('/:id', deleteStudent);
studentroute.patch('/:id', updateStudent);
studentroute.get('/:id', singleStudent);


module.exports = studentroute;