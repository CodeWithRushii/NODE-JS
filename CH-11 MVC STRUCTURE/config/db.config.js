const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/Employee_Management";

mongoose.connect(uri)
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));
