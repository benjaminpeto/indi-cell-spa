export const queryKeys = {
  products: ['products'] as const,
  product: (id: string) => ['product', id] as const,
};
