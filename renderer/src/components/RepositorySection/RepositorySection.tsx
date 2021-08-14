import React from 'react';
import { PullRequest } from '../../models/PullRequest';
import { RepositorySectionHeadingContent } from '../RepositorySectionHeadingContent';
import { PullRequestItem } from '../PullRequestItem';
import { styles } from './styles.css';

interface Props {
  pullRequest: PullRequest;
}

export const RepositorySection: React.FC<Props> = ({ pullRequest }) => {
  return (
    <section>
      <h1>
        <RepositorySectionHeadingContent {...pullRequest.repository} />
      </h1>

      <ul>
        <li className={styles.listItemStyle}>
          <PullRequestItem pullRequest={pullRequest} />
        </li>
      </ul>
    </section>
  );
};
