import React from 'react';
import { motion } from 'framer-motion';
import { useWebsite } from '../context/WebsiteContext';
import { Palette, Printer, Megaphone, ShieldCheck, Mail, Phone, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { InstagramIcon } from './Icons';

export const About: React.FC = () => {
  const { business } = useWebsite();

  const corePillars = [
    {
      icon: Palette,
      title: 'Creative Design',
      desc: 'Precision visual concepts, logo identities, layout architecture, and high-impact custom promotional graphics engineered for instant brand resonance.',
      color: 'from-fuchsia-600 to-pink-600',
    },
    {
      icon: Printer,
      title: 'Advanced Printing',
      desc: 'High-definition flex printing, solvent and eco-solvent technologies, multi-color offset flyers, vinyl stickering, and durable textile apparel printing.',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      icon: Megaphone,
      title: 'Strategic Branding',
      desc: 'Commercial 3D LED letters, illuminated backlight displays, auto transit advertising, kiosk avenue pole banners, and portable event pop-up tents.',
      color: 'from-amber-500 to-yellow-600',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#070510] border-t border-purple-950/40">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-3">
            <span>About Aura Creations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Montserrat',sans-serif] tracking-tight">
            Crafting Tangible Brand Presence in <span className="brand-gradient-text">Guntur & Andhra Pradesh</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            <span className="brand-gradient-text font-bold">Aura Creations</span> is a specialized advertising, printing, and brand visibility enterprise based in Guntur. We unite creative graphic design, industrial printing machinery, and outdoor fabrication under one roof.
          </p>
        </div>

        {/* 2-Column Showcase: Editorial Story & Authentic Visiting Card Asset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-slate-300"
          >
            <div className="space-y-4 text-base sm:text-lg font-light leading-relaxed">
              <p>
                In today's competitive commercial landscape, an idea only creates value when it commands attention. At <span className="brand-gradient-text font-bold drop-shadow-[0_0_12px_rgba(217,70,239,0.35)]">Aura Creations</span>, our philosophy is anchored in one promise: <span className="text-fuchsia-400 font-medium">“Ideas That Create Impact”</span>.
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                Whether you need a luminous 3D LED storefront that stops nighttime foot traffic, high-precision laser-cut acrylic architectural boards, fleet auto-rickshaw marketing, or thousands of sharp offset brochures delivered on tight deadlines — we execute with absolute craftsmanship.
              </p>
            </div>

            {/* Proprietor & Verification Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <p className="text-xs text-amber-400 font-mono tracking-wider uppercase">{business.proprietorRole || 'Managing Director'}</p>
                  <p className="text-lg font-bold text-white font-['Montserrat',sans-serif]">{business.proprietor}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Verified Studio Lead</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                  <span>{business.address}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <a href={`tel:${business.phone2Raw}`} className="hover:text-amber-300 transition-colors font-mono font-medium">
                      {business.phone2}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                    <a href={`mailto:${business.email}`} className="hover:text-purple-300 transition-colors">
                      {business.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & WhatsApp Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-pink-500/30 hover:border-pink-400 text-xs font-semibold text-pink-200 flex items-center gap-2 transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>Follow {business.instagram}</span>
              </a>

              <a
                href={`https://wa.me/${business.phone2Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20discuss%20a%20branding%20project`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-xs font-semibold text-emerald-300 flex items-center gap-2 transition-all"
              >
                <span>Direct WhatsApp Inquiries</span>
              </a>
            </div>
          </motion.div>

          {/* Right Visual: Interactive Google Maps Location Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Srinagar+Colony,+4th+Line,+Near+Sri+Chaitanya+College,+Guntur,+Andhra+Pradesh+522002"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Find Aura Creations on Google Maps - Get Directions"
              className="group block relative rounded-2xl overflow-hidden border border-fuchsia-500/30 hover:border-fuchsia-400/80 shadow-2xl shadow-purple-950/60 bg-[#0c0718] transition-all duration-300 hover:shadow-fuchsia-950/50 cursor-pointer"
            >
              {/* Header Bar */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#170e2b] via-[#120a22] to-[#0d0718] border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-300 font-bold">
                    FIND OUR OFFICE
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-600/20 border border-fuchsia-500/40 text-[11px] font-bold text-fuchsia-200 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shadow-sm">
                  <Navigation className="w-3 h-3 text-amber-300 group-hover:text-white transition-colors" />
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
                </div>
              </div>

              {/* Map Canvas with Embed & Location Marker Overlay */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#090514]">
                <iframe
                  title="Aura Creations Office Location Map"
                  src="https://maps.google.com/maps?q=Srinagar+Colony%2C+4th+Line%2C+Near+Sri+Chaitanya+College%2C+Guntur%2C+Andhra+Pradesh+522002&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 pointer-events-none opacity-85 contrast-[1.08] saturate-[1.1] transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0718] via-transparent to-black/20 pointer-events-none" />

                {/* Pulsing Aura Location Pin Badge in Map Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative flex flex-col items-center">
                    <span className="absolute -inset-2 rounded-full bg-fuchsia-500/30 animate-ping" />
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-950/80 border border-white/40">
                      <MapPin className="w-5 h-5 fill-white text-fuchsia-900" />
                    </div>
                    <div className="mt-1 px-2.5 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] font-bold text-white shadow-xl whitespace-nowrap">
                      AURA CREATIONS
                    </div>
                  </div>
                </div>

                {/* Floating "Click to open route" overlay hint */}
                <div className="absolute top-3 right-3 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-slate-300">
                    Google Maps
                  </span>
                </div>
              </div>

              {/* Bottom Office Details Footer */}
              <div className="p-4 bg-[#100922] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <p className="text-xs font-bold text-white font-['Montserrat',sans-serif]">
                      AURA CREATIONS STUDIO
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
                    Srinagar Colony, 4th Line, Near Sri Chaitanya College, Guntur – 522002
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:text-amber-200 shrink-0 self-end sm:self-auto pl-5 sm:pl-0">
                  <span>Open Route</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          </motion.div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Montserrat',sans-serif] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
