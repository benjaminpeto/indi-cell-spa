import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../api/client';
import { CART_COUNT_STORAGE_KEY, CartProvider, useCart } from '../app/providers/cart-provider';
import { useAddToCartMutation } from './use-add-to-cart-mutation';

vi.mock('../api/client', () => ({
  apiClient: { addToCart: vi.fn() },
}));

const addToCartMock = apiClient.addToCart as unknown as ReturnType<typeof vi.fn>;

function Harness() {
  const { count } = useCart();
  const add = useAddToCartMutation();

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button type="button" onClick={() => add.mutate({ id: '1', colorCode: 1000, storageCode: 2000 })}>
        Add
      </button>
    </div>
  );
}

beforeEach(() => {
  addToCartMock.mockReset();
  if (typeof localStorage?.setItem === 'function') {
    localStorage.setItem(CART_COUNT_STORAGE_KEY, '0');
  }
});

describe('useAddToCartMutation', () => {
  it('increments local count even when API count is stuck at 1', async () => {
    addToCartMock.mockResolvedValue({ count: 1 });

    const user = userEvent.setup();
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <CartProvider>
          <Harness />
        </CartProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2'));

    expect(addToCartMock).toHaveBeenCalledTimes(2);
  });

  it('reconciles to API count if it ever increases', async () => {
    addToCartMock.mockResolvedValue({ count: 7 });

    const user = userEvent.setup();
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <CartProvider>
          <Harness />
        </CartProvider>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('7'));
  });

  it('falls back to local increment when API count is invalid', async () => {
    addToCartMock.mockResolvedValue({ count: 'not-a-number' });

    const user = userEvent.setup();
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <CartProvider>
          <Harness />
        </CartProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));
  });
});
