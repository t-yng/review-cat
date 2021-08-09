import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { AccountSelect } from './AccountSelect';

describe('AccountSelect', () => {
  it('セレクトボックスをクリックしたときにアカウントの一覧が表示されること', () => {
    render(<AccountSelect />);

    const selectBox = screen.getByTestId('account-select-box');
    userEvent.click(selectBox);
    expect(screen.queryByRole('listbox')).toBeInTheDocument();
  });
});
