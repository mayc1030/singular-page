import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import type { SavedDesign } from '../../types/order';
import { formatCurrency } from '../../utils/priceUtils';
import { X, Search, Trash2, FolderOpen, Copy, Check, Calendar, Shirt } from 'lucide-react';
import { Button } from '../common/Button';
import { Dialog } from '../common/Dialog';

export interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDesign: (code: string) => void;
}

export const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({
  isOpen,
  onClose,
  onSelectDesign
}) => {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // BUG-04: código pendiente de eliminar — abre Dialog en vez de window.confirm
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);

  // Carga los diseños cada vez que el modal se abre
  useEffect(() => {
    if (isOpen) {
      setDesigns(storageService.getSavedDesigns());
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    setCodeToDelete(code);
  };

  const confirmDelete = () => {
    if (!codeToDelete) return;
    storageService.deleteDesign(codeToDelete);
    setDesigns(storageService.getSavedDesigns());
    setCodeToDelete(null);
  };

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredDesigns = designs.filter((d) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      d.id.toLowerCase().includes(term) ||
      d.productName.toLowerCase().includes(term) ||
      d.techniqueName.toLowerCase().includes(term) ||
      d.size.toLowerCase().includes(term)
    );
  });

  return (
    <>
      {/* Overlay + modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <FolderOpen size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>Historial de Diseños Guardados</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-slate-700">
                    {designs.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Carga cualquier diseño guardado para editarlo o cotizarlo de nuevo.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Barra de búsqueda */}
          {designs.length > 0 && (
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por código (ej: CAM-2026-00001), prenda o técnica..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Lista de diseños */}
          <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
            {designs.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-3">
                  <Shirt size={28} />
                </div>
                <h4 className="text-sm font-bold text-slate-300">Aún no tienes diseños guardados</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Personaliza una camiseta en el estudio y presiona el botón{' '}
                  <span className="text-orange-400 font-semibold">«Guardar»</span> para tenerla disponible aquí en cualquier momento.
                </p>
              </div>
            ) : filteredDesigns.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No se encontraron diseños que coincidan con &quot;<span className="text-orange-400 font-semibold">{searchTerm}</span>&quot;.
              </div>
            ) : (
              filteredDesigns.map((design) => {
                const formattedDate = new Date(design.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={design.id}
                    onClick={() => onSelectDesign(design.id)}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-950 transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/30">
                          {design.id}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopy(e, design.id)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 hover:bg-slate-800 px-1.5 py-0.5 rounded transition-colors"
                          title="Copiar código"
                        >
                          {copiedCode === design.id ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-orange-400 transition-colors">
                        {design.productName}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: design.colorHex }}
                          />
                          <span className="capitalize">{design.colorId}</span>
                        </span>
                        <span>•</span>
                        <span>Talla: <strong className="text-slate-200">{design.size}</strong></span>
                        <span>•</span>
                        <span>Cant: <strong className="text-slate-200">{design.quantity}</strong></span>
                        <span>•</span>
                        <span className="text-orange-300 font-semibold">{design.techniqueName}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <Calendar size={12} />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="text-right mr-2 hidden sm:block">
                        <div className="text-[10px] text-slate-500">Total Est.</div>
                        <div className="text-xs font-bold text-orange-400">
                          {formatCurrency(design.priceTotal)}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={<FolderOpen size={15} />}
                        onClick={() => onSelectDesign(design.id)}
                      >
                        Cargar
                      </Button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, design.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar del historial"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center text-xs text-slate-500">
            <span>Los diseños quedan guardados en este navegador.</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog de confirmación de borrado — reemplaza window.confirm (BUG-04) */}
      <Dialog
        isOpen={codeToDelete !== null}
        onClose={() => setCodeToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Diseño"
        description={`¿Estás seguro de que deseas eliminar el diseño ${codeToDelete ?? ''}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};
