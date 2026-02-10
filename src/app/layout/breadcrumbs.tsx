import { Link, useMatch } from 'react-router-dom';

import { useProductDetailsQuery } from '../../api/product-queries';

export function Breadcrumbs() {
  const match = useMatch('/product/:id');
  const id = match?.params?.id;

  const { data } = useProductDetailsQuery(id);

  const productLabel = data ? `${data.brand} ${data.model}` : 'Product';
  const onProduct = Boolean(id);

  return (
    <nav aria-label="Breadcrumb" className="neo-panel bg-paper px-3 py-2 text-sm sm:px-4">
      <ol className="text-ink/80 flex flex-wrap items-center gap-2">
        <li className="flex items-center gap-2">
          <Link to="/" className="font-semibold underline-offset-2 hover:underline">
            Home
          </Link>
        </li>

        {onProduct ? (
          <>
            <li aria-hidden="true" className="font-semibold">
              /
            </li>
            <li>
              <span aria-current="page" className="text-ink font-extrabold">
                {productLabel}
              </span>
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
