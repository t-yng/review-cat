import { atom } from 'recoil';
import { PullRequest } from '@/models';

export const pullRequestsState = atom<PullRequest[]>({
  key: 'pullRequestsState',
  default: [],
});

export const firstLoadingState = atom<boolean>({
  key: 'firstLoadingPullRequestsState',
  default: false,
});
