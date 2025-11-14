"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  // ADAPTAÇÃO: A função agora é genérica e passa as opções
  generateReport: (options) => ipcRenderer.invoke("generate-report", options)
});
