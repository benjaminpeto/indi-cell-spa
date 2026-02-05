import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { useCart } from '../app/providers/cart-provider';
import type { AddToCartRequest, AddToCartResponse } from '../types/api';

export function useAddToCartMutation() {
  const { setCount } = useCart();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: payload => apiClient.addToCart(payload),
    onSuccess: data => {
      const apiCount = Number(data.count);

      setCount(prev => {
        const nextLocal = prev + 1;
        return apiCount === null ? nextLocal : Math.max(nextLocal, apiCount);
      });
    },
  });
}
