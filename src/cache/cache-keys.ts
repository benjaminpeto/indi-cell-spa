export const cacheKeys = {
  productsList: () => 'products:list',
  productDetails: (id: string) => `products:detail:${id}`,
};
