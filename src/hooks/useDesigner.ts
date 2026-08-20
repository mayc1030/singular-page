import { useState, useCallback, useRef } from 'react';
import type { Canvas, FabricObject } from 'fabric';
import type { Product } from '../types/product';
import type { PrintSide, Size, SavedDesign } from '../types/order';
import { PRODUCTS } from '../data/products';
import { COLOR_PALETTE } from '../data/colors';
import { PRINT_TECHNIQUES } from '../data/techniques';
import { calculateOrderPrice } from '../utils/priceUtils';
import { storageService } from '../services/storageService';
import { whatsappService } from '../services/whatsappService';

export function useDesigner(initialProductId?: string, initialDesignId?: string) {
  // Product & Customization Selection State
  const [product, setProductState] = useState<Product>(() => {
    if (initialProductId) {
      const found = PRODUCTS.find((p) => p.id === initialProductId);
      if (found) return found;
    }
    return PRODUCTS[0];
  });

  const [colorId, setColorId] = useState<string>(product.availableColors[0]?.id || 'black');
  const [size, setSize] = useState<Size>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [techniqueId, setTechniqueId] = useState<string>(product.availableTechniques[0] || 'dtf');
  
  // Side view: 'front' | 'back'
  const [activeSide, setActiveSide] = useState<PrintSide>('front');
  
  // Side canvas contents tracking (inicia vacío: ninguna cara tiene diseño aún)
  const [printedSides, setPrintedSides] = useState<PrintSide[]>([]);
  
  // Canvas JSON state for front & back views
  const canvasJsonRef = useRef<{ front?: string; back?: string }>({});
  
  // Fabric Canvas Reference
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // Active object selection on canvas
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  
  // Saved Design Code
  const [designCode, setDesignCode] = useState<string>('');
  
  // Toast / Status Message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  // Ref para el timer del toast — permite cancelarlo si se lanza un nuevo mensaje antes de que expire
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setStatusMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setStatusMessage(null);
      toastTimerRef.current = null;
    }, 4000);
  }, []);

  // Update selected product and reset defaults if necessary
  const setProduct = useCallback((newProduct: Product) => {
    setProductState(newProduct);
    if (!newProduct.availableColors.some((c) => c.id === colorId)) {
      setColorId(newProduct.availableColors[0]?.id || 'white');
    }
    if (!newProduct.availableTechniques.includes(techniqueId)) {
      setTechniqueId(newProduct.availableTechniques[0] || 'dtf');
    }
    showToast(`Prenda cambiada a ${newProduct.name}`);
  }, [colorId, techniqueId, showToast]);

  // Price calculation
  const priceBreakdown = calculateOrderPrice(
    product.id,
    colorId,
    techniqueId,
    quantity,
    printedSides.length
  );

  // Active color details
  const activeColor = product.availableColors.find((c) => c.id === colorId) || COLOR_PALETTE[0];

  // Active technique details
  const activeTechnique = PRINT_TECHNIQUES.find((t) => t.id === techniqueId) || PRINT_TECHNIQUES[0];

  // Front/Back view switch handler
  const switchSide = useCallback((newSide: PrintSide) => {
    if (newSide === activeSide) return;
    
    // Save current canvas state to ref before switching
    if (fabricCanvasRef.current) {
      const json = JSON.stringify(fabricCanvasRef.current.toJSON());
      canvasJsonRef.current[activeSide] = json;
    }
    
    setActiveSide(newSide);
  }, [activeSide]);

  // Save current design to LocalStorage with code
  const saveDesign = useCallback((): string => {
    // Ensure current side state is updated in JSON ref
    if (fabricCanvasRef.current) {
      canvasJsonRef.current[activeSide] = JSON.stringify(fabricCanvasRef.current.toJSON());
    }

    const code = designCode || storageService.generateDesignCode();
    setDesignCode(code);

    const activeColorObj = product.availableColors.find((c) => c.id === colorId) || COLOR_PALETTE[0];

    const saved: SavedDesign = {
      id: code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productName: product.name,
      productId: product.id,
      colorId: colorId,
      colorHex: activeColorObj.hex,
      size: size,
      quantity: quantity,
      techniqueId: techniqueId,
      techniqueName: activeTechnique.name,
      printedSides: printedSides,
      priceTotal: priceBreakdown.totalPrice,
      unitPrice: priceBreakdown.unitPrice,
      canvasJsonFront: canvasJsonRef.current.front,
      canvasJsonBack: canvasJsonRef.current.back
    };

    storageService.saveDesign(saved);
    // Nota: el toast de confirmación lo muestra el caller (useDesignerExport.handleSaveDesign)
    return code;
  }, [designCode, activeSide, product, colorId, size, quantity, techniqueId, activeTechnique, printedSides, priceBreakdown, showToast]);

  // Load design by code
  const loadDesignByCode = useCallback((code: string): boolean => {
    const found = storageService.getDesignByCode(code);
    if (!found) {
      showToast(`No se encontró ningún diseño con el código: ${code}`);
      return false;
    }

    const prod = PRODUCTS.find((p) => p.id === found.productId) || PRODUCTS[0];
    setProductState(prod);
    setColorId(found.colorId);
    setSize(found.size);
    setQuantity(found.quantity);
    setTechniqueId(found.techniqueId);
    setPrintedSides(found.printedSides || ['front']);
    setDesignCode(found.id);

    canvasJsonRef.current = {
      front: found.canvasJsonFront,
      back: found.canvasJsonBack
    };

    // Load into active fabric canvas if available
    if (fabricCanvasRef.current) {
      const targetJson = activeSide === 'front' ? found.canvasJsonFront : found.canvasJsonBack;
      if (targetJson && targetJson !== '') {
        try {
          const parsed = typeof targetJson === 'string' ? JSON.parse(targetJson) : targetJson;
          fabricCanvasRef.current.loadFromJSON(parsed).then((c) => {
            c.renderAll();
          }).catch((err) => {
            console.warn('Failed to load design JSON', err);
          });
        } catch (err) {
          console.warn('Failed to parse design JSON', err);
        }
      } else {
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.renderAll();
      }
    }

    showToast(`¡Diseño ${found.id} recuperado y cargado con éxito!`);
    return true;
  }, [activeSide, showToast]);

  // WhatsApp Quote Trigger
  const sendWhatsAppQuote = useCallback(() => {
    const sidesText = printedSides.map((s) => (s === 'front' ? 'Frente' : 'Espalda')).join(' + ');

    whatsappService.openWhatsApp({
      productName: product.name,
      colorName: activeColor.name,
      size: size,
      quantity: quantity,
      techniqueName: activeTechnique.name,
      printedSidesText: sidesText,
      totalPrice: priceBreakdown.totalPrice
    });
  }, [printedSides, product, activeColor, size, quantity, activeTechnique, priceBreakdown]);

  return {
    product,
    setProduct,
    colorId,
    setColorId,
    activeColor,
    size,
    setSize,
    quantity,
    setQuantity,
    techniqueId,
    setTechniqueId,
    activeTechnique,
    activeSide,
    switchSide,
    printedSides,
    setPrintedSides,
    fabricCanvasRef,
    canvasJsonRef,
    selectedObject,
    setSelectedObject,
    priceBreakdown,
    designCode,
    saveDesign,
    loadDesignByCode,
    sendWhatsAppQuote,
    statusMessage,
    showToast
  };
}
