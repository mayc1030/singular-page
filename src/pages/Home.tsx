import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, Palette, ImagePlus, ArrowRight, ShieldCheck, Truck, Layers, MessageSquareQuote, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PRODUCTS } from '../data/products';
import { DESIGNS } from '../data/designs';
import { PRINT_TECHNIQUES } from '../data/techniques';
import { ProductCard } from '../components/catalog/ProductCard';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { getAssetUrl } from '../utils/imageUtils';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const productSliderRef = useRef<HTMLDivElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [desktopProductIndex, setDesktopProductIndex] = useState(0);
  const [isProductPaused, setIsProductPaused] = useState(false);
  const maxDesktopIndex = Math.max(0, PRODUCTS.length - 3);

  const featuredProducts = PRODUCTS;
  const popularDesigns = DESIGNS.slice(0, 8); // Top 8 diseños populares para el carrusel

  const designSliderRef = useRef<HTMLDivElement>(null);
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const [desktopDesignIndex, setDesktopDesignIndex] = useState(0);
  const [isDesignPaused, setIsDesignPaused] = useState(false);
  const maxDesktopDesignIndex = Math.max(0, popularDesigns.length - 3);

  // ── Estado y Rotación Automática Crossfade Elegante para 'Vista Previa en Vivo' (Hero) ──
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused) return undefined;

    const timer = setInterval(() => {
      setHeroProductIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 5800);

    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const handleSelectProduct = (productId: string) => {
    navigate(`/designer?product=${productId}`);
  };

  const handleUseDesign = (designId: string) => {
    navigate(`/designer?design=${designId}`);
  };

  const handlePrevDesktop = () => {
    setDesktopProductIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextDesktop = () => {
    setDesktopProductIndex((prev) => Math.min(maxDesktopIndex, prev + 1));
  };

  const handleProductScroll = () => {
    if (!productSliderRef.current) return;
    const container = productSliderRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveProductIndex(Math.min(Math.max(0, newIndex), PRODUCTS.length - 1));
  };

  const scrollToProduct = (index: number) => {
    if (!productSliderRef.current) return;
    const container = productSliderRef.current;
    const targetCard = container.children[index] as HTMLElement;
    if (targetCard) {
      const scrollLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setActiveProductIndex(index);
    }
  };

  const handlePrevProduct = () => {
    const nextIndex = Math.max(0, activeProductIndex - 1);
    scrollToProduct(nextIndex);
  };

  const handleNextProduct = () => {
    const nextIndex = Math.min(PRODUCTS.length - 1, activeProductIndex + 1);
    scrollToProduct(nextIndex);
  };

  // ── Handlers de carrusel para Diseños Populares ──

  const handlePrevDesktopDesign = () => {
    setDesktopDesignIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextDesktopDesign = () => {
    setDesktopDesignIndex((prev) => Math.min(maxDesktopDesignIndex, prev + 1));
  };

  const handleDesignScroll = () => {
    if (!designSliderRef.current) return;
    const container = designSliderRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveDesignIndex(Math.min(Math.max(0, newIndex), popularDesigns.length - 1));
  };

  const scrollToDesign = (index: number) => {
    if (!designSliderRef.current) return;
    const container = designSliderRef.current;
    const targetCard = container.children[index] as HTMLElement;
    if (targetCard) {
      const scrollLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setActiveDesignIndex(index);
    }
  };

  const handlePrevDesign = () => {
    const nextIndex = Math.max(0, activeDesignIndex - 1);
    scrollToDesign(nextIndex);
  };

  const handleNextDesign = () => {
    const nextIndex = Math.min(popularDesigns.length - 1, activeDesignIndex + 1);
    scrollToDesign(nextIndex);
  };

  // ── Autoplay para Prendas Disponibles (Escritorio y Móvil) ──
  useEffect(() => {
    if (isProductPaused) return undefined;

    const timer = setInterval(() => {
      // Autoplay en escritorio
      setDesktopProductIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));

      // Autoplay en móvil (scroll horizontal exclusivo en el contenedor)
      setActiveProductIndex((prev) => {
        const next = (prev + 1) % PRODUCTS.length;
        if (productSliderRef.current) {
          const container = productSliderRef.current;
          const targetCard = container.children[next] as HTMLElement;
          if (targetCard) {
            const scrollLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [isProductPaused, maxDesktopIndex]);

  // ── Autoplay para Diseños Populares (Escritorio y Móvil) ──
  useEffect(() => {
    if (isDesignPaused) return undefined;

    const timer = setInterval(() => {
      // Autoplay en escritorio
      setDesktopDesignIndex((prev) => (prev >= maxDesktopDesignIndex ? 0 : prev + 1));

      // Autoplay en móvil (scroll horizontal exclusivo en el contenedor)
      setActiveDesignIndex((prev) => {
        const next = (prev + 1) % popularDesigns.length;
        if (designSliderRef.current) {
          const container = designSliderRef.current;
          const targetCard = container.children[next] as HTMLElement;
          if (targetCard) {
            const scrollLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [isDesignPaused, maxDesktopDesignIndex, popularDesigns.length]);

  // ── Handlers y Estado para el Slider de Técnicas de Impresión en Móviles ──
  const techniqueSliderRef = useRef<HTMLDivElement>(null);
  const [activeTechniqueIndex, setActiveTechniqueIndex] = useState(0);
  const [isTechniquePaused, setIsTechniquePaused] = useState(false);

  const handleTechniqueScroll = () => {
    if (!techniqueSliderRef.current) return;
    const container = techniqueSliderRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveTechniqueIndex(Math.min(Math.max(0, newIndex), PRINT_TECHNIQUES.length - 1));
  };

  const scrollToTechnique = (index: number) => {
    if (!techniqueSliderRef.current) return;
    const container = techniqueSliderRef.current;
    const targetCard = container.children[index] as HTMLElement;
    if (targetCard) {
      const scrollLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setActiveTechniqueIndex(index);
    }
  };

  const handlePrevTechnique = () => {
    const nextIndex = Math.max(0, activeTechniqueIndex - 1);
    scrollToTechnique(nextIndex);
  };

  const handleNextTechnique = () => {
    const nextIndex = Math.min(PRINT_TECHNIQUES.length - 1, activeTechniqueIndex + 1);
    scrollToTechnique(nextIndex);
  };

  // Autoplay para Técnicas en Móvil (sin saltos verticales)
  useEffect(() => {
    if (isTechniquePaused) return undefined;

    const timer = setInterval(() => {
      setActiveTechniqueIndex((prev) => {
        const next = (prev + 1) % PRINT_TECHNIQUES.length;
        if (techniqueSliderRef.current) {
          const container = techniqueSliderRef.current;
          const targetCard = container.children[next] as HTMLElement;
          if (targetCard) {
            const scrollLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isTechniquePaused]);

  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold w-fit">
              <Palette size={14} className="text-orange-400" />
              <span>Estampado Digital DTF &amp; Vinilo Textil HD</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              PERSONALIZACIÓN <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
                SINGULAR
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Crea tu diseño exclusivo en tiempo real sobre prendas de alta calidad. Agrega textos, gráficos o tu propio logo y recibe tu cotización por WhatsApp al instante.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <Link to="/designer" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={<Shirt size={20} className="stroke-[2.5]" />}>
                  Crear mi diseño
                </Button>
              </Link>
              <Link to="/gallery" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" icon={<ArrowRight size={18} />}>
                  Ver catálogo de diseños
                </Button>
              </Link>
            </div>

            {/* Quick stats badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-slate-800/80 w-full text-center lg:text-left">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold text-white">+10.000</span>
                <span className="text-[11px] sm:text-xs text-slate-400">Prendas listas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base lg:text-lg font-black text-orange-400 leading-tight">
                  DTF · Vinil · Sublimado
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400">Técnicas HD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold text-amber-400">-35% OFF</span>
                <span className="text-[11px] sm:text-xs text-slate-400">Por mayor</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Showcase Card con Fade Automático entre Siluetas */}
          <div
            className="relative flex justify-center items-center"
            onMouseEnter={() => setIsHeroPaused(true)}
            onMouseLeave={() => setIsHeroPaused(false)}
            onTouchStart={() => setIsHeroPaused(true)}
            onTouchEnd={() => setIsHeroPaused(false)}
          >
            <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl animate-pulse-glow">
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-30">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>VISTA PREVIA EN VIVO</span>
              </div>

              {/* Contenedor del Mockup con True Crossfade Ultra Suave y Elegante */}
              <div className="w-full aspect-[4/4.5] bg-slate-950 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden group">
                {PRODUCTS.map((p, idx) => {
                  const isCurrent = heroProductIndex === idx;
                  const design = DESIGNS[idx % DESIGNS.length];
                  return (
                    <div
                      key={p.id}
                      className={`absolute inset-0 p-4 flex items-center justify-center transition-all duration-[1200ms] ease-in-out ${
                        isCurrent
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-[0.97] z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={getAssetUrl(p.mockups.front)}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Estampado de muestra sobre la silueta */}
                      <div className="absolute z-20 top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none opacity-95 transition-transform duration-700 group-hover:scale-105">
                        <img
                          src={design.imageUrl}
                          alt="Diseño personalizado"
                          className="w-full h-full object-contain filter drop-shadow-md"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Badge de silueta actual */}
                <div className="absolute bottom-3 left-3 z-30 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-[11px] font-bold text-orange-300 shadow-md transition-all duration-500">
                  {PRODUCTS[heroProductIndex].category.toUpperCase()} · 100% PERSONALIZABLE
                </div>
              </div>

              {/* Footer de la tarjeta con nombre y botón de acción amigable y persuasivo */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[46px]">
                <div className="transition-all duration-700">
                  <h4 className="font-bold text-sm text-white">{PRODUCTS[heroProductIndex].name}</h4>
                  <span className="text-xs text-slate-400">
                    Estampado DTF Full Color HD · {PRODUCTS[heroProductIndex].availableColors.length} Colores
                  </span>
                </div>
                <Link to={`/designer?product=${PRODUCTS[heroProductIndex].id}`} className="w-full sm:w-auto shrink-0">
                  <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-orange-400/30">
                    <Palette size={13} className="text-amber-200 transition-transform duration-300 group-hover:rotate-12" />
                    <span>¡Personalizar ahora!</span>
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </Link>
              </div>

              {/* Dots interactivos para cambiar silueta manualmente */}
              <div className="flex items-center justify-center gap-1.5 pt-3 mt-3 border-t border-slate-800/80">
                {PRODUCTS.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setHeroProductIndex(idx)}
                    className={`transition-all duration-500 ${
                      heroProductIndex === idx
                        ? 'w-6 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm shadow-orange-500/30'
                        : 'w-2 h-2 bg-slate-800 hover:bg-slate-700 rounded-full'
                    }`}
                    aria-label={`Ver silueta ${p.name}`}
                    title={p.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos / Prendas Disponibles */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        onMouseEnter={() => setIsProductPaused(true)}
        onMouseLeave={() => setIsProductPaused(false)}
        onTouchStart={() => setIsProductPaused(true)}
        onTouchEnd={() => setIsProductPaused(false)}
      >
        {/* Header de Sección */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 sm:mb-8 gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
              <Shirt size={13} />
              <span>Siluetas 100% Personalizables</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Prendas Disponibles</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              Selecciona una silueta para iniciar tu personalización visual en tiempo real.
            </p>
          </div>

          {/* Controles de Navegación (Móvil & Desktop) */}
          <div className="flex items-center gap-3">
            {/* Controles de carrusel en Móvil */}
            <div className="flex md:hidden items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={handlePrevProduct}
                disabled={activeProductIndex === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Prenda anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[11px] font-mono font-bold text-orange-400 px-2">
                {activeProductIndex + 1} / {PRODUCTS.length}
              </span>
              <button
                onClick={handleNextProduct}
                disabled={activeProductIndex === PRODUCTS.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Prenda siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Controles de carrusel en Desktop (desliza de a 3) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-sm">
                <button
                  onClick={handlePrevDesktop}
                  disabled={desktopProductIndex === 0}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Ver prendas anteriores"
                  title="Anteriores"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-mono font-bold text-orange-400 px-2.5">
                  {desktopProductIndex + 1} - {desktopProductIndex + 3} de {PRODUCTS.length}
                </span>
                <button
                  onClick={handleNextDesktop}
                  disabled={desktopProductIndex === maxDesktopIndex}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Ver prendas siguientes"
                  title="Siguientes"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <Link to="/designer">
                <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />}>
                  Ver todas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Vista Móvil: Slider / Carrusel Táctil Individual con Scroll Snap ── */}
        <div className="md:hidden flex flex-col gap-3">
          <div
            ref={productSliderRef}
            onScroll={handleProductScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-3 px-1 -mx-4 px-4 overscroll-x-contain"
          >
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="snap-center shrink-0 w-[84vw] max-w-[310px]"
              >
                <ProductCard product={p} onSelect={handleSelectProduct} />
              </div>
            ))}
          </div>

          {/* Dots Indicadores Móvil */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {PRODUCTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => scrollToProduct(idx)}
                className={`transition-all duration-300 ${
                  activeProductIndex === idx
                    ? 'w-6 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full'
                    : 'w-2 h-2 bg-slate-800 hover:bg-slate-700 rounded-full'
                }`}
                aria-label={`Ir a prenda ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Vista Desktop: Slider Mostrando de a 3 Prendas a la vez (md+) ── */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="overflow-hidden w-full py-1 -mx-3 px-3">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${desktopProductIndex * 33.333333}%)`
              }}
            >
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="w-1/3 shrink-0 px-3"
                >
                  <ProductCard product={p} onSelect={handleSelectProduct} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicadores Desktop */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: maxDesktopIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setDesktopProductIndex(idx)}
                className={`transition-all duration-300 ${
                  desktopProductIndex === idx
                    ? 'w-8 h-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm shadow-orange-500/30'
                    : 'w-2.5 h-2.5 bg-slate-800 hover:bg-slate-700 rounded-full'
                }`}
                aria-label={`Ver grupo de prendas ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="bg-slate-900/60 border-y border-slate-800/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ¿Cómo Funciona el Personalizador SINGULAR?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-12">
            En 4 sencillos pasos puedes tener tu prenda personalizada y cotizada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative">
              <span className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-extrabold text-lg mb-4">
                1
              </span>
              <h3 className="font-bold text-base text-white mb-2">Elige Prenda y Color</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selecciona entre camisetas, hoodies, buzos o polos en una amplia gama de colores.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative">
              <span className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-extrabold text-lg mb-4">
                2
              </span>
              <h3 className="font-bold text-base text-white mb-2">Sube o Agrega Diseños</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Añade textos con tipografías exclusivas o sube tu logo/imagen PNG en alta calidad.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative">
              <span className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center font-extrabold text-lg mb-4">
                3
              </span>
              <h3 className="font-bold text-base text-white mb-2">Ajusta Frente y Espalda</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escala, rota y posiciona con precisión dentro del área de estampado.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative">
              <span className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg mb-4">
                4
              </span>
              <h3 className="font-bold text-base text-white mb-2">Haz tu Pedido por WhatsApp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Obtén tu precio total en vivo y envía tu pedido con 1 solo clic para iniciar producción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diseños Populares / Destacados */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        onMouseEnter={() => setIsDesignPaused(true)}
        onMouseLeave={() => setIsDesignPaused(false)}
        onTouchStart={() => setIsDesignPaused(true)}
        onTouchEnd={() => setIsDesignPaused(false)}
      >
        {/* Header de Sección */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 sm:mb-8 gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <ImagePlus size={13} />
              <span>Estampados Vectoriales HD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Diseños Populares</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              Explora ilustraciones y frases prediseñadas listas para estampar en tu prenda.
            </p>
          </div>

          {/* Controles de Navegación (Móvil & Desktop) */}
          <div className="flex items-center gap-3">
            {/* Controles en Móvil */}
            <div className="flex md:hidden items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={handlePrevDesign}
                disabled={activeDesignIndex === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Diseño anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[11px] font-mono font-bold text-amber-400 px-2">
                {activeDesignIndex + 1} / {popularDesigns.length}
              </span>
              <button
                onClick={handleNextDesign}
                disabled={activeDesignIndex === popularDesigns.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Diseño siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Controles en Desktop (desliza de a 3) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-sm">
                <button
                  onClick={handlePrevDesktopDesign}
                  disabled={desktopDesignIndex === 0}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Ver diseños anteriores"
                  title="Anteriores"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-mono font-bold text-amber-400 px-2.5">
                  {desktopDesignIndex + 1} - {desktopDesignIndex + 3} de {popularDesigns.length}
                </span>
                <button
                  onClick={handleNextDesktopDesign}
                  disabled={desktopDesignIndex === maxDesktopDesignIndex}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Ver diseños siguientes"
                  title="Siguientes"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <Link to="/gallery">
                <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />}>
                  Ver todos en Galería
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Vista Móvil: Slider / Carrusel Táctil Individual con Scroll Snap ── */}
        <div className="md:hidden flex flex-col gap-3">
          <div
            ref={designSliderRef}
            onScroll={handleDesignScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-3 px-1 -mx-4 px-4 overscroll-x-contain"
          >
            {popularDesigns.map((d) => (
              <div
                key={d.id}
                className="snap-center shrink-0 w-[84vw] max-w-[300px]"
              >
                <GalleryCard design={d} onUseDesign={handleUseDesign} />
              </div>
            ))}
          </div>

          {/* Dots Indicadores Móvil */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {popularDesigns.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => scrollToDesign(idx)}
                className={`transition-all duration-300 ${
                  activeDesignIndex === idx
                    ? 'w-6 h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full'
                    : 'w-2 h-2 bg-slate-800 hover:bg-slate-700 rounded-full'
                }`}
                aria-label={`Ir a diseño ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Vista Desktop: Slider Mostrando de a 3 Diseños a la vez (md+) ── */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="overflow-hidden w-full py-1 -mx-3 px-3">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${desktopDesignIndex * 33.333333}%)`
              }}
            >
              {popularDesigns.map((d) => (
                <div
                  key={d.id}
                  className="w-1/3 shrink-0 px-3"
                >
                  <GalleryCard design={d} onUseDesign={handleUseDesign} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicadores Desktop */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: maxDesktopDesignIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setDesktopDesignIndex(idx)}
                className={`transition-all duration-300 ${
                  desktopDesignIndex === idx
                    ? 'w-8 h-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-sm shadow-amber-500/30'
                    : 'w-2.5 h-2.5 bg-slate-800 hover:bg-slate-700 rounded-full'
                }`}
                aria-label={`Ver grupo de diseños ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Técnicas de Impresión */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        onMouseEnter={() => setIsTechniquePaused(true)}
        onMouseLeave={() => setIsTechniquePaused(false)}
        onTouchStart={() => setIsTechniquePaused(true)}
        onTouchEnd={() => setIsTechniquePaused(false)}
      >
        {/* Header de Sección */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 sm:mb-10 gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
              <Zap size={13} />
              <span>Tecnología Textil de Alta Definición</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Técnicas de Impresión</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Contamos con la tecnología textil adecuada para cada tipo de proyecto y acabado.
            </p>
          </div>

          {/* Controles en Móvil */}
          <div className="flex md:hidden items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={handlePrevTechnique}
              disabled={activeTechniqueIndex === 0}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Técnica anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[11px] font-mono font-bold text-orange-400 px-2">
              {activeTechniqueIndex + 1} / {PRINT_TECHNIQUES.length}
            </span>
            <button
              onClick={handleNextTechnique}
              disabled={activeTechniqueIndex === PRINT_TECHNIQUES.length - 1}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Técnica siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Vista Móvil: Slider / Carrusel Táctil con Scroll Snap ── */}
        <div className="md:hidden flex flex-col gap-3">
          <div
            ref={techniqueSliderRef}
            onScroll={handleTechniqueScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-3 px-1 -mx-4 px-4 overscroll-x-contain"
          >
            {PRINT_TECHNIQUES.slice(0, 3).map((tech) => (
              <div
                key={tech.id}
                className="snap-center shrink-0 w-[84vw] max-w-[320px] p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-3 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <h3 className="font-bold text-lg text-white">{tech.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">{tech.description}</p>
                <span className="text-xs font-semibold text-orange-300 pt-3 border-t border-slate-800/80">
                  Recomendado para: {tech.recommendedFor}
                </span>
              </div>
            ))}
          </div>

          {/* Dots Indicadores Móvil */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {PRINT_TECHNIQUES.slice(0, 3).map((tech, idx) => (
              <button
                key={tech.id}
                onClick={() => scrollToTechnique(idx)}
                className={`transition-all duration-300 ${
                  activeTechniqueIndex === idx
                    ? 'w-6 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full'
                    : 'w-2 h-2 bg-slate-800 hover:bg-slate-700 rounded-full'
                }`}
                aria-label={`Ir a técnica ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Vista Desktop: Grid Responsive (md+) ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {PRINT_TECHNIQUES.slice(0, 3).map((tech) => (
            <div key={tech.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-3 hover:border-orange-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg text-white">{tech.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tech.description}</p>
              <span className="text-xs font-semibold text-orange-300 pt-2 border-t border-slate-800/80">
                Recomendado para: {tech.recommendedFor}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Ventajas */}
      <section className="bg-slate-900/40 border-y border-slate-800/60 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <ShieldCheck size={36} className="text-orange-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Garantía de Calidad</h4>
              <p className="text-xs text-slate-400">Tintas lavables que no se agrietan.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <Truck size={36} className="text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Envíos Nacionales</h4>
              <p className="text-xs text-slate-400">Entrega rápida a todo el país.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <Layers size={36} className="text-orange-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Precios Mayoristas</h4>
              <p className="text-xs text-slate-400">Descuentos desde 5 unidades.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <MessageSquareQuote size={36} className="text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Atención WhatsApp</h4>
              <p className="text-xs text-slate-400">Respuesta rápida a cotizaciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <h2 className="text-2xl font-extrabold text-white mb-6">Preguntas Frecuentes</h2>
        <div className="flex flex-col gap-4 text-left">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <h4 className="font-bold text-sm text-white mb-1">¿Cuál es la cantidad mínima de compra?</h4>
            <p className="text-xs text-slate-400">¡Desde 1 sola unidad! Sin embargo, aplicamos descuentos escalonados a partir de 5 unidades.</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <h4 className="font-bold text-sm text-white mb-1">¿Qué resolución debe tener mi logo o imagen cargada?</h4>
            <p className="text-xs text-slate-400">Recomendamos imágenes PNG o SVG en alta resolución (al menos 300 DPI o 1500px) con fondo transparente para un resultado óptimo.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-950/70 via-slate-900 to-slate-950 p-8 sm:p-12 border border-orange-500/30 overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3 text-left">
            <h3 className="text-3xl font-black text-white">¿Listo para crear tu prenda en SINGULAR?</h3>
            <p className="text-sm text-orange-200 max-w-lg">
              Prueba el editor visual ahora mismo. Es gratis, no requiere registro previo y obtienes tu presupuesto en segundos.
            </p>
          </div>
          <Link to="/designer">
            <Button variant="whatsapp" size="lg" icon={<Shirt size={22} className="stroke-[2.5]" />}>
              Comenzar a Diseñar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
