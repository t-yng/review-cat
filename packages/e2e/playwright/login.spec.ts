import { test, expect } from '@playwright/test';
import { launchElectronApp } from './helpers/electron';
import { loginWithGitHub } from './helpers/login';
import { server } from './mock/server';
import { loginUser } from './mock/user';

test.describe('Login', () => {
  test.beforeAll(() => {
    server.listen();
  });

  test.afterAll(() => {
    server.close();
    console.log('close server');
  });

  test('Can log in with GitHub', async () => {
    // Launch the app
    const electronApp = await launchElectronApp();

    // GitHub login
    await loginWithGitHub(electronApp, server);

    // Confirm that login succeeded and page navigation occurred
    const mainWindow = await electronApp.firstWindow();
    await expect(
      mainWindow.getByRole('img', { name: loginUser.login })
    ).toBeVisible();
    await expect(mainWindow).toHaveURL(/\/select\-repository/);

    await electronApp.close();
  });
});
