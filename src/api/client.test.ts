import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from './client';

function mockFetchOk<T>(data: T) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(''),
  });
}

function mockFetchFail(opts?: { status?: number; statusText?: string; bodyText?: string }) {
  const status = opts?.status ?? 500;
  const statusText = opts?.statusText ?? 'Internal Server Error';
  const bodyText = opts?.bodyText ?? 'boom';

  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
    json: vi.fn(), // not used on failure
    text: vi.fn().mockResolvedValue(bodyText),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('apiClient', () => {
  it('getProducts calls GET /api/product', async () => {
    const fetchMock = mockFetchOk([
      { id: '1', brand: 'A', model: 'M', price: '10', imgUrl: 'https://example.com/x.jpg' },
    ]);
    vi.stubGlobal('fetch', fetchMock);

    const result = await apiClient.getProducts();

    expect(result).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://itx-frontend-test.onrender.com/api/product',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('getProductById calls GET /api/product/:id', async () => {
    const fetchMock = mockFetchOk({
      id: '7',
      brand: 'B',
      model: 'X',
      price: '99',
      imgUrl: 'https://example.com/y.jpg',
      options: { colors: [], storages: [] },
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await apiClient.getProductById('7');

    expect(result.id).toBe('7');
    expect(fetchMock).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product/7', expect.any(Object));
  });

  it('addToCart calls POST /api/cart with correct payload', async () => {
    const fetchMock = mockFetchOk({ count: 3 });
    vi.stubGlobal('fetch', fetchMock);

    const result = await apiClient.addToCart({ id: '1', colorCode: 2, storageCode: 3 });

    expect(result.count).toBe(3);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://itx-frontend-test.onrender.com/api/cart',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: '1', colorCode: 2, storageCode: 3 }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('throws a helpful error when response is not ok', async () => {
    const fetchMock = mockFetchFail({ status: 404, statusText: 'Not Found', bodyText: 'missing' });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.getProductById('nope')).rejects.toThrow(/404/i);
    await expect(apiClient.getProductById('nope')).rejects.toThrow(/not found/i);
  });
});
