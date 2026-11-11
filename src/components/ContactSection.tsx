import React, { useState } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import confetti from 'canvas-confetti';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Users
} from 'lucide-react';
import { InstagramIcon } from './Icons';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedService = '' }) => {
  const { business, services, addEnquiry } = useWebsite();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: preselectedService || 'LED Boards',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [copiedGST, setCopiedGST] = useState(false);

  // Update selected service if preselectedService prop changes
  React.useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.service) {
      errs.service = 'Please select a service';
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = 'Please provide details about your project requirements';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Real persistence: save inquiry into WebsiteContext
    addEnquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      service: formData.service,
      message: formData.message.trim(),
    });

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c026d3', '#a855f7', '#fbbf24', '#38bdf8']
    });

    setSubmitted(true);
  };

  const handleCopyGST = () => {
    navigator.clipboard.writeText(business.gstin);
    setCopiedGST(true);
    setTimeout(() => setCopiedGST(false), 2000);
  };

  const handleDirectWhatsAppForward = () => {
    const text = `*New Website Enquiry - Aura Creations*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email || 'N/A'}\n*Service Required:* ${formData.service}\n*Message:* ${formData.message}`;
    const url = `https://wa.me/${business.phone1Raw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#05030a] border-t border-purple-950/40">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 uppercase tracking-widest mb-3">
            <span>Direct Business Connect</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Montserrat',sans-serif] tracking-tight">
            Let’s Build Something <span className="brand-gradient-text">Impactful</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            Reach out directly to our leadership and administration team for rapid estimates, material samples, and on-site site surveys across Guntur.
          </p>
        </div>

        {/* 2-Column Layout: Business Details & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">
          {/* Left Column: Authentic Business Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-fuchsia-400 uppercase">
                  Advertising • Printing • Branding
                </span>
                <h3 className="text-2xl font-bold text-white font-['Montserrat',sans-serif] mt-1">
                  {business.name}
                </h3>
                <p className="font-signature text-2xl text-amber-300 font-bold mt-1 select-none">
                  Ideas that create impact
                </p>
              </div>

              {/* THREE DEDICATED CONTACT CARDS */}
              <div className="space-y-3 pt-1">
                <p className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Key Contact Persons & Phone Lines
                </p>
                
                {/* Contact 1 */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-fuchsia-950/40 via-purple-950/30 to-black/40 border border-fuchsia-500/40 space-y-2.5 shadow-lg shadow-fuchsia-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-fuchsia-300 tracking-wider">
                        {business.administratorRole || 'Administrator & WhatsApp'}
                      </span>
                      <h4 className="text-base font-bold text-white font-['Montserrat',sans-serif]">
                        {business.administrator && business.administrator.trim() && business.administrator.trim() !== '.'
                          ? business.administrator.trim()
                          : 'J. Vani'}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                      Primary Contact
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/5">
                    <a
                      href={`tel:${business.phone1Raw}`}
                      className="flex items-center gap-2 text-sm font-bold text-white font-mono hover:text-amber-300 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>{business.phone1}</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${business.phone1Raw}`}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20discuss%20a%20branding%20project`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact 2 */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-purple-300 tracking-wider">
                        {business.proprietorRole || 'Managing Director'}
                      </span>
                      <h4 className="text-base font-bold text-white font-['Montserrat',sans-serif]">
                        {business.proprietor && business.proprietor.trim()
                          ? business.proprietor.trim()
                          : 'Shiva'}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300">
                      {business.proprietorRole || 'Managing Director'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <a
                      href={`tel:${business.phone2Raw}`}
                      className="flex items-center gap-2 text-sm font-bold text-white font-mono hover:text-purple-300 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>{business.phone2}</span>
                    </a>

                    <a
                      href={`tel:${business.phone2Raw}`}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>

                {/* Contact 3 */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-300 tracking-wider">
                        {business.supportingTeamRole || 'Customer & Execution Desk'}
                      </span>
                      <h4 className="text-base font-bold text-white font-['Montserrat',sans-serif]">
                        {business.supportingTeamName && business.supportingTeamName.trim()
                          ? business.supportingTeamName.trim()
                          : 'Supporting Team'}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                      Support Desk
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <a
                      href={`tel:${business.phone3Raw || '918886930880'}`}
                      className="flex items-center gap-2 text-sm font-bold text-white font-mono hover:text-amber-300 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span>{business.phone3Display || business.phone3 || '8886930880'}</span>
                    </a>

                    <a
                      href={`tel:${business.phone3Raw || '918886930880'}`}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>

              {/* Primary WhatsApp Quick Action Button */}
              <a
                href={`https://wa.me/${business.phone1Raw}?text=Hello%20Aura%20Creations,%20I%20would%20like%20to%20discuss%20a%20branding%20project`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Aura on WhatsApp ({business.phone1})</span>
              </a>

              {/* Email & Instagram Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`mailto:${business.email}`}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-400/30 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 text-xs text-fuchsia-400 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Official Email</span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate font-mono group-hover:text-white">
                    {business.email}
                  </p>
                </a>

                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/30 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 text-xs text-pink-400 mb-1">
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram Profile</span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate font-mono group-hover:text-white">
                    {business.instagram}
                  </p>
                </a>
              </div>

              {/* Physical Location Address */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
                    <MapPin className="w-4 h-4 text-fuchsia-400" />
                    <span>Studio & Office Location</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Srinagar+Colony+4th+Line+Near+Sri+Chaitanya+College+Guntur+Andhra+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                  {business.address}
                </p>
              </div>

              {/* GSTIN Copy Box (Legitimate business information section) */}
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase font-mono block">Registered GSTIN</span>
                    <span className="text-xs font-bold text-white font-mono">{business.gstin}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyGST}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                  title="Copy GSTIN"
                >
                  {copiedGST ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGST ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quote Request Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 relative">
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Online Estimate & Project Inquiry
                </span>
                <h3 className="text-2xl font-bold text-white font-['Montserrat',sans-serif] mt-1">
                  Request a Custom Quotation
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Fill in your details below and our team will prepare specifications and pricing promptly.
                </p>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white font-['Montserrat',sans-serif]">
                      Enquiry Successfully Received!
                    </h4>
                    <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
                      Thank you, <span className="text-amber-300 font-bold">{formData.name}</span>! Your inquiry for <span className="text-fuchsia-300 font-semibold">{formData.service}</span> has been saved in our studio inbox.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto text-left text-xs text-slate-300 space-y-1 font-mono">
                    <p><span className="text-slate-500">Service:</span> {formData.service}</p>
                    <p><span className="text-slate-500">Phone:</span> {formData.phone}</p>
                    {formData.email && <p><span className="text-slate-500">Email:</span> {formData.email}</p>}
                    <p><span className="text-slate-500">Message:</span> {formData.message}</p>
                  </div>

                  {/* Forward to WhatsApp CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleDirectWhatsAppForward}
                      className="brand-btn-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                      <span>Send to Shiva on WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          service: 'LED Boards',
                          message: '',
                        });
                      }}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Full Name <span className="text-fuchsia-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                          errors.name ? 'border-rose-500' : 'border-white/10'
                        } text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors`}
                      />
                      {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Mobile Phone Number <span className="text-fuchsia-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 98480 12345"
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                          errors.phone ? 'border-rose-500' : 'border-white/10'
                        } text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors`}
                      />
                      {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email & Service Required */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email Address <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rajesh@company.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                          errors.email ? 'border-rose-500' : 'border-white/10'
                        } text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors`}
                      />
                      {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Service Required <span className="text-fuchsia-400">*</span>
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#140b26] border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500 transition-colors cursor-pointer"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.name} className="bg-[#140b26] text-white">
                            {s.name} ({s.category}) {s.price ? `— ${s.price}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message / Specifications */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Project Details / Dimensions / Quantity <span className="text-fuchsia-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention approximate size (e.g. 10x4 ft LED board, 1000 visiting cards, 5 rollup standees), location in Guntur, and target completion date..."
                      className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                        errors.message ? 'border-rose-500' : 'border-white/10'
                      } text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors resize-none`}
                    />
                    {errors.message && <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="brand-btn-primary w-full py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-fuchsia-950/60"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Studio</span>
                    </button>
                    <p className="text-center text-[11px] text-slate-500 mt-2">
                      Inquiries are stored directly in the business studio dashboard. Prompt response guaranteed.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
