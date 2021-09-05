import React, { FC } from 'react';
import { usePullRequests } from '../../hooks/usePullRequests';
import { RepositorySection } from '../../components/RepositorySection';
import { groupByRepository } from '../../graphql/mapper';

// 頻度が多いと Github GraphQL API のレート制限に影響するので、投げるクエリのスコアを計算して調整してください。
// @see: https://docs.github.com/ja/graphql/overview/resource-limitations
const FETCH_PULL_REQUESTS_INTERVAL = 60 * 1000; // ms

export const PullRequestListContainer: FC = () => {
  const { pullRequests, loading } = usePullRequests({
    fetchInterval: FETCH_PULL_REQUESTS_INTERVAL,
  });
  const repositories = groupByRepository(pullRequests);

  if (loading) {
    return <h1>Loading...</h1>;
  }

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
