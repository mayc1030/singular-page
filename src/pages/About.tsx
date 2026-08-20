import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Award, Cpu, HeartHandshake } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PRINT_TECHNIQUES } from '../data/techniques';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-black text-white">Sobre SINGULAR</h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Somos especialistas en personalización y estampado textil de alto nivel. Combinamos herramientas interactivas de diseño en tiempo real con tecnología de punta como DTF digital HD, vinilo textil premium y sublimación.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
            <Cpu size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">Tecnología Interactiva</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nuestro editor visual corre 100% en tu navegador, permitiéndote previsualizar la camiseta con cambios de color y capas en tiempo real antes de enviar tu pedido.
          </p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
            <Award size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">Calidad Textil Garantizada</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Utilizamos prendas de algodón peinado de alto gramaje y tintas textiles certificadas que soportan decenas de lavados sin desgastarse.
          </p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <HeartHandshake size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">Atención Personalizada</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cada pedido es verificado por nuestro equipo técnico para asegurar que las proporciones y colores impresos coincidan perfectamente con tu diseño visual.
          </p>
        </div>
      </div>

      {/* Techniques Detail List */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold text-white text-center">Nuestras Técnicas de Estampado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRINT_TECHNIQUES.map((tech) => (
            <div key={tech.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-orange-400 mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tech.description}</p>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-800">
                Ideal para: <span className="text-slate-300">{tech.recommendedFor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-gradient-to-r from-orange-950/70 to-slate-900 border border-orange-500/30 rounded-3xl text-center flex flex-col items-center gap-4">
        <h3 className="text-2xl font-black text-white">¿Tienes un pedido corporativo o evento empresarial?</h3>
        <p className="text-xs text-orange-200 max-w-md">
          Ofrecemos descuentos por volumen de hasta el 35% y asesoría personalizada para tu marca o proyecto.
        </p>
        <Link to="/designer">
          <Button variant="primary" size="lg" icon={<Shirt size={20} />}>
            Crear mi Primer Diseño
          </Button>
        </Link>
      </div>
    </div>
  );
};
