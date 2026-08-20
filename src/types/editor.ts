import type { PrintSide } from './order';

export type EditorView = PrintSide;

export interface FontOption {
  family: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting';
}

export interface LayerItem {
  id: string;
  type: 'text' | 'image' | 'path' | 'group';
  name: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  underline: boolean;
  textAlign: 'left' | 'center' | 'right';
  charSpacing: number;
  lineHeight: number;
  stroke: string;
  strokeWidth: number;
  curved: boolean;
  curveDiameter: number;
}
