import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { ApiProductListItem } from '../../../types/api';
import { ProductListContent } from './product-list-content';

const products: ApiProductListItem[] = [{ id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'x' }];
const sentinelRef = { current: null };

const baseProps = {
  isLoading: false,
  isError: false,
  error: null,
  products,
  filteredProducts: products,
  hasMore: false,
  sentinelRef,
  hasIntersectionObserver: true,
  onLoadMore: () => {},
};

describe('ProductListContent', () => {
  it('renders loading state', () => {
    render(<ProductListContent {...baseProps} isLoading products={[]} filteredProducts={[]} />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<ProductListContent {...baseProps} isError error={new Error('boom')} products={[]} filteredProducts={[]} />);

    expect(screen.getByText(/failed to load products: boom/i)).toBeInTheDocument();
  });

  it('renders empty-products state', () => {
    render(<ProductListContent {...baseProps} products={[]} filteredProducts={[]} />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('renders no-match state when products exist but filtered is empty', () => {
    render(<ProductListContent {...baseProps} filteredProducts={[]} />);

    expect(screen.getByText(/no matching products/i)).toBeInTheDocument();
  });

  it('renders product grid when there are filtered products', () => {
    render(
      <MemoryRouter>
        <ProductListContent {...baseProps} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
  });

  it('renders load-more button fallback and triggers callback without IntersectionObserver', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();

    render(
      <MemoryRouter>
        <ProductListContent {...baseProps} hasMore hasIntersectionObserver={false} onLoadMore={onLoadMore} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /load more/i }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
