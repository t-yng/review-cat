import * as matchers from '@testing-library/jest-dom/matchers';
import { vi, expect } from 'vitest';
import { server } from './mocks/api/server';

expect.extend(matchers);

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
    loginWithGithub: vi.fn().mockResolvedValue('code'),
    getAccessToken: vi.fn().mockResolvedValue('token'),
    updateAutoLaunch: vi.fn(),
  };
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
