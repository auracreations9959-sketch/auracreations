import React from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { Phone, Mail, MapPin, Sparkles, ArrowUp, Users } from 'lucide-react';
import { InstagramIcon } from './Icons';

interface FooterProps {
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const { business, services } = useWebsite();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#040208] text-slate-400 border-t border-purple-950/60 pt-16 pb-12 relative overflow-hidden">
      {/* Background Accent Bloom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-950/20 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-1.5 rounded-2xl border border-white/30 shadow-lg inline-flex items-center justify-center">
                <img
                  src="/images/logo/aura-logo-card.png"
                  alt="Aura Creations Logo"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              {business.category}
            </p>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Premier advertising, printing, and branding studio in Guntur, Andhra Pradesh. Dedicated to engineering high-visibility brand assets that command attention.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 font-bold">
                GSTIN: {business.gstin}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Montserrat',sans-serif]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">Our Services</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-amber-400 transition-colors">Client Portfolio</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-amber-400 transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Directory */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Montserrat',sans-serif]">
              Featured Services
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
              {services.slice(0, 10).map((s) => (
                <a
                  key={s.id}
                  href="#services"
                  className="hover:text-fuchsia-300 transition-colors truncate"
                >
                  • {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Col 4: Contact & Leadership */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Montserrat',sans-serif]">
              Studio Leadership & Team
            </h4>
            <div className="space-y-1">
              <p className="text-slate-300">
                <strong className="text-white">{business.administrator || 'J. Vani'}</strong> — {business.administratorRole || 'Administrator'}
              </p>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">{business.proprietor || 'Shiva'}</strong> — {business.proprietorRole || 'Managing Director'}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`tel:${business.phone1Raw}`} className="hover:text-amber-300 font-mono font-semibold text-white">
                  {business.phone1} <span className="text-[10px] text-emerald-400 font-normal">({business.administratorRole || 'Primary / WhatsApp'})</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <a href={`tel:${business.phone2Raw}`} className="hover:text-purple-300 font-mono">
                  {business.phone2} <span className="text-[10px] text-slate-500">({business.proprietorRole || 'Managing Director'})</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${business.phone3Raw || '918886930880'}`} className="hover:text-emerald-300 font-mono">
                  {business.phone3Display || business.phone3 || '8886930880'} <span className="text-[10px] text-slate-500">({business.supportingTeamName || 'Supporting Team'})</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:text-fuchsia-300 truncate">
                  {business.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-300">
                  {business.instagram}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{business.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Admin Button & Replay */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} <strong className="text-white font-['Montserrat',sans-serif]">AURA CREATIONS</strong>. All rights reserved. <span className="font-signature text-base text-white/90 font-bold pl-1">“Ideas that create impact”</span>.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onReplayIntro}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cinematic Intro</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
