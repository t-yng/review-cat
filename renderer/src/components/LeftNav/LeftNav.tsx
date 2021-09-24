import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { loginUserAtom } from '../../jotai';
import { GitHubAvatar } from '../GitHubAvatar';
import { UserMenu } from '../UserMenu';
import { navStyle, userIconStyle } from './styles.css';

export const LeftNav: React.FC = () => {
  const [user] = useAtom(loginUserAtom);
  const [visibleUserMenu, setVisibleUserMenu] = useState(false);

  const handleClickUserIcon = () => {
    setVisibleUserMenu((visible) => !visible);
  };

  const handleSignOut = () => {
    alert('サインアウトを実装してください');
  };

  return (
    <nav className={navStyle}>
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
