import React from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { 
  ArrowRight, 
  Sparkles, 
  Eye, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Award,
  Printer,
  Palette,
  Flag,
  Tent,
  Lightbulb,
  Shirt
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { business, services } = useWebsite();

  // Dynamically derive 6 active services from context
  const activeServices = services.filter((s) => s.active !== false);
  const s1 = activeServices[0] || { id: 'branding', name: 'Corporate Branding', category: 'Identity & Cards' };
  const s2 = activeServices[1] || { id: 'standees', name: 'Rollup Standees', category: 'Promo Displays' };
  const s3 = activeServices[2] || { id: 'flex', name: 'Flex Printing', category: 'Banners & Hoardings' };
  const s4 = activeServices[3] || { id: 'led', name: '3D LED Boards', category: 'Acrylic Signage' };
  const s5 = activeServices[4] || { id: 'demotents', name: 'Demotents', category: 'Promo Canopies' };
  // Planet 6: T-Shirt Printing (Promotional)
  const s6 = activeServices.find((s) => s.id === 'tshirt-printing' || s.name.toLowerCase().includes('t-shirt')) || activeServices[5] || { id: 'tshirt-printing', name: 'T-Shirt Printing', category: 'Promotional' };

  return (
    <section id="home" className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-10 pb-20 bg-[#06040d]">
      {/* Subtle Studio Ambient Lighting & Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Magenta Radial Bloom */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] bg-fuchsia-600/15 blur-[160px] rounded-full" />
        
        {/* Soft Indigo / Royal Purple Radial Bloom */}
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-indigo-700/15 blur-[160px] rounded-full" />

        {/* Minimalist fine grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex flex-col items-center text-center">
        
        {/* ========================================================================= */}
        {/* 1. COMPANY NAME & BRAND HEADLINE SECTION (FIRST / AT TOP)                */}
        {/* ========================================================================= */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Dynamic Eyebrow Category */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fuchsia-950/70 border border-fuchsia-500/30 text-xs font-semibold text-fuchsia-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{business.category ? business.category.replace(/\|/g, '•') : 'DESIGN • PRINT • BRAND'}</span>
          </div>

          {/* MAIN BRAND LOGO MARK: EXACT CUSTOM "AURA CREATIONS" LETTERS IN CRISP WHITE */}
          <div className="relative flex flex-col items-center justify-center py-2 group/logo">
            <img
              src="/images/logo/aura-logo-white-hd.png"
              alt={business.name}
              fetchPriority="high"
              decoding="async"
              className="w-full max-w-[340px] sm:max-w-[460px] md:max-w-[560px] h-auto object-contain filter drop-shadow-[0_4px_30px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover/logo:scale-[1.02]"
            />
            {/* Semantic heading for search engines & accessibility */}
            <h1 className="sr-only">{business.name}</h1>
          </div>

          {/* DYNAMIC SIGNATURE HANDWRITTEN CURSIVE TAGLINE */}
          <div className="relative flex flex-col items-center justify-center -mt-1 pb-1">
            <span className="font-signature text-3xl sm:text-4xl md:text-5xl text-white font-bold tracking-wide transform -rotate-1 select-none drop-shadow-[0_2px_12px_rgba(255,255,255,0.35)]">
              {business.tagline || 'Ideas That Create Impact'}
            </span>
            {/* Elegant Calligraphic Underline Swoop Matching Reference Image */}
            <svg
              className="w-56 sm:w-72 md:w-84 h-4 text-white -mt-1 overflow-visible"
              viewBox="0 0 280 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 12 C 70 5, 170 4, 275 14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Subheadline & Dynamic Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed pt-1">
            {business.heroSubheadline}
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            {business.businessType ? `${business.businessType} in ${business.location}. From 3D luminous LED signage and wide-format flex printing to corporate branding and vehicle wraps — engineering visibility that creates commercial impact.` : 'From 3D luminous LED signage and wide-format flex printing to corporate branding and vehicle wraps — we engineer visibility that drives commercial results.'}
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Explore Our Services */}
            <a
              href="#services"
              className="brand-btn-primary px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center gap-2 group shadow-xl shadow-fuchsia-950/60"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* View Our Work */}
            <a
              href="#portfolio"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold text-slate-100 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Eye className="w-4 h-4 text-purple-400" />
              <span>View Client Portfolio</span>
            </a>

            {/* WhatsApp Direct Chat */}
            <a
              href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20discuss%20a%20branding%20project`}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-btn-gold px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center gap-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. REVOLUTION ANIMATION (PLACED AFTER COMPANY NAME SECTION)               */}
        {/*    DYNAMIC 6-SERVICE SOLAR SYSTEM (COMPLETELY UN-HARDCODED)              */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-[620px] aspect-square flex items-center justify-center my-8 select-none group/orbit">
          
          {/* ORBIT 3 (OUTERMOST RING) */}
          <div className="absolute w-[90%] h-[90%] rounded-full border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.06)] animate-orbit-outer group-hover/orbit:[animation-play-state:paused]">
            
            {/* Dynamic Planet 1 (Left Side: 180 deg) */}
            <a
              href="#services"
              className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 group/node"
            >
              <div className="animate-counter-rotate-outer group-hover/orbit:[animation-play-state:paused]">
                <div className="px-3.5 py-2 rounded-full bg-[#0a1533]/90 border border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-[11px] font-bold text-white whitespace-nowrap block">{s1.name}</span>
                    <span className="text-[9px] text-blue-300/80 font-mono block -mt-0.5">{s1.category}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Dynamic Planet 2 (Right Side: 0 deg) */}
            <a
              href="#services"
              className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 group/node"
            >
              <div className="animate-counter-rotate-outer group-hover/orbit:[animation-play-state:paused]">
                <div className="px-3.5 py-2 rounded-full bg-[#260f1c]/90 border border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
                    <Flag className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-[11px] font-bold text-white whitespace-nowrap block">{s2.name}</span>
                    <span className="text-[9px] text-rose-300/80 font-mono block -mt-0.5">{s2.category}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Decorative Solar Planet Dot (Coral Glow) */}
            <div className="absolute top-[8%] right-[22%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            </div>
          </div>

          {/* ORBIT 2 (MIDDLE RING) */}
          <div className="absolute w-[68%] h-[68%] rounded-full border border-purple-400/25 shadow-[0_0_30px_rgba(217,70,239,0.08)] animate-orbit-middle group-hover/orbit:[animation-play-state:paused]">
            
            {/* Dynamic Planet 3 (Top Side: 90 deg) */}
            <a
              href="#services"
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group/node"
            >
              <div className="animate-counter-rotate-middle group-hover/orbit:[animation-play-state:paused]">
                <div className="px-3 py-1.5 rounded-full bg-[#241306]/90 border border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.4)] flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                    <Printer className="w-3 h-3" />
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-[11px] font-bold text-amber-200 whitespace-nowrap block">{s3.name}</span>
                    <span className="text-[9px] text-amber-300/80 font-mono block -mt-0.5">{s3.category}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Dynamic Planet 4 (Bottom Side: 270 deg) */}
            <a
              href="#services"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 group/node"
            >
              <div className="animate-counter-rotate-middle group-hover/orbit:[animation-play-state:paused]">
                <div className="px-3 py-1.5 rounded-full bg-[#051c22]/90 border border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.45)] flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                    <Lightbulb className="w-3 h-3" />
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-[11px] font-bold text-cyan-200 whitespace-nowrap block">{s4.name}</span>
                    <span className="text-[9px] text-cyan-300/80 font-mono block -mt-0.5">{s4.category}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Decorative Solar Planet Dot (Cyan/Teal Glow) */}
            <div className="absolute bottom-[10%] left-[14%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
            </div>
          </div>

          {/* ORBIT 1 (INNER RING) */}
          <div className="absolute w-[46%] h-[46%] rounded-full border border-fuchsia-400/30 shadow-[0_0_25px_rgba(217,70,239,0.12)] animate-orbit-inner group-hover/orbit:[animation-play-state:paused]">
            
            {/* Dynamic Planet 5 (Top-Left: 135 deg) */}
            <a
              href="#services"
              className="absolute top-[14%] left-[14%] -translate-x-1/2 -translate-y-1/2 group/node"
            >
              <div className="animate-counter-rotate-inner group-hover/orbit:[animation-play-state:paused]">
                <div className="px-3 py-1.5 rounded-full bg-[#061e16]/90 border border-emerald-400/70 shadow-[0_0_18px_rgba(16,185,129,0.4)] flex items-center gap-1.5 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                    <Tent className="w-3 h-3" />
                  </div>
                  <div className="text-left pr-0.5">
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200 whitespace-nowrap block">{s5.name}</span>
                    <span className="text-[8px] text-emerald-300/80 font-mono block -mt-0.5">{s5.category}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Dynamic Planet 6 (Bottom-Right: 315 deg) - T-Shirt Printing */}
            <a
              href="#services"
              className="absolute bottom-[14%] right-[14%] translate-x-1/2 translate-y-1/2 group/node"
            >
              <div className="animate-counter-rotate-inner group-hover/orbit:[animation-play-state:paused]">
                <div className="px-3 py-1.5 rounded-full bg-[#1e0a29]/90 border border-purple-400/70 shadow-[0_0_18px_rgba(168,85,247,0.45)] flex items-center gap-1.5 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                    <Shirt className="w-3 h-3" />
                  </div>
                  <div className="text-left pr-0.5">
                    <span className="text-[10px] sm:text-[11px] font-bold text-purple-200 whitespace-nowrap block">{s6.name}</span>
                    <span className="text-[8px] text-purple-300/80 font-mono block -mt-0.5">{s6.category}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Decorative Solar Planet Dot (Fuchsia Glow) */}
            <div className="absolute top-[18%] right-[10%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.9)]" />
            </div>
          </div>

          {/* CENTER SUN: THE CORE AURA LOGO WITH PULSING CONCENTRIC RIPPLE WAVES */}
          <div className="relative flex items-center justify-center z-10">
            {/* Ripple Wave 3 (Outermost glow wave) */}
            <div className="absolute w-40 h-40 rounded-full bg-fuchsia-500/10 blur-xl animate-pulse" />
            
            {/* Ripple Wave 2 (Middle translucent purple ring) */}
            <div className="absolute w-32 h-32 rounded-full border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-950/30 via-purple-950/20 to-transparent backdrop-blur-sm" />
            
            {/* Ripple Wave 1 (Inner soft glow ring) */}
            <div className="absolute w-26 h-26 rounded-full border border-fuchsia-400/40 bg-purple-900/30 shadow-[0_0_30px_rgba(217,70,239,0.3)]" />

            {/* Central Core Sun Badge */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#280c43] via-[#1a082e] to-[#0d0417] border-2 border-fuchsia-400/80 shadow-[0_0_35px_rgba(217,70,239,0.55)] flex items-center justify-center p-2.5 group/core hover:scale-105 transition-transform duration-300">
              <img
                src="/images/logo/aura-logo-white-hd.png"
                alt="Aura Creations Center"
                className="w-full h-full object-contain filter brightness-0 invert drop-shadow-[0_0_14px_rgba(255,255,255,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CLEAN TRUST PILLARS BAR (REMOVED "18 CORE SERVICES" WORDS)             */}
        {/* ========================================================================= */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left w-full">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-950/80 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-fuchsia-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">End-to-End Solutions</p>
              <p className="text-[11px] text-slate-400">LED, Print, Standees & More</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">In-House Output</p>
              <p className="text-[11px] text-slate-400">Direct Industrial Machinery</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Turnaround Focus</p>
              <p className="text-[11px] text-slate-400">Rapid Commercial Delivery</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">{business.location ? business.location.split(',')[0] : 'Guntur'} Studio</p>
              <p className="text-[11px] text-slate-400">Serving {business.location ? business.location.split(',')[1]?.trim() || 'all AP regions' : 'Andhra Pradesh'}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
