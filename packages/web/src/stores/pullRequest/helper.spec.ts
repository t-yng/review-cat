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

    it('Sets the pull request to waiting for review status when self is included in requestedReviewer', () => {
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

    it('Marks the target pull request as approved when an approved review from self exists', () => {
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

    it('Sets the pull request to reviewed status in all other cases', () => {
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
