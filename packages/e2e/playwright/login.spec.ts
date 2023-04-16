import { _electron as electron } from 'playwright';
import { test } from '@playwright/test';

test('GitHubでログインできる', async () => {
  // アプリを起動
  const electronApp = await electron.launch({
    args: [require.resolve('main/dist/app.js')],
  });
  const mainProcess = electronApp.process();
  mainProcess.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  const mainWindow = await electronApp.firstWindow();
  mainWindow.on('console', console.log);

  // react-routerのページ遷移を実行するために、ナビゲーションのイベントを発火
  await mainWindow.evaluate(() => {
    // ログイン状態を初期化
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  // ログインボタンをクリック
  const loginButton = await mainWindow.getByRole('button', {
    name: 'Login To GitHub',
  });
  await loginButton.click();

  // 認証用のウィンドウを取得
  const authWindow = await electronApp.waitForEvent('window');
  await authWindow.waitForLoadState('domcontentloaded');

  // GitHub認証のページ遷移をモック
  await authWindow.route('https://github.com/authorized', (route) => {
    return route.fulfill({
      status: 302,
      headers: { Location: 'http://localhost?code=1234567890' },
    });
  });

  try {
    await authWindow.goto('https://github.com/authorized', {
      waitUntil: 'commit',
    });
  } catch (error) {
    // アプリケーションの仕様として、認証後にリダイレクトされたURLから認証コードを取得したらウィンドウが閉じられる
    // ERROR_ABORTEDは正常な動作なので、エラーとして扱わない
    // それ以外のエラーは異常な動作なので、エラーとして扱う
    if (!error.message.includes('net::ERR_ABORTED')) {
      throw error;
    }
  }

  await mainWindow.waitForTimeout(2000);

  await mainWindow.screenshot({ path: 'intro.png' });

  await electronApp.close();
});
