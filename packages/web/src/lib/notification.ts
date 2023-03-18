import { PullRequest, pullRequestStatus } from '../models';

const shouldNotify = (
  newPullRequest: PullRequest,
  beforePullRequest?: PullRequest
) => {
  // TODO: 自分が作成したプルリクエストの場合はレビュー済みになった状態で通知する
  if (beforePullRequest == null) {
    return newPullRequest.status === pullRequestStatus.waitingReview;
  } else {
    return (
      beforePullRequest.status !== newPullRequest.status &&
      newPullRequest.status === pullRequestStatus.waitingReview
    );
  }
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
  newPullRequests: PullRequest[],
  beforePullRequests: PullRequest[]
) => {
  for (const newPullRequest of newPullRequests) {
    const beforePullRequest = beforePullRequests.find(
      (pr) => pr.url === newPullRequest.url
    );

    if (shouldNotify(newPullRequest, beforePullRequest)) {
      notifyPullRequest(newPullRequest);
    }
  }
};
