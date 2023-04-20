import { test, expect } from '@playwright/test';
import jsonServer from 'json-server';
import { launchElectronApp } from './helpers/app';
import { loginWithGitHub } from './helpers/login';

const server = jsonServer.create();
server.use(jsonServer.bodyParser);

test.beforeAll(() => {
  server.listen(4400);
});

test('GitHubでログインできる', async () => {
  // アプリを起動
  const electronApp = await launchElectronApp();

  // GitHubログイン
  await loginWithGitHub(electronApp, server);

  // ログインに成功してページ遷移が行われていることを確認
  const mainWindow = await electronApp.firstWindow();
  await expect(mainWindow.getByRole('img', { name: 'test' })).toBeVisible();
  await expect(mainWindow).toHaveURL(/\/select\-repository/);

  await electronApp.close();
});
