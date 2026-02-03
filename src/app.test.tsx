import { render, screen } from '@testing-library/react';

import App from './app';

test('renders', () => {
  render(<App />);
  expect(screen.getByText(/vite/i)).toBeInTheDocument();
});
