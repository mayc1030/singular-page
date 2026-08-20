import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
      ))}
    </div>
  );
};
