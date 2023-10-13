const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDirectory = 'public'; 

const server = http.createServer((req, res) => {
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const fileExtension = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    } [fileExtension] || 'text/plain';

    fs.readFile(path.join(__dirname, publicDirectory, filePath), (err, data) => {
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end('Not Found');
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});