import type { Dispatch, ReactNode, SetStateAction } from 'react';

import type { CartItem, CartItemInput } from '../../types/cart';

export type CartProviderProps = {
  children: ReactNode;
};

export type CartContextValue = {
  count: number;
  items: CartItem[];
  setCount: Dispatch<SetStateAction<number>>;
  addItem: (item: CartItemInput) => void;
  removeItem: (key: string) => void;
};
