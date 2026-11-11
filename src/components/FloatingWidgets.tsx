import React, { useState, useEffect } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

export const FloatingWidgets: React.FC = () => {
  const { business } = useWebsite();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 select-none pointer-events-auto">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-black/80 border border-white/20 text-slate-300 hover:text-white hover:bg-black/95 flex items-center justify-center shadow-lg transition-all cursor-pointer backdrop-blur-md animate-in fade-in"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Call Button */}
      <a
        href={`tel:${business.phone1Raw}`}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center justify-center shadow-xl shadow-amber-950/60 hover:scale-108 transition-transform cursor-pointer"
        title={`Direct Phone Call: ${business.phone1}`}
      >
        <Phone className="w-5 h-5 fill-black" />
      </a>

      {/* Floating WhatsApp Action Pill with Pulse */}
      <a
        href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20inquire%20about%20your%20services`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/80 hover:scale-105 transition-all cursor-pointer"
        title={`Chat on WhatsApp (${business.phone1})`}
      >
        {/* Pulsing Aura Rings */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
        
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-emerald-100 font-mono leading-none">Instant WhatsApp</span>
          <span className="text-xs font-bold leading-tight">Chat with Aura</span>
        </div>
      </a>
    </div>
  );
};
