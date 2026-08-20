import React from 'react';
import { PRINT_TECHNIQUES } from '../../data/techniques';
import { formatCurrency } from '../../utils/priceUtils';
import { CheckCircle2 } from 'lucide-react';

export interface TechniqueSelectorProps {
  selectedTechniqueId: string;
  onSelectTechnique: (techniqueId: string) => void;
}

export const TechniqueSelector: React.FC<TechniqueSelectorProps> = ({
  selectedTechniqueId,
  onSelectTechnique
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
      {PRINT_TECHNIQUES.map((tech) => {
        const isSelected = tech.id === selectedTechniqueId;
        return (
          <button
            key={tech.id}
            type="button"
            onClick={() => onSelectTechnique(tech.id)}
            className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
              isSelected
                ? 'bg-orange-500/15 border-orange-500 ring-1 ring-orange-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                {isSelected && <CheckCircle2 size={14} className="text-orange-400" />}
                <span>{tech.name}</span>
              </span>
              <span className="text-[11px] font-bold text-orange-400">
                +{formatCurrency(tech.basePrice)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tech.description}</p>
          </button>
        );
      })}
    </div>
  );
};
