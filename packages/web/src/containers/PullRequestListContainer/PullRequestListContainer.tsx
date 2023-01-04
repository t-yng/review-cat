import React, { FC } from 'react';
import { usePullRequests } from '../../hooks/usePullRequests';
import { RepositorySection } from '../../components/RepositorySection';
import { PullRequest, Repositories, Settings } from '../../models';
import { useSettings } from '../../hooks';

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

const filterPullRequests = (
  pullRequests: PullRequest[],
  settings: Settings
) => {
  return pullRequests.filter((pr) => {
    switch (pr.status) {
      case 'requestedReview':
        return settings.showsRequestedReviewPR;
      case 'reviewing':
        return settings.showsInReviewPR;
      case 'approved':
        return settings.showsApprovedPR;
    }
  });
};

export const PullRequestListContainer: FC = () => {
  const { pullRequests, firstLoading } = usePullRequests();
  const { settings } = useSettings();
  const filteredPullRequests = filterPullRequests(pullRequests, settings);
  const repositories = groupByRepository(filteredPullRequests);

  if (firstLoading) {
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
