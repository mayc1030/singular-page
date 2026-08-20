import React from 'react';
import type { DesignCategory } from '../../types/design';
import { Search } from 'lucide-react';

export interface GalleryFiltersProps {
  categories: (DesignCategory | 'Todas')[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl mb-8 backdrop-blur-md shadow-lg">
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar diseño o etiqueta..."
          className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = cat === selectedCategory;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
