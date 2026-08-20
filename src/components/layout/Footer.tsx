import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Code2 } from 'lucide-react';
import { SingularLogo } from '../common/SingularLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-28 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
        
        {/* Brand Column (Centered on Mobile) */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5 group transition-transform duration-200">
            <SingularLogo
              variant="full"
              height={34}
              textColor="#FFFFFF"
              animated={true}
              showSubtitle={true}
            />
          </Link>
          <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
            Plataforma premium en personalización y estampado textil. Diseña tus prendas en tiempo real con alta definición DTF, Vinilo Textil, Sublimación y cotización directa al instante.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-orange-400 hover:border-orange-500/50 hover:bg-slate-850 transition-all shadow-sm"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-orange-400 hover:border-orange-500/50 hover:bg-slate-850 transition-all shadow-sm"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-850 transition-all shadow-sm"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-4 sm:pt-0 border-t border-slate-900 sm:border-t-0">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span>Navegación</span>
          </h4>
          <ul className="flex flex-col items-center sm:items-start gap-2.5 text-xs">
            <li>
              <Link to="/" className="text-slate-400 hover:text-orange-400 transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/designer" className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1.5">
                <span>Personalizador en Vivo</span>
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.2 rounded border border-orange-500/30">PRO</span>
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-slate-400 hover:text-orange-400 transition-colors">
                Biblioteca de Diseños
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-slate-400 hover:text-orange-400 transition-colors">
                Técnicas &amp; Empresa
              </Link>
            </li>
          </ul>
        </div>

        {/* Printing Techniques */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-4 sm:pt-0 border-t border-slate-900 sm:border-t-0">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Técnicas de Impresión</span>
          </h4>
          <ul className="flex flex-col items-center sm:items-start gap-2.5 text-xs">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
              <span>DTF (Direct to Film HD)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Vinilo Textil Premium</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"></span>
              <span>Sublimación Digital Full Color</span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-4 sm:pt-0 border-t border-slate-900 sm:border-t-0">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Contacto &amp; Ventas</span>
          </h4>
          <ul className="flex flex-col items-center sm:items-start gap-3 text-xs">
            <li className="flex items-center justify-center sm:justify-start gap-2.5 text-slate-300">
              <MapPin size={16} className="text-orange-400 shrink-0" />
              <span>Zona Industrial Textil #102, Colombia</span>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2.5 text-slate-300">
              <Phone size={16} className="text-emerald-400 shrink-0" />
              <span>+57 (300) 000-0000</span>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2.5 text-slate-300">
              <Mail size={16} className="text-amber-400 shrink-0" />
              <span>cotizaciones@singular.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright de SINGULAR + Créditos de Maycol Sánchez Salazar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 flex-wrap">
          <span>© 2026 <strong>SINGULAR</strong>. Todos los derechos reservados.</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <p className="flex items-center gap-1.5 text-slate-400">
            <Code2 size={13} className="text-orange-400" />
            <span>Diseño &amp; Desarrollo Web por</span>
            <strong className="text-slate-200 font-semibold hover:text-orange-400 transition-colors">
              Maycol Sánchez Salazar
            </strong>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Garantía Textil</a>
        </div>
      </div>
    </footer>
  );
};
