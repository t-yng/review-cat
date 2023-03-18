import { Settings } from '../models';
import { storage } from './storage';

describe('lib/storage', () => {
  const originalLocalStorage = window.localStorage;

  const mockLocalStorageGetItem = (key: string, value: string | null) => {
    const mockGetItem = jest.fn().mockImplementation((storageKey) => {
      if (storageKey === key) {
        return value;
      } else {
        null;
      }
    });

    Object.defineProperty(window, 'localStorage', {
      get: () => ({
        getItem: mockGetItem,
      }),
    });
  };

  const mockLocalStorageSetItem = () => {
    const mockSetItem = jest.fn();

    Object.defineProperty(window, 'localStorage', {
      get: () => ({
        setItem: mockSetItem,
      }),
    });

    return mockSetItem;
  };

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      get: () => originalLocalStorage,
    });
  });

  describe('GithubAccessToken', () => {
    describe('getGithubAccessToken', () => {
      it('localStorageからアクセストークンが取得できること', () => {
        const token = 'token';
        mockLocalStorageGetItem('gh_atk', token);

        const result = storage.getGithubAccessToken();
        expect(result).toBe(token);
      });
    });

    describe('setGithubAccessToken', () => {
      it('localStorageにアクセストークンがセットできること', () => {
        const token = 'token';
        const mockSetItem = mockLocalStorageSetItem();

        storage.setGithubAccessToken(token);
        expect(mockSetItem).toBeCalledWith('gh_atk', token);
      });
    });
  });

  describe('Settings', () => {
    const settings: Settings = {
      notifyReviewRequested: false,
      showsRequestedReviewPR: true,
      showsInReviewPR: true,
      showsApprovedPR: true,
      showsMyPR: true,
      autoLaunched: false,
      subscribedRepositories: ['test/test'],
    };

    describe('getSettings', () => {
      it('localStorageから設定情報が取得できること', () => {
        mockLocalStorageGetItem('settings', JSON.stringify(settings));
        const result = storage.getSettings();
        expect(result).toEqual(settings);
      });

      it('値が存在しないときに null を返すこと', () => {
        mockLocalStorageGetItem('settings', null);
        const result = storage.getSettings();
        expect(result).toBeNull();
      });
    });

    describe('setSettings', () => {
      it('localStorageに設定情報をセットできること', () => {
        const mockSetItem = mockLocalStorageSetItem();

        storage.setSettings(settings);
        expect(mockSetItem).toBeCalledWith(
          'settings',
          JSON.stringify(settings) // NOTE: stringifyは順番が保証されないのでテストがコケる可能性があります。
        );
      });
    });
  });
});
