import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AppLayout } from './app-layout';

vi.mock('./header', () => ({
  Header: () => <div>Header Mock</div>,
}));

vi.mock('./breadcrumbs', () => ({
  Breadcrumbs: () => <div>Breadcrumbs Mock</div>,
}));

describe('AppLayout', () => {
  it('renders skip link, layout landmarks and outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Outlet Mock</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');
    expect(screen.getByText('Header Mock')).toBeInTheDocument();
    expect(screen.getByText('Breadcrumbs Mock')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Outlet Mock')).toBeInTheDocument();
  });
});
