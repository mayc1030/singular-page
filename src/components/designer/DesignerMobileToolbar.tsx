import React, { useState } from 'react';
import type { Product } from '../../types/product';
import type { Size } from '../../types/order';
import type { Canvas, FabricObject } from 'fabric';
import { Shirt, Type, Layers, ImagePlus, ChevronDown, Move } from 'lucide-react';
import { ColorSelector } from '../catalog/ColorSelector';
import { SizeSelector } from '../catalog/SizeSelector';
import { ProductSelector } from '../catalog/ProductSelector';
import { PrintPositionControls } from './PrintPositionControls';
import { TextEditor } from './TextEditor';
import { LayerPanel } from './LayerPanel';

export interface DesignerMobileToolbarProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  colorId: string;
  onSelectColor: (cId: string) => void;
  size: Size;
  onSelectSize: (s: Size) => void;
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  onUpdateText: (props: Record<string, unknown>) => void;
  onOpenLibrary: () => void;
}

export const DesignerMobileToolbar: React.FC<DesignerMobileToolbarProps> = ({
  product,
  onSelectProduct,
  colorId,
  onSelectColor,
  size,
  onSelectSize,
  canvas,
  selectedObject,
  onUpdateText,
  onOpenLibrary
}) => {
  const [activePanel, setActivePanel] = useState<'garment' | 'position' | 'text' | 'layers' | null>(null);

  const togglePanel = (panel: 'garment' | 'position' | 'text' | 'layers') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="lg:hidden flex flex-col w-full bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Expandable Panel drawer */}
      {activePanel && (
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 max-h-96 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              {activePanel === 'garment' && 'Prenda, Color & Talla'}
              {activePanel === 'position' && 'Ubicación y Orientación del Estampado'}
              {activePanel === 'text' && 'Ajustes de Texto'}
              {activePanel === 'layers' && 'Gestión de Capas'}
            </span>
            <button
              onClick={() => setActivePanel(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Cerrar panel"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {activePanel === 'garment' && (
            <div className="flex flex-col gap-4">
              <ProductSelector selectedProductId={product.id} onSelectProduct={onSelectProduct} />
              <ColorSelector colors={product.availableColors} selectedColorId={colorId} onSelectColor={onSelectColor} />
              <SizeSelector availableSizes={product.availableSizes} selectedSize={size} onSelectSize={onSelectSize} />
              <div className="h-px bg-slate-800/80 my-1" />
              <PrintPositionControls canvas={canvas} selectedObject={selectedObject} />
            </div>
          )}

          {activePanel === 'position' && (
            <PrintPositionControls canvas={canvas} selectedObject={selectedObject} />
          )}

          {activePanel === 'text' && (
            <TextEditor selectedObject={selectedObject} onUpdateText={onUpdateText} />
          )}

          {activePanel === 'layers' && (
            <LayerPanel canvas={canvas} />
          )}
        </div>
      )}

      {/* Main Touch Tool Buttons (5 Column Grid on Mobile) */}
      <div className="grid grid-cols-5 gap-1 p-1.5 bg-slate-900/90">
        <button
          onClick={() => togglePanel('garment')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold gap-1 transition-all ${
            activePanel === 'garment'
              ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Shirt size={17} className={activePanel === 'garment' ? 'text-white' : 'text-orange-400'} />
          <span className="text-[10px]">Prenda</span>
        </button>

        <button
          onClick={() => togglePanel('position')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold gap-1 transition-all ${
            activePanel === 'position'
              ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Move size={17} className={activePanel === 'position' ? 'text-white' : 'text-orange-400'} />
          <span className="text-[10px]">Posición</span>
        </button>

        <button
          onClick={onOpenLibrary}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold gap-1 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <ImagePlus size={17} className="text-amber-400" />
          <span className="text-[10px]">Diseños</span>
        </button>

        <button
          onClick={() => togglePanel('text')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold gap-1 transition-all ${
            activePanel === 'text'
              ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Type size={17} className={activePanel === 'text' ? 'text-white' : 'text-orange-400'} />
          <span className="text-[10px]">Texto</span>
        </button>

        <button
          onClick={() => togglePanel('layers')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold gap-1 transition-all ${
            activePanel === 'layers'
              ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers size={17} className={activePanel === 'layers' ? 'text-white' : 'text-amber-400'} />
          <span className="text-[10px]">Capas</span>
        </button>
      </div>
    </div>
  );
};
