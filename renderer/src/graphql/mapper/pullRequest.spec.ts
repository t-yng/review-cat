import { mock, when, instance } from 'ts-mockito';
import { SearchPullRequest } from '../queries/__generated__/SearchPullRequest.graphql';
import { SearchPullRequestViewer } from '../queries/__generated__/SearchPullRequestViewer.graphql';
import { pullRequestMapper } from './pullRequest';

describe('mapper/pullRequest', () => {
  describe('toModelFromSearchPullRequest', () => {
    const toModelFromSearchPullRequest =
      pullRequestMapper.toModelFromSearchPullRequest;

    describe('ステータスの設定', () => {
      const loginUser = 'test';
      let mockPullRequest: SearchPullRequest;
      let mockViewer: SearchPullRequestViewer;

      beforeAll(() => {
        mockViewer = mock<SearchPullRequestViewer>();
        when(mockViewer.login).thenReturn(loginUser);
      });

      beforeEach(() => {
        mockPullRequest = mock<SearchPullRequest>();
      });

      it('requestedReviewer に自分が含まれているときに requestedReview の status を設定すること', () => {
        when(mockPullRequest.reviewRequests).thenReturn({
          totalCount: 1,
          nodes: [{ requestedReviewer: { login: loginUser } }],
        });

        const pullRequest = toModelFromSearchPullRequest(
          instance(mockPullRequest),
          instance(mockViewer)
        );

        expect(pullRequest.status).toBe('requestedReview');
      });

      it('自身の承認済みのコメントが存在するときに approved の status を設定すること', () => {
        when(mockPullRequest.reviews).thenReturn({
          totalCount: 1,
        });

        const pullRequest = toModelFromSearchPullRequest(
          instance(mockPullRequest),
          instance(mockViewer)
        );

        expect(pullRequest.status).toBe('approved');
      });

      it('上記以外の場合は reviewing の status を設定すること', () => {
        const pullRequest = toModelFromSearchPullRequest(
          instance(mockPullRequest),
          instance(mockViewer)
        );

        expect(pullRequest.status).toBe('reviewing');
      });
    });
  });
});
