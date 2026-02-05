import { Link, useMatch } from 'react-router-dom';

import { useProductDetailsQuery } from '../../api/product-queries';

export function Breadcrumbs() {
  const match = useMatch('/product/:id');
  const id = match?.params?.id;

  const { data } = useProductDetailsQuery(id);

  const productLabel = data ? `${data.brand} ${data.model}` : 'Product';
  const onProduct = Boolean(id);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-600">
      <ol className="flex items-center gap-2">
        <li className="flex items-center gap-2">
          <Link to="/" className="hover:text-neutral-900 hover:underline">
            Home
          </Link>
        </li>

        {onProduct ? (
          <>
            <li aria-hidden="true">/</li>
            <li>
              <span aria-current="page" className="text-neutral-800">
                {productLabel}
              </span>
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
