import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { ApiProductListItem } from '../../../types/api';
import { ProductListContent } from './product-list-content';

const products: ApiProductListItem[] = [{ id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'x' }];

describe('ProductListContent', () => {
  it('renders loading state', () => {
    render(<ProductListContent isLoading isError={false} error={null} products={[]} filteredProducts={[]} />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <ProductListContent isLoading={false} isError error={new Error('boom')} products={[]} filteredProducts={[]} />,
    );

    expect(screen.getByText(/failed to load products: boom/i)).toBeInTheDocument();
  });

  it('renders empty-products state', () => {
    render(<ProductListContent isLoading={false} isError={false} error={null} products={[]} filteredProducts={[]} />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('renders no-match state when products exist but filtered is empty', () => {
    render(
      <ProductListContent isLoading={false} isError={false} error={null} products={products} filteredProducts={[]} />,
    );

    expect(screen.getByText(/no matching products/i)).toBeInTheDocument();
  });

  it('renders product grid when there are filtered products', () => {
    render(
      <MemoryRouter>
        <ProductListContent
          isLoading={false}
          isError={false}
          error={null}
          products={products}
          filteredProducts={products}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
  });
});
