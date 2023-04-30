import { test, expect } from '@playwright/test';
import { launchElectronApp } from './helpers/electron';
import { loginWithGitHub } from './helpers/login';
import { server } from './mock/server';
import { loginUser } from './mock/user';

test.describe('ログイン', () => {
  test.beforeAll(() => {
    server.listen();
  });

  test.afterAll(() => {
    server.close();
    console.log('close server');
  });

  test('GitHubでログインできる', async () => {
    // アプリを起動
    const electronApp = await launchElectronApp();

    // GitHubログイン
    await loginWithGitHub(electronApp, server);

    // ログインに成功してページ遷移が行われていることを確認
    const mainWindow = await electronApp.firstWindow();
    await expect(
      mainWindow.getByRole('img', { name: loginUser.login })
    ).toBeVisible();
    await expect(mainWindow).toHaveURL(/\/select\-repository/);

    await electronApp.close();
  });
});
