const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        return;
    }

    let fileName = "";

    switch (req.url) {
        case '/':
            fileName = "index.html"
            break;
        case '/about':
            fileName = "about.html"
            break;
        case '/contact':
            fileName = "contact.html"
            break;
        case '/services':
            fileName = "services.html"
            break;  

        default:
            fileName = "404.html"
            break;
    }

    fs.readFile(fileName, (err, result) => {
        if (err) {
            console.log(err);

        }
        res.end(result);
    })

})

server.listen(8000, (err) => {
    if (err) {
        console.log("server is not start... some error....", err);
        return false;
    }
    console.log("server is started successfully......");

});