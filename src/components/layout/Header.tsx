import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Palette, Grid, Users, Shirt, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';
import { SingularLogo } from '../common/SingularLogo';

export const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group transition-transform duration-200">
          <SingularLogo
            variant="full"
            height={36}
            textColor="#FFFFFF"
            animated={true}
            showSubtitle={true}
            className="group-hover:opacity-95"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/90 shadow-inner">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/')
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HomeIcon size={16} className={isActive('/') ? 'text-white' : 'text-orange-400'} />
            <span>Inicio</span>
          </Link>
          <Link
            to="/designer"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/designer')
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette size={16} className={isActive('/designer') ? 'text-white' : 'text-orange-400'} />
            <span>Personalizador</span>
          </Link>
          <Link
            to="/gallery"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/gallery')
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Grid size={16} className={isActive('/gallery') ? 'text-white' : 'text-amber-400'} />
            <span>Galería</span>
          </Link>
          <Link
            to="/about"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/about')
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users size={16} className={isActive('/about') ? 'text-white' : 'text-amber-400'} />
            <span>Nosotros</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/designer">
            <Button variant="primary" size="sm" icon={<Shirt size={16} />}>
              Crear Mi Diseño
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-colors"
          aria-label="Abrir menú"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-6 flex flex-col gap-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              isActive('/') ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HomeIcon size={18} className="text-orange-400" />
            <span>Inicio</span>
          </Link>
          <Link
            to="/designer"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              isActive('/designer') ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Palette size={18} className="text-orange-400" />
            <span>Personalizador</span>
          </Link>
          <Link
            to="/gallery"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              isActive('/gallery') ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Grid size={18} className="text-amber-400" />
            <span>Galería de Diseños</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              isActive('/about') ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users size={18} className="text-amber-400" />
            <span>Sobre Nosotros</span>
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link to="/designer" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full" icon={<Shirt size={18} />}>
                Crear Mi Diseño
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
