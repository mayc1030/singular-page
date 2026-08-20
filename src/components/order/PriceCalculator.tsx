import React from 'react';
import type { PriceBreakdown } from '../../types/order';
import { formatCurrency } from '../../utils/priceUtils';
import { Calculator, Tag } from 'lucide-react';

export interface PriceCalculatorProps {
  breakdown: PriceBreakdown;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ breakdown }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Calculator size={16} className="text-orange-400" />
          <span>Cotización Estimada</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {breakdown.volumeTierLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Precio prenda base:</span>
          <span className="text-slate-200 font-medium">{formatCurrency(breakdown.basePrice)}</span>
        </div>
        {breakdown.colorExtra > 0 && (
          <div className="flex justify-between">
            <span>Color especial:</span>
            <span className="text-slate-200 font-medium">+{formatCurrency(breakdown.colorExtra)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Técnica de estampado:</span>
          <span className="text-slate-200 font-medium">+{formatCurrency(breakdown.techniquePrice)}</span>
        </div>
        {breakdown.extraSideCost > 0 && (
          <div className="flex justify-between">
            <span>Segunda zona estampado (Espalda):</span>
            <span className="text-slate-200 font-medium">+{formatCurrency(breakdown.extraSideCost)}</span>
          </div>
        )}
        {breakdown.discountPercentage > 0 && (
          <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800/60">
            <span className="flex items-center gap-1">
              <Tag size={12} />
              Descuento ({breakdown.discountPercentage}%):
            </span>
            <span>-{formatCurrency((breakdown.unitPriceBeforeDiscount - breakdown.unitPrice) * breakdown.quantity)}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400">Precio Unitario</span>
          <span className="text-sm font-bold text-slate-200">{formatCurrency(breakdown.unitPrice)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase font-bold text-slate-400">TOTAL ESTIMADO ({breakdown.quantity} Pcs)</span>
          <span className="text-2xl font-black text-orange-400">
            {formatCurrency(breakdown.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
