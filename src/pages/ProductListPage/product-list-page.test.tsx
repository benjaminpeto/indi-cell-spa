import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { ApiProductListItem } from '../../types/api';
import { ProductListPage } from './product-list-page';

const mockUseProductsQuery = vi.fn();

vi.mock('../../api/product-queries', () => ({
  useProductsQuery: () => mockUseProductsQuery(),
}));

describe('ProductListPage', () => {
  it('filters products by brand/model in real time', async () => {
    const user = userEvent.setup();

    const data: ApiProductListItem[] = [
      { id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'x' },
      { id: '2', brand: 'Samsung', model: 'Galaxy S10', price: '500', imgUrl: 'y' },
      { id: '3', brand: 'Apple', model: 'iPhone 13', price: '900', imgUrl: 'z' },
    ];

    mockUseProductsQuery.mockReturnValue({
      data,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
    );

    // all show initially
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 3 of 3');
    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S10')).toBeInTheDocument();
    expect(screen.getByText('iPhone 13')).toBeInTheDocument();

    // filter by brand
    await user.type(screen.getByLabelText(/search/i), 'acer');
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 1 of 3');
    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
    expect(screen.queryByText('Galaxy S10')).not.toBeInTheDocument();
    expect(screen.queryByText('iPhone 13')).not.toBeInTheDocument();

    // clear
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 3 of 3');
  });

  it('shows empty state when no matches', async () => {
    const user = userEvent.setup();

    const data: ApiProductListItem[] = [{ id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'x' }];

    mockUseProductsQuery.mockReturnValue({
      data,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/search/i), 'zzzz');
    expect(screen.getByText(/no matching products/i)).toBeInTheDocument();
  });
});
