import '@testing-library/jest-dom';
import { server } from './mocks/api/server';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

process.env.GITHUB_APP_CLIENT_ID = 'usrrgi8hwwncrrqlei1o';
process.env.GITHUB_APP_CLIENT_SECRET =
  'ts9gxbz92hdtmcppur2jumvlazangvi902da12cc';

beforeAll(() => {
  server.listen();

  window.ipc = {
    loginWithGithub: jest.fn().mockResolvedValue('code'),
    getAccessToken: jest.fn().mockResolvedValue('token'),
    updateAutoLaunch: jest.fn(),
  };
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
