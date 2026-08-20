import * as fabric from 'fabric';
import type { Product } from '../types/product';
import type { PrintSide } from '../types/order';

export interface RenderMockupOptions {
  product: Product;
  colorHex: string;
  side: PrintSide;
  activeSide?: PrintSide;
  activeCanvas?: fabric.Canvas | null;
  canvasJson?: string;
  width?: number;
  height?: number;
}

export interface SpecSheetData {
  designCode: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  techniqueName: string;
  printedSidesText: string;
  totalPriceFormatted: string;
  dateStr: string;
  previewDataUrl?: string;
  frontPreviewDataUrl?: string | null;
  backPreviewDataUrl?: string | null;
}

export const exportService = {
  // Download direct DataURL as image file (uses Blob ObjectURL for 100% reliable filename and PNG extension)
  downloadDataUrlAsImage: (dataUrl: string | null, filename: string = 'singular-camiseta.png') => {
    if (!dataUrl) return;

    const cleanFilename = filename.endsWith('.png') || filename.endsWith('.jpg') ? filename : `${filename}.png`;

    try {
      if (dataUrl.startsWith('data:')) {
        const parts = dataUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = cleanFilename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 500);
        return;
      }
    } catch (e) {
      console.warn('Fallback to standard download link:', e);
    }

    const fallbackLink = document.createElement('a');
    fallbackLink.download = cleanFilename;
    fallbackLink.href = dataUrl;
    fallbackLink.style.display = 'none';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    setTimeout(() => {
      document.body.removeChild(fallbackLink);
    }, 500);
  },

  // Download canvas element directly as PNG or JPG image file
  downloadCanvasAsImage: (canvas: HTMLCanvasElement | null, filename: string = 'singular-camiseta.png', format: 'png' | 'jpeg' = 'png') => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
    exportService.downloadDataUrlAsImage(dataUrl, filename);
  },

  // Renders a high definition composite image for any side (front or back) with tinted mockup and artwork
  renderMockupComposite: async ({
    product,
    colorHex,
    side,
    activeSide,
    activeCanvas,
    canvasJson,
    width = 1000,
    height = 1100
  }: RenderMockupOptions): Promise<string | null> => {
    const photoUrl = side === 'front' ? product.mockups.front : product.mockups.back;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Load photo image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    // Draw shirt mockup
    ctx.drawImage(img, 0, 0, width, height);

    // 2. Tint shirt by Alpha + Luminance (if not pure white)
    if (colorHex.toUpperCase() !== '#FFFFFF') {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const tr = parseInt(colorHex.slice(1, 3), 16);
      const tg = parseInt(colorHex.slice(3, 5), 16);
      const tb = parseInt(colorHex.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 20) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        data[i] = Math.min(255, Math.round(tr * lum));
        data[i + 1] = Math.min(255, Math.round(tg * lum));
        data[i + 2] = Math.min(255, Math.round(tb * lum));
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // 3. Draw fabric artwork layer
    try {
      if (side === activeSide && activeCanvas) {
        const activeObj = activeCanvas.getActiveObject();
        if (activeObj) {
          activeCanvas.discardActiveObject();
          activeCanvas.renderAll();
        }

        const dataUrl = activeCanvas.toDataURL({ format: 'png', multiplier: width / (activeCanvas.getWidth() || 500) });
        if (dataUrl) {
          const artworkImg = new Image();
          artworkImg.crossOrigin = 'anonymous';
          artworkImg.src = dataUrl;
          await new Promise<void>((resolve) => {
            artworkImg.onload = () => resolve();
            artworkImg.onerror = () => resolve();
          });
          ctx.drawImage(artworkImg, 0, 0, width, height);
        }

        if (activeObj) {
          activeCanvas.setActiveObject(activeObj);
          activeCanvas.renderAll();
        }
      } else if (canvasJson) {
        const parsed = typeof canvasJson === 'string' ? JSON.parse(canvasJson) : canvasJson;
        if (parsed?.objects && parsed.objects.length > 0) {
          const offscreenEl = document.createElement('canvas');
          offscreenEl.width = 500;
          offscreenEl.height = 550;
          const offscreenFabric = new fabric.StaticCanvas(offscreenEl, {
            width: 500,
            height: 550
          });
          await offscreenFabric.loadFromJSON(parsed);
          offscreenFabric.renderAll();
          const offscreenDataUrl = offscreenFabric.toDataURL({ format: 'png', multiplier: width / 500 });
          if (offscreenDataUrl) {
            const offImg = new Image();
            offImg.crossOrigin = 'anonymous';
            offImg.src = offscreenDataUrl;
            await new Promise<void>((resolve) => {
              offImg.onload = () => resolve();
              offImg.onerror = () => resolve();
            });
            ctx.drawImage(offImg, 0, 0, width, height);
          }
          offscreenFabric.dispose();
        }
      }
    } catch (err) {
      console.warn('Error drawing fabric artwork layer on mockup:', err);
    }

    return canvas.toDataURL('image/png', 1.0);
  },

  // Generates a side-by-side presentation mockup PNG containing both Front & Back views
  renderDualMockupComposite: async (
    frontDataUrl: string,
    backDataUrl: string,
    productName: string
  ): Promise<string | null> => {
    const width = 2000;
    const height = 1150;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090D16');
    bgGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Header accent bar
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(0, 0, width, 14);

    // Title top banner
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(productName.toUpperCase(), width / 2, 70);

    ctx.fillStyle = '#FB923C';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('DISEÑO PERSONALIZADO • VISTA FRENTE Y ESPALDA', width / 2, 105);

    // Load both images
    const [frontImg, backImg] = await Promise.all([
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = frontDataUrl;
      }),
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = backDataUrl;
      })
    ]);

    // Left card: Frente
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(80, 140, 880, 920, 24);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.drawImage(frontImg, 120, 160, 800, 840);

    // Botón / Badge Frente en color corporativo Naranja SINGULAR
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.roundRect(400, 980, 240, 48, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('VISTA FRENTE', 520, 1012);

    // Right card: Espalda
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(1040, 140, 880, 920, 24);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.drawImage(backImg, 1080, 160, 800, 840);

    // Botón / Badge Espalda en color corporativo Naranja SINGULAR
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.roundRect(1360, 980, 240, 48, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('VISTA ESPALDA', 1480, 1012);

    return canvas.toDataURL('image/png', 1.0);
  },

  // Generates high quality Spec Sheet ("Ficha Técnica") graphic card and triggers image download
  downloadSpecSheetImage: async (data: SpecSheetData) => {
    const width = 800;
    const height = 1100;

    const specCanvas = document.createElement('canvas');
    specCanvas.width = width;
    specCanvas.height = height;
    const ctx = specCanvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#090D14');
    bgGrad.addColorStop(1, '#111622');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Header Bar
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(0, 0, width, 14);

    // Header Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('FICHA TÉCNICA DE DISEÑO • SINGULAR', 40, 65);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Cotización & Especificaciones de Impresión • ${data.dateStr}`, 40, 95);

    // Design Code Pill
    ctx.fillStyle = '#431407';
    ctx.beginPath();
    ctx.roundRect(width - 240, 40, 200, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FB923C';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(data.designCode, width - 140, 70);
    ctx.textAlign = 'left';

    // Mockup Image Container Box
    const boxX = 40;
    const boxY = 130;
    const boxW = 720;
    const boxH = 520;

    ctx.fillStyle = '#090D14';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    ctx.fill();
    ctx.strokeStyle = '#2B3342';
    ctx.lineWidth = 2;
    ctx.stroke();

    const hasBothSides = Boolean(data.frontPreviewDataUrl && data.backPreviewDataUrl);

    const loadImage = (url: string) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = url;
      });
    };

    if (hasBothSides && data.frontPreviewDataUrl && data.backPreviewDataUrl) {
      const [frontImg, backImg] = await Promise.all([
        loadImage(data.frontPreviewDataUrl),
        loadImage(data.backPreviewDataUrl)
      ]);

      const halfW = (boxW - 30) / 2; // ~345px
      const leftX = boxX + 10;
      const rightX = boxX + halfW + 20;

      // Draw Front Mockup
      const drawH = 430;
      const drawW = (drawH * 500) / 550;
      const scaledW = Math.min(drawW, halfW - 20);
      const scaledH = (scaledW * 550) / 500;

      const frontDrawX = leftX + (halfW - scaledW) / 2;
      const frontDrawY = boxY + 15 + (440 - scaledH) / 2;
      ctx.drawImage(frontImg, frontDrawX, frontDrawY, scaledW, scaledH);

      // Label Front
      ctx.fillStyle = '#431407';
      ctx.beginPath();
      ctx.roundRect(leftX + (halfW - 140) / 2, boxY + 465, 140, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#FB923C';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VISTA FRENTE', leftX + halfW / 2, boxY + 486);

      // Divider line
      ctx.strokeStyle = '#2B3342';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(boxX + boxW / 2, boxY + 20);
      ctx.lineTo(boxX + boxW / 2, boxY + boxH - 20);
      ctx.stroke();

      // Draw Back Mockup
      const backDrawX = rightX + (halfW - scaledW) / 2;
      const backDrawY = boxY + 15 + (440 - scaledH) / 2;
      ctx.drawImage(backImg, backDrawX, backDrawY, scaledW, scaledH);

      // Label Back
      ctx.fillStyle = '#431407';
      ctx.beginPath();
      ctx.roundRect(rightX + (halfW - 140) / 2, boxY + 465, 140, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#FB923C';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VISTA ESPALDA', rightX + halfW / 2, boxY + 486);
      ctx.textAlign = 'left';
    } else {
      // Single side preview
      const singleUrl = data.frontPreviewDataUrl || data.backPreviewDataUrl || data.previewDataUrl || '';
      const sideLabel = data.backPreviewDataUrl && !data.frontPreviewDataUrl ? 'VISTA ESPALDA' : 'VISTA FRENTE';
      const img = await loadImage(singleUrl);

      const aspect = (img.width || 500) / (img.height || 550);
      let drawW = 460;
      let drawH = 460;
      if (aspect > 1) {
        drawH = drawW / aspect;
      } else {
        drawW = drawH * aspect;
      }
      const drawX = boxX + (boxW - drawW) / 2;
      const drawY = boxY + (boxH - 40 - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Label
      ctx.fillStyle = '#431407';
      ctx.beginPath();
      ctx.roundRect(boxX + (boxW - 160) / 2, boxY + boxH - 45, 160, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#FB923C';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sideLabel, boxX + boxW / 2, boxY + boxH - 24);
      ctx.textAlign = 'left';
    }

    // Specs Summary Grid Table
    const startY = 680;
    ctx.fillStyle = '#111622';
    ctx.beginPath();
    ctx.roundRect(40, startY, 720, 340, 16);
    ctx.fill();
    ctx.strokeStyle = '#2B3342';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('DETALLES DE LA PRENDA Y ESTAMPADO', 70, startY + 45);

    const rows = [
      { label: 'Producto', val: data.productName },
      { label: 'Color seleccionado', val: data.colorName },
      { label: 'Talla', val: data.size },
      { label: 'Cantidad solicitada', val: `${data.quantity} unidades` },
      { label: 'Técnica recomendada', val: data.techniqueName },
      { label: 'Zonas de estampado', val: data.printedSidesText },
      { label: 'Precio estimado total', val: data.totalPriceFormatted }
    ];

    let rowY = startY + 95;
    rows.forEach((r, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#1A202C' : '#111622';
      ctx.fillRect(70, rowY - 22, 660, 32);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(r.label, 90, rowY);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '15px sans-serif';
      ctx.fillText(r.val, 340, rowY);

      rowY += 34;
    });

    // Footer disclaimer
    ctx.fillStyle = '#64748B';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Documento generado automáticamente por SINGULAR - Personalizador Online. Válido para cotización.', width / 2, height - 30);

    // Trigger download
    const specDataUrl = specCanvas.toDataURL('image/png', 1.0);
    exportService.downloadDataUrlAsImage(specDataUrl, `ficha-tecnica-${data.designCode}.png`);
  }
};
