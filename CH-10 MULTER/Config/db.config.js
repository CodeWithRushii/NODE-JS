const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/BookManagement";

mongoose.connect(uri)
    .then(() => {
        console.log("DB is connected");
    }).catch(err => {
        console.error("DB not connected error:", err);
    }).finally(() => {
        console.log("DB process finished");
    });