import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
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
import { pullRequestStatus } from '../../models';

export const LeftNav: React.FC = () => {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLElement>(null);
  const [user] = useAtom(loginUserAtom);
  const [, signOut] = useAtom(signOutAtom);
  const [visibleUserMenu, setVisibleUserMenu] = useState(false);
  const { pullRequests, firstLoading } = usePullRequests();

  const requestedReviewPullRequests = pullRequests.filter(
    (pr) => pr.status === pullRequestStatus.waitingReview
  );

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
      navigate('/login', { replace: true });
    });
  }, [signOut, navigate]);

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
          {!firstLoading && requestedReviewPullRequests.length > 0 && (
            <span
              aria-label={`PRが${requestedReviewPullRequests.length}個あります`}
              className={statusCountBadge}
              data-testid="pr-count-badge"
            >
              {requestedReviewPullRequests.length}
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
