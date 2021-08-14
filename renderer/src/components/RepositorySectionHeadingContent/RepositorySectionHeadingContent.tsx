import React from 'react';
import { Repository } from '../../models/PullRequest';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

export const RepositorySectionHeadingContent: React.FC<Repository> = React.memo(
  ({ nameWithOwner, openGraphImageUrl }) => {
    return (
      <span className={styles.rootStyle}>
        <span className={styles.avatarContainerStyle}>
          <GitHubAvatar src={openGraphImageUrl} alt="" loading="lazy" />
        </span>
        <span className={styles.nameContainerStyle}>{nameWithOwner}</span>
      </span>
    );
  }
);
