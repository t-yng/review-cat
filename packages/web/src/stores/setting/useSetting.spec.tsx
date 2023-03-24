import { act } from '@testing-library/react';
import { customRenderHook } from '@test/helpers/render';
import { storage } from '@/lib/storage';
import { useSetting } from './useSetting';
import { Settings } from '@/models';

jest.mock('@/lib/storage');
const mockStorage = storage as jest.Mocked<typeof storage>;

describe('useSetting', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const renderUseSetting = () => {
    return customRenderHook(() => useSetting());
  };

  describe('設定情報の読み込み', () => {
    it('ストレージに設定情報が存在しないときにデフォルトの値を初期値として返す', () => {
      mockStorage.getSettings.mockReturnValue(null);
      const { result } = renderUseSetting();

      expect(result.current.setting).not.toBeNull();
    });

    it('ストレージから設定情報を読み込む', () => {
      const savedSettings: Settings = {
        notifyReviewRequested: true,
        showsRequestedReviewPR: true,
        showsInReviewPR: true,
        showsApprovedPR: false,
        showsMyPR: false,
        autoLaunched: false,
        subscribedRepositories: ['test/test1', 'test/test2'],
      };
      mockStorage.getSettings.mockReturnValue(savedSettings);

      const { result } = renderUseSetting();

      expect(result.current.setting).toEqual(savedSettings);
    });
  });

  describe('設定情報の保存', () => {
    it('レビューリクエストの通知設定を更新する', () => {
      const { result } = renderUseSetting();

      const updated = !result.current.setting.notifyReviewRequested;
      act(() => {
        result.current.updateNotifyReviewRequested(updated);
      });

      expect(result.current.setting.notifyReviewRequested).toBe(updated);
    });

    it('PRの表示設定を更新する', () => {
      const { result } = renderUseSetting();
      const setting = result.current.setting;

      const updatedRequestedReview = !setting.showsRequestedReviewPR;
      const updatedInReview = !setting.showsInReviewPR;
      const updatedApproved = !setting.showsApprovedPR;
      act(() => {
        result.current.updateShowsPR({
          requestedReview: updatedRequestedReview,
          inReview: updatedInReview,
          approved: updatedApproved,
        });
      });

      expect(result.current.setting.showsRequestedReviewPR).toBe(
        updatedRequestedReview
      );
      expect(result.current.setting.showsInReviewPR).toBe(updatedInReview);
      expect(result.current.setting.showsApprovedPR).toBe(updatedApproved);
    });

    it('自動起動設定を更新する', () => {
      window.ipc = {
        updateAutoLaunch: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      const { result } = renderUseSetting();
      const setting = result.current.setting;

      const updateValue = !setting.autoLaunched;
      act(() => {
        result.current.updateAutoLaunch(!updateValue);
      });

      expect(result.current.setting.autoLaunched).toBe(!updateValue);
      expect(window.ipc.updateAutoLaunch).toBeCalledWith(!updateValue);
    });

    it('PRを監視するリポジトリを追加する', () => {
      const { result } = renderUseSetting();

      const repositories = ['test/test1', 'test/test2'];
      act(() => {
        result.current.addSubscribedRepository(repositories[0]);
      });
      act(() => {
        result.current.addSubscribedRepository(repositories[1]);
      });

      expect(result.current.setting.subscribedRepositories).toEqual(
        repositories
      );
    });

    it('PRを監視するリポジトリを削除する', () => {
      const { result } = renderUseSetting();

      const repositories = ['test/test1', 'test/test2'];
      act(() => {
        result.current.addSubscribedRepository(repositories[0]);
      });
      act(() => {
        result.current.addSubscribedRepository(repositories[1]);
      });
      act(() => {
        result.current.removeSubscribedRepository(repositories[0]);
      });

      expect(result.current.setting.subscribedRepositories).toEqual([
        repositories[1],
      ]);
    });
  });
});
