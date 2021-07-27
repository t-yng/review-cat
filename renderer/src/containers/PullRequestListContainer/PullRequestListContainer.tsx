import React, { FC } from 'react';
import { PreloadedQuery } from 'react-relay';
import { SearchPullRequestsQuery } from '../../graphql/queries/__generated__/SearchPullRequestsQuery.graphql';
import { usePullRequests } from '../../hooks/usePullRequests';
import { PullRequestList } from '../../components/PullRequestList';

type Props = {
  preloadedQuery: PreloadedQuery<SearchPullRequestsQuery>;
};

export const PullRequestListContainer: FC<Props> = ({
  preloadedQuery,
}: Props) => {
  const { pullRequests } = usePullRequests(preloadedQuery);

  return <PullRequestList pullRequests={pullRequests} />;
};
