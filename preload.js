const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exitApp: () => ipcRenderer.send('quit-app')
});
