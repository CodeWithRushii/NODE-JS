const fs = require('fs');

console.log(1);

// Blocking / Synchronous
// const data = fs.readFileSync('log.txt', 'utf8');
// console.log('File contents:', data);

// Non-blocking / Asynchronous
fs.readFile('log.txt', 'utf8', ( data) => {
    
    console.log('File contents:', data);
});

console.log(2);