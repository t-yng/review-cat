import { PullRequest, pullRequestStatus, User } from '../models';

const shouldNotify = (
  loginUser: User,
  newPullRequest: PullRequest,
  beforePullRequest?: PullRequest
) => {
  // 自分が作成したプルリクエストの場合はレビュー済みになった状態で通知する
  if (
    newPullRequest.author.name === loginUser.name &&
    newPullRequest.status === pullRequestStatus.reviewed
  ) {
    return true;
  }

  if (beforePullRequest == null) {
    return newPullRequest.status === pullRequestStatus.waitingReview;
  } else if (
    beforePullRequest.status !== newPullRequest.status &&
    newPullRequest.status === pullRequestStatus.waitingReview
  ) {
    return true;
  }

  return false;
};

/**
 * デスクトップ通知をする
 * NOTE: ElectronではレンダラープロセスでHTML5のNotification APIを利用すると
 *       プラットフォームのネイティブ通知が実行される。
 *       許可などの管理もプラットフォームに依存するので、コード上での許可の確認は不要
 * @param pullRequest
 */
const notifyPullRequest = (pullRequest: PullRequest) => {
  new Notification('新着のレビューリクエスト', {
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
