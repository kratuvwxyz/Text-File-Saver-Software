document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', submitForm);

    loadTableData();
});

function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    // Use ipcRenderer from the global context
    window.ipcRenderer.send('submit-form', { name, email, age });

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('age').value = '';
}

function loadTableData() {
    // Use ipcRenderer from the global context
    window.ipcRenderer.send('request-table-data');

    // Handle the response with the table data
    window.ipcRenderer.on('table-data', (event, tableData) => {
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
