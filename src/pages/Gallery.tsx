import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DesignCategory } from '../types/design';
import { DESIGNS } from '../data/designs';
import { GalleryFilters } from '../components/gallery/GalleryFilters';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { ImagePlus } from 'lucide-react';

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

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDesigns = DESIGNS.filter((design) => {
    const matchesCategory = selectedCategory === 'Todas' || design.category === selectedCategory;
    const matchesSearch =
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseDesign = (designId: string) => {
    navigate(`/designer?design=${designId}`);
  };

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2 mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold w-fit mx-auto">
          <ImagePlus size={14} className="text-orange-400" />
          <span>+20 Estampados Exclusivos HD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Galería de Diseños SINGULAR</h1>
        <p className="text-sm text-slate-400">
          Elige entre nuestras ilustraciones y frases vectorizadas para estampar en tu prenda en tiempo real.
        </p>
      </div>

      <GalleryFilters
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <GalleryGrid designs={filteredDesigns} onUseDesign={handleUseDesign} />
    </div>
  );
};
