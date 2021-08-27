import React, { FC } from 'react';
import { PreloadedQuery } from 'react-relay';
import { SearchPullRequestsQuery } from '../../graphql/queries/__generated__/SearchPullRequestsQuery.graphql';
import { usePullRequests } from '../../hooks/usePullRequests';
import { RepositorySection } from '../../components/RepositorySection';
import { groupByRepository } from '../../graphql/mapper';

type Props = {
  preloadedQuery: PreloadedQuery<SearchPullRequestsQuery>;
};

export const PullRequestListContainer: FC<Props> = ({
  preloadedQuery,
}: Props) => {
  const { pullRequests } = usePullRequests(preloadedQuery);
  const repositories = groupByRepository(pullRequests);
  return (
    <>
      {repositories.map((repository, i) => {
        return (
          <RepositorySection
            key={repository.nameWithOwner ?? i}
            repository={repository}
          />
        );
      })}
    </>
  );
};
