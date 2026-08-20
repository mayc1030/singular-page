import type { ProductColor } from '../types/product';

export const COLOR_PALETTE: ProductColor[] = [
  { id: 'white', name: 'Blanco', hex: '#FFFFFF', darkOverlay: false, extraCost: 0 },
  { id: 'black', name: 'Negro', hex: '#1C1C1E', darkOverlay: true, extraCost: 0 },
  { id: 'navy', name: 'Azul Marino', hex: '#1E293B', darkOverlay: true, extraCost: 0 },
  { id: 'red', name: 'Rojo Pasión', hex: '#DC2626', darkOverlay: true, extraCost: 0 },
  { id: 'olive', name: 'Verde Oliva', hex: '#3F6212', darkOverlay: true, extraCost: 0 },
  { id: 'heather', name: 'Gris Jaspeado', hex: '#94A3B8', darkOverlay: false, extraCost: 0 },
  { id: 'yellow', name: 'Amarillo Mostaza', hex: '#EAB308', darkOverlay: false, extraCost: 0 },
  { id: 'pink', name: 'Rosa Pastel', hex: '#F472B6', darkOverlay: false, extraCost: 0 },
  { id: 'beige', name: 'Beige Arena', hex: '#D97706', darkOverlay: false, extraCost: 0 },
  { id: 'burgundy', name: 'Burdeos / Tinto', hex: '#881337', darkOverlay: true, extraCost: 0 }
];

export const getColorById = (id: string): ProductColor => {
  return COLOR_PALETTE.find((c) => c.id === id) || COLOR_PALETTE[0];
};
