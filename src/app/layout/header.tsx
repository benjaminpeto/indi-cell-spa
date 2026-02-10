import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCart } from '../providers/cart-provider';

export function Header() {
  const { count } = useCart();

  return (
    <header className="border-ink bg-sun fixed top-0 right-0 left-0 z-50 border-b-[3px]">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-extrabold tracking-wide uppercase transition-transform duration-200 hover:-translate-y-0.5"
        >
          Indi Cell Store
        </Link>

        <div className="neo-panel bg-paper inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold">
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          <span>
            Cart: <span className="font-extrabold">{count}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
