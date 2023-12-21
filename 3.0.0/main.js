const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Set to false to enable context isolation
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), // Specify the preload script
        },
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on('submit-form', (event, formData) => {
    const dataPath = path.join(app.getPath('userData'), 'data.json');
    const jsonData = JSON.stringify(formData, null, 2);

    fs.writeFile(dataPath, jsonData, (err) => {
        if (err) throw err;
        console.log('Data saved to', dataPath);

        mainWindow.webContents.send('request-table-data');
    });
});

ipcMain.on('request-table-data', (event) => {
    const dataPath = path.join(app.getPath('userData'), 'data.json');

    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            event.reply('table-data', []); // Send an empty array if there's an error
        } else {
            const jsonData = JSON.parse(data);
            event.reply('table-data', [jsonData]); // Send the data as an array for consistency
        }
    });
});
