import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { useCart } from '../app/providers/cart-provider';
import type { AddToCartRequest, AddToCartResponse } from '../types/api';

export function useAddToCartMutation() {
  const { setCount } = useCart();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: payload => apiClient.addToCart(payload),
    onSuccess: data => {
      const apiCount = typeof data.count === 'number' ? data.count : Number(data.count);
      const apiCountSafe = Number.isFinite(apiCount) && apiCount >= 0 ? apiCount : null;

      setCount(prev => {
        const nextLocal = prev + 1;
        return apiCountSafe === null ? nextLocal : Math.max(nextLocal, apiCountSafe);
      });
    },
  });
}
