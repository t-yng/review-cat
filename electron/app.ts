import path from 'path';
import { app, ipcMain, shell, autoUpdater, dialog } from 'electron';
import { menubar } from 'menubar';
import { auth } from './src/lib';
import { oAuthOptions } from './src/constants/auth';

const isProduction = process?.env?.NODE_ENV === 'production';

const trayIcon = path.join(__dirname, 'assets', 'images', 'tray-icon.png');
const indexUrl = isProduction
  ? `file://${path.resolve(__dirname, './index.html')}`
  : 'http://localhost:3000/';

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

  const platform = process.platform;
  const version = app.getVersion();
  const updateUrl = `http://review-cat-updater.herokuapp.com/update/${platform}/${version}`;

  autoUpdater.setFeedURL({ url: updateUrl });
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.',
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });

    console.log('detect update downloaded');
    console.log(releaseNotes);
    return false;
  });

  autoUpdater.on('update-available', () => {
    console.log('update is available');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('no updates');
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

  if (!isProduction) {
    menubarApp.showWindow();
  }
});
