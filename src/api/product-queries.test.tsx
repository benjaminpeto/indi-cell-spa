import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getProductsMock = vi.fn();
const getProductByIdMock = vi.fn();

vi.mock('./client.ts', () => ({
  apiClient: {
    getProducts: (...args: unknown[]) => getProductsMock(...args),
    getProductById: (...args: unknown[]) => getProductByIdMock(...args),
  },
}));

const getCacheMock = vi.fn();
const setCacheMock = vi.fn();

vi.mock('../cache/cache-storage.ts', () => ({
  getCache: (...args: unknown[]) => getCacheMock(...args),
  setCache: (...args: unknown[]) => setCacheMock(...args),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  getProductsMock.mockReset();
  getProductByIdMock.mockReset();
  getCacheMock.mockReset();
  setCacheMock.mockReset();

  vi.resetModules();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('product-queries', () => {
  it('useProductsQuery returns cached data and does not call api', async () => {
    const cached = [{ id: '1', brand: 'A', model: 'M', price: '10', imgUrl: 'x' }];
    getCacheMock.mockReturnValue(cached);

    const wrapper = createWrapper();

    const { useProductsQuery } = await import('./product-queries');
    const { result } = renderHook(() => useProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(cached);
    expect(getProductsMock).not.toHaveBeenCalled();
    expect(setCacheMock).not.toHaveBeenCalled();
    expect(getCacheMock).toHaveBeenCalledWith('products:list');
  });

  it('useProductsQuery calls api and sets cache on miss', async () => {
    getCacheMock.mockReturnValue(null);

    const fresh = [{ id: '2', brand: 'B', model: 'X', price: '99', imgUrl: 'y' }];
    getProductsMock.mockResolvedValue(fresh);

    const wrapper = createWrapper();

    const { useProductsQuery } = await import('./product-queries');
    const { result } = renderHook(() => useProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductsMock).toHaveBeenCalledTimes(1);
    expect(setCacheMock).toHaveBeenCalledWith('products:list', fresh);
    expect(result.current.data).toEqual(fresh);
  });

  it('useProductDetailsQuery is disabled when id is undefined', async () => {
    const wrapper = createWrapper();

    const { useProductDetailsQuery } = await import('./product-queries');
    const { result } = renderHook(() => useProductDetailsQuery(undefined), { wrapper });

    // if enabled=false, query should not execute
    expect(result.current.fetchStatus).toBe('idle');
    expect(getProductByIdMock).not.toHaveBeenCalled();
    expect(setCacheMock).not.toHaveBeenCalled();
  });

  it('useProductDetailsQuery returns cached data and does not call api', async () => {
    const cached = {
      id: '7',
      brand: 'Acer',
      model: 'Iconia',
      price: '170',
      imgUrl: 'z',
      options: { colors: [], storages: [] },
    };

    getCacheMock.mockReturnValue(cached);

    const wrapper = createWrapper();

    const { useProductDetailsQuery } = await import('./product-queries');
    const { result } = renderHook(() => useProductDetailsQuery('7'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(cached);
    expect(getProductByIdMock).not.toHaveBeenCalled();
    expect(setCacheMock).not.toHaveBeenCalled();
    expect(getCacheMock).toHaveBeenCalledWith('products:detail:7');
  });

  it('useProductDetailsQuery calls api and sets cache on miss', async () => {
    getCacheMock.mockReturnValue(null);

    const fresh = {
      id: '7',
      brand: 'Acer',
      model: 'Iconia',
      price: '170',
      imgUrl: 'z',
      options: { colors: [], storages: [] },
    };

    getProductByIdMock.mockResolvedValue(fresh);

    const wrapper = createWrapper();

    const { useProductDetailsQuery } = await import('./product-queries');
    const { result } = renderHook(() => useProductDetailsQuery('7'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductByIdMock).toHaveBeenCalledTimes(1);
    expect(getProductByIdMock).toHaveBeenCalledWith('7');
    expect(setCacheMock).toHaveBeenCalledWith('products:detail:7', fresh);
    expect(result.current.data).toEqual(fresh);
  });
});
