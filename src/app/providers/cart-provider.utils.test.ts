import { describe, expect, it } from 'vitest';

import type { CartItem } from '../../types/cart';
import {
  addOrMergeCartItem,
  buildCartItemKey,
  parseCartCount,
  parseCartItems,
  removeCartItemLine,
} from './cart-provider.utils';

const baseItem: CartItem = {
  key: 'p1:1000:2000',
  productId: 'p1',
  brand: 'Acer',
  model: 'Iconia Talk S',
  imgUrl: 'x',
  unitPrice: 170,
  colorCode: 1000,
  colorName: 'Black',
  storageCode: 2000,
  storageName: '16 GB',
  quantity: 1,
};

describe('cart-provider.utils', () => {
  it('buildCartItemKey composes product and variant keys', () => {
    expect(buildCartItemKey('p1', 1000, 2000)).toBe('p1:1000:2000');
  });

  it('parseCartCount guards invalid values', () => {
    expect(parseCartCount('4')).toBe(4);
    expect(parseCartCount('-1')).toBe(0);
    expect(parseCartCount('NaN')).toBe(0);
    expect(parseCartCount(null)).toBe(0);
  });

  it('parseCartItems returns only valid rows', () => {
    const raw = JSON.stringify([baseItem, { ...baseItem, key: 12 }, { ...baseItem, quantity: 0 }]);
    const parsed = parseCartItems(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].key).toBe(baseItem.key);
  });

  it('addOrMergeCartItem merges same variant into quantity', () => {
    const input = {
      productId: baseItem.productId,
      brand: baseItem.brand,
      model: baseItem.model,
      imgUrl: baseItem.imgUrl,
      unitPrice: baseItem.unitPrice,
      colorCode: baseItem.colorCode,
      colorName: baseItem.colorName,
      storageCode: baseItem.storageCode,
      storageName: baseItem.storageName,
    };

    const once = addOrMergeCartItem([], input);
    const twice = addOrMergeCartItem(once, input);

    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it('removeCartItemLine returns removed quantity and remaining items', () => {
    const items = [baseItem, { ...baseItem, key: 'p2:1001:2001', productId: 'p2' }];
    const result = removeCartItemLine(items, baseItem.key);

    expect(result.removedQuantity).toBe(1);
    expect(result.nextItems).toHaveLength(1);
    expect(result.nextItems[0].key).toBe('p2:1001:2001');
  });
});
