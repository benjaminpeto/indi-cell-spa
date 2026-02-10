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
  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products: {(error as Error).message}</p>;
  if (products.length === 0) return <p>No products found.</p>;
  if (filteredProducts.length === 0) return <p>No matching products.</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore ? (
        hasIntersectionObserver ? (
          <div ref={sentinelRef} aria-label="Load more products trigger" className="h-4" />
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Load more
            </button>
          </div>
        )
      ) : null}
    </div>
  );
}
