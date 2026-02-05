import type { AddToCartRequest, AddToCartResponse, ApiProductDetails, ApiProductListItem } from '../types/api';

const API_BASE_URL = 'https://itx-frontend-test.onrender.com';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText} (${path}) ${text}`);
  }

  return (await res.json()) as T;
}

export const apiClient = {
  getProducts: () => request<ApiProductListItem[]>('/api/product'),
  getProductById: (id: string) => request<ApiProductDetails>(`/api/product/${id}`),
  addToCart: (body: AddToCartRequest) =>
    request<AddToCartResponse>('/api/cart', { method: 'POST', body: JSON.stringify(body) }),
};
