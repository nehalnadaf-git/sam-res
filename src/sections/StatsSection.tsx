'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
 * Process cards data
 * ───────────────────────────────────────────────────────── */
const notes = [
  {
    title: 'Customer\nSatisfaction.',
    body: 'Courteously **greeting customers** and ensuring a warm welcome. Expertly **escorting guests** to seats, presenting menus, and **recommending** food & beverage combinations and daily specials.',
    bg: '#D8F0E8',
    titleColor: '#4A7C6F',
    rotation: -2,
    animationClass: 'animate-note-float-1',
    image: '/assets/customer_satisfaction.webp',
  },
  {
    title: 'F&B Service\n& Operations.',
    body: '**Preparing orders** for presentation. **Clearing tables** throughout dining experience using proper methods. **Processing** customer restaurant bills **promptly** and **accurately**.',
    bg: '#D8EBF5',
    titleColor: '#5F7B8B',
    rotation: 1,
    animationClass: 'animate-note-float-2',
    image: '/assets/fb_service_operations.webp',
  },
  {
    title: 'Hotel\nStandards.',
    body: 'Providing **courteous, professional, efficient** and **flexible** service following **Novotel standards**. **Conversant** with all hotel services, **opening and closing** procedures, and **SOP** adherence.',
    bg: '#E0F0E0',
    titleColor: '#5A8B6B',
    rotation: -1,
    animationClass: 'animate-note-float-3',
    image: '/assets/hotel_standards.webp',
  },
  {
    title: 'Menu\nKnowledge.',
    body: '**Thorough understanding** of all food and beverage items. Ability to **recommend** Food & Beverage combinations, **upsell alternatives**, and suggest **cocktails** and daily specials to enhance guest experience.',
    bg: '#E8F0D8',
    titleColor: '#6B8B5F',
    rotation: 2,
    animationClass: 'animate-note-float-4',
    image: '/assets/menu_knowledge.webp',
  },
];

function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#2A2522' }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/* ─────────────────────────────────────────────────────────
 * Unified Stats + Process Section
 * ───────────────────────────────────────────────────────── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [cgpa, setCgpa] = useState(0);
  const [projects, setProjects] = useState(0);
  const [certifications, setCertifications] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const proxy = { cgpa: 0, projects: 0, certifications: 0 };

    const ctx = gsap.context(() => {
      // Card entrance — lightweight fade+slide (no heavy rotationX on mobile)
      gsap.set(sectionRef.current!, { willChange: 'transform, opacity' });
      gsap.from(sectionRef.current!, {
        opacity: 0,
        y: 50,
        scale: 0.97,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'willChange',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 89%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Animated counters
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            cgpa: 5,
            projects: 3,
            certifications: 3,
            duration: 1.2,
            ease: 'power2.out',
            snap: { cgpa: 1, projects: 1, certifications: 1 },
            onUpdate: () => {
              setCgpa(Math.round(proxy.cgpa));
              setProjects(Math.round(proxy.projects));
              setCertifications(Math.round(proxy.certifications));
            },
          });
        },
      });

      // Process cards — fast staggered entrance
      const noteRotations = [-3, 2, -2, 4];
      gsap.set(notesRef.current.filter(Boolean), { willChange: 'transform, opacity' });
      notesRef.current.forEach((note, i) => {
        if (!note) return;
        gsap.from(note, {
          opacity: 0,
          y: 45,
          scale: 0.9,
          rotation: noteRotations[i] * 2,
          duration: 0.55,
          ease: 'power3.out',
          delay: i * 0.08,
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: note,
            start: 'top 91%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Ruler marks — horizontal top + vertical left
  const rulerMarksH = Array.from({ length: 46 }, (_, i) => i);
  const rulerMarksV = Array.from({ length: 60 }, (_, i) => i);

  return (
    <section className="py-8 md:py-14 px-3 md:px-6">
      {/* ─── Big unified white card ─── */}
      <div
        ref={sectionRef}
        className="relative max-w-[1100px] mx-auto rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#FDFBF7',
          boxShadow: '0 6px 32px rgba(42,37,34,0.09), 0 1px 6px rgba(42,37,34,0.05)',
        }}
      >
        {/* ── Ruler decorations ── */}

        {/* Horizontal ruler — top, ALL screen sizes */}
        <div className="absolute top-2 left-8 right-8 flex justify-between items-start pointer-events-none z-10">
          {rulerMarksH.map((mark) => (
            <div key={mark} className="flex flex-col items-center">
              <div
                className="w-px"
                style={{
                  height: mark % 5 === 0 ? '14px' : '7px',
                  backgroundColor: '#D5D0C8',
                }}
              />
              {mark % 5 === 0 && (
                <span className="text-[6px] mt-0.5" style={{ color: '#B8860B' }}>{mark}</span>
              )}
            </div>
          ))}
        </div>

        {/* Vertical ruler — left side, ALL screen sizes */}
        <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-between items-start pointer-events-none z-10">
          {rulerMarksV.map((mark) => (
            <div key={mark} className="flex items-center">
              <div
                className="h-px"
                style={{
                  width: mark % 5 === 0 ? '14px' : '7px',
                  backgroundColor: '#D5D0C8',
                }}
              />
              {mark % 5 === 0 && (
                <span className="text-[6px] ml-0.5" style={{ color: '#B8860B' }}>{mark}</span>
              )}
            </div>
          ))}
        </div>

        {/* WIP badge */}
        <div
          className="absolute top-3 right-3 md:top-4 md:right-5 px-3 py-1.5 rounded-md rotate-3 z-20"
          style={{ backgroundColor: '#F5F0D0', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
        >
          <span className="text-xs font-bold" style={{ color: '#B8860B' }}>Wip</span>
        </div>

        {/* ══════════════════════════════════════
         *  TOP HALF — Heading + Stats
         * ══════════════════════════════════════ */}
        <div className="px-7 pt-9 pb-8 md:px-16 md:pt-14 md:pb-10 md:ml-4">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-0.5" style={{ color: '#2A2522' }}>
              Years of
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1" style={{ color: '#2A2522' }}>
              EXCELLENCE &
            </h2>
            <span
              className="text-2xl md:text-3xl lg:text-4xl inline-block -rotate-2"
              style={{ color: '#B8860B', fontFamily: "'Caveat', cursive" }}
            >
              driven by hospitality.
            </span>
          </div>

          {/* Stats row */}
          <div className="flex justify-between items-start w-full px-1 sm:px-4 md:px-0 mt-4 md:mt-0 gap-2 md:gap-8">
            {/* CGPA */}
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="flex items-baseline justify-center gap-[1px] md:gap-1">
                <span className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: '#2A2522' }}>
                  {cgpa}
                </span>
                <span className="text-[14px] md:text-2xl font-bold" style={{ color: '#2A2522' }}>+</span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-1.5 mb-0.5 font-medium" style={{ color: '#6B6560' }}>Years of Experience</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs" style={{ color: '#A09A94' }}>Al Baik · Tara Hotel · Wind Mills</p>
            </div>

            {/* ML Projects */}
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="flex items-baseline justify-center gap-[1px] md:gap-1">
                <span className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: '#2A2522' }}>
                  {projects}
                </span>
                <span className="text-[14px] md:text-2xl font-bold" style={{ color: '#2A2522' }}>+</span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-1.5 mb-0.5 font-medium" style={{ color: '#6B6560' }}>Employers</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs max-w-[80px] md:max-w-none mx-auto leading-tight" style={{ color: '#A09A94' }}>Hospitality leaders</p>
            </div>

            {/* Certifications */}
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="flex items-baseline justify-center gap-[1px] md:gap-1">
                <span className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: '#2A2522' }}>
                  {certifications}
                </span>
                <span className="text-[14px] md:text-2xl font-bold" style={{ color: '#2A2522' }}>+</span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-1.5 mb-0.5 font-medium" style={{ color: '#6B6560' }}>Languages</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs max-w-[80px] md:max-w-none mx-auto leading-tight" style={{ color: '#A09A94' }}>English, Hindi, Kannada</p>
            </div>
          </div>
        </div>

        {/* ── Dashed separator inside card ── */}
        <div
          className="mx-5 md:mx-16"
          style={{
            borderTop: '1.5px dashed rgba(42,37,34,0.10)',
          }}
        />

        {/* ══════════════════════════════════════
         *  BOTTOM HALF — Process Cards
         * ══════════════════════════════════════ */}
        <div className="pl-10 pr-5 pt-8 pb-8 md:px-12 md:pt-10 md:pb-12 md:ml-4">


          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {notes.map((note, i) => (
              <div
                key={i}
                ref={(el) => { notesRef.current[i] = el; }}
                className={`relative rounded-xl p-3 md:p-4 pb-4 md:pb-5 note-curl ${note.animationClass} flex flex-col justify-between`}
                style={{
                  backgroundColor: note.bg,
                  transform: `rotate(${note.rotation}deg)`,
                  boxShadow: '0 6px 20px rgba(42,37,34,0.07), 0 2px 6px rgba(42,37,34,0.04)',
                }}
              >
                {/* Polaroid photo */}
                <div>
                  <div className="relative w-full aspect-video mb-3 bg-white p-1.5 shadow-sm rounded-sm transform -rotate-1 border border-black/5" style={{ maxHeight: '160px' }}>
                    {/* Tape */}
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 z-10 opacity-60"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.45)',
                        backdropFilter: 'blur(1px)',
                        transform: 'rotate(1deg)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        borderLeft: '1px dashed rgba(0,0,0,0.1)',
                        borderRight: '1px dashed rgba(0,0,0,0.1)',
                      }}
                    />
                    <img
                      src={note.image}
                      alt={note.title.replace('\n', ' ')}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>

                  <h3
                    className="text-sm font-bold mb-2 leading-tight whitespace-pre-line"
                    style={{ color: note.titleColor }}
                  >
                    {note.title}
                  </h3>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: '#6B6560' }}>
                  {parseBoldText(note.body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
