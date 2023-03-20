import React, { FC, memo } from 'react';
import { SignOutIcon, GearIcon } from '@primer/octicons-react';
import { Link } from 'react-router-dom';
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

export const UserMenu: FC<UserMenuProps> = memo(({ user, onClickSignOut }) => {
  return (
    <div className={userMenuStyle}>
      <div className={`${listItemStyle} ${userNameStyle}`}>{user.name}</div>
      <Link to="/settings" className={`${listItemStyle} ${actionItemStyle}`}>
        <GearIcon className={actionIconStyle} />
        <span className={actionLabelStyle}>設定</span>
      </Link>
      <button
        className={`${listItemStyle} ${actionItemStyle}`}
        onClick={onClickSignOut}
      >
        <SignOutIcon className={actionIconStyle} />
        <span className={actionLabelStyle}>ログアウト</span>
      </button>
    </div>
  );
});
