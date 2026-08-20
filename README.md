# SINGULAR - Personalizador Online de Camisetas y Estampados 👕🎨

Aplicación web moderna y Single Page Application (SPA) desarrollada con **React 18**, **TypeScript**, **Vite**, **Fabric.js**, **Tailwind CSS** e iconos de **Lucide React**.

La plataforma permite a los usuarios seleccionar prendas (Camisetas, Polos, Hoodies, Buzos, Manga Larga), cambiar su color en tiempo real con sombras y arrugas realistas, aplicar o cargar diseños y textos interactivos en frente y espalda dentro de un área de impresión delimitada, calcular presupuestos escalonados con descuentos por volumen y exportar imágenes / fichas técnicas o solicitar pedidos y cotizaciones directas por WhatsApp.

---

## 🚀 Características Principales

- **Editor Canvas Visual Interactivo (Fabric.js)**:
  - Mover, escalar, rotar, duplicar y eliminar objetos.
  - Gestión de orden de capas (traer al frente, enviar atrás, bloquear, ocultar).
  - Herramientas de texto completo con fuentes de Google Fonts, colores, negrita, cursiva, alineación y espaciado.
  - Carga de imágenes propias en formatos `PNG`, `JPG`, `SVG` y `WEBP` con soporte de transparencias y validación de tamaño.
- **Mockups Realistas con Cambio de Color Dinámico**:
  - Ajuste dinámico de color conservando pliegues, sombras y costuras de la prenda.
  - Alternancia fluida entre vista **FRENTE** y **ESPALDA** conservando objetos independientes.
- **Cotizador de Precios Dinámico**:
  - Cálculo instantáneo según prenda base, recargo de color, técnica de estampado (DTF, Vinilo Textil, Sublimación) y zonas impresas.
  - Escala de descuentos por volumen.
- **Exportación & Ficha Técnica**:
  - Descarga del mockup en formato `PNG` de alta resolución.
  - Generador de **Ficha Técnica en Imagen (PNG)** con código de diseño único, especificaciones de la prenda, cotización y vista previa.
  - Generación de código único de diseño (ej. `CAM-2026-00001`) persistido en `localStorage` y recuperable mediante buscador e historial.
- **Integración con WhatsApp & Web Share API**:
  - Generación automática del mensaje estructurado para pedidos y cotización.
  - Integración nativa con Web Share API para compartir el diseño.
- **Despliegue GitHub Pages Integrado**:
  - Configurado con `HashRouter` para evitar errores 404 en navegaciones directas.
  - Workflow automatizado en `.github/workflows/deploy.yml`.

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── catalog/         # ProductCard, ProductGrid, ProductSelector, ColorSelector, SizeSelector
│   ├── common/          # Button, Modal, Tabs, Select, ColorPicker, Slider, Tooltip, Toast, Dialog, FloatingHelpButton, ScrollToTop
│   ├── designer/        # ShirtCanvas, DesignerToolbar, DesignLibrary, DesignUploader, TextEditor, LayerPanel, TransformControls, PrintArea, FrontBackToggle, DesignerSidebar, DesignerMobileToolbar, WhatsAppQuoteModal, HelpGuideModal, SavedDesignsModal
│   ├── gallery/         # GalleryGrid, GalleryCard, GalleryFilters
│   ├── layout/          # Header, Footer, MobileNavigation
│   └── order/           # OrderSummary, QuantitySelector, PriceCalculator, QuoteRequest, TechniqueSelector
├── data/                # products.ts, colors.ts, designs.ts, techniques.ts, fonts.ts, prices.ts
├── hooks/               # useDesigner.ts, useDesignerExport.ts, useLocalStorage.ts, usePriceCalculator.ts
├── pages/               # Home.tsx, Designer.tsx, Gallery.tsx, About.tsx
├── services/            # productService.ts, designService.ts, storageService.ts, whatsappService.ts, exportService.ts
├── styles/              # main.css, design-tokens.css
├── types/               # product.ts, design.ts, order.ts, editor.ts
└── utils/               # imageUtils.ts, priceUtils.ts, validation.ts
```

---

## 🛠️ Instalación y Desarrollo Local

### 1. Clonar el repositorio:
```bash
git clone git@github.com:mayc1030/singular-page.git
cd singular-page
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Configurar variables de entorno:
Crea un archivo `.env` en la raíz (puedes tomar como base `.env.example`):
```env
VITE_WHATSAPP_NUMBER=573000000000
```

### 4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### 5. Compilar para producción:
```bash
npm run build
```

---

## 📄 Licencia

Desarrollado bajo licencia MIT. Listo para uso comercial y personalización libre.
