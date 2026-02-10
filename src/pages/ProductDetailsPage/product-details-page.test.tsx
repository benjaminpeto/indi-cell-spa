import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useProductDetailsQuery } from '../../api/product-queries';
import { useAddToCartMutation } from '../../hooks/use-add-to-cart-mutation';
import { ProductDetailsPage } from './product-details-page';

vi.mock('../../api/product-queries', async () => {
  const actual = await vi.importActual<typeof import('../../api/product-queries')>('../../api/product-queries');
  return { ...actual, useProductDetailsQuery: vi.fn() };
});

vi.mock('../../hooks/use-add-to-cart-mutation', () => ({
  useAddToCartMutation: vi.fn(),
}));

const useProductDetailsQueryMock = vi.mocked(useProductDetailsQuery);
const useAddToCartMutationMock = vi.mocked(useAddToCartMutation);

function renderOnProductRoute(productId = 'ZmGrkLRPXOTpxsU4jjAcv') {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProductDetailsPage', () => {
  it('renders required product attributes and can add to cart with default selected options', async () => {
    const mutate = vi.fn();

    useAddToCartMutationMock.mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useAddToCartMutation>);

    useProductDetailsQueryMock.mockReturnValue({
      data: {
        id: 'ZmGrkLRPXOTpxsU4jjAcv',
        brand: 'Acer',
        model: 'Iconia Talk S',
        price: '170',
        imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
        cpu: 'Quad-core 1.3 GHz Cortex-A53',
        ram: '2 GB RAM',
        os: 'Android 6.0 (Marshmallow)',
        displaySize: '720 x 1280 pixels (~210 ppi pixel density)',
        displayResolution: '7.0 inches (~69.8% screen-to-body ratio)',
        battery: 'Non-removable Li-Ion 3400 mAh battery (12.92 Wh)',
        primaryCamera: ['13 MP', 'autofocus'],
        secondaryCmera: ['2 MP', '720p'],
        dimentions: '191.7 x 101 x 9.4 mm',
        weight: '260',
        options: {
          colors: [{ code: 1000, name: 'Black' }],
          storages: [{ code: 2000, name: '16 GB' }],
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useProductDetailsQuery>);

    renderOnProductRoute();

    // Title / required specs
    expect(screen.getByRole('heading', { name: /acer iconia talk s/i })).toBeInTheDocument();
    expect(screen.getByText(/price/i)).toBeInTheDocument();

    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText(/quad-core 1\.3 ghz/i)).toBeInTheDocument();

    expect(screen.getByText('RAM')).toBeInTheDocument();
    expect(screen.getByText(/2 gb ram/i)).toBeInTheDocument();

    expect(screen.getByText('Operating System')).toBeInTheDocument();
    expect(screen.getByText(/android 6\.0/i)).toBeInTheDocument();

    expect(screen.getByText('Screen resolution')).toBeInTheDocument();
    expect(screen.getByText(/720 x 1280 pixels/i)).toBeInTheDocument();

    expect(screen.getByText('Battery')).toBeInTheDocument();
    expect(screen.getByText(/3400 mAh/i)).toBeInTheDocument();

    expect(screen.getByText('Cameras')).toBeInTheDocument();
    expect(screen.getByText(/13 mp/i)).toBeInTheDocument();
    expect(screen.getByText(/2 mp/i)).toBeInTheDocument();

    expect(screen.getByText('Dimensions')).toBeInTheDocument();
    expect(screen.getByText(/191\.7 x 101 x 9\.4 mm/i)).toBeInTheDocument();

    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText(/260 g/i)).toBeInTheDocument();

    // Add-to-cart uses default option codes
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mutate).toHaveBeenCalledWith({ id: 'ZmGrkLRPXOTpxsU4jjAcv', colorCode: 1000, storageCode: 2000 });
  });

  it('disables add-to-cart when options are missing', () => {
    const mutate = vi.fn();

    useAddToCartMutationMock.mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useAddToCartMutation>);

    useProductDetailsQueryMock.mockReturnValue({
      data: {
        id: 'x',
        brand: 'Acer',
        model: 'Iconia Talk S',
        price: '170',
        imgUrl: 'x',
        options: { colors: [], storages: [] },
      },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useProductDetailsQuery>);

    renderOnProductRoute('x');

    const btn = screen.getByRole('button', { name: /add to cart/i });
    expect(btn).toBeDisabled();
    expect(mutate).not.toHaveBeenCalled();
  });
});
