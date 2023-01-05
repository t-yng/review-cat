import { createRepository } from './repository';
import { createUser } from './user';
import type { PullRequest } from '../../../src/models';

export const createPullRequest = (pullRequest?: Partial<PullRequest>) => {
  const defaultValue: PullRequest = {
    title: 'テストPRです',
    url: 'https://github.com/higeOhige/review-cat/pull/84',
    author: createUser(),
    repository: createRepository(),
    status: 'requestedReview',
  };

  return {
    ...defaultValue,
    ...pullRequest,
  };
};
