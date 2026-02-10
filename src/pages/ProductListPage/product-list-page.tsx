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
    <section aria-labelledby="product-list-title" className="space-y-5 py-5">
      <header className="neo-panel bg-paper space-y-4 p-4 sm:p-5">
        <h1 id="product-list-title" className="text-2xl leading-tight sm:text-3xl">
          Product List
        </h1>

        <form
          role="search"
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          onSubmit={e => e.preventDefault()}
        >
          <div className="w-full sm:max-w-lg">
            <label htmlFor="product-search" className="mb-1.5 block text-sm font-bold tracking-wide uppercase">
              Search
            </label>
            <input
              id="product-search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by brand or model..."
              className="border-ink w-full border-[3px] bg-white px-3 py-2.5 text-base"
            />
          </div>

          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="neo-button self-start px-4 py-2 text-sm uppercase"
            >
              Clear
            </button>
          ) : null}
        </form>

        {showSummary ? (
          <p aria-live="polite" className="text-sm font-semibold">
            Showing <span className="font-extrabold">{filtered.length}</span> of{' '}
            <span className="font-extrabold">{products.length}</span>
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
