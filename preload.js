const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  savePhoto: (imgData) => ipcRenderer.send('save-photo', imgData),
  onPhotoSaved: (callback) => ipcRenderer.on('photo-saved', (event, path) => callback(path))
})
