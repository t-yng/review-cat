import { render, screen } from '@testing-library/react';
import { HelloWord } from './HelloWorld';

describe('HelloWorld', () => {
  it('render Hello World', () => {
    render(<HelloWord />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
