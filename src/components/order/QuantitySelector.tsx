import React from 'react';
import { Minus, Plus, Tag } from 'lucide-react';
import { VOLUME_DISCOUNT_TIERS } from '../../data/prices';

export interface QuantitySelectorProps {
  quantity: number;
  onChangeQuantity: (newQty: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChangeQuantity
}) => {
  const currentTier =
    VOLUME_DISCOUNT_TIERS.find((t) => quantity >= t.minQty && quantity <= t.maxQty) ||
    VOLUME_DISCOUNT_TIERS[VOLUME_DISCOUNT_TIERS.length - 1];

  const presets = [1, 5, 10, 50];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
        <span>Cantidad de Prendas</span>
        {currentTier.discountPercentage > 0 ? (
          <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Tag size={12} />
            {currentTier.discountPercentage}% OFF ({currentTier.label})
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">Descuentos por volumen disponibles</span>
        )}
      </div>

      {/* Stepper with full width alignment */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-inner w-full">
        <button
          type="button"
          onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Disminuir cantidad"
        >
          <Minus size={18} />
        </button>
        <div className="flex items-center justify-center gap-1">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onChangeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 text-center font-black text-lg bg-transparent text-white focus:outline-none font-mono"
          />
          <span className="text-xs text-slate-400 font-medium">{quantity === 1 ? 'ud' : 'uds'}</span>
        </div>
        <button
          type="button"
          onClick={() => onChangeQuantity(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Aumentar cantidad"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Quick Quantity Presets Grid */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {presets.map((qty) => (
          <button
            key={qty}
            type="button"
            onClick={() => onChangeQuantity(qty)}
            className={`py-1.5 px-1 rounded-lg text-xs font-semibold border text-center transition-all ${
              quantity === qty
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-orange-500 text-white font-bold shadow-md shadow-orange-600/30 ring-1 ring-orange-400'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            {qty} {qty === 1 ? 'ud' : 'uds'}
          </button>
        ))}
      </div>
    </div>
  );
};
