const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database Is Connected");
}).catch((err) => {
    console.log("Error", err);
});