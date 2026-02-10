import type { RefObject } from 'react';

import type { ApiProductListItem } from '../../../types/api';
import { ProductCard } from './product-card';

type ProductListContentProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  products: ApiProductListItem[];
  filteredProducts: ApiProductListItem[];
  hasMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  hasIntersectionObserver: boolean;
  onLoadMore: () => void;
};

export function ProductListContent({
  isLoading,
  isError,
  error,
  products,
  filteredProducts,
  hasMore,
  sentinelRef,
  hasIntersectionObserver,
  onLoadMore,
}: ProductListContentProps) {
  if (isLoading) return <p className="neo-panel p-4 text-sm font-semibold">Loading products...</p>;
  if (isError)
    return (
      <p className="neo-panel bg-clay/20 p-4 text-sm font-semibold">
        Failed to load products: {(error as Error).message}
      </p>
    );
  if (products.length === 0) return <p className="neo-panel p-4 text-sm font-semibold">No products found.</p>;
  if (filteredProducts.length === 0)
    return <p className="neo-panel p-4 text-sm font-semibold">No matching products.</p>;

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(product => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {hasMore ? (
        hasIntersectionObserver ? (
          <div ref={sentinelRef} aria-label="Load more products trigger" className="h-5" />
        ) : (
          <div className="flex justify-center">
            <button type="button" onClick={onLoadMore} className="neo-button px-4 py-2 text-sm uppercase">
              Load more
            </button>
          </div>
        )
      ) : null}
    </div>
  );
}
