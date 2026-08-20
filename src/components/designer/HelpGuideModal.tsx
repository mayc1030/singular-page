import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  Palette, 
  Save, 
  Search, 
  MessageSquareQuote, 
  CheckCircle2, 
  HelpCircle,
  Share2,
  Layers,
  Shirt
} from 'lucide-react';

export interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <HelpCircle size={18} />
          </div>
          <span>¿Cómo Funciona el Personalizador?</span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="flex flex-col gap-6 py-1">
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto flex flex-col gap-1">
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            Crea tu Diseño, Guarda y Haz tu Pedido en 3 Pasos
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nuestra plataforma te permite diseñar en tiempo real sin necesidad de registros complicados.
          </p>
        </div>

        {/* 3 Pasos Ilustrados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Paso 1 */}
          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-2xl flex flex-col gap-3 relative group hover:border-orange-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                <Palette size={20} />
              </div>
              <span className="text-xs font-black text-slate-500 font-mono">PASO 01</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                <span>Personaliza tu Prenda</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige el modelo y color. Agrega textos con fuentes premium o sube tus fotos y logos en PNG/JPG. Puedes diseñar tanto el <strong>Frente</strong> como la <strong>Espalda</strong>.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-2xl flex flex-col gap-3 relative group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Save size={20} />
              </div>
              <span className="text-xs font-black text-slate-500 font-mono">PASO 02</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                <span>Guarda con 1 Clic</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pulsa el botón <strong className="text-emerald-400">Guardar</strong>. El sistema te entregará un <strong className="text-slate-200">Código Único (#CAM-...)</strong> para que tu diseño quede a salvo en tu dispositivo.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-2xl flex flex-col gap-3 relative group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Search size={20} />
              </div>
              <span className="text-xs font-black text-slate-500 font-mono">PASO 03</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                <span>Recupera o Comparte</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Para volver a ver o editar tu diseño en cualquier momento, pulsa la <strong className="text-amber-300">Lupa (Recuperar Código)</strong> o abre tu <strong className="text-amber-300">Historial</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Banner Informativo / Tip Pro */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 shrink-0 mt-0.5">
            <MessageSquareQuote size={20} />
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>¿Cómo hago mi pedido?</span>
              <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.2 rounded border border-orange-500/30">WhatsApp</span>
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              En la parte inferior de la pantalla encontrarás el botón <strong className="text-emerald-400">Hacer Pedido / Cotizar por WhatsApp</strong>. Nuestro asesor recibirá el detalle exacto de tu diseño para iniciar la confección y despacho de inmediato.
            </p>
          </div>
        </div>

        {/* Botón de Cierre */}
        <div className="flex justify-end pt-1">
          <Button
            variant="primary"
            size="md"
            icon={<Palette size={16} />}
            onClick={onClose}
            className="w-full sm:w-auto font-bold text-xs"
          >
            ¡Entendido, empezar a diseñar!
          </Button>
        </div>
      </div>
    </Modal>
  );
};
