import type { ApiProductListItem } from '../../../types/api';
import { ProductCard } from './product-card';

type ProductListContentProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  products: ApiProductListItem[];
  filteredProducts: ApiProductListItem[];
};

export function ProductListContent({ isLoading, isError, error, products, filteredProducts }: ProductListContentProps) {
  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products: {(error as Error).message}</p>;
  if (products.length === 0) return <p>No products found.</p>;
  if (filteredProducts.length === 0) return <p>No matching products.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
