const express = require("express");
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const app = express();

app.set('view engine', 'ejs');

console.log(__dirname);

// Middleware
const middleware = (req, res, next) => {
    console.log("Middleware 2");
    console.log(req.ip);

    next();
}
// Log Middleware
app.use((req, res, next) => {
    console.log("Middleware 1");

    fs.appendFile('./log.txt', `\n${Date()} PATH : ${req.path} IP ADDRESS : ${req.ip}`, (err) => {
        next();
    });
});

app.get('/404', (req, res) => {
    return res.render('404.ejs');
})

app.use(middleware);

app.get('/', (req, res) => {
    return res.render('home');
});

app.get('/about', (req, res) => {
    return res.render('about');
});

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server not started...", err);
        return false;
    }
    console.log("Server Started...😁");
})