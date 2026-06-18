'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = [
  {
    name: 'Guest Service',
    svg: (
      <svg width="170" height="44" viewBox="0 0 170 44">
        <circle cx="17" cy="22" r="12" fill="#B8860B" opacity="0.2" />
        <path d="M12 22 Q17 14 22 22" stroke="#B8860B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="17" cy="17" r="4" fill="#B8860B" />
        <text x="36" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Guest Service</text>
      </svg>
    ),
  },
  {
    name: 'Al Baik',
    svg: (
      <svg width="110" height="44" viewBox="0 0 110 44">
        <rect x="4" y="10" width="24" height="24" rx="5" fill="#E8473F" />
        <text x="8" y="28" fill="white" fontSize="13" fontWeight="900" fontFamily="Inter, sans-serif">AB</text>
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">Al Baik</text>
      </svg>
    ),
  },
  {
    name: 'F&B Operations',
    svg: (
      <svg width="185" height="44" viewBox="0 0 185 44">
        <path d="M8 10 L8 34" stroke="#F18F01" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M17 10 Q17 18 12 22 Q17 26 17 34" stroke="#F18F01" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M22 10 L22 22 A5 5 0 0 0 22 22 L22 34" stroke="#F18F01" strokeWidth="2.5" strokeLinecap="round" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">F&B Operations</text>
      </svg>
    ),
  },
  {
    name: 'Hospitality',
    svg: (
      <svg width="160" height="44" viewBox="0 0 160 44">
        <path d="M17 4 L29 8 V19 C29 27 17 35 17 35 C17 35 5 27 5 19 V8 Z" fill="#2D936C" />
        <path d="M11 19 L15 23 L23 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">Hospitality</text>
      </svg>
    ),
  },
  {
    name: 'MS Office',
    svg: (
      <svg width="135" height="44" viewBox="0 0 135 44">
        <rect x="4" y="9" width="11" height="11" rx="1.5" fill="#D83B01" />
        <rect x="17" y="9" width="11" height="11" rx="1.5" fill="#D83B01" />
        <rect x="4" y="22" width="11" height="11" rx="1.5" fill="#D83B01" />
        <rect x="17" y="22" width="11" height="11" rx="1.5" fill="#D83B01" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">MS Office</text>
      </svg>
    ),
  },
  {
    name: 'Customer Service',
    svg: (
      <svg width="200" height="44" viewBox="0 0 200 44">
        <rect x="4" y="16" width="26" height="12" rx="3" fill="#B8860B" />
        <rect x="10" y="8" width="12" height="28" rx="3" fill="#B8860B" />
        <text x="38" y="28" fill="#2A2522" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">Customer Service</text>
      </svg>
    ),
  },
  {
    name: 'Team Player',
    svg: (
      <svg width="160" height="44" viewBox="0 0 160 44">
        <circle cx="12" cy="18" r="8" fill="#5C4E8B" opacity="0.3" />
        <circle cx="22" cy="18" r="8" fill="#5C4E8B" opacity="0.6" />
        <circle cx="17" cy="25" r="8" fill="#5C4E8B" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">Team Player</text>
      </svg>
    ),
  },
  {
    name: 'Communication',
    svg: (
      <svg width="185" height="44" viewBox="0 0 185 44">
        <path d="M4 10 L30 10 Q34 10 34 14 L34 26 Q34 30 30 30 L18 30 L14 36 L14 30 L8 30 Q4 30 4 26 L4 14 Q4 10 4 10 Z" fill="#217346" opacity="0.2" stroke="#217346" strokeWidth="1.5" />
        <text x="38" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Communication</text>
      </svg>
    ),
  },
  {
    name: 'Active Listening',
    svg: (
      <svg width="185" height="44" viewBox="0 0 185 44">
        <path d="M17 8 Q27 8 27 18 Q27 26 19 28 L19 36" stroke="#E74C3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="19" cy="38" r="2" fill="#E74C3C" />
        <text x="38" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Active Listening</text>
      </svg>
    ),
  },
];

export default function LogoMarquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(sectionRef.current!, { willChange: 'transform, opacity' });
      gsap.from(sectionRef.current!, {
        opacity: 0,
        y: 25,
        duration: 0.45,
        ease: 'power3.out',
        clearProps: 'willChange',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 93%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Two copies — CSS translateX(-50%) loops seamlessly */
  const allLogos = [...logos, ...logos];

  return (
    <section ref={sectionRef} className="py-6 md:py-10 overflow-hidden">
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #F0EBE3 40%, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #F0EBE3 40%, transparent)' }}
        />

        <div className="flex animate-marquee" style={{ width: 'max-content' }}>
          {allLogos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 mx-8 md:mx-14 flex items-center transition-all duration-200 cursor-default"
              style={{ opacity: 0.72 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '1';
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '0.72';
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              }}
            >
              {logo.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
