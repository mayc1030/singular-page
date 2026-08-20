import { useCallback } from 'react';
import type { MutableRefObject } from 'react';
import confetti from 'canvas-confetti';
import * as fabric from 'fabric';
import type { PrintSide, PriceBreakdown, Technique } from '../types/order';
import type { Product, ProductColor } from '../types/product';
import { exportService } from '../services/exportService';

// ─── Interface de parámetros ────────────────────────────────────────────────

export interface UseDesignerExportParams {
  product: Product;
  activeColor: ProductColor;
  activeSide: PrintSide;
  activeTechnique: Technique;
  size: string;
  quantity: number;
  priceBreakdown: PriceBreakdown;
  designCode: string;
  canvasJsonRef: MutableRefObject<{ front?: string; back?: string }>;
  activeCanvas: fabric.Canvas | null;
  saveDesign: () => string;
  showToast: (msg: string) => void;
  printedSides: PrintSide[];
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * useDesignerExport
 * Encapsula toda la lógica de exportación y guardado del studio de diseño.
 * Extraído de Designer.tsx para respetar SoC y el principio de responsabilidad única.
 */
export function useDesignerExport({
  product,
  activeColor,
  activeSide,
  activeTechnique,
  size,
  quantity,
  priceBreakdown,
  canvasJsonRef,
  activeCanvas,
  saveDesign,
  showToast,
}: UseDesignerExportParams) {

  // ── Verifica si una cara (front/back) tiene objetos de diseño ──────────────
  const checkSideHasDesign = useCallback((side: 'front' | 'back'): boolean => {
    // La cara activa se consulta directamente del canvas vivo
    if (side === activeSide && activeCanvas) {
      return activeCanvas.getObjects().length > 0;
    }
    // Caras inactivas se consultan del JSON serializado en el ref
    const savedJson = canvasJsonRef.current[side];
    if (!savedJson) return false;
    try {
      const parsed = JSON.parse(savedJson);
      return Boolean(parsed?.objects && parsed.objects.length > 0);
    } catch {
      return false;
    }
  }, [activeSide, activeCanvas, canvasJsonRef]);

  // ── Guarda el diseño con código + celebración confetti ──────────────────────
  const handleSaveDesign = useCallback((): string => {
    const code = saveDesign();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`¡Diseño guardado! Código: ${code}`);
    return code;
  }, [saveDesign, showToast]);

  // ── Exporta PNG(s) del mockup: frente, espalda o ambos ───────────────────
  const handleExportImage = useCallback(async (): Promise<void> => {
    try {
      // Sincronizar JSON del lado activo antes de exportar
      if (activeCanvas) {
        canvasJsonRef.current[activeSide] = JSON.stringify(activeCanvas.toJSON());
      }

      const hasFront = checkSideHasDesign('front');
      const hasBack = checkSideHasDesign('back');

      showToast('Generando exportación de prendas...');

      let frontUrl: string | null = null;
      let backUrl: string | null = null;

      if (hasFront || (!hasFront && !hasBack && activeSide === 'front')) {
        frontUrl = await exportService.renderMockupComposite({
          product,
          colorHex: activeColor.hex,
          side: 'front',
          activeSide,
          activeCanvas,
          canvasJson: canvasJsonRef.current.front,
          width: 1000,
          height: 1100
        });
      }

      if (hasBack || (!hasFront && !hasBack && activeSide === 'back')) {
        backUrl = await exportService.renderMockupComposite({
          product,
          colorHex: activeColor.hex,
          side: 'back',
          activeSide,
          activeCanvas,
          canvasJson: canvasJsonRef.current.back,
          width: 1000,
          height: 1100
        });
      }

      if (hasFront && hasBack && frontUrl && backUrl) {
        // Descargar frente y espalda por separado
        exportService.downloadDataUrlAsImage(frontUrl, `camiseta-${product.id}-frente.png`);
        setTimeout(() => {
          if (backUrl) {
            exportService.downloadDataUrlAsImage(backUrl, `camiseta-${product.id}-espalda.png`);
          }
        }, 350);

        // Generar y descargar vista dual lado a lado
        const dualUrl = await exportService.renderDualMockupComposite(frontUrl, backUrl, product.name);
        if (dualUrl) {
          setTimeout(() => {
            exportService.downloadDataUrlAsImage(dualUrl, `camiseta-${product.id}-frente-y-espalda.png`);
          }, 700);
        }

        showToast('¡Exportadas imágenes de Frente, Espalda y Vista Dual!');
      } else if (hasFront && frontUrl) {
        exportService.downloadDataUrlAsImage(frontUrl, `camiseta-${product.id}-frente.png`);
        showToast('¡Camiseta (Frente) exportada en PNG correctamente!');
      } else if (hasBack && backUrl) {
        exportService.downloadDataUrlAsImage(backUrl, `camiseta-${product.id}-espalda.png`);
        showToast('¡Camiseta (Espalda) exportada en PNG correctamente!');
      } else {
        const activeUrl = activeSide === 'front' ? frontUrl : backUrl;
        if (activeUrl) {
          exportService.downloadDataUrlAsImage(activeUrl, `camiseta-${product.id}-${activeSide}.png`);
          showToast('¡Imagen exportada en PNG correctamente!');
        }
      }
    } catch (error) {
      console.error('Error during image export:', error);
      showToast('Hubo un error al exportar la imagen. Inténtalo de nuevo.');
    }
  }, [product, activeColor, activeSide, activeCanvas, canvasJsonRef, checkSideHasDesign, showToast]);

  // ── Genera y descarga la Ficha Técnica en alta definición ────────────────
  const handleDownloadSpecSheet = useCallback(async (): Promise<void> => {
    showToast('Generando Ficha Técnica en alta definición...');
    const code = saveDesign();

    const hasFront = checkSideHasDesign('front');
    const hasBack = checkSideHasDesign('back');

    let frontPreviewUrl: string | null = null;
    let backPreviewUrl: string | null = null;

    if (hasFront) {
      frontPreviewUrl = await exportService.renderMockupComposite({
        product,
        colorHex: activeColor.hex,
        side: 'front',
        activeSide,
        activeCanvas,
        canvasJson: canvasJsonRef.current.front,
        width: 800,
        height: 880
      });
    }

    if (hasBack) {
      backPreviewUrl = await exportService.renderMockupComposite({
        product,
        colorHex: activeColor.hex,
        side: 'back',
        activeSide,
        activeCanvas,
        canvasJson: canvasJsonRef.current.back,
        width: 800,
        height: 880
      });
    }

    // Si ninguna cara tiene diseño, exportar la cara activa como referencia
    if (!hasFront && !hasBack) {
      const fallbackUrl = await exportService.renderMockupComposite({
        product,
        colorHex: activeColor.hex,
        side: activeSide,
        activeSide,
        activeCanvas,
        width: 800,
        height: 880
      });
      if (activeSide === 'front') {
        frontPreviewUrl = fallbackUrl;
      } else {
        backPreviewUrl = fallbackUrl;
      }
    }

    // Construir texto de caras estampadas para la ficha
    const detectedSides: string[] = [];
    if (hasFront || (!hasFront && !hasBack && activeSide === 'front')) detectedSides.push('Frente');
    if (hasBack || (!hasFront && !hasBack && activeSide === 'back')) detectedSides.push('Espalda');

    await exportService.downloadSpecSheetImage({
      designCode: code,
      productName: product.name,
      colorName: activeColor.name,
      size,
      quantity,
      techniqueName: activeTechnique.name,
      printedSidesText: detectedSides.join(' + '),
      totalPriceFormatted: `$${priceBreakdown.totalPrice.toLocaleString('es-CO')}`,
      dateStr: new Date().toLocaleDateString('es-CO'),
      frontPreviewDataUrl: frontPreviewUrl,
      backPreviewDataUrl: backPreviewUrl,
    });
  }, [
    product, activeColor, activeSide, activeCanvas, canvasJsonRef,
    size, quantity, activeTechnique, priceBreakdown,
    saveDesign, checkSideHasDesign, showToast,
  ]);

  return {
    checkSideHasDesign,
    handleSaveDesign,
    handleExportImage,
    handleDownloadSpecSheet,
  };
}
