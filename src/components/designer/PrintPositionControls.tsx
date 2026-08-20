import React, { useState, useEffect } from 'react';
import type { Canvas, FabricObject } from 'fabric';
import { Move, RotateCw, AlignCenter, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Crosshair } from 'lucide-react';
import {
  CANVAS_CENTER_X,
  CANVAS_DRAG_MIN_X, CANVAS_DRAG_MAX_X,
  CANVAS_DRAG_MIN_Y, CANVAS_DRAG_MAX_Y,
  PRESET_CHEST_LEFT_X, PRESET_CHEST_LEFT_Y,
  PRESET_CHEST_CENTER_Y
} from '../../constants/canvas';

export interface PrintPositionControlsProps {
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
}

export const PrintPositionControls: React.FC<PrintPositionControlsProps> = ({
  canvas,
  selectedObject
}) => {
  // Active target object (either currently selected or first canvas object)
  const activeObj = selectedObject || (canvas ? canvas.getObjects()[0] : null);

  const [posX, setPosX] = useState<number>(250);
  const [posY, setPosY] = useState<number>(240);
  const [angle, setAngle] = useState<number>(0);

  // Helper to ensure an object rotates around its exact geometric center
  const ensureCenteredOrigin = (obj: FabricObject) => {
    if (obj.originX !== 'center' || obj.originY !== 'center') {
      const centerPoint = obj.getCenterPoint();
      obj.set({
        originX: 'center',
        originY: 'center',
        centeredRotation: true,
        left: centerPoint.x,
        top: centerPoint.y
      });
      obj.setCoords();
    }
  };

  // Sync state from active Fabric object
  useEffect(() => {
    if (!activeObj || !canvas) return undefined;

    const updateFromObject = () => {
      ensureCenteredOrigin(activeObj);
      setPosX(Math.round(activeObj.left || 0));
      setPosY(Math.round(activeObj.top || 0));
      setAngle(Math.round(activeObj.angle || 0) % 360);
    };

    updateFromObject();

    canvas.on('object:moving', updateFromObject);
    canvas.on('object:rotating', updateFromObject);
    canvas.on('object:modified', updateFromObject);
    canvas.on('selection:created', updateFromObject);
    canvas.on('selection:updated', updateFromObject);

    return () => {
      canvas.off('object:moving', updateFromObject);
      canvas.off('object:rotating', updateFromObject);
      canvas.off('object:modified', updateFromObject);
      canvas.off('selection:created', updateFromObject);
      canvas.off('selection:updated', updateFromObject);
    };
  }, [canvas, activeObj, selectedObject]);

  // Handle X Position change
  const handleXChange = (newX: number) => {
    setPosX(newX);
    if (activeObj && canvas) {
      ensureCenteredOrigin(activeObj);
      activeObj.set({ left: newX });
      activeObj.setCoords();
      canvas.renderAll();
    }
  };

  // Handle Y Position change
  const handleYChange = (newY: number) => {
    setPosY(newY);
    if (activeObj && canvas) {
      ensureCenteredOrigin(activeObj);
      activeObj.set({ top: newY });
      activeObj.setCoords();
      canvas.renderAll();
    }
  };

  // Handle Rotation around the central axis
  const handleAngleChange = (newAngle: number) => {
    const normalized = ((newAngle % 360) + 360) % 360;
    setAngle(normalized);
    if (activeObj && canvas) {
      ensureCenteredOrigin(activeObj);
      activeObj.set({ angle: normalized });
      activeObj.setCoords();
      canvas.renderAll();
    }
  };

  // BUG-05: alignCenterHorizontal eliminada — era dead code (no conectada a ningún botón)

  const alignChestLeft = () => {
    if (!activeObj || !canvas) return;
    handleXChange(PRESET_CHEST_LEFT_X);
    handleYChange(PRESET_CHEST_LEFT_Y);
  };

  const alignChestCenter = () => {
    if (!activeObj || !canvas) return;
    handleXChange(CANVAS_CENTER_X);
    handleYChange(PRESET_CHEST_CENTER_Y);
  };

  const hasObjects = Boolean(canvas && canvas.getObjects().length > 0);

  return (
    <div className="flex flex-col gap-3.5 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
          <Move size={15} className="text-orange-400" />
          <span>Ubicación y Orientación del Estampado</span>
        </label>
        {activeObj && (
          <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            {selectedObject ? 'Elemento seleccionado' : 'Estampado activo'}
          </span>
        )}
      </div>

      {!hasObjects ? (
        <p className="text-[11px] text-slate-400 italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 text-center">
          Agrega un texto o diseño en la prenda para ajustar sus coordenadas y rotación.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Quick Presets Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={alignChestLeft}
              className="px-2 py-1.5 bg-slate-800/80 hover:bg-orange-600/20 hover:border-orange-500/50 border border-slate-700/70 rounded-lg text-[11px] font-medium text-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <Crosshair size={12} className="text-orange-400" />
              <span>Pecho Izq</span>
            </button>
            <button
              type="button"
              onClick={alignChestCenter}
              className="px-2 py-1.5 bg-slate-800/80 hover:bg-orange-600/20 hover:border-orange-500/50 border border-slate-700/70 rounded-lg text-[11px] font-medium text-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <AlignCenter size={12} className="text-orange-400" />
              <span>Centrado</span>
            </button>
            <button
              type="button"
              onClick={() => handleAngleChange(0)}
              className="px-2 py-1.5 bg-slate-800/80 hover:bg-orange-600/20 hover:border-orange-500/50 border border-slate-700/70 rounded-lg text-[11px] font-medium text-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw size={12} className="text-orange-400" />
              <span>0° Recto</span>
            </button>
          </div>

          {/* Eje X (Horizontal) */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                  X
                </span>
                <span>Eje X (Horizontal)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleXChange(posX - 5)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Mover a la izquierda"
                >
                  <ArrowLeft size={13} />
                </button>
                <span className="font-mono text-xs font-bold text-orange-400 w-12 text-center bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {posX} px
                </span>
                <button
                  type="button"
                  onClick={() => handleXChange(posX + 5)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Mover a la derecha"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={CANVAS_DRAG_MIN_X}
              max={CANVAS_DRAG_MAX_X}
              value={posX}
              onChange={(e) => handleXChange(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Eje Y (Vertical) */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                  Y
                </span>
                <span>Eje Y (Vertical)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleYChange(posY - 5)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Mover arriba"
                >
                  <ArrowUp size={13} />
                </button>
                <span className="font-mono text-xs font-bold text-blue-400 w-12 text-center bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {posY} px
                </span>
                <button
                  type="button"
                  onClick={() => handleYChange(posY + 5)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Mover abajo"
                >
                  <ArrowDown size={13} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={CANVAS_DRAG_MIN_Y}
              max={CANVAS_DRAG_MAX_Y}
              value={posY}
              onChange={(e) => handleYChange(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Girar (Rotación Central) */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <RotateCw size={13} className="text-emerald-400" />
                <span>Girar (Eje Central)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAngleChange(angle - 15)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Girar -15°"
                >
                  <RotateCcw size={13} />
                </button>
                <span className="font-mono text-xs font-bold text-emerald-400 w-12 text-center bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {angle}°
                </span>
                <button
                  type="button"
                  onClick={() => handleAngleChange(angle + 15)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Girar +15°"
                >
                  <RotateCw size={13} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => handleAngleChange(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
