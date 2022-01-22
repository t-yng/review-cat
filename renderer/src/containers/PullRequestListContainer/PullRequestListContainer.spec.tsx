import React from 'react';
import { render, screen } from '@testing-library/react';
import { instance, mock, when } from 'ts-mockito';
import {
  PullRequest,
  PullRequestStatus,
  Repository,
  Settings,
  User,
} from '../../models';
import { PullRequestListContainer } from './PullRequestListContainer';
import * as useSettingsModule from '../../hooks/useSettings';
import { JestMockCompat, vi } from 'vitest';
import { testEach } from '../../../../test/helpers/testEach';

type SpyUserSettings = JestMockCompat<
  [],
  Partial<ReturnType<typeof useSettingsModule.useSettings>>
>;

vi.mock('../../hooks/usePullRequests', () => {
  const pullRequests = [
    'requestedReview' as const,
    'reviewing' as const,
    'approved' as const,
  ].map((status: PullRequestStatus) => {
    const repositoryMock = mock<Repository>();
    when(repositoryMock.nameWithOwner).thenReturn('test');
    const repository = instance(repositoryMock);

    const authorMock = mock<User>();
    when(authorMock.avatarUrl).thenReturn('');
    when(authorMock.name).thenReturn('');
    const author = instance(authorMock);

    const pullRequestMock = mock<PullRequest>();
    when(pullRequestMock.status).thenReturn(status);
    when(pullRequestMock.repository).thenReturn(repository);
    when(pullRequestMock.author).thenReturn(author);
    when(pullRequestMock.url).thenReturn('');
    when(pullRequestMock.title).thenReturn('');
    return instance(pullRequestMock);
  });

  return {
    usePullRequests: () => ({
      pullRequests: pullRequests,
    }),
  };
});

describe('PullRequestListContainer', () => {
  describe.skip('filterPullRequests', () => {
    let settingsMock: Settings;
    let spyUseSettings: SpyUserSettings;

    beforeEach(() => {
      settingsMock = mock<Settings>();
      spyUseSettings = vi.spyOn(useSettingsModule, 'useSettings');
    });

    testEach([
      {
        statusText: 'レビュー待ち',
        showsRequestedReviewPR: false,
        showsInReviewPR: true,
        showsApprovedPR: true,
      },
      {
        statusText: 'レビュー中',
        showsRequestedReviewPR: true,
        showsInReviewPR: false,
        showsApprovedPR: true,
      },
      {
        statusText: '承認済',
        showsRequestedReviewPR: true,
        showsInReviewPR: true,
        showsApprovedPR: false,
      },
    ])(
      '$statusText の表示をOFFにした時にプルリクスト一覧から除外する',
      (testCase: any) => {
        when(settingsMock.showsRequestedReviewPR).thenReturn(
          testCase.showsRequestedReviewPR
        );
        when(settingsMock.showsInReviewPR).thenReturn(testCase.showsInReviewPR);
        when(settingsMock.showsApprovedPR).thenReturn(testCase.showsApprovedPR);

        spyUseSettings.mockReturnValue({
          settings: instance(settingsMock),
        });

        render(<PullRequestListContainer />);

        const requestedReviewPullRequest = screen.queryByText('レビュー待ち');
        const reviewingPullRequest = screen.queryByText('レビュー中');
        const approvedPullRequest = screen.queryByText('承認済');

        if (testCase.showsRequestedReviewPR) {
          expect(requestedReviewPullRequest).toBeInTheDocument();
        } else {
          expect(requestedReviewPullRequest).not.toBeInTheDocument();
        }

        if (testCase.showsInReviewPR) {
          expect(reviewingPullRequest).toBeInTheDocument();
        } else {
          expect(reviewingPullRequest).not.toBeInTheDocument();
        }

        if (testCase.showsApprovedPR) {
          expect(approvedPullRequest).toBeInTheDocument();
        } else {
          expect(approvedPullRequest).not.toBeInTheDocument();
        }
      }
    );
  });
});
