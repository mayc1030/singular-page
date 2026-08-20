import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface FloatingHelpButtonProps {
  onClick: () => void;
}

export const FloatingHelpButton: React.FC<FloatingHelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Abrir guía: ¿Cómo funciona el personalizador?"
      title="¿Cómo funciona? Guía rápida"
      className="fixed z-40 right-4 md:right-6 bottom-20 md:bottom-6 group transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none select-none cursor-pointer"
    >
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/95 border-2 border-amber-500/60 shadow-[0_8px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_26px_rgba(245,158,11,0.45)] hover:border-amber-400 backdrop-blur-xl transition-all duration-300">
        {/* Ícono de Ayuda / Bombilla con efecto luminoso */}
        <div className="relative flex items-center justify-center text-amber-400">
          <HelpCircle size={18} className="transition-transform duration-300 group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75"></span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"></span>
        </div>

        {/* Texto '¿Cómo funciona?' */}
        <span className="text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors tracking-wide">
          ¿Cómo funciona?
        </span>
      </div>
    </button>
  );
};
