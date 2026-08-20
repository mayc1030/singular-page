import React, { useState, useEffect, useCallback } from 'react';
import type { Canvas, FabricObject, IText } from 'fabric';
import { Layers, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2, Type, Image as ImageIcon } from 'lucide-react';

export interface LayerPanelProps {
  canvas: Canvas | null;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ canvas }) => {
  const [objects, setObjects] = useState<FabricObject[]>([]);
  const [activeObj, setActiveObj] = useState<FabricObject | null>(null);

  // AP-06: refreshLayers envuelto en useCallback para incluirlo correctamente en deps de useEffect
  const refreshLayers = useCallback(() => {
    if (!canvas) return;
    const objs = canvas.getObjects();
    setObjects([...objs].reverse()); // Reverse to list top-most layer first
    setActiveObj(canvas.getActiveObject() || null);
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;
    refreshLayers();

    canvas.on('object:added', refreshLayers);
    canvas.on('object:removed', refreshLayers);
    canvas.on('object:modified', refreshLayers);
    canvas.on('selection:created', refreshLayers);
    canvas.on('selection:updated', refreshLayers);
    canvas.on('selection:cleared', refreshLayers);

    return () => {
      canvas.off('object:added', refreshLayers);
      canvas.off('object:removed', refreshLayers);
      canvas.off('object:modified', refreshLayers);
      canvas.off('selection:created', refreshLayers);
      canvas.off('selection:updated', refreshLayers);
      canvas.off('selection:cleared', refreshLayers);
    };
  }, [canvas, refreshLayers]); // AP-06: refreshLayers correctamente en deps

  if (!canvas || objects.length === 0) {
    return (
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
        <Layers size={22} className="mx-auto text-slate-600 mb-2" />
        <span>No hay capas en este lado del estampado. Agrega un texto o un diseño para gestionarlo aquí.</span>
      </div>
    );
  }

  const selectLayer = (obj: FabricObject) => {
    canvas.setActiveObject(obj);
    canvas.renderAll();
    refreshLayers();
  };

  const toggleVisibility = (obj: FabricObject, e: React.MouseEvent) => {
    e.stopPropagation();
    obj.visible = !obj.visible;
    canvas.renderAll();
    refreshLayers();
  };

  const toggleLock = (obj: FabricObject, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLock = !obj.lockMovementX;
    obj.lockMovementX = nextLock;
    obj.lockMovementY = nextLock;
    obj.lockRotation = nextLock;
    obj.lockScalingX = nextLock;
    obj.lockScalingY = nextLock;
    canvas.renderAll();
    refreshLayers();
  };

  const moveUp = (obj: FabricObject, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas.bringObjectForward(obj);
    canvas.renderAll();
    refreshLayers();
  };

  const moveDown = (obj: FabricObject, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
    refreshLayers();
  };

  const deleteLayer = (obj: FabricObject, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
    refreshLayers();
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <Layers size={16} className="text-orange-400" />
          <span>Panel de Capas ({objects.length})</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {objects.map((obj, idx) => {
          const isSelected = activeObj === obj;
          const isText = obj.type === 'i-text' || obj.type === 'text';
          // AP-01: cast tipado a IText en vez de (obj as any)
          const name = isText
            ? `🔤 "${(obj as IText).text?.slice(0, 15)}..."`
            : `🖼 Imagen #${objects.length - idx}`;
          const isLocked = obj.lockMovementX;
          // AP-02: id es una propiedad interna de FabricObject pero no siempre está en los tipos públicos
          const stableKey = (obj as FabricObject & { id?: string }).id ?? `layer-${objects.length - 1 - idx}`;

          return (
            <div
              key={stableKey}
              onClick={() => selectLayer(obj)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-orange-600/20 border-orange-500 text-white font-semibold'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                {isText ? (
                  <Type size={14} className="text-orange-400 shrink-0" />
                ) : (
                  <ImageIcon size={14} className="text-amber-400 shrink-0" />
                )}
                <span className="truncate">{name}</span>
              </div>

              {/* Layer Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => moveUp(obj, e)}
                  title="Subir capa"
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={(e) => moveDown(obj, e)}
                  title="Bajar capa"
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={(e) => toggleLock(obj, e)}
                  title={isLocked ? 'Desbloquear capa' : 'Bloquear capa'}
                  className={`p-1 rounded ${isLocked ? 'text-amber-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                </button>
                <button
                  onClick={(e) => toggleVisibility(obj, e)}
                  title={obj.visible ? 'Ocultar capa' : 'Mostrar capa'}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  {obj.visible ? <Eye size={13} /> : <EyeOff size={13} className="text-slate-600" />}
                </button>
                <button
                  onClick={(e) => deleteLayer(obj, e)}
                  title="Eliminar capa"
                  className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
