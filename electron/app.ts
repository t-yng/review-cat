import path from 'path';
import { app, ipcMain } from 'electron';
import { menubar } from 'menubar';
import { auth } from './src/lib';
import { oAuthOptions } from './src/constants/auth';

const isDevelopment = process?.env?.NODE_ENV === 'development';

const trayIcon = path.join(__dirname, 'assets', 'images', 'tray-icon.png');
const indexUrl = isDevelopment
  ? 'http://localhost:3000/'
  : `file://${path.resolve(__dirname, './index.html')}`;

const browserWindowOpts = {
  width: 500,
  height: 400,
  minWidth: 500,
  minHeight: 400,
  resizable: false,
  webPreferences: {
    enableRemoteModule: true,
    overlayScrollbars: true,
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js'),
  },
};

const menubarApp = menubar({
  icon: trayIcon,
  index: indexUrl,
  browserWindow: browserWindowOpts,
  preloadWindow: true,
});

const delayedHideAppIcon = () => {
  if (app.dock && app.dock.hide) {
    // Setting a timeout because the showDockIcon is not currently working
    // See more at https://github.com/maxogden/menubar/issues/306
    setTimeout(() => {
      app.dock.hide();
    }, 1000);
  }
};

menubarApp.on('ready', () => {
  delayedHideAppIcon();

  ipcMain.handle('loginWithGithub', async () => {
    return auth.loginWithGithub(oAuthOptions);
  });

  ipcMain.handle('getAccessToken', async (event, code: string) => {
    return auth.getGithubOAuthToken(oAuthOptions, code);
  });
});
