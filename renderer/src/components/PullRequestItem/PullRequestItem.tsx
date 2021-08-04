import React from 'react';
import { PullRequest } from 'renderer/src/models';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

type Props = PullRequest;

export const PullRequestItem: React.FC<Props> = (props) => {
  const { author, url, title, status } = props;

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
            alt: author.name,
            loading: 'lazy',
          }}
        />
      </span>
      <span className={styles.prAuthorNameStyle}>{title}</span>
      <span className={styles.prStatusTextStyle}>{status}</span>
    </a>
  );
};
