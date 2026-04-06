import { render, screen } from '@testing-library/react';
import Home from './pages/home';

test('renders the home welcome heading', () => {
  render(<Home />);
  const heading = screen.getByText(/welcome to the usvi explorer/i);
  expect(heading).toBeInTheDocument();
});
