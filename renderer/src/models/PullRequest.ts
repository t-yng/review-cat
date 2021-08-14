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

export type PullRequests = Array<Omit<PullRequest, 'repository'>>;

export interface RepositoryData extends Omit<Repository, 'nameWithOwner'> {
  pullRequests: PullRequests;
}

export type RepositoryMap = Map<string, RepositoryData>;
