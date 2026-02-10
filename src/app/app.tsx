import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { ONE_HOUR_MS } from '../cache/cache-storage';
import { CartProvider } from './providers/cart-provider';
import { AppRoutes } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: ONE_HOUR_MS,
      gcTime: ONE_HOUR_MS * 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter basename="/indi-cell-spa/">
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}
