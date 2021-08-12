import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { AccountSelect } from './AccountSelect';

describe('AccountSelect', () => {
  it('セレクトボックスをクリックしたときにアカウントの一覧が表示されること', () => {
    render(
      <AccountSelect
        onSelect={() => {
          return;
        }}
      />
    );

    const selectBox = screen.getByTestId('account-select-box');
    userEvent.click(selectBox);
    expect(screen.queryByRole('listbox')).toBeInTheDocument();
  });

  describe('onSelect', () => {
    it('一覧からアカウントを選択した時にコールバックで呼ばれること', () => {
      const onSelectMock = jest.fn();
      render(<AccountSelect onSelect={onSelectMock} />);

      const selectBox = screen.getByTestId('account-select-box');
      userEvent.click(selectBox);
      const listItem = screen.getByRole('listitem');
      userEvent.click(listItem);

      expect(onSelectMock).toBeCalledWith('higeOhige');
    });
  });
});
