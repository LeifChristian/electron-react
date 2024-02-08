const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = true // Add this line

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
      });
      

//   const startUrl = isDev
//     ? 'http://localhost:3000' // Load directly from the dev server
//     : url.format({
//         pathname: path.join(__dirname, './public/index.html'),
//         protocol: 'file:',
//         slashes: true,
//       });


  mainWindow.loadURL('http://localhost:3000');

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
