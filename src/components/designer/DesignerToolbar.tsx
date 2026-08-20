import React from 'react';
import { Type, ImagePlus, Upload, Trash2, Save, Download, FileText, Search, History } from 'lucide-react';
import { Button } from '../common/Button';

export interface DesignerToolbarProps {
  onAddText: () => void;
  onOpenDesignLibrary: () => void;
  onOpenUploader: () => void;
  onClearCanvas: () => void;
  onSaveDesign: () => void;
  onOpenRecoverCode?: () => void;
  onOpenHistory?: () => void;
  onExportImage: () => void;
  onDownloadSpecSheet: () => void;
}

export const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  onAddText,
  onOpenDesignLibrary,
  onOpenUploader,
  onClearCanvas,
  onSaveDesign,
  onOpenRecoverCode,
  onOpenHistory,
  onExportImage,
  onDownloadSpecSheet
}) => {
  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-xl p-2.5 sm:p-3 flex flex-col gap-2.5">
      {/* ── Desktop Layout (lg+) ───────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between gap-3">
        {/* Left Creation Group */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Type size={16} />}
            onClick={onAddText}
          >
            + Agregar Texto
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<ImagePlus size={16} className="text-amber-400" />}
            onClick={onOpenDesignLibrary}
          >
            Catálogo Diseños
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Upload size={16} className="text-orange-400" />}
            onClick={onOpenUploader}
          >
            Subir Mi Imagen
          </Button>
        </div>

        {/* Right Actions Group */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={15} className="text-rose-400" />}
            onClick={onClearCanvas}
            title="Limpiar elementos del canvas"
          >
            Limpiar
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Save size={15} className="text-emerald-400" />}
            onClick={onSaveDesign}
            title="Guardar diseño actual"
          >
            Guardar
          </Button>
          {onOpenHistory && (
            <Button
              variant="outline"
              size="sm"
              icon={<History size={15} className="text-amber-400" />}
              onClick={onOpenHistory}
              title="Ver historial de diseños guardados"
            >
              Historial
            </Button>
          )}
          {onOpenRecoverCode && (
            <Button
              variant="outline"
              size="sm"
              icon={<Search size={15} className="text-orange-400" />}
              onClick={onOpenRecoverCode}
              title="Recuperar diseño guardado por código"
            >
              Recuperar Código
            </Button>
          )}
          <div className="w-px h-5 bg-slate-800 my-auto mx-0.5" />
          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={15} />}
            onClick={onExportImage}
            title="Exportar imagen en alta resolución"
          >
            Exportar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<FileText size={15} className="text-orange-400" />}
            onClick={onDownloadSpecSheet}
            title="Descargar ficha técnica de producción"
          >
            Ficha Técnica
          </Button>
        </div>
      </div>

      {/* ── Mobile Layout (< lg) ───────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col gap-2">
        {/* Nivel 1: Herramientas de Creación (3 columnas simétricas) */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onAddText}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 shadow-md shadow-orange-600/20 active:scale-95 transition-all"
          >
            <Type size={15} />
            <span className="truncate">+ Texto</span>
          </button>

          <button
            onClick={onOpenDesignLibrary}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all"
          >
            <ImagePlus size={15} className="text-amber-400 shrink-0" />
            <span className="truncate">Diseños</span>
          </button>

          <button
            onClick={onOpenUploader}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all"
          >
            <Upload size={15} className="text-orange-400 shrink-0" />
            <span className="truncate">Subir Foto</span>
          </button>
        </div>

        {/* Nivel 2: Acciones Principales y Salidas (Grid 2x2 claro y visible) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
          <button
            onClick={onExportImage}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold text-white bg-slate-800/80 border border-slate-700 hover:border-orange-500/50 active:scale-95 transition-all"
            title="Exportar imagen en alta resolución"
          >
            <Download size={14} className="text-orange-400 shrink-0" />
            <span className="truncate">Exportar</span>
          </button>

          <button
            onClick={onDownloadSpecSheet}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold text-white bg-slate-800/80 border border-slate-700 hover:border-orange-500/50 active:scale-95 transition-all"
            title="Descargar Ficha Técnica en PDF/HTML"
          >
            <FileText size={14} className="text-amber-400 shrink-0" />
            <span className="truncate">Ficha Técnica</span>
          </button>

          <button
            onClick={onSaveDesign}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all"
            title="Guardar diseño en este dispositivo"
          >
            <Save size={14} className="shrink-0" />
            <span className="truncate">Guardar</span>
          </button>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all"
              title="Ver historial de diseños guardados"
            >
              <History size={14} className="shrink-0" />
              <span className="truncate">Historial</span>
            </button>
          )}
        </div>

        {/* Nivel 3: Utilidades secundarias (Recuperar Código & Limpiar) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
          {onOpenRecoverCode && (
            <button
              onClick={onOpenRecoverCode}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-slate-800/60 transition-all text-[11px]"
              title="Buscar diseño por código"
            >
              <Search size={13} className="text-orange-400" />
              <span>Recuperar por Código</span>
            </button>
          )}

          <button
            onClick={onClearCanvas}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-[11px] ml-auto"
            title="Limpiar elementos del lienzo"
          >
            <Trash2 size={13} className="text-rose-400" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
