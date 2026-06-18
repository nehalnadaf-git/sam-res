'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'WHATSAPP', color: '#25D366', url: 'https://wa.me/917338564132' },
  { name: 'GMAIL', color: '#EA4335', url: 'mailto:mrsam70220@gmail.com' },
  { name: 'CALL', color: '#B8860B', url: 'tel:+917338564132' },
];

function CircularTextButton({ onClick, small = false }: { onClick: () => void; small?: boolean }) {
  const text = 'GO TO TOP \u00b7 GO TO TOP \u00b7 GO TO TOP \u00b7 ';
  const characters = text.split('');
  const angleStep = 360 / characters.length;

  const size = small ? 'w-14 h-14' : 'w-20 h-20';
  const textHeight = small ? '28px' : '40px';
  const textSize = small ? 'text-[6px]' : 'text-[8px]';
  const arrowBox = small ? 'w-6 h-6' : 'w-8 h-8';
  const arrowIcon = small ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <button
      onClick={onClick}
      className={`relative ${size} flex items-center justify-center group cursor-pointer`}
      aria-label="Go to top"
    >
      {/* Rotating text */}
      <div className="absolute inset-0 animate-circular-rotate">
        {characters.map((char, i) => (
          <span
            key={i}
            className={`absolute left-1/2 top-0 ${textSize} font-bold uppercase origin-bottom`}
            style={{
              color: '#6B6560',
              height: textHeight,
              transform: `translateX(-50%) rotate(${i * angleStep}deg)`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Center arrow */}
      <div
        className={`relative z-10 ${arrowBox} rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
        style={{ backgroundColor: '#F0EBE3' }}
      >
        <ArrowUp className={arrowIcon} style={{ color: '#B8860B' }} />
      </div>
    </button>
  );
}

interface SocialSectionProps {
  onGoToTop: () => void;
}

export default function SocialSection({ onGoToTop }: SocialSectionProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      /* Heading slides + fades */
      if (headingRef.current) {
        gsap.set(headingRef.current, { willChange: 'transform, opacity' });
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 35,
          duration: 0.55,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 87%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      }

      /* Social link pills snap in */
      if (linksRef.current) {
        gsap.set(linksRef.current.children, { willChange: 'transform, opacity' });
        gsap.from(linksRef.current.children, {
          opacity: 0,
          y: 20,
          scale: 0.85,
          duration: 0.4,
          ease: 'power3.out',
          stagger: 0.07,
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-14 md:py-24 px-4">
      <div ref={sectionRef} className="max-w-[800px] mx-auto text-center">
        <div ref={headingRef}>
          <span
            className="text-2xl block mb-4"
            style={{ color: '#B8860B', fontFamily: "'Caveat', cursive" }}
          >
            Thanks for visiting!
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8" style={{ color: '#2A2522' }}>
            LET&apos;S CREATE MEMORABLE
          </h2>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 -mt-4" style={{ color: '#B8860B' }}>
            EXPERIENCES.
          </h2>

          <p className="text-sm mb-6 md:mb-8" style={{ color: '#6B6560' }}>
            Reach me directly on,
          </p>
        </div>

        <div ref={linksRef} className="flex flex-wrap items-center justify-center gap-2 md:gap-2 mb-8 md:mb-12">
          {socialLinks.map((link, i) => (
            <span key={link.name} className="flex items-center">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold uppercase transition-all duration-200 hover:scale-105"
                style={{ color: link.color }}
              >
                {link.name}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              {i < socialLinks.length - 1 && (
                <span className="mx-3 text-lg" style={{ color: '#6B6560' }}>
                  &middot;
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Go to top button — mobile: fixed bottom-right, appears after hero */}
      <div
        className="fixed right-4 bottom-6 z-30 lg:hidden transition-all duration-300"
        style={{
          opacity: showScrollTop ? 1 : 0,
          transform: showScrollTop ? 'translateY(0)' : 'translateY(16px)',
          pointerEvents: showScrollTop ? 'auto' : 'none',
        }}
      >
        <CircularTextButton onClick={onGoToTop} small />
      </div>

      {/* Go to top button — desktop: fixed vertically centered on right */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
        <CircularTextButton onClick={onGoToTop} />
      </div>
    </section>
  );
}
