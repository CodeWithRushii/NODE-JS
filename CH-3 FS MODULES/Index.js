const fs = require('fs');

// Write
// Synchronous
fs.writeFileSync('Userlog.txt', 'Hello, World!\n');

//asynchronous
fs.writeFile('Userlog.txt', 'Hello, World!\n', (err) => {
    if (err) {
        console.log(err);
    }
});


// Read 
// Synchronous
const data = fs.readFileSync('Userlog.txt', 'utf8');
console.log('File content:', data);

// Asynchronous 
const readData = fs.readFile('Userlog.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('File content:', data);
    }
});
console.log('file content:', readData);


// Append 
// Synchronous
fs.appendFileSync('Userlog.txt', '\n' + new Date().toLocaleString());

// Asynchronous
fs.appendFile('Userlog.txt', '\n' + new Date().toLocaleString(), (err) => {
    if (err) {
        console.log(err);
    }
});

