// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// src/preload.js

// src/preload.js

// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateReport: (options) => ipcRenderer.invoke('generate-report', options),
  
  generateDetailedStudentReport: (data) => ipcRenderer.invoke('generate-detailed-student-report', data)
});