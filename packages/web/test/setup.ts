import '@testing-library/jest-dom/extend-expect';

process.env.GITHUB_APP_CLIENT_ID = 'usrrgi8hwwncrrqlei1o';
process.env.GITHUB_APP_CLIENT_SECRET =
  'ts9gxbz92hdtmcppur2jumvlazangvi902da12cc';

beforeAll(() => {
  window.ipc = {
    loginWithGithub: jest.fn().mockResolvedValue('code'),
    getAccessToken: jest.fn().mockResolvedValue('token'),
    updateAutoLaunch: jest.fn(),
  };
});
