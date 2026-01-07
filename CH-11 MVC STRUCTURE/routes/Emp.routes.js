const express = require('express');

const { employeeFormPage, viewEmp, addEmp, deleteEmployee, editEmployeePage, updateEmployee, errorPage } = require("../controllers/Emp.controller");

const empRoute = express.Router();

empRoute.get('/', employeeFormPage);
empRoute.post('/addEmp', addEmp);
empRoute.get('/viewEmp', viewEmp);

empRoute.get('/deleteEmp', deleteEmployee);

empRoute.get('/editEmp/:empId', editEmployeePage);
empRoute.post('/updateEmp', updateEmployee);

empRoute.get('/error', errorPage);
module.exports = empRoute;