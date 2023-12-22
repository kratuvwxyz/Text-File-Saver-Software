document.addEventListener('DOMContentLoaded', () => {
    loadTableData();
    // const submitButton = document.getElementById('submit-button');
    // submitButton.addEventListener('click', submitForm);

});

function submitForm(onCompleteCallback) {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    // Use ipcRenderer from the global context
    ipcRenderer.send('submit-form', { name, email, age });

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('age').value = '';

    // Call the onCompleteCallback function, if provided
    if (onCompleteCallback && typeof onCompleteCallback === 'function') {
        onCompleteCallback();
    }
}

function onSubmitComplete() {
    console.log('Form submission completed!');
    // Add any additional logic you want to execute after form submission
}

function loadTableData() {
    // Use ipcRenderer from the global context
    ipcRenderer.send('request-table-data');

    // Handle the response with the table data
    ipcRenderer.on('table-data', (tableData) => {
        console.log('Received table data:', tableData);

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        if (Array.isArray(tableData) && tableData.length > 0) {
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
        } else {
            // Display a message or handle the case where no data is available
            const messageRow = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = 3; // Set colspan based on the number of columns
            messageCell.textContent = 'No data available';
            messageRow.appendChild(messageCell);
            tableBody.appendChild(messageRow);
        }
    });
    console.log("this si callingn");

}
