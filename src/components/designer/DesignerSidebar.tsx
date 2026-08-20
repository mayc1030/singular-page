import React, { useState } from 'react';
import type { Product } from '../../types/product';
import type { Size } from '../../types/order';
import { ProductSelector } from '../catalog/ProductSelector';
import { ColorSelector } from '../catalog/ColorSelector';
import { SizeSelector } from '../catalog/SizeSelector';
import { TextEditor } from './TextEditor';
import { LayerPanel } from './LayerPanel';
import { PrintPositionControls } from './PrintPositionControls';
import { Tabs } from '../common/Tabs';
import { Shirt, Type, Layers } from 'lucide-react';
import type { Canvas, FabricObject } from 'fabric';

export interface DesignerSidebarProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  colorId: string;
  onSelectColor: (cId: string) => void;
  size: Size;
  onSelectSize: (s: Size) => void;
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  onUpdateText: (props: Record<string, unknown>) => void;
}

export const DesignerSidebar: React.FC<DesignerSidebarProps> = ({
  product,
  onSelectProduct,
  colorId,
  onSelectColor,
  size,
  onSelectSize,
  canvas,
  selectedObject,
  onUpdateText
}) => {
  const [activeTab, setActiveTab] = useState<string>('product');

  const sidebarTabs = [
    { id: 'product', label: 'Prenda & Color', icon: <Shirt size={15} /> },
    { id: 'text', label: 'Texto / Tipografía', icon: <Type size={15} /> },
    { id: 'layers', label: 'Capas', icon: <Layers size={15} /> }
  ];

  return (
    <div className="flex flex-col gap-4 w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <Tabs tabs={sidebarTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex flex-col gap-4">
        {activeTab === 'product' && (
          <>
            <ProductSelector selectedProductId={product.id} onSelectProduct={onSelectProduct} />
            <div className="h-px bg-slate-800/80" />
            <ColorSelector colors={product.availableColors} selectedColorId={colorId} onSelectColor={onSelectColor} />
            <div className="h-px bg-slate-800/80" />
            <SizeSelector availableSizes={product.availableSizes} selectedSize={size} onSelectSize={onSelectSize} />
            <div className="h-px bg-slate-800/80" />
            <PrintPositionControls canvas={canvas} selectedObject={selectedObject} />
          </>
        )}

        {activeTab === 'text' && (
          <TextEditor selectedObject={selectedObject} onUpdateText={onUpdateText} />
        )}

        {activeTab === 'layers' && (
          <LayerPanel canvas={canvas} />
        )}
      </div>
    </div>
  );
};
