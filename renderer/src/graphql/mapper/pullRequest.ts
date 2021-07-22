import { PullRequest } from 'renderer/src/models/PullRequest';
import { SearchPullRequest } from '../queries/__generated__/SearchPullRequest.graphql';
import { SearchPullRequestViewer } from '../queries/__generated__/SearchPullRequestViewer.graphql';

// レビュー待ちのプルリクエスト: requestedReviewer に自分が含まれている
// 承認済みのプルリクエスト: 自分の state: APPROVED のレビューが存在する
// レビュー中のプルリクエスト: 上記以外のプルリクエスト

export const getPullRequestStatus = (
  pr: SearchPullRequest,
  viewer: SearchPullRequestViewer
): PullRequest['status'] => {
  const isRequestedReview = pr?.reviewRequests?.nodes?.some(
    (node) => node?.requestedReviewer?.login === viewer.login
  );

  if (isRequestedReview) {
    return 'requestedReview';
  }

  const totalCount = pr?.reviews?.totalCount ?? 0;
  const isApproved = totalCount > 0;
  if (isApproved) {
    return 'approved';
  }

  return 'reviewing';
};

const toModelFromSearchPullRequest = (
  pr: SearchPullRequest,
  viewer: SearchPullRequestViewer
): PullRequest => {
  const basePullRequest: Omit<PullRequest, 'status'> = {
    title: pr?.title ?? '',
    repository: {
      nameWithOwner: pr?.repository?.nameWithOwner ?? '',
    },
    author: {
      name: pr?.author?.login ?? '',
      avatarUrl: (pr?.author?.avatarUrl as string) ?? '',
    },
  };

  return {
    ...basePullRequest,
    status: getPullRequestStatus(pr, viewer),
  };
};

export const pullRequestMapper = {
  toModelFromSearchPullRequest,
};
