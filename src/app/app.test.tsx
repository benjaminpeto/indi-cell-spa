import { render, screen } from '@testing-library/react';

import App from './app';

test('renders app shell', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: /indi cell store/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/breadcrumb/i)).toBeInTheDocument();
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /product list/i })).toBeInTheDocument();
});
