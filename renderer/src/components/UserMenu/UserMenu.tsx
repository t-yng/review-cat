import React, { FC } from 'react';
import { SignOutIcon } from '@primer/octicons-react';
import { User } from '../../models';
import {
  listItemStyle,
  userMenuStyle,
  userNameStyle,
  actionItemStyle,
  actionIconStyle,
  actionLabelStyle,
} from './style.css';

export type UserMenuProps = {
  user: User;
  onClickSignOut: () => void;
};

export const UserMenu: FC<UserMenuProps> = ({ user, onClickSignOut }) => {
  return (
    <div className={userMenuStyle}>
      <div className={`${listItemStyle} ${userNameStyle}`}>{user.name}</div>
      <button
        className={`${listItemStyle} ${actionItemStyle}`}
        onClick={onClickSignOut}
      >
        <SignOutIcon className={actionIconStyle} />
        <span className={actionLabelStyle}>ログアウト</span>
      </button>
    </div>
  );
};
