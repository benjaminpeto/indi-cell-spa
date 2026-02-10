import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useProgressiveProducts } from './use-progressive-products';

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({ id: String(i + 1) }));
}

describe('useProgressiveProducts', () => {
  it('returns first 12 items by default', () => {
    const { result } = renderHook(() => useProgressiveProducts(makeItems(20)));

    expect(result.current.visibleItems).toHaveLength(12);
    expect(result.current.hasMore).toBe(true);
  });

  it('loads more items by step', () => {
    const items = makeItems(20);
    const { result } = renderHook(() => useProgressiveProducts(items, { initialVisibleCount: 12, revealStep: 6 }));

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.visibleItems).toHaveLength(18);
    expect(result.current.hasMore).toBe(true);
  });

  it('resets visible count when list changes', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useProgressiveProducts(items, { initialVisibleCount: 12, revealStep: 6 }),
      { initialProps: { items: makeItems(20) } },
    );

    act(() => {
      result.current.loadMore();
    });
    expect(result.current.visibleItems).toHaveLength(18);

    rerender({ items: makeItems(6) });

    expect(result.current.visibleItems).toHaveLength(6);
    expect(result.current.hasMore).toBe(false);
  });
});
