import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { queryKeys } from '../api/query-keys';
import { useCart } from '../app/providers/cart-provider';
import type { AddToCartRequest, AddToCartResponse, ApiProductDetails } from '../types/api';

export function useAddToCartMutation() {
  const { addItem, setCount } = useCart();
  const queryClient = useQueryClient();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: payload => apiClient.addToCart(payload),
    onSuccess: (data, payload) => {
      const apiCount = typeof data.count === 'number' ? data.count : Number(data.count);
      const apiCountSafe = Number.isFinite(apiCount) && apiCount >= 0 ? apiCount : null;
      const details = queryClient.getQueryData<ApiProductDetails>(queryKeys.product(payload.id));
      const colorName = details?.options?.colors?.find(color => color.code === payload.colorCode)?.name ?? `Color #${payload.colorCode}`;
      const storageName =
        details?.options?.storages?.find(storage => storage.code === payload.storageCode)?.name ?? `Storage #${payload.storageCode}`;
      const parsedPrice = Number(details?.price);
      const unitPrice = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;

      setCount(prev => {
        const nextLocal = prev + 1;
        return apiCountSafe === null ? nextLocal : Math.max(nextLocal, apiCountSafe);
      });

      addItem({
        productId: payload.id,
        brand: details?.brand ?? 'Unknown brand',
        model: details?.model ?? 'Unknown model',
        imgUrl: details?.imgUrl ?? '',
        unitPrice,
        colorCode: payload.colorCode,
        colorName,
        storageCode: payload.storageCode,
        storageName,
      });
    },
  });
}
