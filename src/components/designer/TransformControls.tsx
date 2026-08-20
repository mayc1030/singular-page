import React from 'react';
import type { Canvas, FabricObject } from 'fabric';
import { Copy, Trash2, Lock, Unlock, AlignCenter, ArrowUpToLine, FlipHorizontal } from 'lucide-react';

export interface TransformControlsProps {
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  onRefresh?: () => void;
}

export const TransformControls: React.FC<TransformControlsProps> = ({
  canvas,
  selectedObject
}) => {
  if (!canvas || !selectedObject) return null;

  const isLocked = selectedObject.lockMovementX;

  const handleDuplicate = () => {
    selectedObject.clone().then((cloned) => {
      cloned.set({
        left: (selectedObject.left || 0) + 15,
        top: (selectedObject.top || 0) + 15
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const handleCenter = () => {
    canvas.centerObject(selectedObject);
    canvas.renderAll();
  };

  const handleFlipH = () => {
    selectedObject.set('flipX', !selectedObject.flipX);
    canvas.renderAll();
  };

  const handleBringTop = () => {
    canvas.bringObjectToFront(selectedObject);
    canvas.renderAll();
  };

  const handleToggleLock = () => {
    const nextLock = !isLocked;
    selectedObject.set({
      lockMovementX: nextLock,
      lockMovementY: nextLock,
      lockRotation: nextLock,
      lockScalingX: nextLock,
      lockScalingY: nextLock
    });
    canvas.renderAll();
  };

  const handleDelete = () => {
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return (
    <div className="flex items-center justify-center gap-1.5 p-1.5 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-slate-200">
      <button
        onClick={handleCenter}
        title="Centrar en el área de impresión"
        className="p-2 hover:bg-slate-800 hover:text-orange-400 rounded-xl transition-colors"
      >
        <AlignCenter size={16} />
      </button>

      <button
        onClick={handleFlipH}
        title="Voltear horizontalmente"
        className="p-2 hover:bg-slate-800 hover:text-orange-400 rounded-xl transition-colors"
      >
        <FlipHorizontal size={16} />
      </button>

      <button
        onClick={handleDuplicate}
        title="Duplicar elemento"
        className="p-2 hover:bg-slate-800 hover:text-orange-400 rounded-xl transition-colors"
      >
        <Copy size={16} />
      </button>

      <button
        onClick={handleBringTop}
        title="Traer al frente"
        className="p-2 hover:bg-slate-800 hover:text-orange-400 rounded-xl transition-colors"
      >
        <ArrowUpToLine size={16} />
      </button>

      <button
        onClick={handleToggleLock}
        title={isLocked ? 'Desbloquear' : 'Bloquear'}
        className={`p-2 rounded-xl transition-colors ${
          isLocked ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-slate-800 hover:text-white'
        }`}
      >
        {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
      </button>

      <div className="w-px h-5 bg-slate-800 my-auto mx-1" />

      <button
        onClick={handleDelete}
        title="Eliminar del canvas"
        className="p-2 hover:bg-rose-600/20 hover:text-rose-400 rounded-xl transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
