import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export const CART_COUNT_STORAGE_KEY = 'cart:count';

type CartContextValue = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const CartContext = createContext<CartContextValue | null>(null);

function readInitialCount() {
  try {
    const raw = localStorage.getItem(CART_COUNT_STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number>(() => readInitialCount());

  useEffect(() => {
    try {
      localStorage.setItem(CART_COUNT_STORAGE_KEY, String(count));
    } catch {
      // ignore storage failures
    }
  }, [count]);

  const value = useMemo(() => ({ count, setCount }), [count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
