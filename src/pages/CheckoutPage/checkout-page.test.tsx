import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { CartProvider } from '../../app/providers/cart-provider';
import { CART_COUNT_STORAGE_KEY, CART_ITEMS_STORAGE_KEY } from '../../app/providers/cart-provider.constants';
import { CheckoutPage } from './checkout-page';

beforeEach(() => {
  localStorage.clear();
});

describe('CheckoutPage', () => {
  it('renders merged line items and recalculates after removing', async () => {
    localStorage.setItem(CART_COUNT_STORAGE_KEY, '2');
    localStorage.setItem(
      CART_ITEMS_STORAGE_KEY,
      JSON.stringify([
        {
          key: 'p1:1000:2000',
          productId: 'p1',
          brand: 'Acer',
          model: 'Iconia Talk S',
          imgUrl: 'x',
          unitPrice: 170,
          colorCode: 1000,
          colorName: 'Black',
          storageCode: 2000,
          storageName: '16 GB',
          quantity: 2,
        },
      ]),
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/acer iconia talk s/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/line total: 340.00€/i)).toBeInTheDocument();
    expect(screen.getByText(/^total:\s*340.00€$/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument());
  });

  it('shows funny checkout message with profile links', async () => {
    localStorage.setItem(CART_COUNT_STORAGE_KEY, '1');
    localStorage.setItem(
      CART_ITEMS_STORAGE_KEY,
      JSON.stringify([
        {
          key: 'p1:1000:2000',
          productId: 'p1',
          brand: 'Acer',
          model: 'Iconia Talk S',
          imgUrl: 'x',
          unitPrice: 170,
          colorCode: 1000,
          colorName: 'Black',
          storageCode: 2000,
          storageName: '16 GB',
          quantity: 1,
        },
      ]),
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /^checkout$/i }));

    expect(screen.getByText(/checkout service is on coffee break/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com'),
    );
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      expect.stringContaining('github.com'),
    );
  });
});
