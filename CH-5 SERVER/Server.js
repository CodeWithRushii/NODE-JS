const http = require('http');

const server = http.createServer((req, res) => {
    res.write("<h1>Hello World</h1>");
    res.end();
});

server.listen(3000, (err) => {
    if (err) {
        console.error('Server is not running', err);
        return false;
    }
    console.log('Server is running ');
});