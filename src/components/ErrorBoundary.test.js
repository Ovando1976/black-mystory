import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const CrashingComponent = () => {
  throw new Error('boom');
};

test('shows fallback UI when a child crashes', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <CrashingComponent />
    </ErrorBoundary>
  );

  expect(
    screen.getByText(/something went wrong while rendering this page/i)
  ).toBeInTheDocument();

  spy.mockRestore();
});
