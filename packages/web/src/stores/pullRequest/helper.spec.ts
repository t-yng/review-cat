import { mock, when, instance } from 'ts-mockito';
import { getPullRequestStatus } from './helper';
import { pullRequestStatus, User } from '../../models';
import { SearchPullRequestFragment } from '@/gql/generated';

describe('stores/pullRequest/helper', () => {
  describe('getPullRequestStatus', () => {
    const userName = 'test';
    let mockPullRequest: SearchPullRequestFragment;
    let mockUser: User;

    beforeAll(() => {
      mockUser = mock<User>();
      when(mockUser.name).thenReturn(userName);
    });

    beforeEach(() => {
      mockPullRequest = mock<SearchPullRequestFragment>();
    });

    it('requestedReviewer に自分が含まれているときにプルリクエストをレビュー待ちの状態にする', () => {
      when(mockPullRequest.reviewRequests).thenReturn({
        totalCount: 1,
        nodes: [
          {
            requestedReviewer: {
              __typename: 'User',
              login: userName,
            },
          },
        ],
      });
      when(mockPullRequest.reviews).thenReturn({
        nodes: [],
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
      when(mockPullRequest.reviews).thenReturn({
        nodes: [],
      });

      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe(pullRequestStatus.reviewed);
    });
  });
});
