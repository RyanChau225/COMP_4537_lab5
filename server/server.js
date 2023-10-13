const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise'); // Use 'mysql2/promise' for asynchronous database operations
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cors = require("cors"); // Require the 'cors' package


const port = process.env.PORT || 5000;
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




// Create an HTTP server
const server = http.createServer((req, res) => {

    // Use the cors middleware to enable CORS
    cors()(req, res, () => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


        const reqUrl = url.parse(req.url, true);

        if (req.method === "POST" && reqUrl.pathname === "/api/v1/sql/insert") {
            // Handle INSERT operation
            const insertSQL = "INSERT INTO patients (name, age) VALUES (?, ?, )";
            const values = ["Patient Name", 30];

            dbConnection.query(insertSQL, values, (err, results) => {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    res.end("Error inserting rows: " + err.message);
                } else {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        insertedRows: results.affectedRows
                    }));
                }
            });
        } else if (req.method === "GET" && reqUrl.pathname === "/api/v1/sql/") {
            // Handle SELECT operation
            const query = reqUrl.query.query;

            dbConnection.query(query, (err, results) => {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    res.end("Error executing query: " + err.message);
                } else {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify(results));
                }
            });
        } else {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end("Not Found");
        }
    });
});

// Listen on a specific port
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});