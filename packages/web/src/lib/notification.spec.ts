import { createPullRequest } from '../../test/mocks/factory/pullRequest';
import { createUser } from '../../test/mocks/factory/user';
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

  describe('When the logged-in user is a reviewer of the pull request', () => {
    const loginUser = createUser({ name: 'notification-test' });

    it('Send desktop notification when a new "waiting for review" pull request exists', () => {
      const newPullRequest = createPullRequest({
        title: 'New PR',
        url: 'https://github.com/higeOhige/review-cat/pull/100',
        status: pullRequestStatus.waitingReview,
      });
      const beforePullRequests: PullRequest[] = [
        createPullRequest({ status: pullRequestStatus.reviewed }),
      ];
      const newPullRequests = [...beforePullRequests, newPullRequest];
      notifyPullRequests(loginUser, newPullRequests, beforePullRequests);

      expect(NotificationMock).toBeCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: `${newPullRequest.title}\n${newPullRequest.url}`,
        })
      );
    });

    it('Send desktop notification when the updated pull request changes to "waiting for review"', () => {
      const pullRequest = createPullRequest();
      const newPullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.waitingReview },
      ];
      const beforePullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.reviewed },
      ];
      notifyPullRequests(loginUser, newPullRequests, beforePullRequests);

      expect(NotificationMock).toBeCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.any(String),
        })
      );
    });

    it('Do not send desktop notification when the updated pull request is "reviewed"', () => {
      const pullRequest = createPullRequest();
      const newPullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.approved },
      ];
      const beforePullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.reviewed },
      ];
      notifyPullRequests(loginUser, newPullRequests, beforePullRequests);

      expect(NotificationMock).not.toBeCalled();
    });
  });

  describe('When the pull request is created by self', () => {
    const loginUser = createUser({ name: 'notification-test' });
    const pullRequest = createPullRequest({
      author: loginUser,
    });

    it('Send desktop notification when the updated pull request becomes "reviewed"', () => {
      const newPullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.reviewed },
      ];
      const beforePullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.waitingReview },
      ];
      notifyPullRequests(loginUser, newPullRequests, beforePullRequests);

      expect(NotificationMock).toBeCalled();
    });

    it('Do not send desktop notification if the status remains "reviewed" before and after update', () => {
      const newPullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.reviewed },
      ];
      const beforePullRequests: PullRequest[] = [
        { ...pullRequest, status: pullRequestStatus.reviewed },
      ];
      notifyPullRequests(loginUser, newPullRequests, beforePullRequests);

      expect(NotificationMock).not.toBeCalled();
    });
  });
});
