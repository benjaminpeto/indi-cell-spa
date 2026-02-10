import { useMemo, useState } from 'react';

import { useProductsQuery } from '../../api/product-queries';
import { ProductListContent } from './components/product-list-content';
import { filterProducts } from './filter-products';
import { useProgressiveProducts } from './hooks/use-progressive-products';

export function ProductListPage() {
  const { data, isLoading, isError, error } = useProductsQuery();
  const [query, setQuery] = useState('');

  const products = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(() => filterProducts(products, query), [products, query]);
  const hasProducts = products.length > 0;
  const showSummary = !isLoading && !isError && hasProducts;
  const progressive = useProgressiveProducts(filtered, { initialVisibleCount: 12, revealStep: 6 });

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Product List</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-md">
            <label htmlFor="product-search" className="block text-sm font-medium">
              Search
            </label>
            <input
              id="product-search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by brand or model..."
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />
          </div>

          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="self-start rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Clear
            </button>
          ) : null}
        </div>

        {showSummary ? (
          <p className="text-sm text-neutral-600">
            Showing <span className="font-medium text-neutral-900">{filtered.length}</span> of{' '}
            <span className="font-medium text-neutral-900">{products.length}</span>
          </p>
        ) : null}
      </header>

      <ProductListContent
        isLoading={isLoading}
        isError={isError}
        error={error}
        products={products}
        filteredProducts={progressive.visibleItems}
        hasMore={progressive.hasMore}
        sentinelRef={progressive.sentinelRef}
        hasIntersectionObserver={progressive.hasIntersectionObserver}
        onLoadMore={progressive.loadMore}
      />
    </section>
  );
}
