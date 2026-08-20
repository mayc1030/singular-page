import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Share2, MessageSquare, Download, CheckCircle2 } from 'lucide-react';

export interface QuoteRequestProps {
  isOpen: boolean;
  onClose: () => void;
  designCode: string;
  onSendWhatsApp: () => void;
  onDownloadSpecSheet: () => void;
}

export const QuoteRequest: React.FC<QuoteRequestProps> = ({
  isOpen,
  onClose,
  designCode,
  onSendWhatsApp,
  onDownloadSpecSheet
}) => {
  const isWebShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  const handleShare = async () => {
    if (isWebShareSupported) {
      try {
        await navigator.share({
          title: `Prenda Personalizada SINGULAR (${designCode})`,
          text: `Mira el diseño personalizado de mi prenda en SINGULAR. Código: ${designCode}`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share dialog
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¡Diseño Guardado y Listo para Pedir o Cotizar!" maxWidth="md">
      <div className="flex flex-col gap-5 text-center items-center py-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 size={36} />
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-bold text-slate-100">Código de Referencia Único</h4>
          <span className="font-mono text-xl font-extrabold text-orange-400 bg-orange-500/10 px-4 py-1.5 rounded-xl border border-orange-500/30 inline-block mx-auto">
            {designCode}
          </span>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">
            Tu diseño ha sido guardado. Puedes enviar los detalles por WhatsApp para hacer tu pedido directo o descargar la ficha técnica completa.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full pt-2">
          <Button
            variant="whatsapp"
            size="lg"
            icon={<MessageSquare size={20} />}
            onClick={() => {
              onSendWhatsApp();
              onClose();
            }}
            className="w-full"
          >
            Hacer Pedido / Cotizar por WhatsApp
          </Button>

          {isWebShareSupported && (
            <Button
              variant="outline"
              size="md"
              icon={<Share2 size={18} />}
              onClick={handleShare}
              className="w-full"
            >
              Compartir Diseño
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            icon={<Download size={18} />}
            onClick={() => {
              onDownloadSpecSheet();
              onClose();
            }}
            className="w-full"
          >
            Descargar Ficha Técnica en Imagen
          </Button>
        </div>
      </div>
    </Modal>
  );
};
