import React from 'react';
import type { ProductColor } from '../../types/product';
import { ColorPicker } from '../common/ColorPicker';

export interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColorId,
  onSelectColor
}) => {
  return (
    <ColorPicker
      colors={colors}
      selectedColorId={selectedColorId}
      onChange={onSelectColor}
      label="Color de la Prenda"
    />
  );
};
