import React from 'react';
import type { Design } from '../../types/design';
import { ArrowRight, Tag } from 'lucide-react';
import { Button } from '../common/Button';

export interface GalleryCardProps {
  design: Design;
  onUseDesign: (designId: string) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ design, onUseDesign }) => {
  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-orange-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl overflow-hidden">
      {/* Category Pill */}
      <span className="absolute top-3 left-3 z-10 bg-slate-950/80 border border-slate-700/80 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
        {design.category}
      </span>

      {/* Image Preview Box */}
      <div className="w-full h-48 flex items-center justify-center p-3 rounded-xl bg-slate-950/80 overflow-hidden mb-3 group-hover:scale-[1.03] transition-transform">
        <img
          src={design.imageUrl}
          alt={design.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-lg"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="font-bold text-slate-100 text-sm group-hover:text-orange-400 transition-colors">
          {design.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          {design.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Tag size={10} className="text-slate-500" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <Button
        variant="primary"
        size="sm"
        icon={<ArrowRight size={14} />}
        onClick={() => onUseDesign(design.id)}
        className="w-full"
      >
        Usar este Diseño
      </Button>
    </div>
  );
};
