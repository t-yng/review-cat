import React from 'react';
import {
  PullRequest,
  PullRequestStatus,
  RepositoryData,
} from '../../models/PullRequest';
import { RepositorySectionHeadingContent } from '../RepositorySectionHeadingContent';
import { PullRequestItem } from '../PullRequestItem';
import { styles } from './styles.css';

interface Props {
  repository: RepositoryData;
}

export const RepositorySection: React.FC<Props> = ({ repository }) => {
  const sortPullRequests = (pullRequests: PullRequest[]) => {
    const priority: { [key in PullRequestStatus]: number } = {
      requestedReview: 1,
      reviewing: 2,
      approved: 3,
    };

    return [...pullRequests].sort((a, b) => {
      return priority[a.status] - priority[b.status];
    });
  };

  return (
    <section>
      <h1>
        <RepositorySectionHeadingContent {...repository} />
      </h1>

      <ul>
        {sortPullRequests(repository.pullRequests).map((pullRequest, i) => (
          <li
            key={pullRequest.url ?? pullRequest.title ?? i}
            className={styles.listItemStyle}
          >
            <PullRequestItem pullRequest={pullRequest} />
          </li>
        ))}
      </ul>
    </section>
  );
};
