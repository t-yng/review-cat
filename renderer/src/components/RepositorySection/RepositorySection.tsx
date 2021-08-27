import React from 'react';
import { RepositoryData } from '../../models/PullRequest';
import { RepositorySectionHeadingContent } from '../RepositorySectionHeadingContent';
import { PullRequestItem } from '../PullRequestItem';
import { styles } from './styles.css';

interface Props {
  repository: RepositoryData;
}

export const RepositorySection: React.FC<Props> = ({ repository }) => {
  return (
    <section>
      <h1>
        <RepositorySectionHeadingContent {...repository} />
      </h1>

      <ul>
        {repository.pullRequests.map((pullRequest, i) => (
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
