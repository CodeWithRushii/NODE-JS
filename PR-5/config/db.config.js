const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/PerfumeManagement")
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

module.exports = mongoose;
