import React, { FC } from 'react';
import { usePullRequests } from '../../hooks/usePullRequests';
import { RepositorySection } from '../../components/RepositorySection';
import {
  PullRequest,
  pullRequestStatus,
  Repositories,
  Settings,
  User,
} from '../../models';
import { useSettings } from '../../hooks';
import { useAtom } from 'jotai';
import { loginUserAtom } from '../../jotai';

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
  settings: Settings,
  loginUser: User | null
) => {
  return pullRequests.filter((pr) => {
    // 自分のプルリクエストの表示設定がOFFの場合は自分のプルリクエストを除外
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
  const { pullRequests, firstLoading } = usePullRequests();
  const { settings } = useSettings();
  const [user] = useAtom(loginUserAtom);
  const filteredPullRequests = filterPullRequests(pullRequests, settings, user);
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
