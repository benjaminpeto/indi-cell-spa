import type { CartItem, CartItemInput } from '../../types/cart';

export function buildCartItemKey(productId: string, colorCode: number, storageCode: number) {
  return `${productId}:${colorCode}:${storageCode}`;
}

export function parseCartCount(raw: string | null) {
  const count = raw ? Number(raw) : 0;
  return Number.isFinite(count) && count >= 0 ? count : 0;
}

export function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(item => item && typeof item === 'object')
      .filter(item => typeof item.key === 'string' && typeof item.productId === 'string')
      .filter(item => Number.isFinite(item.unitPrice) && Number.isFinite(item.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

export function readCountFromStorage(storageKey: string) {
  try {
    return parseCartCount(localStorage.getItem(storageKey));
  } catch {
    return 0;
  }
}

export function readItemsFromStorage(storageKey: string) {
  try {
    return parseCartItems(localStorage.getItem(storageKey));
  } catch {
    return [];
  }
}

export function addOrMergeCartItem(items: CartItem[], input: CartItemInput) {
  const key = buildCartItemKey(input.productId, input.colorCode, input.storageCode);
  const existing = items.find(item => item.key === key);

  if (!existing) return [...items, { ...input, key, quantity: 1 }];
  return items.map(item => (item.key === key ? { ...item, quantity: item.quantity + 1 } : item));
}

export function removeCartItemLine(items: CartItem[], key: string) {
  const target = items.find(item => item.key === key);
  if (!target) return { nextItems: items, removedQuantity: 0 };

  return {
    nextItems: items.filter(item => item.key !== key),
    removedQuantity: target.quantity,
  };
}
