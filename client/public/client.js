document.addEventListener("DOMContentLoaded", function () {
    const insertButton = document.getElementById("insertButton");
    const executeButton = document.getElementById("executeButton");
    const queryInput = document.getElementById("queryInput");
    const responseDiv = document.getElementById("response");

    // Function to make an HTTP request
    function sendRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(null, JSON.parse(xhr.responseText));
            } else {
                callback(new Error("Request failed"));
            }
        };
        xhr.send(JSON.stringify(data));
    }

    // Insert rows into the database
    insertButton.addEventListener("click", function () {
        sendRequest("POST", "http://localhost:3000/api/v1/sql/insert", {}, function (error, response) {
            if (error) {
                responseDiv.innerHTML = "Error: " + error.message;
            } else {
                responseDiv.innerHTML = "Rows inserted: " + response.insertedRows;
            }
        });
    });

    // Execute SQL query
    executeButton.addEventListener("click", function () {
        const sqlQuery = queryInput.value;
        const method = sqlQuery.trim().toLowerCase().startsWith("select") ? "GET" : "POST";
        const url = "http://localhost:3000/api/v1/sql/" + encodeURIComponent(sqlQuery);

        sendRequest(method, url, {}, function (error, response) {
            if (error) {
                responseDiv.innerHTML = "Error: " + error.message;
            } else {
                responseDiv.innerHTML = JSON.stringify(response, null, 2);
            }
        });
    });
});