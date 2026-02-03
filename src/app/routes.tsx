import { Route, Routes } from 'react-router-dom';

import { NotFoundPage } from '../pages/NotFoundPage/not-found-page';
import { ProductDetailsPage } from '../pages/ProductDetailsPage/product-details-page';
import { ProductListPage } from '../pages/ProductListPage/product-list-page';
import { AppLayout } from './layout/app-layout';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
