import React from 'react';
import { render, screen } from '@testing-library/react';
import { GitHubAvatar } from './GitHubAvatar';
// import { describe, it, expect } from 'vitest';

describe('GitHubUserAvatar', () => {
  it('alt props が無い場合は 空の alt 属性が指定される', () => {
    render(<GitHubAvatar src="#" />);

    expect(screen.getByAltText('')).toBeInTheDocument();
  });
});
