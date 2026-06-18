'use client';

import { useCallback } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/layout/Navbar';

import HeroSection from '@/sections/HeroSection';
import LogoMarquee from '@/sections/LogoMarquee';
import StatsSection from '@/sections/StatsSection';
import WorkFinderSection from '@/sections/WorkFinderSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import SocialSection from '@/sections/SocialSection';
import FooterSection from '@/components/layout/FooterSection';

function App() {
  const lenisRef = useLenis();

  const handleGoToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.5 });
    } else {
      // Fallback for mobile/touch devices where Lenis is not initialized
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenisRef]);

  return (
    <div className="dot-grid-bg min-h-screen">
      <Navbar />

      <main>
        <div id="hero"><HeroSection /></div>
        <LogoMarquee />
        <div id="stats"><StatsSection /></div>
        <div id="work"><WorkFinderSection /></div>
        <div id="achievements"><TestimonialsSection /></div>
        <div id="contact"><SocialSection onGoToTop={handleGoToTop} /></div>
      </main>

      <FooterSection />

    </div>
  );
}

export default App;
