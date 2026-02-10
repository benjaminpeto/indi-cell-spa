import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useProductDetailsQuery } from '../../api/product-queries';
import { useAddToCartMutation } from '../../hooks/use-add-to-cart-mutation';
import { formatMaybeArray, formatWeight } from '../../shared/utils/format-reponse';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProductDetailsQuery(id);
  const addToCart = useAddToCartMutation();
  // TODO: create custom hook to seperate logic

  const [selectedColorCode, setSelectedColorCode] = useState<number | null>(null);
  const [selectedStorageCode, setSelectedStorageCode] = useState<number | null>(null);

  const colorOptions = useMemo(() => data?.options?.colors ?? [], [data]);
  const storageOptions = useMemo(() => data?.options?.storages ?? [], [data]);

  const colorCode = selectedColorCode ?? colorOptions[0]?.code ?? null;
  const storageCode = selectedStorageCode ?? storageOptions[0]?.code ?? null;

  if (isLoading) return <p>Loading product...</p>;
  if (isError) return <p>Failed to load product: {(error as Error).message}</p>;
  if (!data) return <p>Product not found.</p>;

  const title = `${data.brand} ${data.model}`;

  const canAdd =
    Boolean(id) &&
    colorCode !== null &&
    storageCode !== null &&
    !addToCart.isPending &&
    colorOptions.length > 0 &&
    storageOptions.length > 0;

  const screenResolution = data.displaySize?.trim() || null; // e.g. "720 x 1280 pixels ..."
  const screenSize = data.displayResolution?.trim() || null; // e.g. "7.0 inches ..."
  const cameras = [formatMaybeArray(data.primaryCamera), formatMaybeArray(data.secondaryCmera)]
    .filter(Boolean)
    .join(' / ');

  const specs: Array<{ label: string; value: string | null }> = [
    { label: 'Brand', value: data.brand?.trim() || null },
    { label: 'Model', value: data.model?.trim() || null },
    { label: 'CPU', value: data.cpu?.trim() || null },
    { label: 'RAM', value: data.ram?.trim() || null },
    { label: 'Operating System', value: data.os?.trim() || null },
    { label: 'Screen resolution', value: screenResolution },
    { label: 'Screen size', value: screenSize },
    { label: 'Battery', value: data.battery?.trim() || null },
    { label: 'Cameras', value: cameras || null },
    { label: 'Dimensions', value: data.dimentions?.trim() || null },
    { label: 'Weight', value: formatWeight(data.weight) },
  ].filter(row => row.value !== null);

  return (
    <section className="space-y-6">
      <Link className="text-sm hover:underline" to="/">
        ← Back to list
      </Link>
      {/* TODO: extract to separate components and use skeletons for loading state */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-neutral-50">
          <img src={data.imgUrl} alt={title} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-neutral-600">
              Price: <span className="font-semibold text-neutral-900">{data.price ? `${data.price}€` : '—'}</span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="color" className="block text-sm font-medium">
                Color
              </label>
              <select
                id="color"
                value={colorCode ?? ''}
                onChange={e => setSelectedColorCode(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                disabled={colorOptions.length === 0}
              >
                {colorOptions.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {colorOptions.length === 0 ? (
                <p className="mt-1 text-xs text-neutral-500">No color options available.</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="storage" className="block text-sm font-medium">
                Storage
              </label>
              <select
                id="storage"
                value={storageCode ?? ''}
                onChange={e => setSelectedStorageCode(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                disabled={storageOptions.length === 0}
              >
                {storageOptions.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
              {storageOptions.length === 0 ? (
                <p className="mt-1 text-xs text-neutral-500">No storage options available.</p>
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
            className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addToCart.isPending ? 'Adding…' : 'Add to cart'}
          </button>

          <div className="rounded-2xl border p-4">
            <h2 className="text-sm font-semibold text-neutral-900">Product details</h2>

            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {specs.map(row => (
                <div key={row.label} className="space-y-1">
                  <dt className="text-xs font-medium text-neutral-600">{row.label}</dt>
                  <dd className="text-sm text-neutral-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
