import React from 'react';
import type { PrintSide } from '../../types/order';
import { Shirt } from 'lucide-react';

export interface FrontBackToggleProps {
  activeSide: PrintSide;
  onChangeSide: (side: PrintSide) => void;
  printedSides: PrintSide[];
}

export const FrontBackToggle: React.FC<FrontBackToggleProps> = ({
  activeSide,
  onChangeSide,
  printedSides
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
      <button
        onClick={() => onChangeSide('front')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-extrabold transition-all ${
          activeSide === 'front'
            ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Shirt size={15} />
        <span>FRENTE</span>
        {printedSides.includes('front') && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>

      <button
        onClick={() => onChangeSide('back')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-extrabold transition-all ${
          activeSide === 'back'
            ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Shirt size={15} className="rotate-180" />
        <span>ESPALDA</span>
        {printedSides.includes('back') && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>
    </div>
  );
};
