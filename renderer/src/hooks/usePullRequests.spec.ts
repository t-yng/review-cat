import { mock, when, instance } from 'ts-mockito';
import { getPullRequestStatus } from '.';
import { User } from '../models';
import { SearchPullRequest } from './usePullRequests';

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

    it('requestedReviewer に自分が含まれているときに requestedReview の status を設定すること', () => {
      when(mockPullRequest.reviewRequests).thenReturn({
        totalCount: 1,
        nodes: [{ requestedReviewer: { login: userName } }],
      });

      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe('requestedReview');
    });

    it('自身の承認済みのコメントが存在するときに approved の status を設定すること', () => {
      when(mockPullRequest.reviews).thenReturn({
        totalCount: 1,
      });

      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe('approved');
    });

    it('上記以外の場合は reviewing の status を設定すること', () => {
      const status = getPullRequestStatus(
        instance(mockPullRequest),
        instance(mockUser)
      );

      expect(status).toBe('reviewing');
    });
  });
});
