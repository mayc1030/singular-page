import { useMemo } from 'react';
import { calculateOrderPrice } from '../utils/priceUtils';
import type { PriceBreakdown } from '../types/order';

export function usePriceCalculator(
  productId: string,
  colorId: string,
  techniqueId: string,
  quantity: number,
  printedSidesCount: number
): PriceBreakdown {
  return useMemo(() => {
    return calculateOrderPrice(productId, colorId, techniqueId, quantity, printedSidesCount);
  }, [productId, colorId, techniqueId, quantity, printedSidesCount]);
}
