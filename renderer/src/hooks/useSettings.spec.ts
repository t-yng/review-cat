import { renderHook, act } from '@testing-library/react-hooks';
import { useSettings } from './useSettings';

jest.mock('../lib/storage');

describe('useSettings', () => {
  describe('updateNotifyReviewRequested', () => {
    it('レビューリクエストの通知設定が更新されること', () => {
      const { result } = renderHook(() => useSettings());

      const updated = !result.current.settings.notifyReviewRequested;
      act(() => {
        result.current.updateNotifyReviewRequested(updated);
      });

      expect(result.current.settings.notifyReviewRequested).toBe(updated);
    });
  });

  describe('updateShowsPR', () => {
    it('PRの表示設定が更新されること', () => {
      const { result } = renderHook(() => useSettings());
      const settings = result.current.settings;

      const updatedRequestedReview = !settings.showsRequestedReviewPR;
      const updatedInReview = !settings.showsInReviewPR;
      const updatedApproved = !settings.showsApprovedPR;
      act(() => {
        result.current.updateShowsPR({
          requestedReview: updatedRequestedReview,
          inReview: updatedInReview,
          approved: updatedApproved,
        });
      });

      expect(result.current.settings.showsRequestedReviewPR).toBe(
        updatedRequestedReview
      );
      expect(result.current.settings.showsInReviewPR).toBe(updatedInReview);
      expect(result.current.settings.showsApprovedPR).toBe(updatedApproved);
    });
  });

  describe('updateSubscribedRepositories', () => {
    it('PRを監視するリポジトリの一覧が更新されること', () => {
      const { result } = renderHook(() => useSettings());

      const repositories = ['test/test1', 'test/test2'];
      act(() => {
        result.current.updateSubscribedRepositories(repositories);
      });

      expect(result.current.settings.subscribedRepositories).toEqual(
        repositories
      );
    });
  });
});
