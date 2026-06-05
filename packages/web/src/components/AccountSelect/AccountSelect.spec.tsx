import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountSelect, AccountSelectProps } from './AccountSelect';

const renderAccountSelect = (_props?: Partial<AccountSelectProps>) => {
  const props: AccountSelectProps = {
    accounts: ['test1', 'test2'],
    onSelect: vi.fn(),
    ..._props,
  };

  return render(<AccountSelect {...props} />);
};

describe('AccountSelect', () => {
  const user = userEvent.setup();

  it('Account list is displayed when select box is clicked', async () => {
    const accounts = ['test1', 'test2'];
    renderAccountSelect({ accounts });

    await user.click(screen.getByRole('button'));

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
  });

  describe('accounts', () => {
    it('Initially displays the first account in the array', () => {
      const accounts = ['test1', 'test2'];
      renderAccountSelect({ accounts });

      expect(screen.queryByText(accounts[0])).toBeInTheDocument();
    });

    it('Changes the selected account when an account is selected from the list', async () => {
      const accounts = ['test1', 'test2'];
      const onSelectMock = vi.fn();
      renderAccountSelect({ accounts, onSelect: onSelectMock });

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('option', { name: /test2/ }));

      expect(screen.getByRole('button', { name: /test2/ })).toBeInTheDocument();
      expect(onSelectMock).toHaveBeenCalledWith('test2');
    });
  });
});
