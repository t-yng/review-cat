import { renderHook, act } from '@testing-library/react-hooks';
import { useAtom } from 'jotai';
import { Settings } from '../models';
import { settingsReducerAtom, UPDATE_ACTION } from './settings';
import { storage } from '../lib/storage';

jest.mock('../lib/storage');
const mockStorage = storage as jest.Mocked<typeof storage>;

describe('jotai/settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('update settings', () => {
    it('設定情報を更新する時にストレージに更新後の設定情報が保存されること', () => {
      const { result } = renderHook(() => useAtom(settingsReducerAtom));

      const updated: Settings = {
        notifyReviewRequested: true,
        showsRequestedReviewPR: true,
        showsInReviewPR: true,
        showsApprovedPR: false,
        subscribedPRList: ['test/test1', 'test/test2'],
      };
      act(() => {
        result.current[1]({
          type: UPDATE_ACTION,
          payload: updated,
        });
      });

      expect(mockStorage.setSettings).toBeCalledWith(updated);
    });
  });

  describe('initial settings', () => {
    it('ストレージから設定情報を読み込むこと', () => {
      const savedSettings: Settings = {
        notifyReviewRequested: true,
        showsRequestedReviewPR: true,
        showsInReviewPR: true,
        showsApprovedPR: false,
        subscribedPRList: ['test/test1', 'test/test2'],
      };
      mockStorage.getSettings.mockReturnValue(savedSettings);

      const { result } = renderHook(() => useAtom(settingsReducerAtom));

      expect(result.current[0]).toEqual(savedSettings);
    });

    it('ストレージに設定情報が存在しないときにデフォルトの値を初期値として返すこと', () => {
      mockStorage.getSettings.mockReturnValue(null);
      const { result } = renderHook(() => useAtom(settingsReducerAtom));

      expect(result.current[0]).not.toBeNull();
    });
  });
});
