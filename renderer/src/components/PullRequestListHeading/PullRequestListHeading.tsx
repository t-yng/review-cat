import React from 'react';
import { Repository } from '../../models/PullRequest';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

interface Props extends Repository {
  as?: React.ElementType;
}

export const PullRequestListHeading: React.FC<Props> = ({
  as: Heading = 'h1',
  nameWithOwner,
  openGraphImageUrl,
}) => {
  return (
    <Heading className={styles.rootStyle}>
      <span className={styles.avatarContainerStyle}>
        <GitHubAvatar src={openGraphImageUrl} alt="" loading="lazy" />
      </span>
      <span className={styles.nameContainerStyle}>{nameWithOwner}</span>
    </Heading>
  );
};
