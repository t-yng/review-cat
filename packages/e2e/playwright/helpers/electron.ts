import { _electron as electron } from 'playwright';

export const launchElectronApp = async () => {
  // Launch the app
  const electronApp = await electron.launch({
    args: [require.resolve('main/dist/app.js')],
  });

  // Output main process logs
  const mainProcess = electronApp.process();
  mainProcess.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  // Output window console logs
  const mainWindow = await electronApp.firstWindow();
  mainWindow.on('console', console.log);

  return electronApp;
};
