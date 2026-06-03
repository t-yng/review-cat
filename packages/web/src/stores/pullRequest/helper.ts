import { PullRequest, pullRequestStatus, User } from '@/models';
import {
  RequestedReviewerFragment,
  SearchPullRequestFragment,
} from '@/gql/generated';

/**
 * Generate pull request status string
 *
 * Status:
 *   requestedReview(waiting for review): self is included in requestedReviewer
 *   approved: a review with own state: APPROVED exists
 *   reviewed: pull requests other than the above
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

  // Pull request status when the PR owner is self
  if (pr.author?.login === loginUser.name) {
    // User who has approved is not included in reviewers
    const approved =
      approvedReviewAuthors.some(
        (approvedAuthor) => !reviewers.includes(approvedAuthor)
      ) || pr.reviewDecision === 'APPROVED';
    // If all reviewers are in the review request, determine as waiting for review
    if (reviewRequestedAuthors.length === reviewers.length) {
      return pullRequestStatus.waitingReview;
    } else if (approved) {
      return pullRequestStatus.approved;
    } else {
      return pullRequestStatus.reviewed;
    }
  }
  // Pull request status when the PR owner is someone else
  else {
    // If self is in reviewRequests, determine as waiting for review
    if (reviewRequestedAuthors.includes(loginUser.name)) {
      return pullRequestStatus.waitingReview;
    }
    // If there is an approved review from self, determine as approved
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
