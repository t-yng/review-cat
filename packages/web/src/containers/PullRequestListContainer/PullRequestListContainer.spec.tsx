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
import * as useSettingsHook from '../../hooks/useSettings';

jest.mock('../../hooks/useSettings', () => {
  const actualModule = jest.requireActual('../../hooks/useSettings');
  return {
    __esModule: true,
    ...actualModule,
  };
});

jest.mock('../../hooks/usePullRequests', () => {
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
  describe('filterPullRequests', () => {
    // let settingsMock: Settings;
    // let spyUseSettings: SpyUserSettings;

    // beforeEach(() => {
    //   // settingsMock = mock<Settings>();
    //   // spyUseSettings = jest.spyOn(useSettingsHook, 'useSettings');
    // });

    it.each([
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
      (cases) => {
        const settingsMock = mock<Settings>();
        when(settingsMock.showsRequestedReviewPR).thenReturn(
          cases.showsRequestedReviewPR
        );
        when(settingsMock.showsInReviewPR).thenReturn(cases.showsInReviewPR);
        when(settingsMock.showsApprovedPR).thenReturn(cases.showsApprovedPR);

        jest.spyOn(useSettingsHook, 'useSettings').mockReturnValue({
          settings: instance(settingsMock),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        render(<PullRequestListContainer />);

        const requestedReviewPullRequest = screen.queryByText('レビュー待ち');
        const reviewingPullRequest = screen.queryByText('レビュー中');
        const approvedPullRequest = screen.queryByText('承認済');

        if (cases.showsRequestedReviewPR) {
          expect(requestedReviewPullRequest).toBeInTheDocument();
        } else {
          expect(requestedReviewPullRequest).not.toBeInTheDocument();
        }

        if (cases.showsInReviewPR) {
          expect(reviewingPullRequest).toBeInTheDocument();
        } else {
          expect(reviewingPullRequest).not.toBeInTheDocument();
        }

        if (cases.showsApprovedPR) {
          expect(approvedPullRequest).toBeInTheDocument();
        } else {
          expect(approvedPullRequest).not.toBeInTheDocument();
        }
      }
    );
  });
});
