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

  document.addEventListener("DOMContentLoaded", function () {
      const executeButton = document.getElementById("executeButton");
      const queryInput = document.getElementById("queryInput");
      const insertResponseDiv = document.getElementById("insertResponse");
      const queryResponseDiv = document.getElementById("queryResponse");



      // Execute SQL query
      executeButton.addEventListener("click", function () {
          const sqlQuery = queryInput.value.trim().toUpperCase();

          if (sqlQuery.startsWith('SELECT')) {
              // Handle the SELECT operation

              sendRequest('GET', `https://xejzvotuqd.us14.qoddiapp.com/api/v1/sql/select?query=${encodeURIComponent(sqlQuery)}`, null, function (error, response, responseDiv) {
                  if (error) {
                      responseDiv.innerHTML = "Errorr: " + error.message;
                  } else {
                      responseDiv.innerHTML = JSON.stringify(response, null, 2);
                  }
              }, queryResponseDiv);

          } else {
              // Assuming the format for INSERT is ("name", age)
              const parts = sqlQuery.replace(/[()]/g, "").split(",");
              if (parts.length === 2) {
                  const name = parts[0].trim();
                  const age = parseInt(parts[1].trim());

                  if (name && !isNaN(age)) {
                      const method = "POST";
                      const url = "https://xejzvotuqd.us14.qoddiapp.com/api/v1/sql/insert";
                      console.log("METHOD: " + method);

                      const data = {
                          name: name,
                          age: age
                      };

                      console.log("DATA" + data);

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
          }
      });
  });

  const insertPatientsButton = document.getElementById("insertPatientsButton");
  const insertPatientsResponse = document.getElementById("insertPatientsResponse");

  insertPatientsButton.addEventListener("click", function () {
      const defaultPatients = [{
              name: 'Sara Brown',
              dateofbirth: '1901-01-01'
          },
          {
              name: 'John Smith',
              dateofbirth: '1941-01-01'
          },
          {
              name: 'Jack Ma',
              dateofbirth: '1961-01-30'
          },
          {
              name: 'Elon Musk',
              dateofbirth: '1999-01-01'
          }
      ];

      defaultPatients.forEach(patient => {
          sendRequest('POST', 'https://xejzvotuqd.us14.qoddiapp.com/api/v1/sql/insert', patient, function (error, response, responseDiv) {
              if (error) {
                  responseDiv.innerHTML += "Error inserting " + patient.name + ": " + error.message + "<br/>";
              } else {
                  responseDiv.innerHTML += "Inserted " + patient.name + ": " + JSON.stringify(response, null, 2) + "<br/>";
              }
          }, insertPatientsResponse);
      });
  });


  const fetchPatientsButton = document.getElementById("fetchPatientsButton");
  const patientListDiv = document.getElementById("patientList");

  fetchPatientsButton.addEventListener("click", function () {
      sendRequest('GET', 'https://xejzvotuqd.us14.qoddiapp.com/api/v1/sql/select?query=SELECT * FROM patients', null, function (error, response, responseDiv) {
          if (error) {
              responseDiv.innerHTML = "Error fetching patients: " + error.message;
          } else {
              let displayContent = '<h3>Patients:</h3>';
              response.forEach(patient => {
                  displayContent += `<p>ID: ${patient.patientid}, Name: ${patient.name}, Date of Birth: ${patient.dateofbirth}</p>`;
              });
              responseDiv.innerHTML = displayContent;
          }
      }, patientListDiv);
  });