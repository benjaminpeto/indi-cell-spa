import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCart } from '../providers/cart-provider';

export function Header() {
  const { count } = useCart();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-col gap-1">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Indi Cell Store
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm">
            Cart: <span className="font-semibold">{count}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
