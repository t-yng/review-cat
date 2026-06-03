import React from 'react';
import { render, screen, queryByText, act } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './AccountSelect.stories';
import { AccountSelect, AccountSelectProps } from './AccountSelect';

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
  it('Account list is displayed when select box is clicked', async () => {
    const accounts = ['test1', 'test2'];
    const { container } = renderAccountSelect({ accounts });

    await act(async () => await ClickButton.play({ canvasElement: container }));

    const listbox = screen.getByRole('listbox');
    expect(queryByText(listbox, accounts[0])).toBeInTheDocument();
    expect(queryByText(listbox, accounts[1])).toBeInTheDocument();
  });

  describe('accounts', () => {
    it('Initially displays the first account in the array', () => {
      const accounts = ['test1', 'test2'];
      renderAccountSelect({ accounts });

      expect(screen.queryByText(accounts[0])).toBeInTheDocument();
    });

    it('Changes the selected account when an account is selected from the list', async () => {
      const accounts = ['test1', 'test2'];
      const onSelectMock = jest.fn();
      const { container } = renderAccountSelect({
        accounts,
        onSelect: onSelectMock,
      });

      await act(
        async () => await ClickButton.play({ canvasElement: container })
      );

      // NOTE: In js-dom environment, DOM updates don't occur on button click, so execute button click above
      //       This may also be an issue with @headlessui/react
      await act(
        async () => await ClickAnotherAccount.play({ canvasElement: container })
      );

      expect(screen.getByRole('button', { name: 'test2' })).toBeInTheDocument();
      expect(onSelectMock).toBeCalledWith('test2');
    });
  });
});
