import { type ElectronApplication } from 'playwright';
import { mockGitHubGraphQL } from '../mock/graphql';
import { type MockServer } from '../mock/server';
import { loginUser } from '../mock/user';

export const loginWithGitHub = async (
  electronApp: ElectronApplication,
  _server: MockServer,
  setting?: { [key: string]: any }
) => {
  // Output window console logs
  const mainWindow = await electronApp.firstWindow();

  await mainWindow.evaluate((setting) => {
    // Initialize login state
    window.localStorage.clear();

    if (setting) {
      window.localStorage.setItem('settings', JSON.stringify(setting));
    }

    // Fire navigation event to execute react-router page transition
    window.history.pushState({}, '', '/');
  }, setting);

  // Mock IPC handlers in the Electron main process to bypass the real OAuth window flow.
  // Playwright's page.goto() is treated as programmatic navigation (like loadURL) so
  // Electron does not fire will-navigate or will-redirect for it, making the redirect-based
  // approach used in Electron v22 no longer viable in v36.
  await electronApp.evaluate(({ ipcMain }) => {
    ipcMain.removeHandler('loginWithGithub');
    ipcMain.handle('loginWithGithub', async () => '1234567890');
    ipcMain.removeHandler('getAccessToken');
    ipcMain.handle('getAccessToken', async () => 'mock_token');
  });

  // Mock user information retrieval
  mockGitHubGraphQL({
    page: mainWindow,
    operation: 'LoginUser',
    response: {
      body: {
        viewer: {
          ...loginUser,
        },
      },
    },
  });

  // Click login button — the mocked IPC handlers return the code/token immediately
  const loginButton = await mainWindow.getByRole('button', {
    name: 'Login To GitHub',
  });
  await loginButton.click();
};
