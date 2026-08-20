import React, { useState, useEffect } from 'react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Aparece cuando el usuario ha hecho scroll hacia abajo más de 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Comprobación inicial

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleScrollToTop}
      aria-label="Volver al inicio de la página"
      title="Subir al inicio"
      className="fixed z-40 right-4 md:right-6 bottom-36 md:bottom-24 group transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in focus:outline-none select-none cursor-pointer"
    >
      {/* Camiseta SVG Flotante */}
      <div className="relative flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(234,88,12,0.45)] group-hover:drop-shadow-[0_12px_28px_rgba(249,115,22,0.65)] transition-all duration-300">
        <svg
          viewBox="0 0 48 48"
          className="w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:-translate-y-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente principal de la camiseta */}
            <linearGradient id="shirtFloatingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Brillo especular superior */}
            <linearGradient id="shirtHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Silueta de Camiseta */}
          <path
            d="M 17 8 C 20 12, 28 12, 31 8 L 43 14 L 38 22 L 33 19 L 33 40 C 29 41.5, 19 41.5, 15 40 L 15 19 L 10 22 L 5 14 Z"
            fill="url(#shirtFloatingGrad)"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Brillo en hombros y pecho superior */}
          <path
            d="M 17 8.5 C 20 12, 28 12, 31 8.5 L 42 14.2 L 37.5 21 L 33 19 L 33 28 C 28 29, 20 29, 15 28 L 15 19 L 10.5 21 L 6 14.2 Z"
            fill="url(#shirtHighlightGrad)"
            opacity="0.6"
          />

          {/* Cuello / Ribete de la Camiseta */}
          <path
            d="M 17 8 C 20 12.5, 28 12.5, 31 8"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Costuras de mangas */}
          <path
            d="M 33 19 L 36.5 11"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M 15 19 L 11.5 11"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Flecha 'UP' en el pecho con micro-animación en hover */}
          <g className="transition-transform duration-300 group-hover:-translate-y-0.5">
            {/* Sombra de flecha */}
            <path
              d="M 24 17.5 L 18 23.5 L 21.5 23.5 L 21.5 32 L 26.5 32 L 26.5 23.5 L 30 23.5 Z"
              fill="rgba(0, 0, 0, 0.25)"
            />
            {/* Flecha blanca nítida */}
            <path
              d="M 24 16.5 L 18 22.5 L 21.5 22.5 L 21.5 31 L 26.5 31 L 26.5 22.5 L 30 22.5 Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>

        {/* Badge 'TOP' flotante sutil */}
        <span className="absolute -bottom-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-orange-500/50 text-[9px] font-black tracking-wider text-orange-300 uppercase shadow-md pointer-events-none transition-transform duration-300 group-hover:scale-105">
          TOP
        </span>
      </div>
    </button>
  );
};
