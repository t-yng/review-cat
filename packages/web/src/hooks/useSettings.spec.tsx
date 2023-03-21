import React from 'react';
import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'jotai';
import { useSettings } from './useSettings';

jest.mock('../lib/storage');

describe('useSettings', () => {
  const renderUseSettings = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider>{children}</Provider>
    );
    return renderHook(() => useSettings(), { wrapper });
  };

  describe('updateNotifyReviewRequested', () => {
    it('レビューリクエストの通知設定を更新すること', () => {
      const { result } = renderUseSettings();

      const updated = !result.current.settings.notifyReviewRequested;
      act(() => {
        result.current.updateNotifyReviewRequested(updated);
      });

      expect(result.current.settings.notifyReviewRequested).toBe(updated);
    });
  });

  describe('updateShowsPR', () => {
    it('PRの表示設定を更新すること', () => {
      const { result } = renderUseSettings();
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

  describe('updateAutoLaunch', () => {
    it('自動起動設定を更新する', () => {
      window.ipc = {
        updateAutoLaunch: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      const { result } = renderUseSettings();
      const settings = result.current.settings;

      const updateValue = !settings.autoLaunched;
      act(() => {
        result.current.updateAutoLaunch(!updateValue);
      });

      expect(result.current.settings.autoLaunched).toBe(!updateValue);
      expect(window.ipc.updateAutoLaunch).toBeCalledWith(!updateValue);
    });
  });

  describe('addSubscribedRepositories', () => {
    it('PRを監視するリポジトリを追加すること', () => {
      const { result } = renderUseSettings();

      const repositories = ['test/test1', 'test/test2'];
      act(() => {
        result.current.addSubscribedRepository(repositories[0]);
      });
      act(() => {
        result.current.addSubscribedRepository(repositories[1]);
      });

      expect(result.current.settings.subscribedRepositories).toEqual(
        repositories
      );
    });
  });

  describe('removeSubscribedRepositories', () => {
    it('PRを監視するリポジトリを削除すること', () => {
      const { result } = renderUseSettings();

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

      expect(result.current.settings.subscribedRepositories).toEqual([
        repositories[1],
      ]);
    });
  });
});
