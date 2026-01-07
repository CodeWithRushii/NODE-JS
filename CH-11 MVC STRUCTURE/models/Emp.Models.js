const mongoose = require('mongoose');

const EmpSchema = mongoose.Schema({
    emp_name:{
        type:String,
        required:true
    },
    emp_email:{
        type:String,
        required:true
    },
    emp_password:{
        type:String,
        required:true
    },
    emp_gender:{
        type:String,
        required:true
    },
    emp_salary:{
        type:Number,
        required:true
    },
    emp_hobby:{
        type:Array,
        required:true
    },
    emp_role:{
        type:String,
        required:true
    }
});

const Employee = mongoose.model("Employee", EmpSchema, "Employees");

module.exports = Employee;