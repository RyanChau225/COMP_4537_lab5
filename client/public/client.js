document.addEventListener("DOMContentLoaded", function () {
    const insertButton = document.getElementById("insertButton");
    const executeButton = document.getElementById("executeButton");
    const queryInput = document.getElementById("queryInput");
    const insertResponseDiv = document.getElementById("insertResponse");
    const queryResponseDiv = document.getElementById("queryResponse");

    // Function to make an HTTP request
    function sendRequest(method, url, data, callback, responseDiv) {
        console.log(url);
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(null, JSON.parse(xhr.responseText), responseDiv);
            } else {
                callback(new Error("Request failed"), null, responseDiv);
            }
        };
        xhr.send(JSON.stringify(data));
    }

    // Insert rows into the database
    insertButton.addEventListener("click", function () {
        sendRequest("POST", "http://localhost:5000/api/v1/sql/insert", {}, function (error, response, responseDiv) {
            if (error) {
                responseDiv.innerHTML = "Error: " + error.message;
            } else {
                responseDiv.innerHTML = "Rows inserted: " + response.insertedRows;
            }
        }, insertResponseDiv);
    });

    // Execute SQL query
    executeButton.addEventListener("click", function () {
        const sqlQuery = queryInput.value;
        const method = sqlQuery.trim().toLowerCase().startsWith("select") ? "GET" : "POST";
        const url = "http://localhost:5000/api/v1/sql?query=" + encodeURIComponent(sqlQuery);
        console.log(url);

        sendRequest(method, url, {}, function (error, response, responseDiv) {
            if (error) {
                responseDiv.innerHTML = "Error: " + error.message;
            } else {
                responseDiv.innerHTML = JSON.stringify(response, null, 2);
            }
        }, queryResponseDiv);
    });
});