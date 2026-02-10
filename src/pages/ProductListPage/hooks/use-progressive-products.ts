import { useEffect, useMemo, useRef, useState } from 'react';

type UseProgressiveProductsOptions = {
  initialVisibleCount?: number;
  revealStep?: number;
};

export function useProgressiveProducts<T>(items: T[], options: UseProgressiveProductsOptions = {}) {
  const initialVisibleCount = Math.max(1, options.initialVisibleCount ?? 12);
  const revealStep = Math.max(1, options.revealStep ?? 6);

  const [visibleCount, setVisibleCount] = useState(() => Math.min(initialVisibleCount, items.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

  useEffect(() => {
    setVisibleCount(Math.min(initialVisibleCount, items.length));
  }, [initialVisibleCount, items]);

  useEffect(() => {
    if (!hasIntersectionObserver) return;
    if (visibleCount >= items.length) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setVisibleCount(prev => Math.min(items.length, prev + revealStep));
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasIntersectionObserver, items.length, revealStep, visibleCount]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(items.length, prev + revealStep));
  };

  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    visibleCount,
    hasMore,
    sentinelRef,
    hasIntersectionObserver,
    loadMore,
  };
}
