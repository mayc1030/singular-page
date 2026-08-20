/**
 * Canvas dimension constants.
 * Centraliza todas las dimensiones del canvas de diseño para evitar magic numbers dispersos.
 * Si se necesita cambiar el tamaño del canvas, modificar solo este archivo.
 */

/** Ancho base del canvas Fabric.js en píxeles */
export const CANVAS_WIDTH = 500;

/** Alto base del canvas Fabric.js en píxeles */
export const CANVAS_HEIGHT = 550;

/** Coordenada X del centro geométrico del canvas */
export const CANVAS_CENTER_X = CANVAS_WIDTH / 2; // 250

/** Tamaño máximo (px) al que se escala una imagen recién añadida al canvas */
export const DEFAULT_IMAGE_MAX_SIZE = 180;

// ── Rangos de arrastre (con margen de seguridad desde los bordes) ─────────────

/** Límite mínimo de arrastre en eje X (margen izquierdo) */
export const CANVAS_DRAG_MIN_X = 60;

/** Límite máximo de arrastre en eje X (margen derecho) */
export const CANVAS_DRAG_MAX_X = 440;

/** Límite mínimo de arrastre en eje Y (margen superior) */
export const CANVAS_DRAG_MIN_Y = 90;

/** Límite máximo de arrastre en eje Y (margen inferior) */
export const CANVAS_DRAG_MAX_Y = 460;

// ── Posiciones preset de estampado ────────────────────────────────────────────

/** X del preset "Pecho Izquierdo" */
export const PRESET_CHEST_LEFT_X = 190;

/** Y del preset "Pecho Izquierdo" */
export const PRESET_CHEST_LEFT_Y = 195;

/** Y del preset "Pecho Centrado" (X usa CANVAS_CENTER_X) */
export const PRESET_CHEST_CENTER_Y = 230;
