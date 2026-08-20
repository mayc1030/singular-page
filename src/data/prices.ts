export interface VolumeDiscountTier {
  minQty: number;
  maxQty: number;
  discountPercentage: number;
  label: string;
}

export const VOLUME_DISCOUNT_TIERS: VolumeDiscountTier[] = [
  { minQty: 1, maxQty: 4, discountPercentage: 0, label: 'Unidad (1-4 pcs)' },
  { minQty: 5, maxQty: 9, discountPercentage: 10, label: 'Descuento Equipo (5-9 pcs)' },
  { minQty: 10, maxQty: 49, discountPercentage: 22, label: 'Descuento Mayorista (10-49 pcs)' },
  { minQty: 50, maxQty: 99999, discountPercentage: 35, label: 'Precio Corporativo (50+ pcs)' }
];

export const EXTRA_SIDE_COST = 12000; // Extra cost for adding print on second view (e.g. back)
