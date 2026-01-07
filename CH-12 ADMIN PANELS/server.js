const express = require('express');
const path = require('path');
require('./config/db.config');

const app = express();

const PORT = 8090;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/', require('./routes/'));

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not started...", err);
        return;
    }
    console.log("Server is started on port", PORT);
});