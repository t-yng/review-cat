import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserMenu } from './';
import userEvent from '@testing-library/user-event';
import { UserMenuProps } from '..';
import { MemoryRouter } from 'react-router';

describe('UserMenu', () => {
  const renderUserMenu = (props: Partial<UserMenuProps> | undefined) => {
    const defaultProps: UserMenuProps = {
      user: {
        avatarUrl: 'https://example.com/images/avatar.jpeg',
        name: 'test',
      },
      onClickSignOut: jest.fn(),
    };

    const userMenuProps = {
      ...defaultProps,
      ...props,
    };

    return render(
      <MemoryRouter>
        <UserMenu {...userMenuProps} />
      </MemoryRouter>
    );
  };
  it('ユーザー名を表示する', () => {
    const user = {
      avatarUrl: '',
      name: 'test',
    };

    renderUserMenu({ user });

    const userName = screen.queryByText(user.name);
    expect(userName).toBeInTheDocument();
  });

  it('設定画面へ遷移するリンクを表示する', () => {
    renderUserMenu(undefined);
    const link = screen.getByText('設定').closest('a');

    expect(link).toHaveAttribute('href', '/settings');
  });

  it('ログアウトがクリックされた時に、onClickSignOut を実行する', () => {
    const handleClickSignOutMock = jest.fn();

    renderUserMenu({ onClickSignOut: handleClickSignOutMock });

    const signOutButton = screen.getByText('ログアウト');
    userEvent.click(signOutButton);

    expect(handleClickSignOutMock).toBeCalled();
  });
});
