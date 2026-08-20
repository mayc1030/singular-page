export type DesignCategory =
  | 'Frases'
  | 'Deportes'
  | 'Gaming'
  | 'Música'
  | 'Animales'
  | 'Amor'
  | 'Humor'
  | 'Retro'
  | 'Minimalista'
  | 'Empresarial';

export interface Design {
  id: string;
  name: string;
  category: DesignCategory;
  imageUrl: string; // SVG path or Data URI
  svgContent?: string;
  tags: string[];
  featured?: boolean;
}
