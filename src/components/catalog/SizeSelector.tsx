import React from 'react';
import type { Size } from '../../types/order';

export interface SizeSelectorProps {
  availableSizes: string[];
  selectedSize: Size;
  onSelectSize: (size: Size) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  availableSizes,
  selectedSize,
  onSelectSize
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
        <span>Talla de la Prenda</span>
        <span className="text-orange-400 font-bold">{selectedSize}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {availableSizes.map((sz) => {
          const isSelected = sz === selectedSize;
          return (
            <button
              key={sz}
              type="button"
              onClick={() => onSelectSize(sz as Size)}
              className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-orange-500 text-white shadow-md shadow-orange-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {sz}
            </button>
          );
        })}
      </div>
    </div>
  );
};
