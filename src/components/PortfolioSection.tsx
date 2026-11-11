import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import { Sparkles, X, ChevronLeft, ChevronRight, MessageCircle, Maximize2, Tag } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { portfolio, business } = useWebsite();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'LED & Sign Boards',
    'Printing',
    'Branding',
    'Promotional Products',
    'Outdoor Advertising',
  ];

  const filteredItems = portfolio.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const handleNextLightbox = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
  };

  const handlePrevLightbox = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const currentItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-[#070511] border-t border-purple-950/40">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-900/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-fuchsia-900/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Actual Execution Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Montserrat',sans-serif] tracking-tight">
            Our Work in <span className="brand-gradient-text">Action</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            Real signage installations, printing productions, and branded promotional collateral executed for businesses and institutions across Guntur.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-950/50'
                  : 'glass-panel text-slate-300 hover:text-white hover:border-amber-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-amber-400/40 cursor-pointer shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-amber-300">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom Preview Icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
                    {item.client && (
                      <span className="text-[11px] font-mono text-fuchsia-400 tracking-wider uppercase mb-1">
                        {item.client}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white font-['Montserrat',sans-serif] group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300 line-clamp-2 font-light">
                      {item.description}
                    </p>

                    {/* Tag Pills */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setActiveLightboxIndex(null)}
          >
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#100a20] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/30">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold">
                    {currentItem.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({activeLightboxIndex! + 1} of {filteredItems.length})
                  </span>
                </div>

                <button
                  onClick={() => setActiveLightboxIndex(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close modal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="relative bg-black flex items-center justify-center min-h-[320px] max-h-[55vh] overflow-hidden">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="max-h-[55vh] w-auto object-contain mx-auto"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-colors cursor-pointer"
                    title="Previous project"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-colors cursor-pointer"
                    title="Next project"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Footer */}
                <div className="p-6 bg-[#0c0819] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      {currentItem.client && (
                        <p className="text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
                          Client / Location: {currentItem.client}
                        </p>
                      )}
                      <h3 className="text-2xl font-bold text-white font-['Montserrat',sans-serif]">
                        {currentItem.title}
                      </h3>
                    </div>

                    <a
                      href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations!%20I%20saw%20your%20portfolio%20project:%20*${encodeURIComponent(currentItem.title)}*%20and%20would%20like%20similar%20work.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brand-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                      <span>Inquire About Similar Work</span>
                    </a>
                  </div>

                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {currentItem.description}
                  </p>

                  {currentItem.tags && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                      {currentItem.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                        >
                          <Tag className="w-3 h-3 text-amber-400" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
