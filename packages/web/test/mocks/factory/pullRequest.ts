import { createRepository } from './repository';
import { createUser } from './user';
import { PullRequest, pullRequestStatus } from '../../../src/models';

export const createPullRequest = (pullRequest?: Partial<PullRequest>) => {
  const defaultValue: PullRequest = {
    title: 'テストPRです',
    url: 'https://github.com/higeOhige/review-cat/pull/84',
    author: createUser(),
    repository: createRepository(),
    status: pullRequestStatus.waitingReview,
  };

  return {
    ...defaultValue,
    ...pullRequest,
  };
};
