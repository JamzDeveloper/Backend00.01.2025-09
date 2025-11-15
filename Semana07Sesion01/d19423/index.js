var moment = require('moment'); // require); 
require('dotenv').config();
console.log("Hola desde NodeJS")
console.log("Ahora desde nodemon")
console.log(`Esta es la fecha ${moment().format("ddd, hA")}`)
console.log(`Este es el puerto donde voy a trabajar ${process.env.PORT}`)


const os = require('os');

// Basic system information
console.log(`OS Platform: ${os.platform()}`);
console.log(`OS Type: ${os.type()}`);
console.log(`OS Release: ${os.release()}`);
console.log(`CPU Architecture: ${os.arch()}`);
console.log(`Hostname: ${os.hostname()}`);

// Memory information
const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
console.log(`Memory: ${freeMemGB}GB free of ${totalMemGB}GB`);

// User information
const userInfo = os.userInfo();
console.log(`Current User: ${userInfo.username}`);
console.log(`Home Directory: ${os.homedir()}`);

// server.mjs
const { createServer } = require('node:http');
const PORT = process.env.PORT || 8080
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hola desde NodeJS!\n');
});

// starts a simple http server locally on port 3000
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening on 127.0.0.1:${PORT}`);
});

// run with `node server.mjs`
