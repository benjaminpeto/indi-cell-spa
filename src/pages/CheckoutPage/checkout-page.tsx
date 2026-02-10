import { Github, Linkedin, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../app/providers/cart-provider';

function formatPrice(value: number) {
  return `${value.toFixed(2)}€`;
}

export function CheckoutPage() {
  const { items, removeItem } = useCart();
  const [showHirePrompt, setShowHirePrompt] = useState(false);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  if (items.length === 0) {
    return (
      <section className="space-y-4 py-5" aria-labelledby="checkout-title">
        <h1 id="checkout-title" className="neo-panel bg-paper p-4 text-2xl sm:p-5 sm:text-3xl">
          Checkout
        </h1>
        <p className="neo-panel bg-paper p-4 text-sm font-semibold">Your cart is empty. Add a phone and come back.</p>
        <Link to="/" className="neo-button inline-flex px-4 py-2 text-sm uppercase">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5 py-5" aria-labelledby="checkout-title">
      <h1 id="checkout-title" className="neo-panel bg-paper p-4 text-2xl sm:p-5 sm:text-3xl">
        Checkout
      </h1>

      <ul className="space-y-4" aria-label="Cart items">
        {items.map(item => {
          const lineTotal = item.unitPrice * item.quantity;

          return (
            <li key={item.key} className="neo-panel bg-paper p-4 sm:p-5">
              <article className="grid gap-4 sm:grid-cols-[140px_1fr]">
                {item.imgUrl ? (
                  <img
                    src={item.imgUrl}
                    alt={`${item.brand} ${item.model}`}
                    className="border-ink h-28 w-full border-2 bg-white object-contain p-2"
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="border-ink flex h-28 w-full items-center justify-center border-2 bg-white text-xs font-semibold"
                  >
                    No image
                  </div>
                )}

                <div className="space-y-2">
                  <h2 className="text-lg leading-tight">
                    {item.brand} {item.model}
                  </h2>
                  <p className="text-sm font-semibold">
                    Color: {item.colorName} | Storage: {item.storageName}
                  </p>
                  <p className="text-sm font-semibold">
                    Unit: {formatPrice(item.unitPrice)} | Quantity: {item.quantity}
                  </p>
                  <p className="border-ink bg-sun inline-block border-2 px-2 py-1 text-sm font-extrabold">
                    Line total: {formatPrice(lineTotal)}
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="neo-button px-4 py-2 text-sm uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <aside className="neo-panel bg-paper space-y-4 p-4 sm:p-5" aria-label="Checkout summary">
        <p className="text-lg font-extrabold">Total: {formatPrice(total)}</p>
        <button
          type="button"
          className="neo-button inline-flex items-center gap-2 px-4 py-2 text-sm uppercase"
          onClick={() => setShowHirePrompt(prev => !prev)}
          aria-expanded={showHirePrompt}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Checkout
        </button>

        {showHirePrompt ? (
          <div className="border-ink space-y-3 border-2 bg-white p-3">
            <p className="text-sm font-semibold">
              Checkout service is on coffee break. Meanwhile, hire the engineer who built this cart.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.linkedin.com/in/benjaminpeto"
                target="_blank"
                rel="noreferrer"
                className="neo-button inline-flex items-center gap-2 px-3 py-2 text-xs uppercase"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="https://github.com/benjaminpeto"
                target="_blank"
                rel="noreferrer"
                className="neo-button inline-flex items-center gap-2 px-3 py-2 text-xs uppercase"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
