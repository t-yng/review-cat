import path from 'path';
import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  Menu,
  shell,
  Tray,
} from 'electron';
import { auth } from './lib';
import { oAuthOptions } from './constants/auth';
import axios from 'axios';

if (process.env.NODE_ENV === 'test') {
  axios.defaults.proxy = {
    protocol: 'http',
    host: '127.0.0.1',
    port: 4400,
  };
}

const CUSTOM_PROTOCOL = 'review-cat';
const isProduction = process?.env?.NODE_ENV === 'production';
const trayIcon = path.join(__dirname, 'assets', 'images', 'tray-icon.png');

// `file://${require.resolve('web/dist/index.html')}`;
// `file://${path.resolve(__dirname, './index.html')}`
const indexUrl = isProduction
  ? `file://${require.resolve('web/dist/index.html')}`
  : 'http://localhost:3000/';

const browserWindowOpts: BrowserWindowConstructorOptions = {
  width: 580,
  height: 640,
  minWidth: 500,
  minHeight: 400,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js'),
  },
};

// Register custom protocol for OAuth callback
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL);
}

// macOS: handle OAuth callback via open-url event
app.on('open-url', (event, url) => {
  event.preventDefault();
  auth.handleOAuthCallback(url);
});

// Windows: enforce single instance and handle OAuth callback via second-instance event
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    const url = commandLine.find((arg) =>
      arg.startsWith(`${CUSTOM_PROTOCOL}://`)
    );
    if (url) {
      auth.handleOAuthCallback(url);
    }
  });
}

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow(browserWindowOpts);
  mainWindow.loadURL(indexUrl);

  // When navigating to external links, open in the default browser without showing a new window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // NOTE: To prevent the window from closing when opening external links, do not focus the browser
    //       However, note that Chrome has a bug where focus is applied
    // @see: vhttps://github.com/electron/electron/issues/12492
    if (url.startsWith('https:')) {
      shell.openExternal(url, { activate: false });
    }
    return { action: 'deny' };
  });

  let isQuitting = false;

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  const tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ReviewCat', click: () => mainWindow.show() },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  ipcMain.handle('loginWithGithub', async () => {
    return auth.loginWithGithub(oAuthOptions);
  });

  ipcMain.handle('getAccessToken', async (event, code: string) => {
    return auth.getGithubOAuthToken(oAuthOptions, code);
  });

  ipcMain.handle('updateAutoLaunch', async (_, isAutoLaunched: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: isAutoLaunched,
    });
  });

  if (!isProduction) {
    mainWindow.show();
  }
});
