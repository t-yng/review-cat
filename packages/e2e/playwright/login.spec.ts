import { test, expect, Page, ElectronApplication } from '@playwright/test';
import { launchElectronApp } from './helpers/electron';
import { loginWithGitHub } from './helpers/login';
import { server } from './mock/server';
import { loginUser } from './mock/user';

test.describe('Login', () => {
  let electronApp: ElectronApplication;
  let mainWindow: Page;

  test.beforeAll(() => {
    server.listen();
  });

  test.beforeEach(async () => {
    electronApp = await launchElectronApp();
    mainWindow = await electronApp.firstWindow();
  });

  test.afterAll(() => {
    server.close();
    console.log('close server');
  });

  test.afterEach(async () => {
    await electronApp.evaluate(({ app }) => app.exit(0));
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
  });
});
