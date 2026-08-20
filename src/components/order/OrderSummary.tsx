import React from 'react';
import type { Product, ProductColor } from '../../types/product';
import type { Size, PrintSide, PriceBreakdown } from '../../types/order';
import { PRINT_TECHNIQUES } from '../../data/techniques';
import { formatCurrency } from '../../utils/priceUtils';
import { QuantitySelector } from './QuantitySelector';
import { PriceCalculator } from './PriceCalculator';
import { Button } from '../common/Button';
import { MessageSquareQuote, Save, Download, ShoppingBag, CheckCircle2 } from 'lucide-react';

export interface OrderSummaryProps {
  product: Product;
  activeColor: ProductColor;
  size: Size;
  onSelectSize: (s: Size) => void;
  quantity: number;
  onChangeQuantity: (q: number) => void;
  techniqueId: string;
  onSelectTechnique: (techId: string) => void;
  printedSides: PrintSide[];
  breakdown: PriceBreakdown;
  designCode?: string;
  onSaveDesign: () => void;
  onExportImage: () => void;
  onSendWhatsApp: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  activeColor,
  size,
  quantity,
  onChangeQuantity,
  techniqueId,
  onSelectTechnique,
  printedSides,
  breakdown,
  designCode,
  onSaveDesign,
  onExportImage,
  onSendWhatsApp
}) => {
  const printedSidesText = printedSides.map((s) => (s === 'front' ? 'Frente' : 'Espalda')).join(' + ');

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-extrabold text-base text-slate-100 uppercase tracking-wide flex items-center gap-2">
          <ShoppingBag className="text-orange-400" size={18} />
          <span>Resumen del Pedido y Cotización</span>
        </h3>
        {designCode && (
          <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
            Código: #{designCode}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Technique & Specifications */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Técnica de Estampado
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {PRINT_TECHNIQUES.map((tech) => {
                const isSelected = tech.id === techniqueId;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => onSelectTechnique(tech.id)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-orange-600/20 border-orange-500 ring-1 ring-orange-500'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                        {isSelected && <CheckCircle2 size={14} className="text-orange-400" />}
                        {tech.name}
                      </span>
                      <span className="text-[11px] font-semibold text-orange-400">
                        +{formatCurrency(tech.basePrice)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{tech.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Itemized Specifications Box */}
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Prenda:</span>
              <span className="font-semibold text-white">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color:</span>
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: activeColor.hex }} />
                <span>{activeColor.name}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Talla:</span>
              <span className="font-semibold text-white">{size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estampado:</span>
              <span className="font-semibold text-orange-300">{printedSidesText}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quantity Stepper & Discounts */}
        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            2. Cantidad y Descuentos
          </label>
          <QuantitySelector quantity={quantity} onChangeQuantity={onChangeQuantity} />
        </div>

        {/* Column 3: Price Calculator & Actions */}
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Desglose Financiero
            </label>
            <PriceCalculator breakdown={breakdown} />
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              variant="whatsapp"
              size="lg"
              icon={<MessageSquareQuote size={20} />}
              onClick={onSendWhatsApp}
              className="w-full text-base py-3.5 font-black shadow-emerald-500/20"
            >
              Hacer Pedido / Cotizar por WhatsApp
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="md"
                icon={<Save size={16} />}
                onClick={onSaveDesign}
              >
                Guardar
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<Download size={16} />}
                onClick={onExportImage}
              >
                Exportar PNG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
