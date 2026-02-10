import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CART_COUNT_STORAGE_KEY, CART_ITEMS_STORAGE_KEY } from './cart-provider.constants';
import type { CartContextValue, CartProviderProps } from './cart-provider.types';
import {
  addOrMergeCartItem,
  readCountFromStorage,
  readItemsFromStorage,
  removeCartItemLine,
} from './cart-provider.utils';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [count, setCount] = useState<number>(() => readCountFromStorage(CART_COUNT_STORAGE_KEY));
  const [items, setItems] = useState(() => readItemsFromStorage(CART_ITEMS_STORAGE_KEY));

  useEffect(() => {
    try {
      localStorage.setItem(CART_COUNT_STORAGE_KEY, String(count));
    } catch {
      // ignore storage failures
    }
  }, [count]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures
    }
  }, [items]);

  const addItem = useCallback((item: Parameters<CartContextValue['addItem']>[0]) => {
    setItems(prev => addOrMergeCartItem(prev, item));
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems(prev => {
      const { nextItems, removedQuantity } = removeCartItemLine(prev, key);
      if (!removedQuantity) return prev;

      setCount(current => Math.max(0, current - removedQuantity));
      return nextItems;
    });
  }, []);

  const value = useMemo(() => ({ count, items, setCount, addItem, removeItem }), [addItem, count, items, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
