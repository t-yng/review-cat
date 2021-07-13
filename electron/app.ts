import path from 'path';
import { app, BrowserWindow } from 'electron';

const isDevelopment = process?.env?.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({ width: 530, height: 496 });

  mainWindow.loadURL(
    isDevelopment
      ? 'http://localhost:3000/'
      : `file://${path.resolve(__dirname, './index.html')}`
  );
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
