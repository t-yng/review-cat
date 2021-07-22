interface User {
  name: string;
  avatarUrl: string;
}

interface Repository {
  nameWithOwner: string;
}

type PullRequestStatus = 'requestedReview' | 'reviewing' | 'approved';

export interface PullRequest {
  title: string;
  author: User;
  repository: Repository;
  status: PullRequestStatus;
}
