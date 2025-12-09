const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    fs.readFile('index.html', (err, reselt) => {
        res.end(reselt);
    });
});
app.get('/about', (req, res) => {
    fs.readFile('about.html', (err, reselt) => {
        res.end(reselt);
    });
});
app.get('/contact', (req, res) => {
    fs.readFile('contact.html', (err, reselt) => {
        res.end(reselt);
    });
});

app.get('/services', (req, res) => {
    fs.readFile('services.html', (err, reselt) => {
        res.end(reselt);
    });
});

app.listen(9080, (err) => {
    if (err) {
        console.log("Error in starting server:", err);
        return false;
    }
    console.log("Server is running ...");
});