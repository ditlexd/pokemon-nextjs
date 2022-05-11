import { render, screen } from '@testing-library/react';
import Home from '../pages';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home nameLength={8} imageUrl={''} id={1} />);

    const heading = screen.getByText('Guess that POKEMON!');

    expect(heading).toBeInTheDocument();
  });
});
