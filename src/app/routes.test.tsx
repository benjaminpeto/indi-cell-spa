import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AppRoutes } from './routes';

vi.mock('../pages/ProductListPage/product-list-page', () => ({
  ProductListPage: () => <div>PLP Mock</div>,
}));

vi.mock('../pages/ProductDetailsPage/product-details-page', () => ({
  ProductDetailsPage: () => <div>PDP Mock</div>,
}));

vi.mock('../pages/CheckoutPage/checkout-page', () => ({
  CheckoutPage: () => <div>Checkout Mock</div>,
}));

vi.mock('../pages/NotFoundPage/not-found-page', () => ({
  NotFoundPage: () => <div>NotFound Mock</div>,
}));

vi.mock('./layout/app-layout', () => ({
  AppLayout: () => (
    <div>
      <div>Layout Mock</div>
      <Outlet />
    </div>
  ),
}));

describe('AppRoutes', () => {
  it('renders checkout route', () => {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('Layout Mock')).toBeInTheDocument();
    expect(screen.getByText('Checkout Mock')).toBeInTheDocument();
  });

  it('renders not found route for unknown path', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('NotFound Mock')).toBeInTheDocument();
  });
});
