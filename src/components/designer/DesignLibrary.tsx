import React, { useState } from 'react';
import type { Design, DesignCategory } from '../../types/design';
import { DESIGNS } from '../../data/designs';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export interface DesignLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDesign: (design: Design) => void;
}

const CATEGORIES: (DesignCategory | 'Todas')[] = [
  'Todas',
  'Frases',
  'Deportes',
  'Gaming',
  'Música',
  'Animales',
  'Amor',
  'Humor',
  'Retro',
  'Minimalista',
  'Empresarial'
];

export const DesignLibrary: React.FC<DesignLibraryProps> = ({
  isOpen,
  onClose,
  onSelectDesign
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const filteredDesigns =
    activeCategory === 'Todas'
      ? DESIGNS
      : DESIGNS.filter((d) => d.category === activeCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Biblioteca de Diseños y Estampados SINGULAR" maxWidth="2xl">
      <div className="flex flex-col gap-5">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="group relative bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-orange-500 hover:bg-slate-900 transition-all shadow-md"
            >
              {design.featured && (
                <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                  POPULAR
                </span>
              )}
              <div className="w-full h-32 flex items-center justify-center p-2 rounded-lg bg-slate-900/60 overflow-hidden mb-2">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <span className="font-bold text-xs text-slate-200 line-clamp-1">{design.name}</span>
                <span className="text-[10px] text-slate-500">{design.category}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => {
                  onSelectDesign(design);
                  onClose();
                }}
                className="w-full"
              >
                Usar Diseño
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
