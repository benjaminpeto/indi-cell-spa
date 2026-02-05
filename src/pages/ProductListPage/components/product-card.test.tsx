import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { ApiProductListItem } from '../../../types/api';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  it('renders product info and links to PDP', () => {
    const product: ApiProductListItem = {
      id: 'abc',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170',
      imgUrl: 'https://example.com/img.jpg',
    };

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Acer')).toBeInTheDocument();
    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
    expect(screen.getByText('170€')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /view acer iconia talk s/i });
    expect(link).toHaveAttribute('href', '/product/abc');

    expect(screen.getByRole('img', { name: /acer iconia talk s/i })).toBeInTheDocument();
  });

  it('renders dash when price is empty', () => {
    const product: ApiProductListItem = {
      id: 'p',
      brand: 'Acer',
      model: 'Some Model',
      price: '',
      imgUrl: 'x',
    };

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
