import type { Design } from '../types/design';
import { DESIGNS, getDesignsByCategory } from '../data/designs';

export const designService = {
  getAllDesigns: async (): Promise<Design[]> => {
    return DESIGNS;
  },

  getDesignsByCategory: async (category?: string): Promise<Design[]> => {
    return getDesignsByCategory(category);
  },

  getFeaturedDesigns: async (): Promise<Design[]> => {
    return DESIGNS.filter((d) => d.featured);
  },

  getDesignById: async (id: string): Promise<Design | undefined> => {
    return DESIGNS.find((d) => d.id === id);
  }
};
