import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositorySearchBox } from './RepositorySearchBox';

describe('RepositorySearchBox', () => {
  const user = userEvent.setup();

  describe('onSearch', () => {
    it('Enterを押した時に入力テキストを引数にして呼ばれること', async () => {
      const onSearchMock = jest.fn();
      render(<RepositorySearchBox onSearch={onSearchMock} />);

      const text = 'test';
      const input = screen.getByRole('textbox');

      await act(async () => await user.type(input, text));
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(onSearchMock).toBeCalledWith(text);
    });
  });
});
