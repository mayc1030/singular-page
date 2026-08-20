import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Palette, Grid, Users } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      aria-label="Navegación Móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex justify-around items-center shadow-2xl"
    >
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-semibold transition-all ${
          isActive('/')
            ? 'text-orange-400 bg-orange-500/10 shadow-sm border border-orange-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <HomeIcon size={19} className={isActive('/') ? 'stroke-[2.5]' : ''} />
        <span>Inicio</span>
      </Link>

      <Link
        to="/designer"
        className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-semibold transition-all relative ${
          isActive('/designer')
            ? 'text-white bg-gradient-to-r from-orange-600 to-amber-500 shadow-md shadow-orange-600/30'
            : 'text-orange-400 hover:text-orange-300'
        }`}
      >
        <div className="relative">
          <Palette size={19} className={isActive('/designer') ? 'stroke-[2.5]' : ''} />
          {!isActive('/designer') && (
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          )}
        </div>
        <span>Estudio</span>
      </Link>

      <Link
        to="/gallery"
        className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-semibold transition-all ${
          isActive('/gallery')
            ? 'text-orange-400 bg-orange-500/10 shadow-sm border border-orange-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Grid size={19} className={isActive('/gallery') ? 'stroke-[2.5]' : ''} />
        <span>Galería</span>
      </Link>

      <Link
        to="/about"
        className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-semibold transition-all ${
          isActive('/about')
            ? 'text-orange-400 bg-orange-500/10 shadow-sm border border-orange-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Users size={19} className={isActive('/about') ? 'stroke-[2.5]' : ''} />
        <span>Nosotros</span>
      </Link>
    </nav>
  );
};
