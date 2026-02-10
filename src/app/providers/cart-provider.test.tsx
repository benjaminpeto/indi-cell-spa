import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { CartProvider, useCart } from './cart-provider';
import { CART_COUNT_STORAGE_KEY, CART_ITEMS_STORAGE_KEY } from './cart-provider.constants';

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

function CartActionsConsumer() {
  const { addItem, count, items, removeItem, setCount } = useCart();

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="items">{items.length}</div>
      <div data-testid="qty">{items[0]?.quantity ?? 0}</div>
      <button
        type="button"
        onClick={() =>
          addItem({
            productId: 'p1',
            brand: 'Acer',
            model: 'Iconia Talk S',
            imgUrl: 'x',
            unitPrice: 170,
            colorCode: 1000,
            colorName: 'Black',
            storageCode: 2000,
            storageName: '16 GB',
          })
        }
      >
        Add same
      </button>
      <button type="button" onClick={() => removeItem('p1:1000:2000')}>
        Remove line
      </button>
      <button type="button" onClick={() => setCount(2)}>
        Seed count
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

  it('merges same product variant and removes the full line from cart', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <CartActionsConsumer />
      </CartProvider>,
    );

    await user.click(screen.getByRole('button', { name: /add same/i }));
    await user.click(screen.getByRole('button', { name: /add same/i }));

    expect(screen.getByTestId('items')).toHaveTextContent('1');
    expect(screen.getByTestId('qty')).toHaveTextContent('2');
    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: /seed count/i }));
    await user.click(screen.getByRole('button', { name: /remove line/i }));

    expect(screen.getByTestId('items')).toHaveTextContent('0');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(localStorage.getItem(CART_ITEMS_STORAGE_KEY)).toBe('[]');
  });
});
