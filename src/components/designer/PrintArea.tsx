import React from 'react';
import type { PrintZone } from '../../types/product';
import { Maximize2 } from 'lucide-react';

export interface PrintAreaProps {
  printZone: PrintZone;
}

export const PrintArea: React.FC<PrintAreaProps> = ({ printZone }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
      <div className="flex items-center gap-2 text-slate-300">
        <Maximize2 size={16} className="text-orange-400" />
        <span className="font-semibold">Zona Máxima de Impresión ({printZone.name}):</span>
      </div>
      <div className="px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-orange-300 font-mono font-bold">
        {printZone.widthCm} cm × {printZone.heightCm} cm
      </div>
    </div>
  );
};
