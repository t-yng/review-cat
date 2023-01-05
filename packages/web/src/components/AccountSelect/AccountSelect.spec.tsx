import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, queryByText } from '@testing-library/react';
import { AccountSelect } from './AccountSelect';

describe('AccountSelect', () => {
  it('セレクトボックスをクリックしたときにアカウントの一覧が表示されること', () => {
    const accounts = ['test1', 'test2'];
    render(
      <AccountSelect
        accounts={accounts}
        onSelect={() => {
          return;
        }}
      />
    );

    const selectButton = screen.getByRole('button');
    userEvent.click(selectButton);
    const listbox = screen.getByRole('listbox');
    expect(queryByText(listbox, accounts[0])).toBeInTheDocument();
    expect(queryByText(listbox, accounts[1])).toBeInTheDocument();
  });

  describe('accounts', () => {
    it('配列先頭のアカウントを初期表示すること', () => {
      const accounts = ['test1', 'test2'];
      render(
        <AccountSelect
          accounts={accounts}
          onSelect={() => {
            return;
          }}
        />
      );

      expect(screen.queryByText(accounts[0])).toBeInTheDocument();
    });

    it('一覧のアカウントを選択したときに選択中のアカウントを変更すること', () => {
      const accounts = ['test1', 'test2'];
      const onSelectMock = jest.fn();
      render(<AccountSelect accounts={accounts} onSelect={onSelectMock} />);

      const selectButton = screen.getByRole('button');
      userEvent.click(selectButton);
      const listItems = screen.getAllByRole('option');
      userEvent.click(listItems[1]);

      expect(queryByText(selectButton, accounts[1])).toBeInTheDocument();
    });
  });

  describe('onSelect', () => {
    it('一覧からアカウントを選択した時にコールバックで呼ばれること', () => {
      const accounts = ['test1', 'test2'];
      const onSelectMock = jest.fn();
      render(<AccountSelect accounts={accounts} onSelect={onSelectMock} />);

      const selectButton = screen.getByRole('button');
      userEvent.click(selectButton);
      const listItems = screen.getAllByRole('option');
      userEvent.click(listItems[1]);

      expect(onSelectMock).toBeCalledWith(accounts[1]);
    });
  });
});
