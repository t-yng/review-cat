import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { auth } from './src/lib';
import { oAuthOptions } from './src/constants/auth';

const isDevelopment = process?.env?.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 530,
    height: 496,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const indexUrl = isDevelopment
    ? 'http://localhost:3000/'
    : `file://${path.resolve(__dirname, './index.html')}`;
  mainWindow.loadURL(indexUrl);
}

app.whenReady().then(() => {
  // Github認証のキャッシュを削除する
  // session.defaultSession.clearStorageData();
  // session.defaultSession.clearAuthCache([], (data) => {
  //   console.log(data);
  // });

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

ipcMain.handle('loginWithGithub', async () => {
  return auth.loginWithGithub(oAuthOptions);
});

ipcMain.handle('getAccessToken', async (event, code: string) => {
  return auth.getGithubOAuthToken(oAuthOptions, code);
});
