import { useAtom } from 'jotai';
import React from 'react';
import { loginUserAtom } from '../../jotai';
import { GitHubAvatar } from '../GitHubAvatar';
import { navStyle } from './styles.css';

export const LeftNav: React.FC = () => {
  const [user] = useAtom(loginUserAtom);

  return (
    <nav className={navStyle}>
      <h1>{user != null && <GitHubAvatar src={user?.avatarUrl} />}</h1>
    </nav>
  );
};
