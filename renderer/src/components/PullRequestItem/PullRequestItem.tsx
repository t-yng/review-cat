import React from 'react';
import { PullRequest } from '../../models';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

interface Props {
  pullRequest: PullRequest;
}

export const PullRequestItem: React.FC<Props> = ({ pullRequest }) => {
  const { author, url, title, status } = pullRequest;

  return (
    <a
      className={styles.rootStyle}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.avatarContainerStyle}>
        <GitHubAvatar
          {...{
            src: author.avatarUrl,
            alt: `author is ${author.name}`,
            loading: 'lazy',
          }}
        />
      </span>
      <span className={styles.prAuthorNameStyle}>{title}</span>
      <span className={styles.prStatusTextStyle}>{status}</span>
    </a>
  );
};
