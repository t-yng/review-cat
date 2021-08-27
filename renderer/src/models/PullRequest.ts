import { User } from './User';

export interface Repository {
  nameWithOwner: string;
  openGraphImageUrl: string;
}

type PullRequestStatus = 'requestedReview' | 'reviewing' | 'approved';

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
