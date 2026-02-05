import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { CART_COUNT_STORAGE_KEY, CartProvider, useCart } from './cart-provider';

function Consumer() {
  const { count, setCount } = useCart();
  return (
    <div>
      <div data-testid="count">{count}</div>
      <button type="button" onClick={() => setCount(5)}>
        Set 5
      </button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('CartProvider', () => {
  it('hydrates initial count from localStorage', () => {
    localStorage.setItem(CART_COUNT_STORAGE_KEY, '2');

    render(
      <CartProvider>
        <Consumer />
      </CartProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('persists count to localStorage on change', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <Consumer />
      </CartProvider>,
    );

    await user.click(screen.getByRole('button', { name: /set 5/i }));

    expect(localStorage.getItem(CART_COUNT_STORAGE_KEY)).toBe('5');
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });
});
