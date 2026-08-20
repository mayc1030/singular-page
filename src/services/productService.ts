import type { Product } from '../types/product';
import { PRODUCTS, getProductById } from '../data/products';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    // Simulating async API call for future backend readiness
    return PRODUCTS;
  },

  getProductById: async (id: string): Promise<Product> => {
    return getProductById(id);
  },

  getPopularProducts: async (): Promise<Product[]> => {
    return PRODUCTS.filter((p) => p.popular);
  }
};
