'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const navItems = [
  { label: 'Work',          href: '#work'         },
  { label: 'Achievements',  href: '#achievements' },
  { label: 'Stats',         href: '#stats'        },
  { label: 'Contact',       href: '#contact'      },
];

export default function Navbar() {
  const navRef    = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  /* Slide-down entrance */
  useEffect(() => {
    if (!navRef.current) return;
    gsap.from(navRef.current, {
      y: -80, opacity: 0, duration: 0.7, ease: 'back.out(1.4)', delay: 0.1,
    });
  }, []);

  /* Scrolled shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close on desktop resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Lock body scroll when overlay is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* Smooth scroll helper — works with Lenis if present, falls back to native */
  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const target = document.querySelector(href);
    if (!target) return;
    // Lenis exposes itself on window.__lenis; fall back to native scrollIntoView
    const lenis = (window as unknown as Record<string, unknown>).__lenis as { scrollTo?: (el: Element, opts: object) => void } | undefined;
    if (lenis?.scrollTo) {
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Floating glassmorphism navbar */}
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pt-3 md:pt-4">
        <nav
          className={`w-full max-w-[860px] flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'shadow-lg' : 'shadow-sm'
          }`}
          style={{
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(245, 241, 235, 0.15)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(200, 192, 182, 0.2)',
            padding: '0 20px',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo('#')}
            className="text-lg md:text-xl font-extrabold tracking-tight"
            style={{ color: '#B8860B', fontFamily: "'Inter', system-ui, sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}
          >
            SS
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-[13px] font-medium cursor-pointer transition-colors duration-200 hover:text-[#B8860B]"
                style={{ color: '#5A5550', fontFamily: "'Inter', system-ui, sans-serif", background: 'none', border: 'none' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ color: '#2A2522' }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: 'rgba(240, 235, 227, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              className="text-2xl font-bold uppercase tracking-wider transition-all duration-300"
              style={{
                color: '#2A2522',
                fontFamily: "'Inter', system-ui, sans-serif",
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transitionDelay: `${i * 80}ms`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => scrollTo(item.href)}
            >
              {item.label}
            </button>
          ))}
          <div
            className="mt-4 w-12 h-0.5 rounded-full"
            style={{ backgroundColor: '#B8860B' }}
          />
        </div>
      </div>
    </>
  );
}
