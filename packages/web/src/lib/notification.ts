import { PullRequest, pullRequestStatus, User } from '../models';

const shouldNotify = (
  loginUser: User,
  newPullRequest: PullRequest,
  beforePullRequest?: PullRequest
) => {
  // プルリクエストのステータスが変更されていない場合は通知しない
  if (beforePullRequest?.status === newPullRequest.status) {
    return false;
  }

  // 自分が作成したプルリクエストの場合はレビュー済みになった状態で通知する
  if (newPullRequest.author.name === loginUser.name) {
    return newPullRequest.status === pullRequestStatus.reviewed;
  }

  // 自分がレビュアーのプルリクエストの場合
  return newPullRequest.status === pullRequestStatus.waitingReview;
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
