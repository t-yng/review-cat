import { Settings } from '../models';
import { storage } from './storage';

describe('lib/storage', () => {
  const originalLocalStorage = window.localStorage;

  const mockLocalStorageGetItem = (key: string, value: string | null) => {
    const mockGetItem = jest.fn().mockImplementation((storageKey) => {
      if (storageKey === key) {
        return value;
      } else {
        return null;
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
      it('Can retrieve the access token from localStorage', () => {
        const token = 'token';
        mockLocalStorageGetItem('gh_atk', token);

        const result = storage.getGithubAccessToken();
        expect(result).toBe(token);
      });
    });

    describe('setGithubAccessToken', () => {
      it('Can set the access token in localStorage', () => {
        const token = 'token';
        const mockSetItem = mockLocalStorageSetItem();

        storage.setGithubAccessToken(token);
        expect(mockSetItem).toHaveBeenCalledWith('gh_atk', token);
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
      it('Can retrieve settings from localStorage', () => {
        mockLocalStorageGetItem('settings', JSON.stringify(settings));
        const result = storage.getSettings();
        expect(result).toEqual(settings);
      });

      it('Returns null when no value exists', () => {
        mockLocalStorageGetItem('settings', null);
        const result = storage.getSettings();
        expect(result).toBeNull();
      });
    });

    describe('setSettings', () => {
      it('Can set settings in localStorage', () => {
        const mockSetItem = mockLocalStorageSetItem();

        storage.setSettings(settings);
        expect(mockSetItem).toHaveBeenCalledWith(
          'settings',
          JSON.stringify(settings) // NOTE: stringify does not guarantee order, so tests may fail.
        );
      });
    });
  });
});
