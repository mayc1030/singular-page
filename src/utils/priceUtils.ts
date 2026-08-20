import type { PriceBreakdown } from '../types/order';
import { getProductById } from '../data/products';
import { getColorById } from '../data/colors';
import { getTechniqueById } from '../data/techniques';
import { VOLUME_DISCOUNT_TIERS, EXTRA_SIDE_COST } from '../data/prices';

export const calculateOrderPrice = (
  productId: string,
  colorId: string,
  techniqueId: string,
  quantity: number,
  printedSidesCount: number = 1
): PriceBreakdown => {
  const product = getProductById(productId);
  const color = getColorById(colorId);
  const technique = getTechniqueById(techniqueId);

  const basePrice = product.basePrice;
  const colorExtra = color.extraCost;
  const techniquePrice = technique.basePrice;
  const extraSideCost = printedSidesCount > 1 ? (printedSidesCount - 1) * EXTRA_SIDE_COST : 0;

  // Single unit total before quantity discount
  const unitPriceBeforeDiscount = basePrice + colorExtra + techniquePrice + extraSideCost;

  // Find matching volume tier
  const safeQty = Math.max(1, quantity);
  const tier =
    VOLUME_DISCOUNT_TIERS.find((t) => safeQty >= t.minQty && safeQty <= t.maxQty) ||
    VOLUME_DISCOUNT_TIERS[VOLUME_DISCOUNT_TIERS.length - 1];

  const discountPercentage = tier.discountPercentage;
  const discountFactor = 1 - discountPercentage / 100;

  const unitPrice = Math.round(unitPriceBeforeDiscount * discountFactor);
  const totalPrice = Math.round(unitPrice * safeQty);

  return {
    basePrice,
    colorExtra,
    techniquePrice,
    extraSideCost,
    unitPriceBeforeDiscount,
    unitPrice,
    discountPercentage,
    totalPrice,
    quantity: safeQty,
    volumeTierLabel: tier.label
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
};
