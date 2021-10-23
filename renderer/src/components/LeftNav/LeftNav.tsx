import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { useHistory } from 'react-router';
import { loginUserAtom, signOutAtom } from '../../jotai';
import { GitHubAvatar } from '../GitHubAvatar';
import { UserMenu } from '../UserMenu';
import {
  iconStyle,
  navStyle,
  pullRequestIconLink,
  statusCountBadge,
  userIconStyle,
} from './styles.css';
import { GitPullRequestIcon } from '@primer/octicons-react';
import { Link } from 'react-router-dom';
import { usePullRequests } from '../../hooks';
import { PullRequest } from '../../models';

export const LeftNav: React.FC = () => {
  usePullRequests;
  const history = useHistory();
  const avatarRef = useRef<HTMLElement>(null);
  const [user] = useAtom(loginUserAtom);
  const [, signOut] = useAtom(signOutAtom);
  const [visibleUserMenu, setVisibleUserMenu] = useState(false);
  const { pullRequests, loading } = usePullRequests();

  const requestedReviewPullRequests = (pullRequests: PullRequest[]) => {
    return pullRequests.filter((pr) => pr.status === 'requestedReview');
  };

  useEffect(() => {
    const handleClickBody = (event: MouseEvent) => {
      const target: HTMLElement = event.target as HTMLElement;
      if (target.closest('nav')) {
        return;
      } else {
        setVisibleUserMenu(false);
      }
    };
    document.body.addEventListener('click', handleClickBody);

    return () => {
      document.body.removeEventListener('click', handleClickBody);
    };
  });

  const handleClickUserIcon = useCallback(() => {
    setVisibleUserMenu((visible) => !visible);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut(() => {
      history.replace('/login');
    });
  }, [signOut, history]);

  return (
    <nav className={navStyle} ref={avatarRef}>
      <h1>
        {user != null && (
          <GitHubAvatar
            src={user?.avatarUrl}
            onClick={handleClickUserIcon}
            className={`${iconStyle} ${userIconStyle}`}
          />
        )}
      </h1>
      <div>
        <Link to="/" className={pullRequestIconLink}>
          <GitPullRequestIcon
            size={24}
            className={iconStyle}
            aria-label="プルリクエスト一覧へ移動"
          />
          {!loading && (
            <span role="status" className={statusCountBadge}>
              {requestedReviewPullRequests(pullRequests).length}
            </span>
          )}
        </Link>
      </div>
      {user != null && visibleUserMenu && (
        <UserMenu user={user} onClickSignOut={handleSignOut} />
      )}
    </nav>
  );
};
