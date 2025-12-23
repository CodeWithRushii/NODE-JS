const express = require('express');

const app = express();
const PORT = 9080;

app.set('view engine', 'ejs');

app.use('/', require('./routes/'));

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not started...", err);
        return;
    }

    console.log("Server is started...");
});