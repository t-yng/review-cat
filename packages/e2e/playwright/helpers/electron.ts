import { _electron as electron } from 'playwright';

export const launchElectronApp = async () => {
  // アプリを起動
  const electronApp = await electron.launch({
    args: [require.resolve('main/dist/app.js')],
  });

  // メインプロセスのログを出力
  const mainProcess = electronApp.process();
  mainProcess.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  // ウィンドウのコンソールログを出力
  const mainWindow = await electronApp.firstWindow();
  mainWindow.on('console', console.log);

  return electronApp;
};
