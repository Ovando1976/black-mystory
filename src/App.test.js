import { fireEvent, render, screen } from '@testing-library/react';
import Home from './pages/home';

test('renders the home welcome heading', () => {
  render(<Home />);
  const heading = screen.getByText(/welcome to the usvi explorer/i);
  expect(heading).toBeInTheDocument();
});

test('selecting a persona renders persona-specific greeting', () => {
  render(<Home />);

  fireEvent.click(screen.getByRole('button', { name: /the family adventurer/i }));

  expect(screen.getByText(/welcome, the family adventurer!/i)).toBeInTheDocument();
});

test('send button is disabled until chat input has text', () => {
  render(<Home />);
  const sendButton = screen.getByRole('button', { name: /send/i });

  expect(sendButton).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/chat message/i), {
    target: { value: 'hello' },
  });

  expect(sendButton).toBeEnabled();
});
