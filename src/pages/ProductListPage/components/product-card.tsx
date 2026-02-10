import { Link } from 'react-router-dom';

import type { ApiProductListItem } from '../../../types/api';

export function ProductCard({ product }: { product: ApiProductListItem }) {
  const title = `${product.brand} ${product.model}`;
  const priceLabel = product.price ? `${product.price}€` : '—';

  return (
    <Link
      to={`/product/${product.id}`}
      className="neo-panel group bg-paper motion-safe:animate-enter-pop block overflow-hidden transition-all duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
      aria-label={`View ${title}`}
    >
      <div className="border-ink aspect-4/3 max-h-[240px] w-full overflow-hidden border-b-[3px] bg-white sm:max-h-[280px]">
        <img
          src={product.imgUrl}
          alt={title}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 639px) 92vw, (max-width: 1535px) 30vw, 22vw"
        />
      </div>

      <article className="space-y-1.5 p-4">
        <p className="text-xs font-bold tracking-[0.12em] uppercase">{product.brand}</p>
        <h2 className="font-body text-base leading-snug font-extrabold">{product.model}</h2>
        <p className="border-ink bg-sun inline-block border-2 px-2 py-0.5 text-sm font-extrabold">{priceLabel}</p>
      </article>
    </Link>
  );
}
