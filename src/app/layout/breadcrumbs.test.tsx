import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useProductDetailsQueryMock = vi.fn();

vi.mock('../../api/product-queries', () => ({
  useProductDetailsQuery: (...args: unknown[]) => useProductDetailsQueryMock(...args),
}));

async function renderBreadcrumbs(initialEntry: string) {
  const { Breadcrumbs } = await import('./breadcrumbs');

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useProductDetailsQueryMock.mockReset();
});

describe('Breadcrumbs', () => {
  it('renders Home on PLP', async () => {
    useProductDetailsQueryMock.mockReturnValue({ data: undefined });

    await renderBreadcrumbs('/');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Product')).not.toBeInTheDocument();
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  it('renders product label on PDP when data exists', async () => {
    useProductDetailsQueryMock.mockReturnValue({
      data: { brand: 'Acer', model: 'Iconia Talk S' },
    });

    await renderBreadcrumbs('/product/7');

    expect(useProductDetailsQueryMock).toHaveBeenCalledWith('7');
    expect(screen.getByText(/acer iconia talk s/i)).toBeInTheDocument();
    expect(screen.queryByText('Product')).not.toBeInTheDocument();
  });

  it('falls back to Product label on PDP when no data', async () => {
    useProductDetailsQueryMock.mockReturnValue({ data: undefined });

    await renderBreadcrumbs('/product/7');

    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('renders Checkout label on checkout route', async () => {
    useProductDetailsQueryMock.mockReturnValue({ data: undefined });

    await renderBreadcrumbs('/checkout');

    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });
});
