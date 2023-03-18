import { createPullRequest } from '../../test/mocks/factory/pullRequest';
import { PullRequest, pullRequestStatus } from '../models';
import { notifyPullRequests } from './notification';

describe('lib/notification', () => {
  const NotificationOriginal = window.Notification;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let NotificationMock: jest.MockedFunction<any>;

  beforeEach(() => {
    NotificationMock = jest.fn();
    NotificationMock.permission = 'granted';
    window.Notification = NotificationMock;
  });

  afterEach(() => {
    window.Notification = NotificationOriginal;
  });

  it('新しい「レビュー待ち」のプルリクエストが存在したらデスクトップ通知をする', () => {
    const newPullRequest = createPullRequest({
      title: '新しいPR',
      url: 'https://github.com/higeOhige/review-cat/pull/100',
      status: pullRequestStatus.waitingReview,
    });
    const beforePullRequests: PullRequest[] = [
      createPullRequest({ status: pullRequestStatus.reviewed }),
    ];
    const newPullRequests = [...beforePullRequests, newPullRequest];
    notifyPullRequests(newPullRequests, beforePullRequests);

    expect(NotificationMock).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: `${newPullRequest.title}\n${newPullRequest.url}`,
      })
    );
  });

  it('更新後のプルリクエストが「レビュー待ち」に更新された時にデスクトップ通知をする', () => {
    const pullRequest = createPullRequest();
    const newPullRequests: PullRequest[] = [
      { ...pullRequest, status: pullRequestStatus.waitingReview },
    ];
    const beforePullRequests: PullRequest[] = [
      { ...pullRequest, status: pullRequestStatus.reviewed },
    ];
    notifyPullRequests(newPullRequests, beforePullRequests);

    expect(NotificationMock).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.any(String),
      })
    );
  });

  it('更新後のプルリクエストが「レビュー済み」の場合はデスクトップ通知をしない', () => {
    const pullRequest = createPullRequest();
    const newPullRequests: PullRequest[] = [
      { ...pullRequest, status: pullRequestStatus.approved },
    ];
    const beforePullRequests: PullRequest[] = [
      { ...pullRequest, status: pullRequestStatus.reviewed },
    ];
    notifyPullRequests(newPullRequests, beforePullRequests);

    expect(NotificationMock).not.toBeCalled();
  });

  it.todo(
    '自分が作成したプルリクエストの場合は「レビュー済み」になった時にデスクトップ通知する'
  );
});
