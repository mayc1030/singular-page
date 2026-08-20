import React from 'react';
import type { ProductColor } from '../../types/product';
import { Check } from 'lucide-react';

export interface ColorPickerProps {
  colors: ProductColor[];
  selectedColorId: string;
  onChange: (colorId: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColorId,
  onChange,
  label = 'Selecciona el Color'
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>{label}</span>
          <span className="text-orange-400 font-bold">
            {colors.find((c) => c.id === selectedColorId)?.name}
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const isSelected = color.id === selectedColorId;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onChange(color.id)}
              title={`${color.name}${color.extraCost ? ` (+$${color.extraCost})` : ''}`}
              className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-900 scale-110'
                  : 'hover:scale-105 opacity-90 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex, border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {isSelected && (
                <Check
                  size={14}
                  className={color.darkOverlay ? 'text-white' : 'text-slate-950'}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
