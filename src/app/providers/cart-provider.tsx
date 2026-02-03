import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

type CartContextValue = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

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
