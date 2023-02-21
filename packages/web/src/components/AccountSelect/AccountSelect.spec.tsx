import React from 'react';
import { render, screen, queryByText } from '@testing-library/react';
import { AccountSelect, AccountSelectProps } from './AccountSelect';
import { composeStories } from '@storybook/testing-react';
import * as stories from './AccountSelect.stories';

const { ClickButton, ClickAnotherAccount } = composeStories(stories);

const renderAccountSelect = (_props?: Partial<AccountSelectProps>) => {
  const props: AccountSelectProps = {
    accounts: ['test1', 'test2'],
    onSelect: jest.fn(),
    ..._props,
  };

  return render(<AccountSelect {...props} />);
};

describe('AccountSelect', () => {
  it('セレクトボックスをクリックしたときにアカウントの一覧が表示されること', async () => {
    const accounts = ['test1', 'test2'];
    const { container } = renderAccountSelect({ accounts });

    await ClickButton.play({ canvasElement: container });

    const listbox = screen.getByRole('listbox');
    expect(queryByText(listbox, accounts[0])).toBeInTheDocument();
    expect(queryByText(listbox, accounts[1])).toBeInTheDocument();
  });

  describe('accounts', () => {
    it('配列先頭のアカウントを初期表示すること', () => {
      const accounts = ['test1', 'test2'];
      renderAccountSelect({ accounts });

      expect(screen.queryByText(accounts[0])).toBeInTheDocument();
    });

    it('一覧のアカウントを選択したときに選択中のアカウントを変更すること', async () => {
      const accounts = ['test1', 'test2'];
      const onSelectMock = jest.fn();
      const { container } = renderAccountSelect({
        accounts,
        onSelect: onSelectMock,
      });
      await ClickAnotherAccount.play({ canvasElement: container });

      expect(screen.getByRole('button', { name: 'test2' })).toBeInTheDocument();
      expect(onSelectMock).toBeCalledWith('test2');
    });
  });
});