// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// src/preload.js

// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ADAPTAÇÃO: A função agora é genérica e passa as opções
  generateReport: (options) => ipcRenderer.invoke('generate-report', options)
});