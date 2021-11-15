import React from 'react';
import { PullRequest, PullRequestStatus } from '../../models';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

interface Props {
  pullRequest: PullRequest;
}

export const PullRequestItem: React.FC<Props> = ({ pullRequest }) => {
  const { author, url, title, status } = pullRequest;

  const statusLabel: { [key in PullRequestStatus]: string } = {
    requestedReview: 'レビュー待ち',
    reviewing: 'レビュー中',
    approved: '承認済',
  };

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
      <span className={styles.prStatusTextStyle}>{statusLabel[status]}</span>
    </a>
  );
};
