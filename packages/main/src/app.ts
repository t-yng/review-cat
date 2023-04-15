import path from 'path';
import { app, ipcMain, shell } from 'electron';
import { menubar } from 'menubar';
import { auth } from './lib';
import { oAuthOptions } from './constants/auth';

const isDevelopment = process?.env?.NODE_ENV === 'development';

const trayIcon = path.join(__dirname, 'assets', 'images', 'tray-icon.png');

// `file://${require.resolve('web/dist/index.html')}`;
// `file://${path.resolve(__dirname, './index.html')}`
const html = `file://${require.resolve('web/dist/index.html')}`;
const indexUrl = isDevelopment ? 'http://localhost:3000/' : html;

const browserWindowOpts: Electron.BrowserWindowConstructorOptions = {
  width: 500,
  height: 400,
  minWidth: 500,
  minHeight: 400,
  resizable: false,
  webPreferences: {
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

const hideDockIcon = () => {
  // menubar の showDockIcon:false が正常に動作しないので、自前でドックアイコンを非表示にしている
  // @see: https://github.com/maxogden/menubar/issues/306
  if (app.dock && app.dock.hide) {
    app.dock.hide();
  }
};

menubarApp.on('ready', () => {
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
});

menubarApp.on('after-create-window', () => {
  // 外部リンクに遷移するときに新しいウィンドウを表示せずにデフォルトのブラウザで表示する
  menubarApp.window?.webContents.setWindowOpenHandler(({ url }) => {
    // NOTE: 外部リンクを開く時にウィンドウを閉じないようにブラウザにフォーカスを当てないようにする
    //       ただし、Chromeの場合はバグでフォーカスが当たってしまうので注意
    // @see: vhttps://github.com/electron/electron/issues/12492
    if (url.startsWith('https:')) {
      shell.openExternal(url, { activate: false });
    }
    return { action: 'deny' };
  });

  hideDockIcon();

  if (isDevelopment) {
    menubarApp.showWindow();
  }
});
