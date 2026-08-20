import type { Technique } from '../types/order';

export const PRINT_TECHNIQUES: Technique[] = [
  {
    id: 'dtf',
    name: 'DTF (Direct to Film)',
    description: 'Impresión digital de alta definición. Colores vibrantes y excelente durabilidad en cualquier color de prenda.',
    basePrice: 15000,
    minQuantity: 1,
    recommendedFor: 'Diseños a todo color, fotos, degradados y pocas unidades.',
    iconName: 'Printer'
  },
  {
    id: 'vinyl',
    name: 'Vinilo Textil Promocional',
    description: 'Corte vectorial de alta precisión. Acabado mate impecable ideal para logos y frases simples de 1 o 2 colores.',
    basePrice: 12000,
    minQuantity: 1,
    recommendedFor: 'Textos, números de camisetas deportivas y logos de 1 solo color.',
    iconName: 'Scissors'
  },
  {
    id: 'sublimation',
    name: 'Sublimación Digital',
    description: 'Tinta integrada en la fibra del tejido sin tacto ni relieve. Exclusivo para prendas poliéster/blancas.',
    basePrice: 10000,
    minQuantity: 1,
    recommendedFor: 'Prendas deportivas de poliéster y camisetas blancas sintéticas.',
    iconName: 'Zap'
  }
];

export const getTechniqueById = (id: string): Technique => {
  return PRINT_TECHNIQUES.find((t) => t.id === id) || PRINT_TECHNIQUES[0];
};
