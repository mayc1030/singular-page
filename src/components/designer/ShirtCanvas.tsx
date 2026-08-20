import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as fabric from 'fabric';
import type { Product } from '../../types/product';
import type { PrintSide } from '../../types/order';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/canvas';

export interface ShirtCanvasHandle {
  getCompositeDataUrl: (multiplier?: number) => string | null;
  getMockupCanvas: () => HTMLCanvasElement | null;
  getFabricCanvas: () => fabric.Canvas | null;
}

export interface ShirtCanvasProps {
  product: Product;
  colorHex: string;
  activeSide: PrintSide;
  onCanvasReady: (canvas: fabric.Canvas) => void;
  onSelectionChanged: (selectedObj: fabric.FabricObject | null) => void;
  savedCanvasJson?: string;
}

export const ShirtCanvas = forwardRef<ShirtCanvasHandle, ShirtCanvasProps>(({
  product,
  colorHex,
  activeSide,
  onCanvasReady,
  onSelectionChanged,
  savedCanvasJson
}, ref) => {
  const [mockupError, setMockupError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const printZone = product.printZones.find((z) => z.id === activeSide) || product.printZones[0];
  const photoUrl = activeSide === 'front' ? product.mockups.front : product.mockups.back;

  const canvasWidth  = CANVAS_WIDTH;
  const canvasHeight = CANVAS_HEIGHT;

  useImperativeHandle(ref, () => ({
    getMockupCanvas: () => mockupCanvasRef.current,
    getFabricCanvas: () => fabricCanvasRef.current,
    getCompositeDataUrl: (multiplier: number = 2) => {
      const fCanvas = fabricCanvasRef.current;
      const mCanvas = mockupCanvasRef.current;
      if (!mCanvas || !fCanvas) return null;

      // Deseleccionar elemento activo temporalmente para no exportar los controles de selección
      const activeObj = fCanvas.getActiveObject();
      if (activeObj) {
        fCanvas.discardActiveObject();
        fCanvas.renderAll();
      }

      const outWidth = canvasWidth * multiplier;
      const outHeight = canvasHeight * multiplier;

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = outWidth;
      exportCanvas.height = outHeight;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return null;

      // 1. Dibujar camiseta tintada
      ctx.drawImage(mCanvas, 0, 0, outWidth, outHeight);

      // 2. Dibujar capa de diseño de Fabric.js
      const fabricElement = fCanvas.getElement();
      if (fabricElement) {
        ctx.drawImage(fabricElement, 0, 0, outWidth, outHeight);
      }

      // Restaurar selección activa si existía
      if (activeObj) {
        fCanvas.setActiveObject(activeObj);
        fCanvas.renderAll();
      }

      return exportCanvas.toDataURL('image/png', 1.0);
    }
  }), [canvasWidth, canvasHeight]);

  const printBox = {
    left: (printZone.bounds.xPercentage / 100) * canvasWidth,
    top: (printZone.bounds.yPercentage / 100) * canvasHeight,
    width: (printZone.bounds.widthPercentage / 100) * canvasWidth,
    height: (printZone.bounds.heightPercentage / 100) * canvasHeight
  };

  // Tintado fotográfico por canal Alpha + Luminancia
  // Mismo origen (localhost) = sin problemas CORS
  useEffect(() => {
    const canvas = mockupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    // Sin crossOrigin porque es mismo origen (localhost)
    img.src = photoUrl;

    img.onerror = () => {
      // ARCH-05: error visible en vez de canvas en negro silencioso
      console.warn('ShirtCanvas: no se pudo cargar el mockup:', photoUrl);
      setMockupError(true);
    };
    img.onload = () => {
      setMockupError(false);
      // 1. Dibujar la foto original sobre el canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      const isWhite = colorHex.toUpperCase() === '#FFFFFF';
      if (isWhite) return; // Blanco = mostrar foto original sin modificar

      // 2. Leer datos de píxeles
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = imageData.data;

      // 3. Color objetivo (RGB)
      const tr = parseInt(colorHex.slice(1, 3), 16);
      const tg = parseInt(colorHex.slice(3, 5), 16);
      const tb = parseInt(colorHex.slice(5, 7), 16);

      // 4. Recorrer cada píxel
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];

        // Saltar píxeles transparentes (fondo fuera de la camiseta)
        if (alpha < 20) continue;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Luminancia perceptual: preserva sombras y arrugas naturales
        const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        // Aplicar color × luminancia: las sombras oscuras se mantienen oscuras
        data[i]     = Math.min(255, Math.round(tr * lum));
        data[i + 1] = Math.min(255, Math.round(tg * lum));
        data[i + 2] = Math.min(255, Math.round(tb * lum));
        // Alpha sin cambios: el fondo sigue transparente
      }

      // 5. Pintar resultado tintado de vuelta
      ctx.putImageData(imageData, 0, 0);
    };
  }, [photoUrl, colorHex]);

  // Inicializar Fabric.js canvas interactivo
  useEffect(() => {
    const canvas = canvasElRef.current;
    if (!canvas) return;

    const fabricCanvas = new fabric.Canvas(canvas, {
      width: canvasWidth,
      height: canvasHeight,
      preserveObjectStacking: true,
      selectionColor: 'rgba(99, 102, 241, 0.15)',
      selectionBorderColor: '#6366f1',
      selectionLineWidth: 1
    });

    fabricCanvasRef.current = fabricCanvas;
    onCanvasReady(fabricCanvas);

    const handleSelection = () => {
      onSelectionChanged(fabricCanvas.getActiveObject() || null);
    };

    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', handleSelection);
    fabricCanvas.on('selection:cleared', () => onSelectionChanged(null));
    fabricCanvas.on('object:modified', handleSelection);

    fabricCanvas.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;

      const bound = obj.getBoundingRect();

      // Ensure object cannot be dragged completely outside visible canvas
      const minLeft = 5;
      const maxLeft = canvasWidth - bound.width - 5;
      const minTop = 5;
      const maxTop = canvasHeight - bound.height - 5;

      if (maxLeft >= minLeft) {
        if (bound.left < minLeft) {
          obj.left += (minLeft - bound.left);
        } else if (bound.left > maxLeft) {
          obj.left -= (bound.left - maxLeft);
        }
      }

      if (maxTop >= minTop) {
        if (bound.top < minTop) {
          obj.top += (minTop - bound.top);
        } else if (bound.top > maxTop) {
          obj.top -= (bound.top - maxTop);
        }
      }

      obj.setCoords();
    });

    if (savedCanvasJson) {
      try {
        const parsed = typeof savedCanvasJson === 'string' ? JSON.parse(savedCanvasJson) : savedCanvasJson;
        fabricCanvas.loadFromJSON(parsed).then((c) => {
          c.requestRenderAll();
        }).catch((err) => {
          console.warn('Failed to load canvas JSON', err);
        });
      } catch (err) {
        console.warn('Failed to parse canvas JSON', err);
      }
    }

    return () => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [activeSide]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[580px] aspect-[500/550] mx-auto bg-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden flex items-center justify-center select-none"
    >
      {/* ARCH-05: Banner de error si el mockup no cargó */}
      {mockupError && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/90 rounded-2xl gap-2 p-4 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="text-xs text-slate-400">No se pudo cargar la imagen de la prenda.<br />Verifica que los archivos de mockup están en <code className="text-orange-400">/public/mockups/</code>.</p>
        </div>
      )}
      {/* Canvas con foto real tintada por Alpha+Luminancia */}
      <canvas
        ref={mockupCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="absolute inset-0 w-full h-full object-contain p-2 pointer-events-none z-10 transition-opacity duration-300"
      />

      {/* Guía sutil de área de impresión (sin texto superpuesto para máxima visibilidad) */}
      <div
        className="absolute border border-dashed border-orange-400/35 pointer-events-none rounded-lg z-20 transition-all"
        style={{
          left: `${(printBox.left / canvasWidth) * 100}%`,
          top: `${(printBox.top / canvasHeight) * 100}%`,
          width: `${(printBox.width / canvasWidth) * 100}%`,
          height: `${(printBox.height / canvasHeight) * 100}%`
        }}
      />

      {/* Fabric.js canvas overlay para diseño interactivo */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <canvas ref={canvasElRef} width={canvasWidth} height={canvasHeight} />
      </div>
    </div>
  );
});

