import type { Product } from '../types/product';
import { COLOR_PALETTE } from './colors';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-tshirt-basic',
    name: 'Camiseta Básica 100% Algodón',
    description: 'Camiseta de corte clásico confeccionada en suave algodón de 180g. Ligera, fresca y versátil para uso diario.',
    category: 'tshirt',
    basePrice: 32000,
    popular: true,
    tag: 'Más vendida',
    mockups: {
      front: './mockups/tshirt-front.png',
      back: './mockups/tshirt-back.png'
    },
    availableColors: COLOR_PALETTE,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableTechniques: ['dtf', 'vinyl', 'sublimation'],
    printZones: [
      {
        id: 'front',
        name: 'Frente',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 25, widthPercentage: 44, heightPercentage: 50 }
      },
      {
        id: 'back',
        name: 'Espalda',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 23, widthPercentage: 44, heightPercentage: 50 }
      }
    ]
  },
  {
    id: 'prod-tshirt-premium',
    name: 'Camiseta Premium Heavyweight',
    description: 'Algodón peinado de 220g con costuras reforzadas, ajuste streetwear oversized y máxima durabilidad.',
    category: 'tshirt',
    basePrice: 45000,
    popular: true,
    tag: 'Calidad Premium',
    mockups: {
      front: './mockups/tshirt-front.png',
      back: './mockups/tshirt-back.png'
    },
    availableColors: COLOR_PALETTE,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableTechniques: ['dtf', 'vinyl'],
    printZones: [
      {
        id: 'front',
        name: 'Frente',
        widthCm: 32,
        heightCm: 38,
        bounds: { xPercentage: 28, yPercentage: 25, widthPercentage: 44, heightPercentage: 50 }
      },
      {
        id: 'back',
        name: 'Espalda',
        widthCm: 32,
        heightCm: 38,
        bounds: { xPercentage: 28, yPercentage: 23, widthPercentage: 44, heightPercentage: 50 }
      }
    ]
  },
  {
    id: 'prod-polo',
    name: 'Camiseta Polo Empresarial',
    description: 'Polo pique clásico con cuello de tejido plano y 3 botones. Apariencia elegante para empresas y eventos.',
    category: 'polo',
    basePrice: 52000,
    mockups: {
      front: './mockups/polo-front.png',
      back: './mockups/polo-back.png'
    },
    availableColors: COLOR_PALETTE,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableTechniques: ['dtf', 'vinyl'],
    printZones: [
      {
        id: 'front',
        name: 'Frente',
        widthCm: 25,
        heightCm: 30,
        bounds: { xPercentage: 30, yPercentage: 30, widthPercentage: 40, heightPercentage: 45 }
      },
      {
        id: 'back',
        name: 'Espalda',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 23, widthPercentage: 44, heightPercentage: 50 }
      }
    ]
  },
  {
    id: 'prod-hoodie',
    name: 'Hoodie con Capucha & Bolsillo',
    description: 'Buzo con capucha ajustables con cordones, bolsillo tipo canguro y felpa interior cálida y confortable.',
    category: 'hoodie',
    basePrice: 78000,
    popular: true,
    tag: 'Invierno / Trendy',
    mockups: {
      front: './mockups/hoodie-front.png',
      back: './mockups/hoodie-back.png'
    },
    availableColors: COLOR_PALETTE,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableTechniques: ['dtf', 'vinyl'],
    printZones: [
      {
        id: 'front',
        name: 'Frente',
        widthCm: 28,
        heightCm: 28,
        bounds: { xPercentage: 30, yPercentage: 36, widthPercentage: 40, heightPercentage: 34 }
      },
      {
        id: 'back',
        name: 'Espalda',
        widthCm: 32,
        heightCm: 40,
        bounds: { xPercentage: 28, yPercentage: 28, widthPercentage: 44, heightPercentage: 48 }
      }
    ]
  },
  {
    id: 'prod-longsleeve',
    name: 'Camiseta Manga Larga',
    description: 'Prenda versátil en algodón peinado con puños acanalados. Ideal para climas frescos y uso corporativo.',
    category: 'longsleeve',
    basePrice: 42000,
    mockups: {
      front: './mockups/longsleeve-front.png',
      back: './mockups/longsleeve-back.png'
    },
    availableColors: COLOR_PALETTE,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableTechniques: ['dtf', 'vinyl'],
    printZones: [
      {
        id: 'front',
        name: 'Frente',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 25, widthPercentage: 44, heightPercentage: 50 }
      },
      {
        id: 'back',
        name: 'Espalda',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 23, widthPercentage: 44, heightPercentage: 50 }
      }
    ]
  },
  {
    id: 'prod-sweatshirt',
    name: 'Buzo Cuello Redondo (Sweatshirt)',
    description: 'Buzo clásico de cuello redondo en franela perchada suave. Cómodo, sin capucha, estilo urbano minimalista.',
    category: 'sweatshirt',
    basePrice: 68000,
    mockups: {
      front: './mockups/sweatshirt-front.png',
      back: './mockups/sweatshirt-back.png'
    },
    availableColors: COLOR_PALETTE,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableTechniques: ['dtf', 'vinyl'],
    printZones: [
      {
        id: 'front',
        name: 'Frente',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 25, widthPercentage: 44, heightPercentage: 50 }
      },
      {
        id: 'back',
        name: 'Espalda',
        widthCm: 30,
        heightCm: 35,
        bounds: { xPercentage: 28, yPercentage: 23, widthPercentage: 44, heightPercentage: 50 }
      }
    ]
  }
];

export const getProductById = (id: string): Product => {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
};
