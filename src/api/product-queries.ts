import { useQuery } from '@tanstack/react-query';

import { cacheKeys } from '../cache/cache-keys';
import { getCache, setCache } from '../cache/cache-storage';
import type { ApiProductDetails, ApiProductListItem } from '../types/api';
import { apiClient } from './client';
import { queryKeys } from './query-keys';

export function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async (): Promise<ApiProductListItem[]> => {
      const cached = getCache<ApiProductListItem[]>(cacheKeys.productsList());
      if (cached) return cached;

      const fresh = await apiClient.getProducts();
      setCache(cacheKeys.productsList(), fresh);
      return fresh;
    },
  });
}

export function useProductDetailsQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.product(id) : ['product', 'missing-id'],
    enabled: Boolean(id),
    queryFn: async (): Promise<ApiProductDetails> => {
      const safeId = id as string;

      const cached = getCache<ApiProductDetails>(cacheKeys.productDetails(safeId));
      if (cached) return cached;

      const fresh = await apiClient.getProductById(safeId);
      setCache(cacheKeys.productDetails(safeId), fresh);
      return fresh;
    },
  });
}
