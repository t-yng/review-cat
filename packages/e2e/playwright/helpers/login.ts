import { type ElectronApplication } from 'playwright';
import { mockGitHubGraphQL } from '../mock/graphql';
import { type MockServer } from '../mock/server';
import { loginUser } from '../mock/user';

export const loginWithGitHub = async (
  electronApp: ElectronApplication,
  server: MockServer,
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

  // Click login button
  const loginButton = await mainWindow.getByRole('button', {
    name: 'Login To GitHub',
  });
  await loginButton.click();

  // Get authentication window
  const authWindow = await electronApp.waitForEvent('window');
  await authWindow.waitForLoadState('domcontentloaded');

  // Mock GitHub authentication page transition
  await authWindow.route('https://github.com/authorized', (route) => {
    return route.fulfill({
      status: 302,
      headers: { Location: 'http://localhost?code=1234567890' },
    });
  });

  // Mock GitHub authentication access token retrieval
  server.post('/login/oauth/access_token', (req, res) => {
    if (req.body.code === '1234567890') {
      return res.status(200).json({
        access_token: 'mock_token',
      });
    } else {
      return res.status(401);
    }
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

  // Reproduce the state where the user has completed login with GitHub
  try {
    await authWindow.goto('https://github.com/authorized', {
      waitUntil: 'commit',
    });
  } catch (error) {
    // As per application specification, the window is closed after retrieving the auth code from the redirected URL post-authentication
    // ERROR_ABORTED is normal behavior, so do not treat it as an error
    // Other errors are abnormal behavior, so treat them as errors
    if (!error.message.includes('net::ERR_ABORTED')) {
      throw error;
    }
  }
};
