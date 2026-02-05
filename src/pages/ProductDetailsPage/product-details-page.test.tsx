import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductDetailsPage } from './product-details-page';

const useProductDetailsQueryMock = vi.fn();
const mutateMock = vi.fn();

vi.mock('../../api/product-queries', () => ({
  useProductDetailsQuery: (...args: unknown[]) => useProductDetailsQueryMock(...args),
}));

vi.mock('../../hooks/use-add-to-cart-mutation', () => ({
  useAddToCartMutation: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function renderPdp(path = '/product/7') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProductDetailsPage', () => {
  it('renders options and calls add-to-cart with selected codes', async () => {
    const user = userEvent.setup();

    useProductDetailsQueryMock.mockReturnValue({
      data: {
        id: '7',
        brand: 'Acer',
        model: 'Iconia Talk S',
        price: '170',
        imgUrl: 'x',
        options: {
          colors: [
            { code: 1000, name: 'Black' },
            { code: 1001, name: 'White' },
          ],
          storages: [
            { code: 2000, name: '16 GB' },
            { code: 2001, name: '32 GB' },
          ],
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPdp();

    expect(screen.getByRole('heading', { name: /acer iconia talk s/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/color/i), '1001');
    await user.selectOptions(screen.getByLabelText(/storage/i), '2001');

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mutateMock).toHaveBeenCalledWith({
      id: '7',
      colorCode: 1001,
      storageCode: 2001,
    });
  });

  it('uses first options by default when user does not change selects', async () => {
    const user = userEvent.setup();

    useProductDetailsQueryMock.mockReturnValue({
      data: {
        id: '7',
        brand: 'Acer',
        model: 'Iconia Talk S',
        price: '170',
        imgUrl: 'x',
        options: {
          colors: [
            { code: 1000, name: 'Black' },
            { code: 1001, name: 'White' },
          ],
          storages: [
            { code: 2000, name: '16 GB' },
            { code: 2001, name: '32 GB' },
          ],
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPdp();

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mutateMock).toHaveBeenCalledWith({
      id: '7',
      colorCode: 1000,
      storageCode: 2000,
    });
  });

  it('disables add-to-cart when options are missing', () => {
    useProductDetailsQueryMock.mockReturnValue({
      data: {
        id: '7',
        brand: 'Acer',
        model: 'Iconia Talk S',
        price: '170',
        imgUrl: 'x',
        options: { colors: [], storages: [] },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPdp();

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });
});
