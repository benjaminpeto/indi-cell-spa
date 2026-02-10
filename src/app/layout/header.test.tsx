import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { CartProvider } from '../providers/cart-provider';
import { CART_COUNT_STORAGE_KEY } from '../providers/cart-provider.constants';
import { Header } from './header';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders brand and cart checkout link with persisted count', () => {
    localStorage.setItem(CART_COUNT_STORAGE_KEY, '3');

    render(
      <MemoryRouter>
        <CartProvider>
          <Header />
        </CartProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /indi cell store/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /open checkout cart/i })).toHaveAttribute('href', '/checkout');
    expect(screen.getByText(/cart:/i)).toHaveTextContent('Cart: 3');
  });
});
