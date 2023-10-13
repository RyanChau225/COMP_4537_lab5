document.addEventListener("DOMContentLoaded", function () {
    const executeButton = document.getElementById("executeButton");
    const queryInput = document.getElementById("queryInput");
    const insertResponseDiv = document.getElementById("insertResponse");
    const queryResponseDiv = document.getElementById("queryResponse");

    // Function to make an HTTP request
    function sendRequest(method, url, data, callback, responseDiv) {
        console.log("MY DATA" + data);
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


    // Execute SQL query
    executeButton.addEventListener("click", function () {
        const sqlQuery = queryInput.value;

        // Remove the parentheses and split by comma
        const parts = sqlQuery.replace(/[()]/g, "").split(",");

        if (parts.length === 2) {
            const name = parts[0].trim();
            const age = parseInt(parts[1].trim());

            if (name && !isNaN(age)) {
                const method = "POST";
                const url = "http://localhost:5000/api/v1/sql/insert";
                console.log("METHOD: " + method);

                const data = {
                    name: name,
                    age: age
                };

                console.log("DATA" + data)

                sendRequest(method, url, data, function (error, response, responseDiv) {
                    if (error) {
                        responseDiv.innerHTML = "Error: " + error.message;
                    } else {
                        responseDiv.innerHTML = JSON.stringify(response, null, 2);
                    }
                }, queryResponseDiv);
            } else {
                queryResponseDiv.innerHTML = "Invalid 'name' or 'age' values. Make sure 'name' is not empty, and 'age' is a valid number.";
            }
        } else {
            queryResponseDiv.innerHTML = "Invalid format. Use (\"name\", age)";
        }
    });


});