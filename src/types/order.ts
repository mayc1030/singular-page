export type PrintSide = 'front' | 'back';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Technique {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  minQuantity: number;
  recommendedFor: string;
  iconName: string;
}

export interface PriceBreakdown {
  basePrice: number;
  colorExtra: number;
  techniquePrice: number;
  extraSideCost: number;
  unitPriceBeforeDiscount: number;
  unitPrice: number;
  discountPercentage: number;
  totalPrice: number;
  quantity: number;
  volumeTierLabel: string;
}

export interface OrderState {
  productId: string;
  colorId: string;
  size: Size;
  quantity: number;
  techniqueId: string;
  activeSide: PrintSide;
  printedSides: PrintSide[];
}

export interface SavedDesign {
  id: string; // e.g. CAM-2026-00001
  createdAt: string;
  updatedAt: string;
  productName: string;
  productId: string;
  colorId: string;
  colorHex: string;
  size: Size;
  quantity: number;
  techniqueId: string;
  techniqueName: string;
  printedSides: PrintSide[];
  priceTotal: number;
  unitPrice: number;
  canvasJsonFront?: string;
  canvasJsonBack?: string;
  previewUrlFront?: string;
  previewUrlBack?: string;
}
