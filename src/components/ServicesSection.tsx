import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import type { ServiceItem } from '../context/WebsiteContext';
import { MessageCircle, Search, Sparkles, Check, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForQuote?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services, business } = useWebsite();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Signage', 'Printing', 'Branding', 'Promotional', 'Outdoor'];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppEnquiry = (service: ServiceItem) => {
    const text = `Hello Aura Creations! I am interested in your service: *${service.name}*. Please share specifications, timeline, and quote details.`;
    const url = `https://wa.me/${business.phone1Raw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#06040e]">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-fuchsia-900/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-purple-900/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/30 text-xs font-semibold text-fuchsia-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Complete Catalogue • Specialized Services</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Montserrat',sans-serif] tracking-tight">
            Our Full Spectrum of <span className="brand-gradient-text">Creative & Printing</span> Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            Every service is executed with industrial-grade substrates, high-clarity color profiles, and rigorous quality inspection. Browse our complete range of specialized services below.
          </p>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
                {cat === 'All' && ` (${services.length})`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. LED, Flex)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Services Grid (All 18 Services) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredServices.map((srv, idx) => (
              <motion.div
                key={srv.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group relative border border-white/10 hover:border-fuchsia-500/40"
              >
                {/* Image Container with Badges */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-black/40">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0819] via-transparent to-transparent opacity-80" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-purple-300">
                      {srv.category}
                    </span>
                  </div>

                  {/* Feature Tag */}
                  {srv.tag && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {srv.tag}
                      </span>
                    </div>
                  )}

                  {/* Service Number Watermark */}
                  <div className="absolute bottom-2 right-3">
                    <span className="text-3xl font-black text-white/10 font-mono">
                      #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-400 font-semibold">
                        {srv.category}
                      </span>
                      {srv.price && (
                        <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {srv.price}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white font-['Montserrat',sans-serif] group-hover:text-fuchsia-300 transition-colors">
                      {srv.name}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>

                    {/* Feature Bullets */}
                    {srv.features && srv.features.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                        {srv.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                    {/* WhatsApp Direct Enquiry */}
                    <button
                      onClick={() => handleWhatsAppEnquiry(srv)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Form Quote Trigger */}
                    <a
                      href="#contact"
                      onClick={() => onSelectServiceForQuote && onSelectServiceForQuote(srv.name)}
                      className="py-2.5 px-3 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Get Quote</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-fuchsia-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty Search State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-2xl max-w-md mx-auto">
            <p className="text-sm text-slate-400">No service found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-fuchsia-600/30 text-fuchsia-300 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
