import { normaliseString } from '../../shared/utils/normalise-string';
import type { ApiProductListItem } from '../../types/api';

export function filterProducts(products: ApiProductListItem[], query: string) {
  const q = normaliseString(query);
  if (!q) return products;

  return products.filter(p => {
    const haystack = normaliseString(`${p.brand} ${p.model}`);
    return haystack.includes(q);
  });
}
