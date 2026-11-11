import React from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import { 
  Lightbulb, 
  Printer, 
  Megaphone, 
  Layers, 
  Sparkles, 
  Users, 
  Clock, 
  CheckCircle
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { business } = useWebsite();

  const points = [
    {
      icon: Lightbulb,
      title: 'Creative Solutions',
      description: 'Custom visual ideation that aligns specifically with your market and customer profile, ensuring your message stands out instantly.',
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      icon: Printer,
      title: 'Professional Printing',
      description: 'Industrial flex machinery, sharp offset presses, and precision eco-solvent printers delivering vibrant color fastness that withstands sun and rain.',
      gradient: 'from-fuchsia-600 to-pink-600',
    },
    {
      icon: Megaphone,
      title: 'Advertising Services',
      description: 'Strategic placement of pole banners, auto transit stickers, no-parking boards, and city-wide marketing campaigns across Guntur.',
      gradient: 'from-purple-600 to-indigo-600',
    },
    {
      icon: Layers,
      title: 'Branding Solutions',
      description: 'From 3D luminous LED letters to precision laser-cut acrylic boards, we build enduring storefront identities that command respect.',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Sparkles,
      title: 'Multiple Product Options',
      description: 'Complete range of specialized services under one roof — standees, visiting cards, apparel printing, demo tents, and signage with no third-party runarounds.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Users,
      title: 'Customer-Focused Approach',
      description: `Direct communication with ${business.proprietorRole || 'Managing Director'} ${business.proprietor}. Transparent specifications, timely execution, and dedicated support.`,
      gradient: 'from-rose-500 to-red-600',
    },
  ];

  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-[#06040d]">
      {/* Background Decor */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>The Aura Creations Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Montserrat',sans-serif] tracking-tight">
            Why Businesses in Guntur <span className="brand-gradient-text">Trust Us</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            We bridge the gap between creative graphic design and physical production reality with dependable quality and honest turnaround.
          </p>
        </div>

        {/* 6 Core Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden group border border-white/10 hover:border-amber-400/40"
              >
                {/* Accent Corner Glow */}
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${pt.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`} />

                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pt.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-white/10 font-mono">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-['Montserrat',sans-serif] mb-2 group-hover:text-amber-300 transition-colors">
                  {pt.title}
                </h3>

                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  {pt.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Highlight Banner */}
        <div className="mt-16 glass-panel p-6 sm:p-8 rounded-2xl border border-fuchsia-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-950/80 border border-fuchsia-500/40 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white font-['Montserrat',sans-serif]">
                Tight Launch or Exhibition Deadline?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Direct in-house flex printing & rollup standee dispatch with rush order support in Guntur.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="brand-btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide shrink-0"
          >
            Request Instant Consultation
          </a>
        </div>
      </div>
    </section>
  );
};
