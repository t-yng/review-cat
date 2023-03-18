import { mock, when, instance } from 'ts-mockito';
import { getPullRequestStatus } from '.';
import { pullRequestStatus, User } from '../models';
import { SearchPullRequest } from './useWatchPullRequests';

describe('usePullRequestStatus', () => {
  describe('getPullRequestStatus', () => {
    const userName = 'test';
    let mockPullRequest: SearchPullRequest;
    let mockUser: User;

    beforeAll(() => {
      mockUser = mock<User>();
      when(mockUser.name).thenReturn(userName);
    });

    beforeEach(() => {
      mockPullRequest = mock<SearchPullRequest>();
    });

    it('requestedReviewer に自分が含まれているときにプルリクエストをレビュー待ちの状態にする', () => {
      when(mockPullRequest.reviewRequests).thenReturn({
        totalCount: 1,
        nodes: [{ requestedReviewer: { login: userName } }],
      });

      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe(pullRequestStatus.waitingReview);
    });

    it('自身の承認済みのレビューが存在するときに対象のプルリクエストを承認済みにする', () => {
      when(mockPullRequest.reviews).thenReturn({
        nodes: [
          {
            state: 'APPROVED',
            author: {
              login: userName,
            },
          },
        ],
      });

      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe(pullRequestStatus.approved);
    });

    it('上記以外の場合はプルリクエストをレビュー済みの状態にする', () => {
      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe(pullRequestStatus.reviewed);
    });
  });
});
