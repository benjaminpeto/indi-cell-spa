import { Link, useParams } from 'react-router-dom';

import { useProductDetailsQuery } from '../../api/product-queries';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProductDetailsQuery(id);

  return (
    <section className="space-y-3">
      <Link className="text-sm hover:underline" to="/">
        ← Back to list
      </Link>

      {isLoading && <p>Loading product...</p>}
      {isError && <p>Failed to load product: {(error as Error).message}</p>}

      {data && (
        <>
          <h1 className="text-xl font-semibold">
            {data.brand} {data.model}
          </h1>
          <p>Price: {data.price}€</p>

          {/* Proof that options shape exists for next milestone */}
          <p className="text-sm text-neutral-600">
            Options: {data.options?.colors?.length ?? 0} colors, {data.options?.storages?.length ?? 0} storages
          </p>
        </>
      )}
    </section>
  );
}
