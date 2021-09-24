import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserMenu } from './';
import userEvent from '@testing-library/user-event';

describe('UserMenu', () => {
  it('ユーザー名を表示する', () => {
    const user = {
      avatarUrl: '',
      name: 'test',
    };

    render(
      <UserMenu
        user={user}
        onClickSignOut={() => {
          return;
        }}
      />
    );

    const userName = screen.queryByText(user.name);
    expect(userName).toBeInTheDocument();
  });

  it('ログアウトがクリックされた時に、onClickSignOut を実行する', () => {
    const handleClickSignOutMock = jest.fn();
    const user = {
      avatarUrl: '',
      name: 'test',
    };

    render(<UserMenu user={user} onClickSignOut={handleClickSignOutMock} />);

    const signOutButton = screen.getByText('ログアウト');
    userEvent.click(signOutButton);

    expect(handleClickSignOutMock).toBeCalled();
  });
});
