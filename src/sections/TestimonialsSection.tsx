'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
 * Certificates & Achievements Data  (sourced from /docs)
 * Only real certifications & education — NO work history
 * ───────────────────────────────────────────────────────── */
const cards = [
  /* 1 ─ TAJ Hotels Training Certificate */
  {
    type: 'certificate',
    badge: 'CERTIFIED',
    badgeColor: '#B45309',
    institution: 'TAJ HOTELS RESORTS & PALACES',
    title: 'Industrial Exposure Training',
    period: '7 Mar 2019 – 31 Aug 2019',
    location: 'The Gateway Hotel, Mangalore',
    body: 'Certified by Taj Hotels Resorts and Palaces for successfully completing Industrial Exposure Training in Front Office, Housekeeping, and Food & Beverage at The Gateway Hotel, Mangalore.',
    highlights: [],
    paperBg: '#F5EEC0',
    accentColor: '#C2843B',
    stripeColor: '#D4C97A',
    tapeColor: '#FCD34D',
    rotation: -2,
    image: '/assets/certificates/Taj-hotels.webp',
  },
  /* 2 ─ Diploma in Hotel Management */
  {
    type: 'education',
    badge: 'FIRST DIV',
    badgeColor: '#7C3AED',
    institution: 'NEXUS INSTITUTE OF HOTEL MGMT',
    title: 'Diploma in Hotel Management',
    period: 'June 2018 – Dec 2019',
    location: 'Hubli, Karnataka · NIHM/18-19/8488.28',
    body: 'Awarded Diploma in Hotel Management (18-Month) with First Division — A Grade (68%, 408/600). Subjects: Front Office, F&B Service, F&B Production, Housekeeping, Catering Management, English.',
    highlights: [],
    paperBg: '#F0E8D8',
    accentColor: '#7C3AED',
    stripeColor: '#3A3530',
    tapeColor: '#C4B5FD',
    rotation: 2,
    image: '/assets/certificates/hotel-management.webp',
  },
];

/* ─────────────────────────────────────────────────────────
 * (no glassmorphism helpers needed — solid parchment backgrounds)
 * ───────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────
 * Premium Achievement Card
 * ───────────────────────────────────────────────────────── */
/* Float animation variants — index maps to note-float-1..4 */
const FLOAT_CLASSES = [
  'animate-note-float-1',
  'animate-note-float-2',
  'animate-note-float-3',
  'animate-note-float-4',
] as const;

function AchievementCard({
  card,
  refCallback,
  floatDelay,
  floatIndex,
  onClick,
  isSelected,
}: {
  card: (typeof cards)[0];
  refCallback?: (el: HTMLDivElement | null) => void;
  floatDelay: string;
  floatIndex: number;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const currentRotation = isSelected ? 0 : card.rotation;
  const floatClass = FLOAT_CLASSES[floatIndex % FLOAT_CLASSES.length];

  return (
    <div
      ref={refCallback}
      className={floatClass}
      style={{ animationDelay: floatDelay }}
    >
      {/* Inner wrapper — holds rotation + hover lift/scale */}
      <div
        ref={innerRef}
        className="relative group"
        style={{
          transform: `rotate(${currentRotation}deg)`,
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: onClick ? 'pointer' : undefined,
        }}
        onClick={(e) => {
          const pointerType = (e.nativeEvent as PointerEvent).pointerType;
          if (pointerType !== 'touch' && onClick) onClick();
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            const hoverRotation = (card.rotation * 0.3).toFixed(2);
            (e.currentTarget as HTMLDivElement).style.transform =
              `rotate(${hoverRotation}deg) translateY(-8px) scale(1.025)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotation}deg)`;
          }
        }}
      >
        {/* Tape strip */}
        <div
          className="absolute -top-3 left-1/2 z-20 w-14 h-5 opacity-85"
          style={{
            backgroundColor: card.tapeColor,
            transform: `translateX(-50%) rotate(${card.rotation * -0.5}deg)`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            borderLeft: '1px dashed rgba(255,255,255,0.6)',
            borderRight: '1px dashed rgba(255,255,255,0.6)',
          }}
        />

        {/* Card body */}
        <div
          className="relative overflow-hidden flex h-full"
          style={{
            backgroundColor: card.paperBg,
            boxShadow: '4px 4px 12px rgba(42,37,34,0.1)',
            borderRadius: '2px',
            minHeight: '420px',
          }}
        >
          {/* Left color stripe */}
          <div
            className="flex-shrink-0 flex flex-col items-center py-4 gap-3"
            style={{ width: '20px', backgroundColor: card.stripeColor }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((h) => (
              <div
                key={h}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 pl-3">

            {/* Title — Caveat italic at top, matching reference image */}
            <h3
              className="leading-snug mb-3"
              style={{
                color: '#2A2522',
                fontFamily: "'Caveat', cursive",
                fontSize: '18px',
                fontStyle: 'italic',
                fontWeight: 700,
              }}
            >
              {card.title}
            </h3>

            {/* Polaroid photo */}
            <div className="relative mb-3">
              <div
                className="bg-white shadow-md border border-black/5 p-1.5 pb-5"
                style={{ transform: 'rotate(-1deg)', margin: '0 auto', maxWidth: '94%' }}
              >
                <div
                  className="aspect-[4/3] overflow-hidden bg-gray-100"
                  style={{ cursor: onClick ? 'pointer' : undefined }}
                  onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                >
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <p
                  className="text-center text-[8px] font-bold tracking-tight uppercase mt-2 opacity-60"
                  style={{ color: '#5A5550', fontFamily: "'Outfit', 'Inter', sans-serif" }}
                >
                  {card.institution.slice(0, 28)}
                </p>
              </div>
              {/* Tape on polaroid */}
              <div
                className="absolute -top-1.5 left-1/3 w-8 h-3 z-10 opacity-60"
                style={{
                  backgroundColor: card.tapeColor,
                  transform: 'rotate(-7deg)',
                  borderLeft: '1px dashed rgba(255,255,255,0.5)',
                  borderRight: '1px dashed rgba(255,255,255,0.5)',
                }}
              />
            </div>

            {/* Body text — Outfit for readability (Caveat is too difficult to
                read at small sizes for multi-line credential descriptions) */}
            <p
              className="leading-relaxed flex-1"
              style={{
                color: '#6B6560',
                fontFamily: "'Outfit', 'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 400,
                maxHeight: '120px',
                overflowY: 'auto',
                marginBottom: '12px',
              }}
            >
              {card.body}
            </p>

            {/* Footer — separator + institution + period + LinkedIn */}
            <div
              style={{
                borderTop: '1px solid rgba(42,37,34,0.08)',
                paddingTop: '10px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: '#2A2522', marginBottom: '2px', fontFamily: "'Outfit', 'Inter', sans-serif" }}
                >
                  {card.institution}
                </p>
                <p
                  className="text-[9px]"
                  style={{ color: '#6B6560', fontFamily: "'Outfit', 'Inter', sans-serif" }}
                >
                  {card.period}
                </p>
              </div>
              {/* LinkedIn icon */}
              <a
                href="#"
                aria-label="LinkedIn"
                onClick={(e) => e.stopPropagation()}
                style={{ flexShrink: 0 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 *  CERTIFICATE MODAL — Premium GSAP-animated polaroid viewer
 * ───────────────────────────────────────────────────────── */
function CertificateModal({
  image,
  title,
  tapeColor,
  institution,
  onClose,
}: {
  image: string;
  title: string;
  tapeColor: string;
  institution: string;
  onClose: () => void;
}) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const tapeRef     = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLImageElement>(null);

  /* ── open animation ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    const card    = cardRef.current;
    const tape    = tapeRef.current;
    if (!overlay || !card) return;

    // prevent scroll
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Bug fix 2: GSAP cannot animate backdropFilter (not a supported property).
    // The overlay inline style already has blur(16px) applied; we just animate opacity.
    tl.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.32 },
    );

    // Card drops in from slightly above, with bounce
    tl.fromTo(card,
      { opacity: 0, y: -48, scale: 0.88, rotation: -2 },
      { opacity: 1, y: 0, scale: 1, rotation: -0.5, duration: 0.62, ease: 'back.out(1.7)' },
      '-=0.16',
    );

    // Tape slaps on top with a subtle bounce
    if (tape) {
      tl.fromTo(tape,
        { scaleX: 0, opacity: 0.85 },
        { scaleX: 1, opacity: 0.85, duration: 0.3, ease: 'back.out(2)' },
        '-=0.3',
      );
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  /* ── close with animation ── */
  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const card    = cardRef.current;
    if (!overlay || !card) { onClose(); return; }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(card, { opacity: 0, y: 40, scale: 0.9, rotation: 2, duration: 0.28, ease: 'power3.in' });
    tl.to(overlay, { opacity: 0, duration: 0.22 }, '-=0.12');
  }, [onClose]);

  /* ── keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  /* ── 3D Interactive Parallax Tilt ── */
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Tilt max 4.5 degrees
    const rotX = -(y / (rect.height / 2)) * 4.5;
    const rotY = (x / (rect.width / 2)) * 4.5;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      transformPerspective: 1000,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      rotation: -0.5,
      duration: 0.45,
      ease: 'power2.out',
    });
  };

  const washiBg = `repeating-linear-gradient(45deg, ${tapeColor}D8, ${tapeColor}D8 4px, ${tapeColor}C0 4px, ${tapeColor}C0 8px)`;

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(20,15,12,0.72)',
        WebkitBackdropFilter: 'blur(16px)',
        backdropFilter: 'blur(16px)',
      }}
      onClick={handleClose}
    >
      {/* Dynamic Ambient Glow Behind Modal */}
      <div
        style={{
          position: 'absolute',
          width: 'min(90vw, 480px)',
          height: 'min(90vw, 480px)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tapeColor}22 0%, transparent 70%)`,
          opacity: 0.7,
          pointerEvents: 'none',
          filter: 'blur(35px)',
          zIndex: 0,
        }}
      />

      {/* Card — stop propagation so inner clicks don't close */}
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex flex-col items-center modal-shimmer-card"
        style={{
          width: 'min(92vw, 520px)',
          maxHeight: '92vh',
          background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.78) 0%, rgba(253, 251, 247, 0.54) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          borderRadius: '16px',
          padding: '24px 20px 20px',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.38), 0 12px 28px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.04)',
          transform: 'rotate(-0.5deg)',
          transformStyle: 'preserve-3d',
          zIndex: 10,
        }}
      >
        {/* Specular glass reflection shine overlay on modal card */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 40%, rgba(255,255,255,0.06) 100%)',
            borderRadius: 'inherit',
            zIndex: 15,
          }}
        />

        {/* Washi tape strip at top */}
        <div
          ref={tapeRef}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: '90px',
            height: '20px',
            background: washiBg,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            borderLeft: '1px dashed rgba(255,255,255,0.45)',
            borderRight: '1px dashed rgba(255,255,255,0.45)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
            opacity: 0.85,
            transformOrigin: 'center',
            zIndex: 20,
          }}
        />

        {/* Header */}
        <div className="text-center w-full mb-3" style={{ transform: 'translateZ(20px)' }}>
          <h3
            style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#2A2522',
              margin: 0,
            }}
          >
            {title}
          </h3>
          <p style={{ fontFamily: "'Caveat', cursive", color: '#0E8B7D', fontSize: 'clamp(13px, 3vw, 16px)', marginTop: '2px' }}>
            {institution}
          </p>
        </div>

        {/* Polaroid photo frame */}
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0.32) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.50)',
            padding: '10px 10px 40px',
            boxShadow: '0 8px 32px rgba(42,37,34,0.06), 0 1px 4px rgba(42,37,34,0.03)',
            borderRadius: '4px',
            position: 'relative',
            transform: 'translateZ(30px)',
          }}
        >
          {/* Image ── scrollable if very tall on mobile */}
          <div style={{ overflowY: 'auto', maxHeight: 'calc(92vh - 220px)', borderRadius: '1px' }}>
            <img
              ref={imageRef}
              src={image}
              alt={title}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1px' }}
            />
          </div>

          {/* Polaroid caption */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: "'Caveat', cursive",
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              color: '#6B6560',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            Verified Credential ✦
          </div>

          {/* Ink Stamp Seal */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              width: '56px',
              height: '56px',
              transform: 'rotate(-12deg)',
              opacity: 0.78,
              pointerEvents: 'none',
              zIndex: 12,
            }}
          >
            <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
              <circle cx="30" cy="30" r="26" fill="none" stroke="#0E8B7D" strokeWidth="1.2" strokeDasharray="3 1.5" />
              <circle cx="30" cy="30" r="23" fill="none" stroke="#0E8B7D" strokeWidth="0.8" />
              <path
                id="seal-text-path-testimonials"
                d="M 10 30 A 20 20 0 1 1 50 30"
                fill="none"
                stroke="none"
              />
              <text fontSize="4.6" fontWeight="bold" fill="#0E8B7D" letterSpacing="0.6">
                <textPath href="#seal-text-path-testimonials" startOffset="10%">
                  ✦ VERIFIED CREDENTIAL ✦
                </textPath>
              </text>
              {/* Center checkmark */}
              <path
                d="M 23 30 L 28 35 L 38 23"
                fill="none"
                stroke="#0E8B7D"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Close × button */}
        <button
          onClick={handleClose}
          aria-label="Close document"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(240, 235, 227, 0.5)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#6B6560',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.18s, color 0.18s',
            zIndex: 30,
            transform: 'translateZ(40px)',
          }}
          onMouseEnter={(e) => { 
            const el = e.currentTarget as HTMLButtonElement; 
            el.style.backgroundColor = '#EF4444'; 
            el.style.color = '#fff'; 
          }}
          onMouseLeave={(e) => { 
            const el = e.currentTarget as HTMLButtonElement; 
            el.style.backgroundColor = 'rgba(240, 235, 227, 0.5)'; 
            el.style.color = '#6B6560'; 
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * Section Component
 * ───────────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const mobileSliderWrapRef = useRef<HTMLDivElement>(null);
  const slideItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCard, setSelectedCard] = useState<(typeof cards)[0] | null>(null);

  const handleCloseModal = useCallback(() => {
    setSelectedCard(null);
  }, []);

  // Bug fix 4: wrap in useCallback so the auto-slide interval always has
  // a stable reference (avoids stale-closure issue with setInterval).
  const goToSlide = useCallback((i: number) => {
    const el = slideItemsRef.current[i];
    const container = sliderRef.current;
    if (!el || !container) return;
    const targetLeft = el.offsetLeft - (container.offsetWidth - el.offsetWidth) / 2;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, []);

  /* Entrance animations */
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const rotations = [-5, 3, -4, 5, -3];

      gsap.set(desktopCardsRef.current.filter(Boolean), { willChange: 'transform, opacity' });
      desktopCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0,
          y: 60,
          scale: 0.88,
          rotation: rotations[i] * 1.8,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.09,
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 86%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });

      if (mobileSliderWrapRef.current) {
        gsap.set(mobileSliderWrapRef.current, { willChange: 'transform, opacity' });
        gsap.from(mobileSliderWrapRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.96,
          duration: 0.5,
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

      gsap.set(slideItemsRef.current.filter(Boolean), { willChange: 'transform, opacity' });
      slideItemsRef.current.forEach((slide, i) => {
        if (!slide) return;
        gsap.from(slide, {
          opacity: 0,
          y: 30,
          scale: 0.92,
          duration: 0.45,
          ease: 'power3.out',
          delay: i * 0.08,
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Intersection observer for active dot */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    slideItemsRef.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) setActiveSlide(i);
        },
        { root: sliderRef.current, threshold: 0.6 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // goToSlide is now defined above with useCallback (Bug fix 4)

  /* Auto-slide */
  const sectionVisibleRef = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { sectionVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sectionVisibleRef.current) return;
      const next = (activeSlide + 1) % cards.length;
      goToSlide(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 px-4" style={{ overflowX: 'clip' }}>
      
      {/* Liquid glass styling & backdrop blobs */}
      <style>{`
        /* Glowing background blobs for achievements */
        .ac-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(55px);
          opacity: 0.18;
          mix-blend-mode: multiply;
          pointer-events: none;
          will-change: transform;
          z-index: 0;
        }
        .ac-blob-1 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(194,132,59,0.55) 0%, rgba(194,132,59,0) 70%);
          left: -5%;
          top: 10%;
          animation: ac-blob-move-1 16s ease-in-out infinite alternate;
        }
        .ac-blob-2 {
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(124,58,237,0) 70%);
          right: -5%;
          bottom: 10%;
          animation: ac-blob-move-2 18s ease-in-out infinite alternate-reverse;
        }
        .ac-blob-3 {
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(14,139,125,0.45) 0%, rgba(14,139,125,0) 70%);
          left: 45%;
          top: 30%;
          animation: ac-blob-move-3 14s ease-in-out infinite alternate;
        }

        @keyframes ac-blob-move-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(50px, -20px) scale(1.15); }
          100% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes ac-blob-move-2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-45px, 30px) scale(0.85); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes ac-blob-move-3 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-20px, -50px) scale(1.1); }
          100% { transform: translate(40px, 30px) scale(0.95); }
        }

        /* Glass highlight border transition */
        .wf-glass-card {
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Modal Glass Shimmer Sweep animation */
        .modal-shimmer-card {
          position: relative;
          overflow: hidden;
        }
        .modal-shimmer-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.28) 45%,
            rgba(255, 255, 255, 0.38) 50%,
            rgba(255, 255, 255, 0.28) 55%,
            transparent
          );
          transform: skewX(-25deg);
          animation: modal-shimmer-sweep 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          animation-delay: 0.5s; /* sweep after card finishes dropping down */
          z-index: 15;
          pointer-events: none;
        }
        @keyframes modal-shimmer-sweep {
          0% { left: -150%; }
          100% { left: 150%; }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto relative overflow-visible">
        {/* Glowing background liquid glassmorphism blobs */}
        <div className="ac-blob ac-blob-1" />
        <div className="ac-blob ac-blob-2" />
        <div className="ac-blob ac-blob-3" />

        {/* Heading */}
        <div className="text-center mb-10 md:mb-16 relative z-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight"
            style={{ color: '#2A2522' }}
          >
            EDUCATION &
          </h2>
          <span
            className="text-2xl md:text-3xl lg:text-4xl block -mt-1"
            style={{ color: '#D97706', fontFamily: "'Caveat', cursive" }}
          >
            training
          </span>
        </div>

        {/* ── Mobile Slider ── */}
        <div ref={mobileSliderWrapRef} className="md:hidden relative z-10">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-4 pb-6 px-3"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                ref={(el) => { slideItemsRef.current[i] = el; }}
                className="flex-shrink-0 pt-5"
                style={{ scrollSnapAlign: 'center', width: 'calc(85vw)', maxWidth: '320px' }}
              >
                <AchievementCard
                  card={card}
                  floatDelay={`${i * 0.3}s`}
                  floatIndex={i}
                  onClick={() => setSelectedCard(card)}
                  isSelected={selectedCard === card}
                />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeSlide === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: activeSlide === i ? '#0E8B7D' : '#D5D0C8',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 300ms ease, background-color 300ms ease',
                }}
              />
            ))}
          </div>

          <p
            className="text-center mt-3 text-lg"
            style={{ color: '#A09A94', fontFamily: "'Caveat', cursive" }}
          >
            swipe to explore →
          </p>
        </div>

        {/* ── Desktop Grid ── */}
        <div className="hidden md:grid md:grid-cols-2 max-w-3xl mx-auto gap-6 md:gap-8 relative z-10">
          {cards.map((card, i) => (
            <AchievementCard
              key={i}
              card={card}
              refCallback={(el) => { desktopCardsRef.current[i] = el; }}
              floatDelay={`${i * 0.3}s`}
              floatIndex={i}
              onClick={() => setSelectedCard(card)}
              isSelected={selectedCard === card}
            />
          ))}
        </div>
      </div>

      {/* Premium Certificate Modal — portal to document.body so it escapes
          any CSS containment / stacking-context on the section element */}
      {selectedCard &&
        createPortal(
          <CertificateModal
            image={selectedCard.image}
            title={selectedCard.title}
            tapeColor={selectedCard.tapeColor}
            institution={selectedCard.institution}
            onClose={handleCloseModal}
          />,
          document.body
        )
      }
    </section>
  );
}
