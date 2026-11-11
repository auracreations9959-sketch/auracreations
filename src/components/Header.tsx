import React, { useState, useEffect } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { Phone, MessageCircle, Menu, X, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  onReplayIntro: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReplayIntro }) => {
  const { business } = useWebsite();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean navigation links - strictly single line labels
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Our Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <>
      {/* Top Brand Info Strip (Uncluttered, No GSTIN repetition) */}
      <div className="bg-[#090514] text-slate-300 text-xs py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
            <span className="whitespace-nowrap">Srinagar Colony, 4th Line, Guntur, Andhra Pradesh</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs font-mono">
            <a
              href={`tel:${business.phone1Raw}`}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-200 whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-fuchsia-400 shrink-0" />
              <span>{business.phone1}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20inquire%20about%20your%20services`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold whitespace-nowrap"
            >
              <MessageCircle className="w-3 h-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#06040d]/95 backdrop-blur-xl border-b border-purple-900/40 shadow-xl shadow-purple-950/20 py-2.5'
            : 'bg-[#06040d]/80 backdrop-blur-md border-b border-white/5 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <a href="#home" className="flex items-center gap-3 shrink-0 group">
            <div className="relative bg-white px-3 py-1.5 rounded-xl border border-white/40 shadow-sm group-hover:shadow-fuchsia-500/20 transition-all flex items-center justify-center">
              <img
                src="/images/logo/aura-logo-card.png"
                alt="Aura Creations Logo"
                className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </div>
            <div className="hidden xl:flex flex-col text-left pl-2 border-l border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-fuchsia-400 whitespace-nowrap">
                Design • Print • Brand
              </span>
              <span className="text-[9px] text-slate-400 font-light whitespace-nowrap">
                Guntur, AP
              </span>
            </div>
          </a>

          {/* Desktop Navigation - STRICT SINGLE LINE ALIGNMENT */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap px-3 py-2 text-xs xl:text-sm font-medium tracking-wide text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center"
              >
                <span className="whitespace-nowrap">{link.name}</span>
              </a>
            ))}
          </nav>

          {/* Action CTAs: Replay Intro & Quick Quote */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Replay Intro button */}
            <button
              onClick={onReplayIntro}
              title="Replay Signature Cinematic Intro"
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-amber-300/80 hover:text-amber-300 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Quote Button */}
            <a
              href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20get%20a%20quote%20for%20my%20business.`}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-btn-primary px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-lg shadow-fuchsia-950/50"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>Get Quote</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0614] border-b border-purple-900/50 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-fuchsia-950/40 hover:text-fuchsia-300 transition-colors flex items-center justify-between"
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations`}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-btn-primary w-full py-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${business.phone1Raw}`}
                  className="py-2 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Primary</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReplayIntro();
                  }}
                  className="py-2 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-medium text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cinematic Intro</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
