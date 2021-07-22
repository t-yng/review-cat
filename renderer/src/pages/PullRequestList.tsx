import React, { FC } from 'react';
import { PreloadedQuery } from 'react-relay';
import { SearchPullRequestsQuery } from '../graphql/queries/__generated__/SearchPullRequestsQuery.graphql';
import { usePullRequests } from '../hooks/usePullRequests';
import { BaseLayout } from '../layouts/BaseLayout';

type Props = {
  preloadedQuery: PreloadedQuery<SearchPullRequestsQuery>;
};

export const PullRequestListPage: FC<Props> = ({ preloadedQuery }: Props) => {
  const { pullRequests } = usePullRequests(preloadedQuery);

  return (
    <BaseLayout>
      {pullRequests?.map((pr, i) => (
        <h1 key={pr.title ?? i}>
          {`${pr.repository}: ${pr.title}(${pr.status})`}
        </h1>
      ))}
    </BaseLayout>
  );
};
