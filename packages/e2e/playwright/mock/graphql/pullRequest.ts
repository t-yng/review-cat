type SearchPullRequest = {
  headRefName: string;
  title: string;
  url: string;
  reviewDecision: 'APPROVED' | 'CHANGES_REQUESTED' | 'REVIEW_REQUIRED' | null;
  author: {
    avatarUrl: string;
    login: string;
  };
  repository: {
    nameWithOwner: string;
    openGraphImageUrl: string;
  };
  reviews: {
    nodes: Array<{
      __typename: 'PullRequestReview';
      state:
        | 'APPROVED'
        | 'CHANGES_REQUESTED'
        | 'COMMENTED'
        | 'DISMISSED'
        | 'PENDING';
      author: {
        login: string;
      };
    }>;
  };
  reviewRequests: {
    totalCount: number;
    nodes: Array<{
      requestedReviewer: {
        __typename: 'User';
        login: string;
      };
    }>;
  };
};

export const createSearchPullRequest = (
  pullRequest?: Partial<SearchPullRequest>
) => {
  const defaultValue = {
    // __typenameの値が無いとApolloで空オブジェクトになる
    __typename: 'PullRequest',
    headRefName: 'feat/tauri',
    title: 'フレームワークをElectronからTauriへ移行',
    url: 'https://github.com/t-yng/review-cat/pull/159',
    reviewDecision: null,
    author: {
      avatarUrl:
        'https://avatars.githubusercontent.com/u/11068883?u=36aaadc6fa8cb52c40c67c348958a9bf2934261e&v=4',
      login: 't-yng',
    },
    repository: {
      nameWithOwner: 't-yng/review-cat',
      openGraphImageUrl:
        'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
    },
    reviews: {
      nodes: [],
    },
    reviewRequests: {
      totalCount: 0,
      nodes: [],
    },
  };

  return {
    ...defaultValue,
    ...pullRequest,
  };
};
