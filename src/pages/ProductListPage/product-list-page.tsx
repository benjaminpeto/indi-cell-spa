import { Link } from 'react-router-dom';

import { useProductsQuery } from '../../api/product-queries';

export function ProductListPage() {
  const { data, isLoading, isError, error } = useProductsQuery();

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products: {(error as Error).message}</p>;
  if (!data?.length) return <p>No products found.</p>;

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">Product List</h1>

      <ul className="list-inside list-disc space-y-1">
        {data.map(p => (
          <li key={p.id}>
            <Link className="hover:underline" to={`/product/${p.id}`}>
              {p.brand} {p.model} — {p.price}€
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
