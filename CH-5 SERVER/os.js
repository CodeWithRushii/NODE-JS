const os = require('os');

os.cpus().length; 

console.log(`Number of CPU cores: ${os.cpus().length}`);