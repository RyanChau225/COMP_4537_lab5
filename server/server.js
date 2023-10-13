const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise'); // Use 'mysql2/promise' for asynchronous database operations
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3000;
const database = require("./MySQLdatabaseconnection.js");

async function createPool() {

    // Create the 'patients' table if it doesn't exist
    await database.query(`
        CREATE TABLE IF NOT EXISTS patients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INT NOT NULL
        ) ENGINE=InnoDB;
    `);
}

createPool();

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.url === '/') {
        // Serve the HTML file
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                res.end('File not found');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            }
        });
    } else if (parsedUrl.pathname === '/insert') {
        // Handle the INSERT operation
        insertPatientsData()
            .then(() => {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Data inserted successfully.');
            })
            .catch((error) => {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end(`Error: ${error.message}`);
            });
    } else if (parsedUrl.pathname === '/execute') {
        // Handle SELECT or other query operations
        const query = req.method === 'POST' ? parsedUrl.query.query : parsedUrl.query;
        executeQuery(query)
            .then((results) => {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(results));
            })
            .catch((error) => {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end(`Error: ${error.message}`);
            });
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });
        res.end('Invalid URL');
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});