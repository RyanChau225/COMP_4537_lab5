const insertButton = document.getElementById('insertBtn');
const executeButton = document.getElementById('executeBtn');
const sqlQuery = document.getElementById('sqlQuery');
const responseDiv = document.getElementById('response');

insertButton.addEventListener('click', async () => {
    // Send a POST request to the server to insert data.
    const response = await fetch('/insert', {
        method: 'POST'
    });
    const result = await response.text();
    responseDiv.innerHTML = result;
});

executeButton.addEventListener('click', async () => {
    const query = sqlQuery.value;
    let method = 'POST';
    if (query.trim().toUpperCase().startsWith('SELECT')) {
        method = 'GET';
    }

    const response = await fetch('/execute', {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query
        }),
    });
    const result = await response.text();
    responseDiv.innerHTML = result;
});