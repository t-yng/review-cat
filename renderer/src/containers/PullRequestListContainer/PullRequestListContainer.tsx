import React, { FC } from 'react';
import { usePullRequests } from '../../hooks/usePullRequests';
import { RepositorySection } from '../../components/RepositorySection';
import { PullRequest, Repositories } from '../../models';

// 頻度が多いと Github GraphQL API のレート制限に影響するので、投げるクエリのスコアを計算して調整してください。
// @see: https://docs.github.com/ja/graphql/overview/resource-limitations
const FETCH_PULL_REQUESTS_INTERVAL = 60 * 1000; // ms

/**
 * プルリクエストをリポジトリ毎にまとめる
 */
const groupByRepository = (pullRequests: Array<PullRequest>): Repositories => {
  return pullRequests.reduce(
    (repositories: Repositories, pullRequest: PullRequest) => {
      const { repository, author, title, url, status } = pullRequest;
      const existsRepository = repositories.find(
        (data) => data.nameWithOwner === repository.nameWithOwner
      );
      const addPullRequestData = {
        author: { ...author },
        repository: { ...repository },
        title,
        url,
        status,
      };

      if (existsRepository != undefined) {
        existsRepository.pullRequests.push(addPullRequestData);
      } else {
        repositories.push({
          ...repository,
          pullRequests: [addPullRequestData],
        });
      }

      return repositories;
    },
    []
  );
};

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
