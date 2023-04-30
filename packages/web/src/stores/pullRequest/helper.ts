import { PullRequest, pullRequestStatus, User } from '@/models';
import {
  RequestedReviewerFragment,
  SearchPullRequestFragment,
} from '@/gql/generated';

/**
 * プルリクエストのステータス文字列を生成する
 *
 * ステータス:
 *   requestedReview(レビュー待ち): requestedReviewer に自分が含まれている
 *   approved(承認済み): 自分の state: APPROVED のレビューが存在する
 *   reviewed(レビュー済み): 上記以外のプルリクエスト
 */
export const getPullRequestStatus = (
  pr: SearchPullRequestFragment,
  loginUser: User
): PullRequest['status'] => {
  const reviewRequestedAuthors =
    pr.reviewRequests?.nodes
      ?.map((n) => n?.requestedReviewer)
      ?.filter(
        (reviewer): reviewer is RequestedReviewerFragment =>
          reviewer?.__typename === 'User'
      )
      .map((reviewer) => reviewer.login) ?? [];
  const reviewAuthors = pr.reviews?.nodes?.map((n) => n?.author?.login) ?? [];
  const reviewers = Array.from(
    new Set([...reviewRequestedAuthors, ...reviewAuthors])
  );

  const approvedReviewAuthors =
    pr.reviews?.nodes
      ?.filter((n) => n?.state === 'APPROVED')
      .map((n) => n?.author?.login) ?? [];

  // PRのオーナーが自分の場合のプルリクのステータス
  if (pr.author?.login === loginUser.name) {
    // approvedしているユーザーがレビュアーに含まれていない
    const approved =
      approvedReviewAuthors.some(
        (approvedAuthor) => !reviewers.includes(approvedAuthor)
      ) || pr.reviewDecision === 'APPROVED';
    // レビューリクエストに全てのレビュアーが含まれていたらレビュー待ちと判定
    if (reviewRequestedAuthors.length === reviewers.length) {
      return pullRequestStatus.waitingReview;
    } else if (approved) {
      return pullRequestStatus.approved;
    } else {
      return pullRequestStatus.reviewed;
    }
  }
  // PRのオーナーが自分以外の場合のプルリクのステータス
  else {
    // reviewRequests に自分が含まれている場合はレビュー待ちと判定
    if (reviewRequestedAuthors.includes(loginUser.name)) {
      return pullRequestStatus.waitingReview;
    }
    // 自分が承認済みのレビューがある場合は承認済みと判定
    else if (approvedReviewAuthors.includes(loginUser.name)) {
      return pullRequestStatus.approved;
    } else {
      return pullRequestStatus.reviewed;
    }
  }
};

export const toModelFromSearchPullRequest = (
  pr: SearchPullRequestFragment,
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
