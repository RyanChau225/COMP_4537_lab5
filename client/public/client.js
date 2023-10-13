document.getElementById("insertButton").addEventListener("click", insertData);
document.getElementById("queryButton").addEventListener("click", executeQuery);

function insertData() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/insert', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("insertResponse").textContent = xhr.responseText;
        }
    };
    xhr.send(JSON.stringify({}));
}

function executeQuery() {
    const query = document.getElementById("query").value;
    const method = query.trim().toUpperCase().startsWith('SELECT') ? 'GET' : 'POST';

    var xhr = new XMLHttpRequest();
    xhr.open(method, '/query', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("queryResponse").textContent = xhr.responseText;
        }
    };
    xhr.send(JSON.stringify({
        query: query
    }));
}