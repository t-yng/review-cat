import { vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositorySearchBox } from './RepositorySearchBox';

describe('RepositorySearchBox', () => {
  const user = userEvent.setup();

  describe('onSearch', () => {
    it('Called with input text as argument when Enter is pressed', async () => {
      const onSearchMock = vi.fn();
      render(<RepositorySearchBox onSearch={onSearchMock} />);

      const text = 'test';
      const input = screen.getByRole('textbox');

      await act(async () => await user.type(input, text));
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(onSearchMock).toHaveBeenCalledWith(text);
    });
  });
});
