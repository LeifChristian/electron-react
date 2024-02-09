const { app, BrowserWindow, Menu } = require('electron');
const { ipcMain } = require('electron');
const path = require('path');
const isDev = false // Add this line

const createWindow = () => {
    // const mainWindow = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     webPreferences: {
    //       nodeIntegration: true,
    //       contextIsolation: false,
    //     },
    //     fullscreen: true,
    //   });
      

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false, // It's good you have nodeIntegration disabled for security.
          contextIsolation: true, // This should remain true for security reasons.
          preload: path.join(__dirname, 'preload.js'), // Ensure this path is correct.
        },
        fullscreen: true,
    });
    

    const startUrl = isDev
    ? 'http://localhost:3000' // Load directly from the dev server in development
    : `file://${path.join(__dirname, 'build', 'index.html')}`; // Use the build folder in production
  
  mainWindow.loadURL(startUrl);
  
  if (isDev) {
    // mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
    // Menu.setApplicationMenu(null); // Ensure the menu bar is hidden
    createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('ready', () => {
    Menu.setApplicationMenu(null); // This hides the menu bar
    createWindow();
  });


  ipcMain.on('quit-app', () => {
    app.quit();
  });