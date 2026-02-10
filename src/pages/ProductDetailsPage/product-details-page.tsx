import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useProductDetailsQuery } from '../../api/product-queries';
import { useAddToCartMutation } from '../../hooks/use-add-to-cart-mutation';
import { buildSpecs, getSelectedOptionCode } from './utils/product-details';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProductDetailsQuery(id);
  const addToCart = useAddToCartMutation();

  const [selectedColorCode, setSelectedColorCode] = useState<number | null>(null);
  const [selectedStorageCode, setSelectedStorageCode] = useState<number | null>(null);

  const colorOptions = useMemo(() => data?.options?.colors ?? [], [data]);
  const storageOptions = useMemo(() => data?.options?.storages ?? [], [data]);

  const colorCode = getSelectedOptionCode(selectedColorCode, colorOptions);
  const storageCode = getSelectedOptionCode(selectedStorageCode, storageOptions);

  if (isLoading) return <p className="neo-panel mt-5 p-4 text-sm font-semibold">Loading product...</p>;
  if (isError)
    return (
      <p className="neo-panel bg-clay/20 mt-5 p-4 text-sm font-semibold">
        Failed to load product: {(error as Error).message}
      </p>
    );
  if (!data) return <p className="neo-panel mt-5 p-4 text-sm font-semibold">Product not found.</p>;

  const title = `${data.brand} ${data.model}`;
  const specs = buildSpecs(data);

  const canAdd =
    Boolean(id) &&
    colorCode !== null &&
    storageCode !== null &&
    !addToCart.isPending &&
    colorOptions.length > 0 &&
    storageOptions.length > 0;

  return (
    <section aria-labelledby="product-title" className="space-y-5 py-5">
      <Link className="inline-flex items-center gap-2 text-sm font-bold underline-offset-2 hover:underline" to="/">
        ← Back to list
      </Link>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-5">
          <header className="neo-panel bg-paper p-4 sm:p-5">
            <h1 id="product-title" className="text-2xl leading-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm font-semibold">
              Price:{' '}
              <span className="border-ink bg-sun inline-block border-2 px-2 py-0.5 text-base font-extrabold">
                {data.price ? `${data.price}€` : '—'}
              </span>
            </p>
          </header>
          <figure className="neo-panel self-start overflow-hidden bg-white p-3 sm:p-4">
            <img
              src={data.imgUrl}
              alt={title}
              className="mx-auto h-auto max-h-70 w-full object-contain object-top sm:max-h-85 md:max-h-105"
              loading="eager"
              decoding="async"
              sizes="(max-width: 767px) 92vw, 44vw"
            />
          </figure>
        </div>

        <article className="space-y-5">
          <fieldset className="neo-panel bg-paper space-y-4 p-4 sm:p-5">
            <legend className="px-1 text-sm font-extrabold tracking-[0.08em] uppercase">Product actions</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="color" className="mb-1.5 block text-sm font-bold tracking-wide uppercase">
                  Color
                </label>
                <select
                  id="color"
                  value={colorCode ?? ''}
                  onChange={e => setSelectedColorCode(Number(e.target.value))}
                  className="border-ink w-full border-[3px] bg-white px-3 py-2.5 text-sm font-semibold"
                  disabled={colorOptions.length === 0}
                >
                  {colorOptions.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {colorOptions.length === 0 ? (
                  <p className="mt-1 text-xs font-medium">No color options available.</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="storage" className="mb-1.5 block text-sm font-bold tracking-wide uppercase">
                  Storage
                </label>
                <select
                  id="storage"
                  value={storageCode ?? ''}
                  onChange={e => setSelectedStorageCode(Number(e.target.value))}
                  className="border-ink w-full border-[3px] bg-white px-3 py-2.5 text-sm font-semibold"
                  disabled={storageOptions.length === 0}
                >
                  {storageOptions.map(s => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {storageOptions.length === 0 ? (
                  <p className="mt-1 text-xs font-medium">No storage options available.</p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!id || colorCode === null || storageCode === null) return;
                addToCart.mutate({ id, colorCode, storageCode });
              }}
              disabled={!canAdd}
              className="neo-button w-full px-4 py-2.5 text-sm uppercase"
            >
              {addToCart.isPending ? 'Adding…' : 'Add to cart'}
            </button>
          </fieldset>

          <fieldset className="neo-panel bg-paper space-y-4 p-4 sm:p-5" aria-labelledby="product-details-heading">
            <legend id="product-details-heading" className="px-1 text-sm font-extrabold tracking-[0.08em] uppercase">
              Product details
            </legend>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {specs.map(row => (
                <div key={row.label} className="border-ink border-2 bg-white px-3 py-2">
                  <dt className="text-xs font-bold tracking-wide uppercase">{row.label}</dt>
                  <dd className="mt-1 text-sm font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </fieldset>
        </article>
      </div>
    </section>
  );
}
