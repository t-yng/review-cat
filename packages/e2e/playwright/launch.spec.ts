import { _electron as electron } from 'playwright';
import { expect, test } from '@playwright/test';

test('アプリを起動', async () => {
  // アプリを起動
  const electronApp = await electron.launch({
    args: [require.resolve('main/dist/app.js')],
  });

  const page = await electronApp.firstWindow();

  // react-routerのページ遷移を実行するために、ナビゲーションのイベントを発火
  await page.evaluate(() => {
    window.history.pushState({}, '', '/');
  });

  page.on('console', console.log);

  await page.screenshot({ path: 'intro.png' });

  await electronApp.close();
});
