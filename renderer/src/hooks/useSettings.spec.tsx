import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'jotai';
import { FC } from 'react';
import { useSettings } from './useSettings';

jest.mock('../lib/storage');

describe('useSettings', () => {
  const wrapper: FC = ({ children }) => {
    return <Provider>{children}</Provider>;
  };

  describe('updateNotifyReviewRequested', () => {
    it('レビューリクエストの通知設定が更新されること', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      const updated = !result.current.settings.notifyReviewRequested;
      act(() => {
        result.current.updateNotifyReviewRequested(updated);
      });

      expect(result.current.settings.notifyReviewRequested).toBe(updated);
    });
  });

  describe('updateShowsPR', () => {
    it('PRの表示設定が更新されること', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });
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

  describe('updateSubscribedPRList', () => {
    it('PRの監視するリポジトリの一覧が更新されること', () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      const prList = ['test/test1', 'test/test2'];
      act(() => {
        result.current.updateSubscribedPRList(prList);
      });

      expect(result.current.settings.subscribedPRList).toEqual(prList);
    });
  });
});
