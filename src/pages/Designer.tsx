import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { useDesigner } from '../hooks/useDesigner';
import { useDesignerExport } from '../hooks/useDesignerExport';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_IMAGE_MAX_SIZE } from '../constants/canvas';
import { ShirtCanvas, type ShirtCanvasHandle } from '../components/designer/ShirtCanvas';
import { DesignerToolbar } from '../components/designer/DesignerToolbar';
import { DesignerSidebar } from '../components/designer/DesignerSidebar';
import { DesignerMobileToolbar } from '../components/designer/DesignerMobileToolbar';
import { FrontBackToggle } from '../components/designer/FrontBackToggle';
import { TransformControls } from '../components/designer/TransformControls';
import { PrintArea } from '../components/designer/PrintArea';
import { DesignLibrary } from '../components/designer/DesignLibrary';
import { DesignUploader } from '../components/designer/DesignUploader';
import { OrderSummary } from '../components/order/OrderSummary';
import { QuoteRequest } from '../components/order/QuoteRequest';
import { WhatsAppQuoteModal } from '../components/designer/WhatsAppQuoteModal';
import { HelpGuideModal } from '../components/designer/HelpGuideModal';
import { FloatingHelpButton } from '../components/common/FloatingHelpButton';
import { SavedDesignsModal } from '../components/designer/SavedDesignsModal';
import { Dialog } from '../components/common/Dialog';
import { Toast } from '../components/common/Toast';
import { DESIGNS } from '../data/designs';

export const Designer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlProductId = searchParams.get('product') || undefined;
  const urlDesignId = searchParams.get('design') || undefined;
  const urlCode = searchParams.get('code') || undefined;

  const designer = useDesigner(urlProductId);

  // ── Modals ────────────────────────────────────────────────────────────────
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // ── Canvas refs ───────────────────────────────────────────────────────────
  const [activeCanvas, setActiveCanvas] = useState<fabric.Canvas | null>(null);
  const shirtCanvasRef = useRef<ShirtCanvasHandle>(null);

  // Zona de impresión activa según la cara seleccionada
  const activePrintZone =
    designer.product.printZones.find((z) => z.id === designer.activeSide) ||
    designer.product.printZones[0];

  // ── Hook de exportación (lógica extraída del componente) ─────────────────
  const designerExport = useDesignerExport({
    product: designer.product,
    activeColor: designer.activeColor,
    activeSide: designer.activeSide,
    activeTechnique: designer.activeTechnique,
    size: designer.size,
    quantity: designer.quantity,
    priceBreakdown: designer.priceBreakdown,
    designCode: designer.designCode,
    canvasJsonRef: designer.canvasJsonRef,
    activeCanvas,
    saveDesign: designer.saveDesign,
    showToast: designer.showToast,
    printedSides: designer.printedSides,
  });

  // ── Auto-load por URL: ?code=CAM-2026-00001 ───────────────────────────────
  const codeLoadedRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlCode && codeLoadedRef.current !== urlCode) {
      codeLoadedRef.current = urlCode;
      designer.loadDesignByCode(urlCode);
    }
  }, [urlCode, designer]);

  // ── Auto-add diseño preset por URL: ?design=ID ────────────────────────────
  const presetLoadedRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlDesignId && activeCanvas && presetLoadedRef.current !== urlDesignId) {
      presetLoadedRef.current = urlDesignId;
      const foundDesign = DESIGNS.find((d) => d.id === urlDesignId);
      if (foundDesign) {
        handleAddImageToCanvas(foundDesign.imageUrl);
        designer.showToast(`Diseño "${foundDesign.name}" añadido a la camiseta.`);
      }
    }
  }, [urlDesignId, activeCanvas]);

  // ── Callbacks del canvas ──────────────────────────────────────────────────

  const handleCanvasReady = (canvas: fabric.Canvas) => {
    setActiveCanvas(canvas);
    designer.fabricCanvasRef.current = canvas;
  };

  const handleSelectionChanged = (obj: fabric.FabricObject | null) => {
    designer.setSelectedObject(obj);
  };

  // ── Añadir texto al canvas ────────────────────────────────────────────────

  const handleAddText = () => {
    if (!activeCanvas) return;

    const printLeft = (activePrintZone.bounds.xPercentage / 100) * CANVAS_WIDTH;
    const printTop  = (activePrintZone.bounds.yPercentage / 100) * CANVAS_HEIGHT;
    const printW    = (activePrintZone.bounds.widthPercentage / 100) * CANVAS_WIDTH;
    const printH    = (activePrintZone.bounds.heightPercentage / 100) * CANVAS_HEIGHT;

    const textObj = new fabric.IText('TU TEXTO AQUÍ', {
      // AP-02: id estable para React key en LayerPanel
      id: crypto.randomUUID(),
      left: printLeft + printW / 2,
      top:  printTop  + printH / 3,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      fontFamily: 'Inter',
      fontSize: 28,
      fill: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
      cornerColor: '#ff6600',
      cornerSize: 10,
      transparentCorners: false
    });

    activeCanvas.add(textObj);
    activeCanvas.setActiveObject(textObj);
    activeCanvas.renderAll();

    if (!designer.printedSides.includes(designer.activeSide)) {
      designer.setPrintedSides([...designer.printedSides, designer.activeSide]);
    }
    designer.showToast('Texto añadido al canvas.');
  };

  // ── Añadir imagen/SVG al canvas ───────────────────────────────────────────

  const handleAddImageToCanvas = (imageUrl: string) => {
    if (!activeCanvas) return;

    fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!img) return;

        const imgWidth  = img.width  || 300;
        const imgHeight = img.height || 300;

        // Escalar para caber en el área de impresión sin distorsionar
        const scale = Math.min(
          DEFAULT_IMAGE_MAX_SIZE / imgWidth,
          DEFAULT_IMAGE_MAX_SIZE / imgHeight,
          1
        );

        const printLeft = (activePrintZone.bounds.xPercentage / 100) * CANVAS_WIDTH;
        const printTop  = (activePrintZone.bounds.yPercentage / 100) * CANVAS_HEIGHT;
        const printW    = (activePrintZone.bounds.widthPercentage / 100) * CANVAS_WIDTH;
        const printH    = (activePrintZone.bounds.heightPercentage / 100) * CANVAS_HEIGHT;

        img.set({
          // AP-02: id estable para React key en LayerPanel
          id: crypto.randomUUID(),
          left: printLeft + printW / 2,
          top:  printTop  + printH / 2,
          originX: 'center',
          originY: 'center',
          centeredRotation: true,
          scaleX: scale,
          scaleY: scale,
          cornerColor: '#ff6600',
          cornerSize: 10,
          transparentCorners: false
        });

        activeCanvas.add(img);
        activeCanvas.setActiveObject(img);
        activeCanvas.renderAll();

        if (!designer.printedSides.includes(designer.activeSide)) {
          designer.setPrintedSides([...designer.printedSides, designer.activeSide]);
        }
      })
      .catch((err) => {
        console.error('Error loading design onto canvas:', err);
      });
  };

  // ── Actualizar propiedades del objeto seleccionado ────────────────────────

  const handleUpdateText = (props: Record<string, unknown>) => {
    if (!activeCanvas || !designer.selectedObject) return;
    designer.selectedObject.set(props);
    activeCanvas.renderAll();
  };

  // ── Limpiar canvas y actualizar cara impresa ──────────────────────────────

  const handleClearCanvas = () => {
    if (!activeCanvas) return;

    activeCanvas.clear();
    designer.setSelectedObject(null);
    activeCanvas.renderAll();

    // Limpiar JSON del lado activo ANTES de consultar el otro lado
    designer.canvasJsonRef.current[designer.activeSide] = '';

    const otherSide = designer.activeSide === 'front' ? 'back' : 'front';
    const otherHasObjects = designerExport.checkSideHasDesign(otherSide);

    designer.setPrintedSides(otherHasObjects ? [otherSide] : []);
    designer.showToast('Lienzo limpiado.');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-4 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

      {/* Studio Header Toolbar */}
      <div className="mb-4">
        <DesignerToolbar
          onAddText={handleAddText}
          onOpenDesignLibrary={() => setIsLibraryOpen(true)}
          onOpenUploader={() => setIsUploaderOpen(true)}
          onClearCanvas={handleClearCanvas}
          onSaveDesign={designerExport.handleSaveDesign}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenRecoverCode={() => setIsRecoverModalOpen(true)}
          onExportImage={designerExport.handleExportImage}
          onDownloadSpecSheet={designerExport.handleDownloadSpecSheet}
        />
      </div>

      {/* Layout principal: sidebar + canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Columna izquierda: panel de personalización */}
        <div className="hidden lg:block lg:col-span-5">
          <DesignerSidebar
            product={designer.product}
            onSelectProduct={designer.setProduct}
            colorId={designer.colorId}
            onSelectColor={designer.setColorId}
            size={designer.size}
            onSelectSize={designer.setSize}
            canvas={activeCanvas}
            selectedObject={designer.selectedObject}
            onUpdateText={handleUpdateText}
          />
        </div>

        {/* Columna derecha: canvas y controles */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">

          {/* Toggle Frente / Espalda */}
          <div className="w-full max-w-xl flex justify-center">
            <FrontBackToggle
              activeSide={designer.activeSide}
              onChangeSide={designer.switchSide}
              printedSides={designer.printedSides}
            />
          </div>

          {/* Especificaciones del área de impresión */}
          <div className="w-full max-w-xl">
            <PrintArea printZone={activePrintZone} />
          </div>

          {/* Canvas principal */}
          <div className="w-full max-w-xl flex justify-center">
            <ShirtCanvas
              ref={shirtCanvasRef}
              product={designer.product}
              colorHex={designer.activeColor.hex}
              activeSide={designer.activeSide}
              onCanvasReady={handleCanvasReady}
              onSelectionChanged={handleSelectionChanged}
              savedCanvasJson={designer.canvasJsonRef.current[designer.activeSide]}
            />
          </div>

          {/* Controles de transformación del objeto seleccionado */}
          {designer.selectedObject && (
            <div className="mt-2">
              <TransformControls canvas={activeCanvas} selectedObject={designer.selectedObject} />
            </div>
          )}

          {/* Toolbar móvil */}
          <div className="lg:hidden w-full mt-2">
            <DesignerMobileToolbar
              product={designer.product}
              onSelectProduct={designer.setProduct}
              colorId={designer.colorId}
              onSelectColor={designer.setColorId}
              size={designer.size}
              onSelectSize={designer.setSize}
              canvas={activeCanvas}
              selectedObject={designer.selectedObject}
              onUpdateText={handleUpdateText}
              onOpenLibrary={() => setIsLibraryOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Resumen de pedido y cotización */}
      <div className="mt-8 w-full">
        <OrderSummary
          product={designer.product}
          activeColor={designer.activeColor}
          size={designer.size}
          onSelectSize={designer.setSize}
          quantity={designer.quantity}
          onChangeQuantity={designer.setQuantity}
          techniqueId={designer.techniqueId}
          onSelectTechnique={designer.setTechniqueId}
          printedSides={designer.printedSides}
          breakdown={designer.priceBreakdown}
          designCode={designer.designCode}
          onSaveDesign={designerExport.handleSaveDesign}
          onExportImage={designerExport.handleExportImage}
          onSendWhatsApp={() => setIsWhatsAppModalOpen(true)}
        />
      </div>

      {/* ── Modales ────────────────────────────────────────────────────────── */}

      <DesignLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectDesign={(d) => {
          handleAddImageToCanvas(d.imageUrl);
          designer.showToast(`Diseño "${d.name}" añadido al canvas.`);
        }}
      />

      <DesignUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onImageUploaded={(dataUrl) => {
          handleAddImageToCanvas(dataUrl);
          designer.showToast('Tu imagen se cargó correctamente en el canvas.');
        }}
      />

      {/* Modal Guía Profesional de Cotización por WhatsApp */}
      <WhatsAppQuoteModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        product={designer.product}
        activeColor={designer.activeColor}
        size={designer.size}
        quantity={designer.quantity}
        activeTechniqueName={designer.activeTechnique.name}
        printedSidesText={designer.printedSides.map((s) => (s === 'front' ? 'Frente' : 'Espalda')).join(' + ')}
        totalPrice={designer.priceBreakdown.totalPrice}
        designCode={designer.designCode}
        onExportImage={designerExport.handleExportImage}
        onSendWhatsApp={designer.sendWhatsAppQuote}
      />

      <QuoteRequest
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        designCode={designer.designCode}
        onSendWhatsApp={() => setIsWhatsAppModalOpen(true)}
        onDownloadSpecSheet={designerExport.handleDownloadSpecSheet}
      />

      {/* Recuperar diseño por código */}
      <Dialog
        isOpen={isRecoverModalOpen}
        onClose={() => setIsRecoverModalOpen(false)}
        onConfirm={(code) => {
          if (code) {
            const success = designer.loadDesignByCode(code.trim());
            if (success) setIsRecoverModalOpen(false);
          }
        }}
        title="Recuperar Diseño Guardado"
        description="Ingresa el código único de tu diseño (ejemplo: CAM-2026-00001) para restaurar tus prendas, colores y capas guardadas."
        placeholder="CAM-2026-00001"
        showInput
        confirmText="Cargar Diseño"
      />

      {/* Historial de diseños guardados */}
      <SavedDesignsModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectDesign={(code) => {
          designer.loadDesignByCode(code);
          setIsHistoryModalOpen(false);
        }}
      />

      {/* Guía interactiva paso a paso: ¿Cómo funciona? */}
      <HelpGuideModal
        isOpen={isHelpGuideOpen}
        onClose={() => setIsHelpGuideOpen(false)}
      />

      {/* Botón Flotante Permanente '¿Cómo funciona?' */}
      <FloatingHelpButton onClick={() => setIsHelpGuideOpen(true)} />

      {/* Notificación toast */}
      <Toast message={designer.statusMessage} type="info" />
    </div>
  );
};
