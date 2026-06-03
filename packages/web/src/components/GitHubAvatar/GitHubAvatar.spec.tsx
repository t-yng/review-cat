import React from 'react';
import { render, screen } from '@testing-library/react';
import { GitHubAvatar } from './GitHubAvatar';

describe('GitHubUserAvatar', () => {
  it('Empty alt attribute is assigned when alt props are absent', () => {
    render(<GitHubAvatar src="#" />);

    expect(screen.getByAltText('')).toBeInTheDocument();
  });
});
