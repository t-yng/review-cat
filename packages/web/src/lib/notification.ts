import { PullRequest, pullRequestStatus, User } from '../models';

const shouldNotify = (
  loginUser: User,
  newPullRequest: PullRequest,
  beforePullRequest?: PullRequest
) => {
  // Do not notify if the pull request status has not changed
  if (beforePullRequest?.status === newPullRequest.status) {
    return false;
  }

  // For pull requests created by self, notify when the status becomes reviewed
  if (newPullRequest.author.name === loginUser.name) {
    return newPullRequest.status === pullRequestStatus.reviewed;
  }

  // For pull requests where self is the reviewer
  return newPullRequest.status === pullRequestStatus.waitingReview;
};

/**
 * Send desktop notification
 * NOTE: In Electron, using the HTML5 Notification API in the renderer process
 *       executes a platform native notification.
 *       Permission management depends on the platform, so no need to check permissions in code
 * @param pullRequest
 */
const notifyPullRequest = (pullRequest: PullRequest) => {
  new Notification('New review request', {
    body: `${pullRequest.title}\n${pullRequest.url}`,
    requireInteraction: true,
  });
};

export const notifyPullRequests = (
  loginUser: User,
  newPullRequests: PullRequest[],
  beforePullRequests: PullRequest[]
) => {
  for (const newPullRequest of newPullRequests) {
    const beforePullRequest = beforePullRequests.find(
      (pr) => pr.url === newPullRequest.url
    );

    if (shouldNotify(loginUser, newPullRequest, beforePullRequest)) {
      notifyPullRequest(newPullRequest);
    }
  }
};
