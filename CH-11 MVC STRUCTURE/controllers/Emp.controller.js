const Employee = require("../models/Emp.Models");

const employeeFormPage = (req, res) => {
    return res.render('EmpFoarm');
}

const errorPage = (req, res) => {
    return res.render('error');
}

// Insert Employee
const addEmp = async (req, res) => {
    console.log(req.body);
    try {
        const addEmp = await Employee.create(req.body);

        if (addEmp) {
            console.log("Employee inserted......");
        } else {
            console.log("Employee not inserted...");
        }

        return res.redirect('/emp/viewEmp');
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return res.redirect('/emp/error');
    }
}

// All Employee
const viewEmp = async (req, res) => {

    try {
        const allEmp = await Employee.find();

        return res.render('EmpView', { allEmp });
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return res.redirect('/emp/error');
    }
}

// Delete Employee
const deleteEmployee = async (req, res) => {

    console.log(req.query);

    try {
        const deletedEmp = await Employee.findByIdAndDelete(req.query.empId);

        if (deletedEmp) {
            console.log("Employee deleted successfully...");
        } else {
            console.log("Employee deletion failed...");
        }

        return res.redirect('/emp/viewEmp');
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return res.redirect('/emp/error');
    }
}

// Edit Page Render
const editEmployeePage = async (req, res) => {
    console.log(req.params);

    try {
        const singleEmp = await Employee.findById(req.params.empId);


        return res.render('EmpEdit', { singleEmp });
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return res.redirect('/emp/error');
    }

}

// Update Employee
const updateEmployee = async (req, res) => {
    console.log(req.body);

    try {
        const updateEmp = await Employee.findByIdAndUpdate(req.body.emp_id, req.body, { new: true });

        if (updateEmp) {
            console.log("Employee updated successfully...");
        } else {
            console.log("Employee updation failed...");
        }

        return res.redirect('/emp/viewEmp');
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return res.redirect('/emp/error');
    }
}


module.exports = {
    employeeFormPage,
    addEmp,
    viewEmp,
    deleteEmployee,
    editEmployeePage,
    updateEmployee,
    errorPage
}