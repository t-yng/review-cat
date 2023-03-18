import React from 'react';
import {
  PullRequest,
  PullRequestStatus,
  pullRequestStatus,
} from '../../models';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

interface Props {
  pullRequest: PullRequest;
}

export const PullRequestItem: React.FC<Props> = ({ pullRequest }) => {
  const { author, url, title, status } = pullRequest;

  const statusLabel: { [key in PullRequestStatus]: string } = {
    waitingReview: 'レビュー待ち',
    reviewed: 'レビュー済み',
    approved: '承認済み',
  };

  return (
    <a className={styles.rootStyle} href={url} target="_blank" rel="noreferrer">
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
