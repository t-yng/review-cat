import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositorySearchBox } from './RepositorySearchBox';
import { vi } from 'vitest';

describe('RepositorySearchBox', () => {
  describe('onSearch', () => {
    it('Enterを押した時に入力テキストを引数にして呼ばれること', () => {
      const onSearchMock = vi.fn();
      render(<RepositorySearchBox onSearch={onSearchMock} />);

      const text = 'test';
      const input = screen.getByRole('textbox');
      userEvent.type(input, text);
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(onSearchMock).toBeCalledWith(text);
    });
  });
});
