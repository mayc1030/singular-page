import React from 'react';
import type { Design } from '../../types/design';
import { GalleryCard } from './GalleryCard';

export interface GalleryGridProps {
  designs: Design[];
  onUseDesign: (designId: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ designs, onUseDesign }) => {
  if (designs.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
        <p className="text-base font-semibold">No se encontraron diseños que coincidan con la búsqueda.</p>
        <p className="text-xs text-slate-500 mt-1">Intenta seleccionar otra categoría o cambiar los términos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {designs.map((design) => (
        <GalleryCard key={design.id} design={design} onUseDesign={onUseDesign} />
      ))}
    </div>
  );
};
