export type ProductCategory = 'tshirt' | 'polo' | 'hoodie' | 'sweatshirt' | 'longsleeve';

export interface PrintZone {
  id: 'front' | 'back' | 'left-sleeve' | 'right-sleeve';
  name: string;
  widthCm: number;
  heightCm: number;
  // Bounding rect percentage on mockup canvas
  bounds: {
    xPercentage: number; // e.g. 30% from left
    yPercentage: number; // e.g. 25% from top
    widthPercentage: number; // e.g. 40% width
    heightPercentage: number; // e.g. 50% height
  };
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  darkOverlay?: boolean;
  extraCost: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  mockups: {
    front: string; // SVG path or data URI template
    back: string;
  };
  availableColors: ProductColor[];
  availableSizes: string[];
  availableTechniques: string[];
  printZones: PrintZone[];
  popular?: boolean;
  tag?: string;
}
