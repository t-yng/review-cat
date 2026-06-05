import { vi, describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserMenu } from './';
import { UserMenuProps } from '..';
import { customRender } from '@test/helpers/render';

describe('UserMenu', () => {
  const user = userEvent.setup();

  const renderUserMenu = (props: Partial<UserMenuProps> | undefined) => {
    const defaultProps: UserMenuProps = {
      user: {
        avatarUrl: 'https://example.com/images/avatar.jpeg',
        name: 'test',
      },
      onClickSignOut: vi.fn(),
    };

    const userMenuProps = {
      ...defaultProps,
      ...props,
    };

    return customRender(<UserMenu {...userMenuProps} />);
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
    const handleClickSignOutMock = vi.fn();

    renderUserMenu({ onClickSignOut: handleClickSignOutMock });

    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    expect(handleClickSignOutMock).toHaveBeenCalled();
  });
});
