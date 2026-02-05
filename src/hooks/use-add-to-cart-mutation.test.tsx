import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartProvider, useCart } from '../app/providers/cart-provider';
import { useAddToCartMutation } from './use-add-to-cart-mutation';

const addToCartMock = vi.fn();

vi.mock('./client', () => ({
  apiClient: {
    addToCart: (...args: unknown[]) => addToCartMock(...args),
  },
}));

function TestHarness() {
  const { count } = useCart();
  const addToCart = useAddToCartMutation();

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button type="button" onClick={() => addToCart.mutate({ id: '1', colorCode: 1000, storageCode: 2000 })}>
        Add
      </button>
    </div>
  );
}

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>{ui}</CartProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('useAddToCartMutation', () => {
  it('updates cart count on success', async () => {
    const user = userEvent.setup();
    addToCartMock.mockResolvedValue({ count: 7 });

    renderWithProviders(<TestHarness />);

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('7'));

    expect(addToCartMock).toHaveBeenCalledWith({ id: '1', colorCode: 1000, storageCode: 2000 });
  });
});
