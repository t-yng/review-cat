import { FC } from 'react';
import { useSetting, useAuth, usePullRequests } from '@/stores';
import { RepositorySection } from '@/components/RepositorySection';
import {
  PullRequest,
  pullRequestStatus,
  Repositories,
  Settings,
  User,
} from '@/models';

/**
 * Groups pull requests by repository
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
  settings: Settings,
  loginUser: User | null
) => {
  return pullRequests.filter((pr) => {
    // If the display setting for own pull requests is OFF, exclude own pull requests
    if (pr.author.name === loginUser?.name && !settings.showsMyPR) {
      return false;
    }

    switch (pr.status) {
      case pullRequestStatus.waitingReview:
        return settings.showsRequestedReviewPR;
      case pullRequestStatus.reviewed:
        return settings.showsInReviewPR;
      case pullRequestStatus.approved:
        return settings.showsApprovedPR;
      default:
    }
  });
};

export const PullRequestListContainer: FC = () => {
  const { pullRequests } = usePullRequests();
  const { setting } = useSetting();
  const { user } = useAuth();
  const filteredPullRequests = filterPullRequests(pullRequests, setting, user);
  const repositories = groupByRepository(filteredPullRequests);

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
