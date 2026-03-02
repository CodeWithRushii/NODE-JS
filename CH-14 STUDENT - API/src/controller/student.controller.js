const student = require('../model/student.model');

module.exports.addStudent = async (req, res) => {
    try {
        const data = await student.create(req.body);
        return res.status(200).json({
            error: false,
            message: "Student Added Successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            details: err.message
        });
    }
}

module.exports.fetchStudent = async (req, res) => {
    try {
        const data = await student.find();
        return res.status(200).json({
            error: false,
            message: "All students",
            data: data
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            details: err.message
        });
    }
}

module.exports.deleteStudent = async (req, res) => {
    try {
        const data = await student.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            error: false,
            message: "Student Deleted Successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            details: err.message
        });
    }
}

module.exports.updateStudent = async (req, res) => {
    try {
        const data = await student.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({
            error: false,
            message: "Student Updated Successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            details: err.message
        });
    }
}

module.exports.singleStudent = async (req, res) => {
    try {
        const data = await student.findById(req.params.id);
        return res.status(200).json({
            error: false,
            message: "Single Student",
            data: data
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            details: err.message
        });
    }
}