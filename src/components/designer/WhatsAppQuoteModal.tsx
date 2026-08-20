import React, { useState } from 'react';
import type { Product, ProductColor } from '../../types/product';
import type { Size } from '../../types/order';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/priceUtils';
import { Download, MessageCircle, CheckCircle2, Shirt, Paperclip, Copy, Check, Smartphone, RotateCcw } from 'lucide-react';

export interface WhatsAppQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  activeColor: ProductColor;
  size: Size;
  quantity: number;
  activeTechniqueName: string;
  printedSidesText: string;
  totalPrice: number;
  designCode: string;
  onExportImage: () => void;
  onSendWhatsApp: () => void;
}

export const WhatsAppQuoteModal: React.FC<WhatsAppQuoteModalProps> = ({
  isOpen,
  onClose,
  product,
  activeColor,
  size,
  quantity,
  activeTechniqueName,
  printedSidesText,
  totalPrice,
  designCode,
  onExportImage,
  onSendWhatsApp
}) => {
  const [hasDownloadedImage, setHasDownloadedImage] = useState(false);
  const [hasCopiedText, setHasCopiedText] = useState(false);

  const handleDownload = () => {
    onExportImage();
    setHasDownloadedImage(true);
  };

  const handleCopySummary = () => {
    const summaryText = `*PEDIDO / COTIZACIÓN SINGULAR CAMISETAS* (#${designCode})\n` +
      `• Prenda: ${product.name}\n` +
      `• Color: ${activeColor.name}\n` +
      `• Talla: ${size}\n` +
      `• Cantidad: ${quantity} unidades\n` +
      `• Técnica: ${activeTechniqueName}\n` +
      `• Zonas: ${printedSidesText}\n` +
      `• Total del Pedido: ${formatCurrency(totalPrice)}`;

    navigator.clipboard.writeText(summaryText);
    setHasCopiedText(true);
    setTimeout(() => setHasCopiedText(false), 2500);
  };

  const handleProceedWhatsApp = () => {
    onSendWhatsApp();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Smartphone size={18} />
          </div>
          <span>Hacer Pedido / Cotizar por WhatsApp</span>
        </div>
      }
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 py-1">
        {/* Subtítulo Guía */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Para que nuestro equipo textil reciba tu pedido y proceda con la fabricación exacta, sigue estos <strong className="text-white">2 sencillos pasos</strong>:
        </p>

        {/* Resumen Compacto del Pedido */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Shirt size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-white">{product.name}</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">
              #{designCode}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
            <div>
              <span>Color: </span>
              <strong className="text-slate-200">{activeColor.name}</strong>
            </div>
            <div>
              <span>Talla: </span>
              <strong className="text-slate-200">{size}</strong>
            </div>
            <div>
              <span>Cantidad: </span>
              <strong className="text-slate-200">{quantity} pcs</strong>
            </div>
            <div>
              <span>Técnica: </span>
              <strong className="text-slate-200">{activeTechniqueName}</strong>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Total del Pedido:</span>
            <span className="text-base font-black text-orange-400">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {/* ── PASO 1: Descargar Imagen ── */}
        <div className={`p-4 rounded-2xl border transition-all ${
          hasDownloadedImage
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-slate-900/90 border-orange-500/40 shadow-md shadow-orange-500/5'
        }`}>
          <div className="flex items-start gap-3">
            <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs ${
              hasDownloadedImage ? 'bg-emerald-500 text-slate-950' : 'bg-orange-500 text-white'
            }`}>
              {hasDownloadedImage ? <CheckCircle2 size={16} /> : '1'}
            </span>

            <div className="flex flex-col gap-1.5 flex-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Descarga la Imagen de tu Prenda</span>
                {hasDownloadedImage && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/30">
                    ¡Descargada!
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                WhatsApp no permite adjuntar fotos automáticamente desde navegadores web. Descarga tu diseño aquí para enviarlo en el chat:
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all duration-500 cursor-pointer ${
                    hasDownloadedImage
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/60 shadow-md shadow-emerald-900/20 group'
                      : 'bg-orange-600 hover:bg-orange-500 text-white border border-orange-400/50 shadow-md shadow-orange-600/30 animate-slow-pulse'
                  }`}
                >
                  {hasDownloadedImage ? (
                    <>
                      <RotateCcw size={15} className="text-emerald-400 transition-transform duration-700 group-hover:-rotate-180 shrink-0" />
                      <span>Volver a Descargar Imagen (PNG)</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
                    </>
                  ) : (
                    <>
                      <Download size={16} className="text-white shrink-0" />
                      <span>Descargar Mockup de mi Prenda (PNG)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── PASO 2: Abrir WhatsApp y Adjuntar ── */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 font-extrabold text-xs">
              2
            </span>

            <div className="flex flex-col gap-1.5 flex-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Abre WhatsApp y Adjunta tu Imagen</span>
              </h4>
              <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <Paperclip size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <p className="leading-relaxed">
                  Al abrir WhatsApp se cargará el detalle completo de tu pedido. <strong className="text-amber-200">Luego pulsa el clip de adjuntar o Galería y envía la imagen descargada en el Paso 1</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              variant="whatsapp"
              size="lg"
              icon={<MessageCircle size={20} className="fill-white" />}
              onClick={handleProceedWhatsApp}
              className="w-full text-sm sm:text-base py-3.5 font-black shadow-lg shadow-emerald-600/20"
            >
              Continuar a WhatsApp para Enviar Pedido
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={hasCopiedText ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              onClick={handleCopySummary}
              className="text-xs text-slate-400 hover:text-white"
              title="Copiar texto al portapapeles"
            >
              {hasCopiedText ? '¡Copiado!' : 'Copiar Texto'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
