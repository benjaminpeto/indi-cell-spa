import { Link } from 'react-router-dom';

import type { ApiProductListItem } from '../../../types/api';

export function ProductCard({ product }: { product: ApiProductListItem }) {
  const title = `${product.brand} ${product.model}`;
  const priceLabel = product.price ? `${product.price}€` : '—';

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
      aria-label={`View ${title}`}
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-neutral-50">
        <img
          src={product.imgUrl}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="space-y-1 p-4">
        <p className="text-sm text-neutral-600">{product.brand}</p>
        <h2 className="leading-snug font-medium">{product.model}</h2>
        <p className="text-sm font-semibold">{priceLabel}</p>
      </div>
    </Link>
  );
}
