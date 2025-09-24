const { app, BrowserWindow } = require('electron');

function createWindow () {
    const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: false
    }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
    app.quit();
    }
});