const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const {ipcMain, dialog} = require('electron') //ipc lets code talk to main
const fs = require('fs') //reads or writes files

ipcMain.on('save-photo', async(event, imgData) =>{
  const buffer = Buffer.from(
    imgData.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  )

  const {filePath} = await dialog.showSaveDialog({ //opens a "Save As..."
    defaultPath: `photo_${Date.now()}.png`,
    filters: [{name: 'Images', extensions: ['png']}]
  })

  if(filePath){
    fs.writeFile(filePath, buffer, (err) => {
      if(err) console.error('Failed to save photo: ', err)
      else console.log('Photo saved to', filePath)
    })
  }
  
}) 


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  //permission to use camera
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if(permission === 'media') {
      callback(true) //allow camera access
    } else {
      callback(false)
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})