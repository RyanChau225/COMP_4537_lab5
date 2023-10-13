const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    // Serve static files from the "public" directory
    if (req.method === 'GET' && req.url === '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        const readStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', 'text/html');
        readStream.pipe(res);
    } else if (req.method === 'GET' && req.url === '/client.js') {
        const filePath = path.join(__dirname, 'public', 'client.js');
        const readStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', 'application/javascript');
        readStream.pipe(res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});