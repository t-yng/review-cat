import { User } from './User';

export interface Repository {
  nameWithOwner: string;
  openGraphImageUrl: string;
}

export const pullRequestStatus = {
  waitingReview: 'waitingReview',
  reviewed: 'reviewed',
  approved: 'approved',
} as const;

export type PullRequestStatus =
  (typeof pullRequestStatus)[keyof typeof pullRequestStatus];

export interface PullRequest {
  title: string;
  url: string;
  author: User;
  repository: Repository;
  status: PullRequestStatus;
}

export interface RepositoryData extends Repository {
  pullRequests: Array<PullRequest>;
}

export type Repositories = Array<RepositoryData>;
