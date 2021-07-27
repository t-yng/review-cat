import { User } from 'renderer/src/models';
import { mock, when, instance } from 'ts-mockito';
import { SearchPullRequest } from '../queries/SearchPullRequestsQuery';
import { pullRequestMapper } from './pullRequest';

describe('mapper/pullRequest', () => {
  describe('toModelFromSearchPullRequest', () => {
    const toModelFromSearchPullRequest =
      pullRequestMapper.toModelFromSearchPullRequest;

    describe('ステータスの設定', () => {
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

        const pullRequest = toModelFromSearchPullRequest(
          instance(mockPullRequest),
          instance(mockUser)
        );

        expect(pullRequest.status).toBe('requestedReview');
      });

      it('自身の承認済みのコメントが存在するときに approved の status を設定すること', () => {
        when(mockPullRequest.reviews).thenReturn({
          totalCount: 1,
        });

        const pullRequest = toModelFromSearchPullRequest(
          instance(mockPullRequest),
          instance(mockUser)
        );

        expect(pullRequest.status).toBe('approved');
      });

      it('上記以外の場合は reviewing の status を設定すること', () => {
        const pullRequest = toModelFromSearchPullRequest(
          instance(mockPullRequest),
          instance(mockUser)
        );

        expect(pullRequest.status).toBe('reviewing');
      });
    });
  });
});
