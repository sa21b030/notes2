const http = require('http');
const {router} = require('./routes.js');

const server = http.createServer(router);

const port = 8080;
const host = '127.0.0.1';
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});