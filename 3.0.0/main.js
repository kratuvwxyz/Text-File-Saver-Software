const { log } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
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

    fs.readFile(dataPath, 'utf-8', (err, data) => {
        let jsonData;

        if (err) {
            // If file doesn't exist, initialize jsonData as an empty array
            jsonData = [];
        } else {
            try {
                // Parse existing data as JSON
                jsonData = JSON.parse(data);
                if (!Array.isArray(jsonData)) {
                    // If not an array, initialize as an empty array
                    jsonData = [];
                }
            } catch (parseError) {
                console.error('Error parsing data.json:', parseError);
                jsonData = [];
            }
        }

        // Push new formData to jsonData
        jsonData.push(formData);

        // Write the updated data back to the file
        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) throw err;
            console.log('Data saved to', dataPath);

            mainWindow.webContents.send('request-table-data');
        });
    });

    mainWindow.loadFile('index.html');
});

ipcMain.on('request-table-data', (event) => {
    console.log('Request received');
    const dataPath = path.join(app.getPath('userData'), 'data.json');

    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            event.reply('table-data', []); // Send an empty array if there's an error
        } else {
            try {
                const jsonData = JSON.parse(data);
                console.log('Sending table data:', jsonData);
                event.reply('table-data', jsonData);
            } catch (parseError) {
                console.error('Error parsing data.json:', parseError);
                event.reply('table-data', []); // Send an empty array on parse error
            }
        }
    });
});
