import { useState, useEffect } from 'react';
import { WebsiteProvider } from './context/WebsiteContext';
import { SignatureIntro } from './components/SignatureIntro';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { AdminPanel } from './components/AdminPanel';

function MainApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [forceIntro, setForceIntro] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  // 1. DESKTOP HIDDEN ACCESS: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 2. MOBILE & SECRET URL ACCESS: /admin, /admin/, /admin#/, /admin-login, ?admin=portal, #/admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      const isAdminUrl =
        path === '/admin' ||
        path === '/admin/' ||
        path.startsWith('/admin') ||
        path === '/admin-login' ||
        search.includes('admin=') ||
        hash.includes('admin') ||
        (path.includes('/admin') && hash === '#/');

      if (isAdminUrl) {
        setIsAdminOpen(true);
        // Clean up URL so legacy hashes and query parameters are stripped cleanly
        if (hash || search.includes('admin=')) {
          window.history.replaceState({}, document.title, window.location.pathname.replace(/\/+$/, '') || '/');
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleReplayIntro = () => {
    setForceIntro(true);
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForQuote = (serviceName: string) => {
    setPreselectedService(serviceName);
  };

  return (
    <div className="min-h-screen bg-[#06050b] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Signature Animated Opening Experience */}
      {showIntro && (
        <SignatureIntro
          forceShow={forceIntro}
          onComplete={() => {
            setShowIntro(false);
            setForceIntro(false);
          }}
        />
      )}

      {/* Main Glass Header */}
      <Header
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. About Us Section */}
        <About />

        {/* 3. Our Services */}
        <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />

        {/* 4. Portfolio Section with Lightbox */}
        <PortfolioSection />

        {/* 5. Why Choose Us */}
        <WhyChooseUs />

        {/* 6. Contact Us with Interactive Form */}
        <ContactSection preselectedService={preselectedService} />
      </main>

      {/* Footer */}
      <Footer
        onReplayIntro={handleReplayIntro}
      />

      {/* Floating Action Buttons */}
      <FloatingWidgets />

      {/* Protected Admin CMS Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WebsiteProvider>
      <MainApp />
    </WebsiteProvider>
  );
}
