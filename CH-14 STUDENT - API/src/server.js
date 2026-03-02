const dotenv = require('dotenv').config();
const express = require('express');
require('./config/student.config');
const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use('/api', require('./routes'));

const PORT = process.env.PORT || 8090;
app.listen(PORT, (err) => {
    if (err) {
        console.log("Errror", err);
        return false;
    }
    console.log(`Server Is Started In This Port ${PORT}`);

});