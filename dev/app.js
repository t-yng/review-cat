const path = require('path')
const { app, BrowserWindow } = require('electron')

const isDevelopment = process?.env?.NODE_ENV === 'development'

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({ width: 530, height: 496 })
  mainWindow.loadURL(
    isDevelopment
      ? 'http://localhost:3000/'
      : `file://${path.resolve(__dirname, './index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
