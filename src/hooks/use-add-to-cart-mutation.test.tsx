import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const addToCartMock = vi.fn();

vi.mock('../api/client', () => ({
  apiClient: {
    addToCart: (...args: unknown[]) => addToCartMock(...args),
  },
}));

beforeEach(() => {
  addToCartMock.mockReset();
  localStorage.clear();
  vi.resetModules();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useAddToCartMutation', () => {
  it('updates cart count on success', async () => {
    const user = userEvent.setup();
    addToCartMock.mockResolvedValue({ count: 7 });

    const [{ CartProvider, useCart }, { useAddToCartMutation }] = await Promise.all([
      import('../app/providers/cart-provider'),
      import('./use-add-to-cart-mutation'),
    ]);

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

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TestHarness />
        </CartProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('7'));

    expect(addToCartMock).toHaveBeenCalledTimes(1);
    expect(addToCartMock).toHaveBeenCalledWith({ id: '1', colorCode: 1000, storageCode: 2000 });
  });
});
