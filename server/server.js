const http = require('http');
const url = require('url');
const mysql = require('mysql2');
const server = http.createServer(handleRequest);

const dbConfig = {
    host: 'localhost',
    user: 'root', // Change to your MySQL username
    password: 'password', // Change to your MySQL password
    database: 'patientsdb',
};

const pool = mysql.createPool(dbConfig);

async function handleRequest(req, res) {
    const {
        pathname,
        query
    } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'text/plain');

    if (pathname === '/insert') {
        // Handle the INSERT operation here
        // You can write your SQL INSERT code and execute it using the MySQL pool.
        // Be cautious of SQL injection. You should properly escape input values.
        // Send a success response or error response back to the client.

    } else if (pathname === '/execute') {
        // Handle SELECT or other query operations here
        // You can write your SQL SELECT code and execute it using the MySQL pool.
        // Send the results back to the client.
        try {
            const result = await executeQuery(query.query);
            res.end(result);
        } catch (error) {
            res.end(`Error: ${error.message}`);
        }
    } else {
        res.end('Invalid URL');
    }
}

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.stringify(results));
            }
        });
    });
}

server.listen(8080, () => {
    console.log('API Server is running on port 8080');
});