import { storage } from './storage';

describe('lib/storage', () => {
  const originalLocalStorage = window.localStorage;

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      get: () => originalLocalStorage,
    });
  });

  describe('getGithubAccessToken', () => {
    it('localStorageからアクセストークンが取得できること', () => {
      const token = 'token';
      const mockGetItem = jest.fn().mockImplementation((key) => {
        if (key === 'gh_atk') {
          return token;
        } else {
          null;
        }
      });

      Object.defineProperty(window, 'localStorage', {
        get: () => ({
          getItem: mockGetItem,
        }),
      });

      const result = storage.getGithubAccessToken();
      expect(result).toBe(token);
    });
  });

  describe('setGithubAccessToken', () => {
    it('localStorageからアクセストークンがセットできること', () => {
      const token = 'token';
      const mockSetItem = jest.fn();

      Object.defineProperty(window, 'localStorage', {
        get: () => ({
          setItem: mockSetItem,
        }),
      });

      storage.setGithubAccessToken(token);
      expect(mockSetItem).toBeCalledWith('gh_atk', token);
    });
  });
});
