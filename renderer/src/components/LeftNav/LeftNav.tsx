import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { useHistory } from 'react-router';
import { loginUserAtom, signOutAtom } from '../../jotai';
import { GitHubAvatar } from '../GitHubAvatar';
import { UserMenu } from '../UserMenu';
import { navStyle, userIconStyle } from './styles.css';

export const LeftNav: React.FC = () => {
  const history = useHistory();
  const avatarRef = useRef<HTMLElement>(null);
  const [user] = useAtom(loginUserAtom);
  const [, signOut] = useAtom(signOutAtom);
  const [visibleUserMenu, setVisibleUserMenu] = useState(false);

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
            className={userIconStyle}
          />
        )}
      </h1>
      {user != null && visibleUserMenu && (
        <UserMenu user={user} onClickSignOut={handleSignOut} />
      )}
    </nav>
  );
};
