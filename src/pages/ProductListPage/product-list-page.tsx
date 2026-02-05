import { useMemo, useState } from 'react';

import { useProductsQuery } from '../../api/product-queries';
import { ProductCard } from './components/product-card';
import { filterProducts } from './filter-products';

export function ProductListPage() {
  const { data, isLoading, isError, error } = useProductsQuery();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => filterProducts(data ?? [], query), [data, query]);

  // TODO: refactor to use useReducer or something for the various loading/error states instead of 10+ conditionals in the JSX :D LOL
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

        {!isLoading && !isError && data?.length ? (
          <p className="text-sm text-neutral-600">
            Showing <span className="font-medium text-neutral-900">{filtered.length}</span> of{' '}
            <span className="font-medium text-neutral-900">{data.length}</span>
          </p>
        ) : null}
      </header>

      {isLoading && <p>Loading products...</p>}

      {isError && <p>Failed to load products: {(error as Error).message}</p>}

      {!isLoading && !isError && (!data || data.length === 0) && <p>No products found.</p>}

      {!isLoading && !isError && data && data.length > 0 && filtered.length === 0 && <p>No matching products.</p>}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
