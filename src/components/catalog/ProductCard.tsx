import React from 'react';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/priceUtils';
import { getAssetUrl } from '../../utils/imageUtils';
import { ArrowRight, Tag } from 'lucide-react';
import { Button } from '../common/Button';

export interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="group relative bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-orange-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl overflow-hidden">
      {/* Tag badge */}
      {product.tag && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-500 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
          <Tag size={12} />
          <span>{product.tag}</span>
        </div>
      )}

      {/* Image Preview Box */}
      <div className="relative w-full h-56 flex items-center justify-center p-3 rounded-xl bg-slate-950/80 overflow-hidden mb-4 group-hover:scale-[1.03] transition-transform">
        <img
          src={getAssetUrl(product.mockups.front)}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-xl"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="font-bold text-slate-100 text-base group-hover:text-orange-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Colors Preview */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Colores:</span>
          {product.availableColors.slice(0, 5).map((color) => (
            <span
              key={color.id}
              className="w-3.5 h-3.5 rounded-full border border-white/20"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.availableColors.length > 5 && (
            <span className="text-[10px] text-slate-500">+{product.availableColors.length - 5}</span>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-slate-500">Desde</span>
          <span className="text-base font-extrabold text-orange-400">
            {formatCurrency(product.basePrice)}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<ArrowRight size={14} />}
          onClick={() => onSelect(product.id)}
        >
          Personalizar
        </Button>
      </div>
    </div>
  );
};
