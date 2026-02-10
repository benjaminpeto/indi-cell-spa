import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './app';
import { CART_COUNT_STORAGE_KEY } from './providers/cart-provider';

const useProductsQueryMock = vi.fn();
const useProductDetailsQueryMock = vi.fn();
const addToCartMock = vi.fn();

vi.mock('../api/product-queries', () => ({
  useProductsQuery: (...args: unknown[]) => useProductsQueryMock(...args),
  useProductDetailsQuery: (...args: unknown[]) => useProductDetailsQueryMock(...args),
}));

vi.mock('../api/client', () => ({
  apiClient: {
    addToCart: (...args: unknown[]) => addToCartMock(...args),
  },
}));

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
    addToCartMock.mockResolvedValue({ count: 3 });
    if (typeof localStorage?.setItem === 'function') {
      localStorage.setItem(CART_COUNT_STORAGE_KEY, '0');
    }

    useProductsQueryMock.mockReturnValue({
      data: [{ id: 'p1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'https://example.com/p1.jpg' }],
      isLoading: false,
      isError: false,
      error: null,
    });

    useProductDetailsQueryMock.mockImplementation((id?: string) => ({
      data: id
        ? {
            id,
            brand: 'Acer',
            model: 'Iconia Talk S',
            price: '170',
            imgUrl: 'https://example.com/p1.jpg',
            cpu: 'Quad-core',
            ram: '2 GB',
            os: 'Android',
            displaySize: '720 x 1280',
            battery: '3400 mAh',
            primaryCamera: ['13 MP'],
            secondaryCmera: ['2 MP'],
            dimentions: '191.7 x 101 x 9.4 mm',
            weight: '260',
            options: {
              colors: [{ code: 1000, name: 'Black' }],
              storages: [{ code: 2000, name: '16 GB' }],
            },
          }
        : undefined,
      isLoading: false,
      isError: false,
      error: null,
    }));
  });

  it('navigates from PLP to PDP by selecting a product and can return to PLP', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { name: /product list/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /view acer iconia talk s/i }));

    expect(screen.getByRole('heading', { name: /acer iconia talk s/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to list/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /back to list/i }));

    expect(screen.getByRole('heading', { name: /product list/i })).toBeInTheDocument();
  });

  it('keeps header cart count consistent across route changes after adding from PDP', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText(/cart:/i)).toHaveTextContent('Cart: 0');

    await user.click(screen.getByRole('link', { name: /view acer iconia talk s/i }));

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    await waitFor(() => expect(screen.getByText(/cart:/i)).toHaveTextContent('Cart: 3'));
    expect(addToCartMock).toHaveBeenCalledWith({ id: 'p1', colorCode: 1000, storageCode: 2000 });

    await user.click(screen.getByRole('link', { name: /back to list/i }));
    expect(screen.getByRole('heading', { name: /product list/i })).toBeInTheDocument();
    expect(screen.getByText(/cart:/i)).toHaveTextContent('Cart: 3');

    await user.click(screen.getByRole('link', { name: /view acer iconia talk s/i }));
    expect(screen.getByRole('heading', { name: /acer iconia talk s/i })).toBeInTheDocument();
    expect(screen.getByText(/cart:/i)).toHaveTextContent('Cart: 3');
  });
});
