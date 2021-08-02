import { User } from './User';

interface Repository {
  nameWithOwner: string;
}

type PullRequestStatus = 'requestedReview' | 'reviewing' | 'approved';

export interface PullRequest {
  title: string;
  url: string;
  author: User;
  repository: Repository;
  status: PullRequestStatus;
}
