import React from 'react';
import type { Product } from '../../types/product';
import { PRODUCTS } from '../../data/products';
import { formatCurrency } from '../../utils/priceUtils';
import { Shirt } from 'lucide-react';

export interface ProductSelectorProps {
  selectedProductId: string;
  onSelectProduct: (product: Product) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProductId,
  onSelectProduct
}) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
        <Shirt size={16} className="text-orange-400" />
        <span>Selecciona la Prenda</span>
      </label>
      <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {PRODUCTS.map((prod) => {
          const isSelected = prod.id === selectedProductId;
          return (
            <button
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-orange-600/20 border-orange-500 ring-1 ring-orange-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className="font-bold text-xs text-slate-100 line-clamp-1">{prod.name}</span>
              <span className="text-[11px] font-semibold text-orange-400 mt-1">
                {formatCurrency(prod.basePrice)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
