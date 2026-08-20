import type { SavedDesign } from '../types/order';

const STORAGE_KEY_DESIGNS = 'cami_saved_designs';
const STORAGE_KEY_DRAFT = 'cami_current_draft';
/** Contador persistente independiente del array de diseños — evita colisiones al borrar */
const STORAGE_KEY_COUNTER = 'cami_design_counter';
/** Máximo de diseños guardados; los más antiguos se descartan automáticamente */
const MAX_SAVED_DESIGNS = 50;

export const storageService = {
  generateDesignCode: (): string => {
    const year = new Date().getFullYear();
    const yearStr = String(year);

    let counter = 1;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COUNTER);
      if (stored) {
        const parsed = JSON.parse(stored) as { year: string; count: number };
        // Reiniciar al cambio de año; continuar incrementando dentro del mismo año
        counter = parsed.year === yearStr ? parsed.count + 1 : 1;
      }
      localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify({ year: yearStr, count: counter }));
    } catch (e) {
      // Fallback seguro: sufijo de timestamp para evitar colisión en caso de error
      counter = Date.now() % 99999;
    }

    const sequence = String(counter).padStart(5, '0');
    return `CAM-${year}-${sequence}`;
  },

  saveDesign: (design: SavedDesign): void => {
    try {
      const saved = storageService.getSavedDesigns();
      const existingIndex = saved.findIndex((d) => d.id === design.id);
      if (existingIndex >= 0) {
        saved[existingIndex] = design;
      } else {
        saved.unshift(design);
        // Truncar al límite máximo para evitar que localStorage se llene
        if (saved.length > MAX_SAVED_DESIGNS) {
          saved.splice(MAX_SAVED_DESIGNS);
        }
      }
      localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(saved));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled', e);
    }
  },

  getSavedDesigns: (): SavedDesign[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DESIGNS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getDesignByCode: (code: string): SavedDesign | undefined => {
    if (!code) return undefined;
    const normalizedCode = code.trim().toUpperCase();
    const saved = storageService.getSavedDesigns();
    return saved.find((d) => d.id.trim().toUpperCase() === normalizedCode);
  },

  deleteDesign: (code: string): void => {
    try {
      const normalizedCode = code.trim().toUpperCase();
      const saved = storageService.getSavedDesigns();
      const filtered = saved.filter((d) => d.id.trim().toUpperCase() !== normalizedCode);
      localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Error deleting design from storage', e);
    }
  },

  clearAllSavedDesigns: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY_DESIGNS);
    } catch (e) {
      console.warn('Error clearing designs storage', e);
    }
  },

  saveDraftState: (state: any): void => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(state));
    } catch (e) {
      // Ignore quota errors silently
    }
  },

  getDraftState: (): any | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DRAFT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
};
