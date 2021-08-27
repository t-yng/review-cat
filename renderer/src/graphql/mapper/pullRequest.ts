import { PullRequest, Repositories } from '../../models/PullRequest';
import { User } from '../../models/User';
import { SearchPullRequest } from '../queries/SearchPullRequestsQuery';

// レビュー待ちのプルリクエスト: requestedReviewer に自分が含まれている
// 承認済みのプルリクエスト: 自分の state: APPROVED のレビューが存在する
// レビュー中のプルリクエスト: 上記以外のプルリクエスト

export const getPullRequestStatus = (
  pr: SearchPullRequest,
  loginUser: User
): PullRequest['status'] => {
  const isRequestedReview = pr.reviewRequests?.nodes?.some(
    (node) => node?.requestedReviewer?.login === loginUser.name
  );

  if (isRequestedReview) {
    return 'requestedReview';
  }

  const totalCount = pr.reviews?.totalCount ?? 0;
  const isApproved = totalCount > 0;
  if (isApproved) {
    return 'approved';
  }

  return 'reviewing';
};

/**
 * プルリクエストをリポジトリ毎にまとめる
 */
export const groupByRepository = (
  pullRequests: Array<PullRequest>
): Repositories => {
  return pullRequests.reduce(
    (repositories: Repositories, pullRequest: PullRequest) => {
      const { repository, author, title, url, status } = pullRequest;
      const existsRepository = repositories.find(
        (data) => data.nameWithOwner === repository.nameWithOwner
      );
      const addPullRequestData = {
        author: { ...author },
        repository: { ...repository },
        title,
        url,
        status,
      };

      if (existsRepository != undefined) {
        existsRepository.pullRequests.push(addPullRequestData);
      } else {
        repositories.push({
          ...repository,
          pullRequests: [addPullRequestData],
        });
      }

      return repositories;
    },
    []
  );
};

const toModelFromSearchPullRequest = (
  pr: SearchPullRequest,
  loginUser: User
): PullRequest => {
  const basePullRequest: Omit<PullRequest, 'status'> = {
    title: pr.title ?? '',
    url: pr.url ?? '',
    repository: {
      nameWithOwner: pr.repository?.nameWithOwner ?? '',
      openGraphImageUrl: pr.repository?.openGraphImageUrl ?? '',
    },
    author: {
      name: pr.author?.login ?? '',
      avatarUrl: pr.author?.avatarUrl ?? '',
    },
  };

  return {
    ...basePullRequest,
    status: getPullRequestStatus(pr, loginUser),
  };
};

export const pullRequestMapper = {
  toModelFromSearchPullRequest,
};
