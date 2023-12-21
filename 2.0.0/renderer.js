const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // Your code to set up the form or other elements goes here

    // Attach the submitForm function to the button click event
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', submitForm);

    // Load existing data on page load
    loadTableData();
    
    function submitForm() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
    
        const formData = {
            name,
            email,
            age
        };
    
        // Send the form data to the main process
        ipcRenderer.send('submit-form', formData);
    
        // Clear the form fields after submission
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('age').value = '';
    }
});


function loadTableData() {
    // Request the data from the main process
    ipcRenderer.send('request-table-data');

    // Handle the response with the table data
    ipcRenderer.on('table-data', (event, tableData) => {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        // Append new rows to the table
        tableData.forEach((rowData) => {
            const row = document.createElement('tr');
            Object.values(rowData).forEach((value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    });
}
