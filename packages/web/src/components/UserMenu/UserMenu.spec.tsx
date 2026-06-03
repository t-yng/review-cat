import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserMenu } from './';
import { UserMenuProps } from '..';
import { MemoryRouter } from 'react-router-dom';

describe('UserMenu', () => {
  const user = userEvent.setup();

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

  it('Displays the username', () => {
    const user = {
      avatarUrl: '',
      name: 'test',
    };

    renderUserMenu({ user });

    const userName = screen.queryByText(user.name);
    expect(userName).toBeInTheDocument();
  });

  it('Displays a link to navigate to the settings screen', () => {
    renderUserMenu(undefined);
    const link = screen.getByText('Settings').closest('a');

    expect(link).toHaveAttribute('href', '/settings');
  });

  it('Executes onClickSignOut when sign out is clicked', async () => {
    const handleClickSignOutMock = jest.fn();

    renderUserMenu({ onClickSignOut: handleClickSignOutMock });

    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    expect(handleClickSignOutMock).toBeCalled();
  });
});
