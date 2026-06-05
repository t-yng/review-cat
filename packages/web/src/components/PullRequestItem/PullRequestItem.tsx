import { PullRequest, PullRequestStatus } from '../../models';
import { GitHubAvatar } from '../GitHubAvatar';
import { styles } from './styles.css';

interface Props {
  pullRequest: PullRequest;
}

export const PullRequestItem = ({ pullRequest }: Props) => {
  const { author, url, title, status } = pullRequest;

  const statusLabel: { [key in PullRequestStatus]: string } = {
    waitingReview: 'Waiting for review',
    reviewed: 'Reviewed',
    approved: 'Approved',
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
