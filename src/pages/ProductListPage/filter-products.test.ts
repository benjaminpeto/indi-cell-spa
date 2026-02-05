import { describe, expect, it } from 'vitest';

import type { ApiProductListItem } from '../../types/api';
import { filterProducts } from './filter-products';

const products: ApiProductListItem[] = [
  { id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'x' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S10', price: '500', imgUrl: 'y' },
  { id: '3', brand: 'Apple', model: 'iPhone 13', price: '900', imgUrl: 'z' },
];

describe('filterProducts', () => {
  it('returns all products when query is empty', () => {
    expect(filterProducts(products, '')).toEqual(products);
    expect(filterProducts(products, '   ')).toEqual(products);
  });

  it('matches by brand', () => {
    expect(filterProducts(products, 'acer')).toEqual([products[0]]);
  });

  it('matches by model', () => {
    expect(filterProducts(products, 'galaxy')).toEqual([products[1]]);
  });

  it('is case-insensitive and whitespace-tolerant', () => {
    expect(filterProducts(products, '  ICONIA   talk  ')).toEqual([products[0]]);
  });
});
