'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Check, Circle, Sparkles, Smile, Lightbulb, Download, HeartHandshake, UtensilsCrossed, ConciergeBell, Star, Laptop } from 'lucide-react';
import SwingingCardWrapper from '@/components/ui/SwingingCardWrapper';

/* ═══════════════════════════════════════════════════════════════
 *  Module-level constants — defined once, never re-created
 * ═══════════════════════════════════════════════════════════════ */
const TODO_ITEMS = [
  { text: 'Al Baik — Senior GSA · Promoted ✓', done: true },
  { text: 'Tara Emerald Hotel experience — done', done: true },
  { text: 'Wind Mills Total Environment — done', done: true },
  { text: 'Next opportunity — searching!', done: false },
];

const CORE_SKILLS = [
  { label: 'Guest Relations', Icon: HeartHandshake },
  { label: 'F&B Operations', Icon: UtensilsCrossed },
  { label: 'Front Office', Icon: ConciergeBell },
  { label: 'Team Leadership', Icon: Star },
  { label: 'PMS & MS Office', Icon: Laptop },
];

/* ═══════════════════════════════════════════════════════════════
 *  Sub-components — top-level so React never sees them as
 *  "new" types on parent re-renders, keeping GSAP refs stable.
 * ═══════════════════════════════════════════════════════════════ */

function TodoList({
  todoRef,
  mobile = false,
}: {
  todoRef?: React.RefObject<HTMLDivElement | null>;
  mobile?: boolean;
}) {
  return (
    <div
      ref={todoRef}
      className={`relative rounded-xl shadow-lg ${mobile ? 'p-3.5' : 'p-5'}`}
      style={{
        backgroundColor: '#FDFBF7',
        width: mobile ? '170px' : '200px',
        boxShadow: '0 4px 20px rgba(42,37,34,0.08), 0 1px 4px rgba(42,37,34,0.04)',
        opacity: todoRef ? 0 : undefined,
      }}
    >
      <div className={`absolute left-0 ${mobile ? 'top-3 bottom-3' : 'top-4 bottom-4'} w-3 flex flex-col justify-around`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${mobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full border-2`}
            style={{ backgroundColor: '#FDFBF7', borderColor: '#B8860B', marginLeft: mobile ? '-5px' : '-6px' }}
          />
        ))}
      </div>
      <div className={`flex items-center gap-1.5 ${mobile ? 'mb-2' : 'mb-3'} ml-2`}>
        <Sparkles className={`${mobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} style={{ color: '#B8860B' }} />
        <span className={`${mobile ? 'text-[10px]' : 'text-xs'} font-medium`} style={{ color: '#2A2522', fontFamily: "'Caveat', cursive" }}>
          My current to do list
        </span>
      </div>
      <div className={`${mobile ? 'space-y-0.5' : 'space-y-1'} ml-2`}>
        {TODO_ITEMS.map((item, i) => (
          <div key={i} className={`flex items-start gap-1.5 px-1 ${mobile ? 'py-0.5' : 'py-1'} rounded-md`}>
            {item.done ? (
              <div className={`flex items-center justify-center ${mobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} rounded-full mt-0.5`} style={{ backgroundColor: '#B8860B' }}>
                <Check className={`${mobile ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-white`} />
              </div>
            ) : (
              <Circle className={`${mobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} mt-0.5`} style={{ color: '#D5D0C8' }} />
            )}
            <span
              className="leading-tight"
              style={{
                color: item.done ? '#A09A94' : '#2A2522',
                textDecoration: item.done ? 'line-through' : 'none',
                fontFamily: "'Caveat', cursive",
                fontSize: mobile ? '11px' : '13px',
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  ProfileBoard — resume-info widget replacing the key rack
 * ───────────────────────────────────────────────────────────── */
function ProfileBoard({
  folderRef,
  mobile = false,
}: {
  folderRef?: React.RefObject<HTMLDivElement | null>;
  mobile?: boolean;
}) {
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Match the parent card entrance: y-axis, back.out(1.7) bounce, starts at
    // 1.65s (just after the card itself lands at delay 1.5 + 0.12 stagger)
    gsap.set(skillRefs.current.filter(Boolean), { willChange: 'transform, opacity' });
    skillRefs.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 10, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: 1.65 + i * 0.07,
          clearProps: 'willChange',
        }
      );
    });
  }, []);

  const w = mobile ? '195px' : '220px';

  return (
    <div
      ref={folderRef}
      className="relative rounded-xl"
      style={{
        width: w,
        backgroundColor: '#FDFBF7',
        borderRadius: mobile ? '12px' : '16px',
        boxShadow: '0 4px 20px rgba(42,37,34,0.08), 0 1px 4px rgba(42,37,34,0.04)',
        padding: mobile ? '16px 8px 10px' : '20px 11px 14px',
        border: '1px solid rgba(42, 37, 34, 0.05)',
        opacity: folderRef ? 0 : undefined,
      }}
    >
      {/* Realistic 3D Pushpin (pushed straight through the card) */}
      <div
        style={{
          position: 'absolute',
          top: mobile ? '4px' : '4px',
          left: '50%',
          transform: `translateX(-50%) rotate(${mobile ? '-6deg' : '-8deg'})`,
          width: mobile ? '22px' : '30px',
          height: mobile ? '19px' : '26px',
          zIndex: 30,
          pointerEvents: 'none',
          filter: 'drop-shadow(1.5px 2.5px 2px rgba(42,37,34,0.35))',
        }}
      >
        <svg viewBox="0 0 32 28" fill="none" className="w-full h-full">
          <defs>
            {/* Glossy Plastic Radial Gradient for Pin Head */}
            <radialGradient id={`pinBodyRed_${mobile ? 'm' : 'd'}`} cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFA482" />
              <stop offset="35%" stopColor="#E8732E" />
              <stop offset="75%" stopColor="#B64B0C" />
              <stop offset="100%" stopColor="#601F01" />
            </radialGradient>

            {/* Gloss reflection for the plastic cap */}
            <linearGradient id={`glassReflection_${mobile ? 'm' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.75" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Plastic Body: Base flange resting on paper */}
          <path
            d="M7 19 C7 17.5, 25 17.5, 25 19 L23 23 C23 23.5, 9 23.5, 9 23 Z"
            fill={`url(#pinBodyRed_${mobile ? 'm' : 'd'})`}
            stroke="#601F01"
            strokeWidth="0.4"
          />

          {/* Plastic Body: Cylindrical waist/grip */}
          <path
            d="M11.5 10.5 C11.5 10, 20.5 10, 20.5 10.5 L19.5 19 C19.5 19.5, 12.5 19.5, 12.5 19 Z"
            fill={`url(#pinBodyRed_${mobile ? 'm' : 'd'})`}
          />

          {/* Plastic Body: Wide top button/cap */}
          <ellipse cx="16" cy="10" rx="8.5" ry="4.5" fill={`url(#pinBodyRed_${mobile ? 'm' : 'd'})`} stroke="#601F01" strokeWidth="0.4" />
          
          {/* Gloss highlight ellipse */}
          <ellipse cx="14.2" cy="8" rx="5.5" ry="2.2" fill={`url(#glassReflection_${mobile ? 'm' : 'd'})`} />
          
          {/* Shadow underneath the plastic base cast onto paper */}
          <ellipse cx="16" cy="24" rx="7" ry="1.2" fill="black" opacity="0.22" />
        </svg>
      </div>

      {/* Index card header with title */}
      <div className="text-center" style={{ marginTop: mobile ? '4px' : '4px' }}>
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: mobile ? '16px' : '20px',
            fontWeight: 'bold',
            color: '#2A2522',
            letterSpacing: '0.5px',
          }}
        >
          Skills & Expertise
        </span>
      </div>

      {/* Classic index card red line */}
      <div
        style={{
          borderTop: '1px solid rgba(232, 115, 46, 0.4)',
          marginTop: mobile ? '4px' : '4px',
          marginBottom: mobile ? '10px' : '12px',
        }}
      />

      {/* ── Skills horizontal list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '6px' : '8px' }}>
        {/* Row 1: 3 items */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: mobile ? '4px' : '6px', justifyContent: 'center' }}>
          {CORE_SKILLS.slice(0, 3).map((skill, i) => (
            <div
              key={i}
              ref={(el) => { skillRefs.current[i] = el; }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: mobile ? '3px' : '4px',
                padding: mobile ? '4px 2px' : '6px 4px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                width: mobile ? '54px' : '62px',
                textAlign: 'center',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-2px)';
                const icon = el.querySelector('svg');
                if (icon) icon.style.color = '#E8732E'; // Subtle accent color change on hover
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                const icon = el.querySelector('svg');
                if (icon) icon.style.color = '#B8860B'; // Restore standard teal color
              }}
            >
              <div>
                <skill.Icon size={mobile ? 18 : 20} strokeWidth={1.5} style={{ color: '#B8860B', transition: 'color 0.2s ease' }} />
              </div>
              <span
                style={{
                  fontFamily: "'Outfit', 'Inter', sans-serif",
                  fontSize: mobile ? '7px' : '8px',
                  fontWeight: 600,
                  color: '#2A2522',
                  lineHeight: 1.15,
                }}
              >
                {skill.label}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: 2 items */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: mobile ? '4px' : '6px', justifyContent: 'center' }}>
          {CORE_SKILLS.slice(3, 5).map((skill, i) => (
            <div
              key={i + 3}
              ref={(el) => { skillRefs.current[i + 3] = el; }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: mobile ? '3px' : '4px',
                padding: mobile ? '4px 2px' : '6px 4px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                width: mobile ? '54px' : '62px',
                textAlign: 'center',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-2px)';
                const icon = el.querySelector('svg');
                if (icon) icon.style.color = '#E8732E';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                const icon = el.querySelector('svg');
                if (icon) icon.style.color = '#B8860B';
              }}
            >
              <div>
                <skill.Icon size={mobile ? 18 : 20} strokeWidth={1.5} style={{ color: '#B8860B', transition: 'color 0.2s ease' }} />
              </div>
              <span
                style={{
                  fontFamily: "'Outfit', 'Inter', sans-serif",
                  fontSize: mobile ? '7px' : '8px',
                  fontWeight: 600,
                  color: '#2A2522',
                  lineHeight: 1.15,
                }}
              >
                {skill.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Clock state lives here — re-renders of LocationStamp are isolated
   and never bubble up to HeroSection, keeping GSAP refs stable.    */
function LocationStamp({
  stampRef,
  mobile = false,
}: {
  stampRef?: React.RefObject<HTMLDivElement | null>;
  mobile?: boolean;
}) {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={stampRef} className="relative" style={{ width: mobile ? '130px' : '160px', opacity: stampRef ? 0 : undefined }}>
      <div className={`flex items-center gap-1 ${mobile ? 'mb-1.5 justify-end' : 'mb-2'}`}>
        <span className={mobile ? 'text-xs' : 'text-sm'} style={{ color: '#6B6560', fontFamily: "'Caveat', cursive" }}>
          Where am i from?
        </span>
        <svg width={mobile ? '14' : '16'} height={mobile ? '7' : '8'} viewBox="0 0 16 8" fill="none" style={{ color: '#6B6560' }}>
          <path d="M1 4C3 2 5 6 8 4C11 2 13 6 15 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="relative rounded-sm overflow-visible" style={{ backgroundColor: '#4A7C6F', padding: mobile ? '5px' : '6px' }}>
        {/* Perforated edges */}
        <div className={`absolute ${mobile ? '-top-[3px] left-1.5 right-1.5' : '-top-[4px] left-2 right-2'} flex justify-between`}>
          {Array.from({ length: mobile ? 10 : 12 }).map((_, i) => (
            <div key={`t${i}`} className={`${mobile ? 'w-[5px] h-[5px]' : 'w-[6px] h-[6px]'} rounded-full`} style={{ backgroundColor: '#F0EBE3' }} />
          ))}
        </div>
        <div className={`absolute ${mobile ? '-bottom-[3px] left-1.5 right-1.5' : '-bottom-[4px] left-2 right-2'} flex justify-between`}>
          {Array.from({ length: mobile ? 10 : 12 }).map((_, i) => (
            <div key={`b${i}`} className={`${mobile ? 'w-[5px] h-[5px]' : 'w-[6px] h-[6px]'} rounded-full`} style={{ backgroundColor: '#F0EBE3' }} />
          ))}
        </div>
        <div className={`absolute ${mobile ? 'left-[-3px] top-1.5 bottom-1.5' : 'left-[-4px] top-2 bottom-2'} flex flex-col justify-between`}>
          {Array.from({ length: mobile ? 10 : 14 }).map((_, i) => (
            <div key={`l${i}`} className={`${mobile ? 'w-[5px] h-[5px]' : 'w-[6px] h-[6px]'} rounded-full`} style={{ backgroundColor: '#F0EBE3' }} />
          ))}
        </div>
        <div className={`absolute ${mobile ? 'right-[-3px] top-1.5 bottom-1.5' : 'right-[-4px] top-2 bottom-2'} flex flex-col justify-between`}>
          {Array.from({ length: mobile ? 10 : 14 }).map((_, i) => (
            <div key={`r${i}`} className={`${mobile ? 'w-[5px] h-[5px]' : 'w-[6px] h-[6px]'} rounded-full`} style={{ backgroundColor: '#F0EBE3' }} />
          ))}
        </div>

        <div className={`relative text-center ${mobile ? 'py-3 px-2' : 'py-4 px-3'} border-2 rounded-sm`} style={{ borderColor: 'rgba(255,255,255,0.25)' }}>
          <div
            suppressHydrationWarning
            className={mobile ? 'mb-2' : 'mb-3'}
            style={{ fontFamily: 'monospace', fontSize: mobile ? '8px' : '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}
          >
            {dateStr}{dateStr && timeStr ? '\u00a0\u00a0' : ''}{timeStr}
          </div>
          <div className={`flex justify-center ${mobile ? 'mb-2' : 'mb-3'}`}>
            <svg width={mobile ? '40' : '50'} height={mobile ? '32' : '40'} viewBox="0 0 50 40" fill="none">
              <ellipse cx="25" cy="18" rx="8" ry="10" fill="#6AAF7F" transform="rotate(-15 25 18)" />
              <ellipse cx="25" cy="18" rx="8" ry="10" fill="#5A9A6F" transform="rotate(15 25 18)" />
              <ellipse cx="20" cy="20" rx="7" ry="9" fill="#7BC08F" transform="rotate(-30 20 20)" />
              <ellipse cx="30" cy="20" rx="7" ry="9" fill="#7BC08F" transform="rotate(30 30 20)" />
              <ellipse cx="25" cy="15" rx="6" ry="8" fill="#8DD4A0" />
              <rect x="24" y="24" width="2.5" height="12" rx="1" fill="rgba(255,255,255,0.3)" />
              {!mobile && <ellipse cx="22" cy="30" rx="4" ry="2" fill="rgba(255,255,255,0.15)" transform="rotate(-20 22 30)" />}
              {!mobile && <ellipse cx="28" cy="32" rx="4" ry="2" fill="rgba(255,255,255,0.15)" transform="rotate(20 28 32)" />}
            </svg>
          </div>
          <p className={mobile ? 'text-[9px]' : 'text-[11px]'} style={{ color: 'rgba(255,255,255,0.7)' }}>Karnataka</p>
          <p
            className={`${mobile ? 'text-base' : 'text-xl'} font-bold`}
            style={{ color: '#FFFFFF', lineHeight: 1.2, fontFamily: "'Inter', sans-serif", textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
          >
            Hubli
          </p>
        </div>
      </div>
    </div>
  );
}

function StickyNote({
  noteRef,
  mobile = false,
}: {
  noteRef?: React.RefObject<HTMLDivElement | null>;
  mobile?: boolean;
}) {
  return (
    <div ref={noteRef} className="relative" style={{ width: mobile ? '155px' : '180px', opacity: noteRef ? 0 : undefined }}>
      <div className={`absolute ${mobile ? '-top-2.5 right-5' : '-top-3 right-6'} z-10`}>
        <svg width={mobile ? '10' : '12'} height={mobile ? '24' : '30'} viewBox="0 0 12 30" fill="none">
          <path d="M3 8C3 5 5 3 8 3C11 3 11 6 11 8V22C11 25 9 27 6 27C3 27 1 25 1 22V10" stroke="#B5B0A8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: '#E8E0C8', transform: 'rotate(3deg) translate(2px, 1px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
      <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: '#F0E8D0', transform: 'rotate(-1deg) translate(-1px, 1px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
      <div className={`relative rounded-lg ${mobile ? 'p-3' : 'p-4'} note-curl`} style={{ backgroundColor: '#F5F0D0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div className={`flex items-center gap-1 ${mobile ? 'mb-1.5' : 'mb-2'}`}>
          <span className={mobile ? 'text-[10px]' : 'text-xs'} style={{ color: '#2A2522', fontFamily: "'Caveat', cursive" }}>Current Role</span>
          <Lightbulb className={`${mobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} style={{ color: '#B8860B' }} />
        </div>
        <p className={`${mobile ? 'text-xl' : 'text-2xl'} font-bold mb-0.5`} style={{ color: '#B8860B', fontFamily: "'Caveat', cursive" }}>Al Baik</p>
        <p className={`${mobile ? 'text-[9px]' : 'text-xs'} leading-relaxed`} style={{ color: '#6B6560' }}>Sr. Guest Service Associate<br />March 2024 – Present</p>
      </div>
    </div>
  );
}

function IDCardBadge({
  badgeRef,
  mobile = false,
}: {
  badgeRef: React.RefObject<HTMLDivElement | null>;
  mobile?: boolean;
}) {
  const w = mobile ? 240 : 300;
  const photoH = mobile ? 250 : 320;
  const strapW = mobile ? 14 : 18;

  return (
    <div
      ref={badgeRef}
      className="relative flex flex-col items-center"
      style={{ transformOrigin: 'top center', opacity: 0 }}
    >
      {/* Lanyard Strap — extends upward to infinity */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${strapW}px`,
          height: '100vh',
          background: 'repeating-linear-gradient(0deg, #8A8580 0px, #9A9590 1px, #8A8580 2px, #7A7570 3px, #8A8580 4px)',
          boxShadow: '2px 0 6px rgba(0,0,0,0.15), -1px 0 3px rgba(0,0,0,0.08)',
          borderRadius: '2px',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.05) 1px, transparent 2px, rgba(0,0,0,0.03) 3px, transparent 4px)', borderRadius: '2px' }} />
        <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(45deg, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)', borderRadius: '2px' }} />
      </div>

      {/* Metal Clip */}
      <div className="relative flex flex-col items-center" style={{ marginTop: '-2px' }}>
        <div style={{ width: mobile ? '30px' : '36px', height: mobile ? '12px' : '14px', background: 'linear-gradient(180deg, #B8B3AE 0%, #9A9590 40%, #8A8580 100%)', borderRadius: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '2px', left: '4px', right: '4px', height: '3px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', borderRadius: '2px' }} />
        </div>
        <div style={{ width: '4px', height: mobile ? '8px' : '10px', background: 'linear-gradient(180deg, #9A9590, #7A7570)', borderRadius: '0 0 2px 2px', boxShadow: '0 2px 3px rgba(0,0,0,0.15)' }} />
      </div>

      {/* The ID Card */}
      <div
        className="relative overflow-hidden"
        style={{
          width: `${w}px`,
          borderRadius: mobile ? '14px' : '16px',
          background: 'linear-gradient(145deg, #A8A3A0 0%, #9A9590 30%, #8A8580 100%)',
          padding: mobile ? '8px' : '10px',
          boxShadow: '0 25px 60px rgba(42,37,34,0.25), 0 10px 24px rgba(42,37,34,0.18), 0 2px 6px rgba(42,37,34,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
          marginTop: '-2px',
        }}
      >
        {/* Card slot hole */}
        <div className="flex justify-center" style={{ marginBottom: mobile ? '5px' : '6px', marginTop: '2px' }}>
          <div style={{ width: mobile ? '34px' : '40px', height: mobile ? '7px' : '8px', borderRadius: '4px', background: 'linear-gradient(180deg, #6A6560 0%, #7A7570 100%)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1)' }} />
        </div>

        {/* Inner card face */}
        <div style={{ borderRadius: mobile ? '8px' : '10px', overflow: 'hidden', background: '#FDFBF7', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <div className="relative overflow-hidden" style={{ height: `${photoH}px` }}>
            <img src="/assets/samiullah.webp" alt="Samiulla Shaikh - Senior Guest Service Associate" className="w-full h-full object-cover object-[58%_center]" />
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 -30px 50px rgba(0,0,0,0.08)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
          </div>

          <div className={`text-center ${mobile ? 'py-4 px-3' : 'py-5 px-4'}`} style={{ backgroundColor: '#FDFBF7', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ padding: mobile ? '12px 16px 10px' : '16px 20px 14px' }}>
              <h1 className={`${mobile ? 'text-4xl' : 'text-5xl'} font-bold mb-1`} style={{ color: '#B8860B', fontFamily: "'Kalam', cursive", lineHeight: 1.1 }}>Samiulla</h1>
              <p className={`${mobile ? 'text-[10px] tracking-[2px]' : 'text-xs tracking-[3px]'} uppercase font-semibold`} style={{ color: '#6B6560' }}>Guest Service</p>
            </div>
          </div>

          {!mobile && (
            <div className="flex justify-center pb-5" style={{ backgroundColor: '#FDFBF7' }}>
              <a
                href="https://drive.google.com/file/d/1qlAnCEhAHHn72egY5KgitfQw8KjzSe8I/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 text-xs uppercase tracking-wider font-semibold transition-all duration-200"
                style={{ borderColor: '#B8860B', color: '#B8860B' }}
              >
                Resume <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        <div className={`absolute inset-0 ${mobile ? 'rounded-[14px]' : 'rounded-[16px]'} pointer-events-none`} style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1)' }} />
      </div>

      {/* Ground shadow */}
      <div
        className={`absolute ${mobile ? '-bottom-3' : '-bottom-4'} left-1/2 -translate-x-1/2`}
        style={{ width: mobile ? '200px' : '240px', height: mobile ? '16px' : '20px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(42,37,34,0.12) 0%, transparent 70%)', filter: 'blur(6px)' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  HeroSection — owns refs + GSAP only, no state of its own
 * ═══════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const mobileBadgeRef = useRef<HTMLDivElement>(null);
  const desktopBadgeRef = useRef<HTMLDivElement>(null);

  /* Desktop widget refs (passed to component inner divs) */
  const todoRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  /* Mobile widget WRAPPER refs — these are the actual DOM nodes visible on mobile */
  const mobileTodoWrapRef = useRef<HTMLDivElement>(null);
  const mobileFolderWrapRef = useRef<HTMLDivElement>(null);
  const mobileStampWrapRef = useRef<HTMLDivElement>(null);
  const mobileNoteWrapRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Badge lanyard physics — both mobile & desktop ──
      const badges = [mobileBadgeRef.current, desktopBadgeRef.current].filter(Boolean);

      badges.forEach((badge) => {
        if (!badge) return;

        // Prime GPU layer before the drop
        gsap.set(badge, {
          willChange: 'transform, opacity',
          y: -1200,
          opacity: 0,
          rotation: -12,
          rotationX: -8,
          transformOrigin: 'top center',
          transformPerspective: 1000,
        });

        const tl = gsap.timeline({ delay: 0.1 });

        tl.to(badge, { y: 8, opacity: 1, rotation: 10, rotationX: 4, duration: 0.85, ease: 'power3.in' });
        tl.to(badge, { y: 0, rotationX: 0, duration: 0.14, ease: 'power2.out' });
        tl.to(badge, { rotation: -12, y: 9, rotationX: -1.5, duration: 0.38, ease: 'sine.inOut' }, '-=0.05');
        tl.to(badge, { rotation: 7, y: 6, rotationX: 1, duration: 0.35, ease: 'sine.inOut' });
        tl.to(badge, { rotation: -4, y: 3, rotationX: -0.5, duration: 0.30, ease: 'sine.inOut' });
        tl.to(badge, { rotation: 2, y: 1.5, rotationX: 0.2, duration: 0.26, ease: 'sine.inOut' });
        tl.to(badge, { rotation: 0, y: 0, duration: 0.30, ease: 'power2.out', clearProps: 'willChange' });

        const idleAt = 3.0;
        const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        // Mobile: only 2 idle tweens (no 3D rotationX/Y — expensive compositor layers)
        gsap.to(badge, { rotation: 3.5, duration: 4.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: idleAt });
        gsap.to(badge, { y: 14, duration: 5.0, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: idleAt + 0.4 });
        if (!isMobile) {
          gsap.to(badge, { rotationX: 2, duration: 5.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: idleAt + 1.0 });
          gsap.to(badge, { rotationY: 1.5, duration: 7.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: idleAt + 1.6 });
        }
      });

      // ── Desktop widgets — premium scattered-desk stagger ──
      const desktopWidgets = [todoRef.current, folderRef.current, stampRef.current, noteRef.current].filter(Boolean);
      const rotations = [-4, 3, -2, 5];
      gsap.set(desktopWidgets, { willChange: 'transform, opacity', y: 50, scale: 0.88, rotation: (i: number) => rotations[i] * 2, opacity: 0 });
      gsap.to(desktopWidgets, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: (i: number) => rotations[i] || 0,
        duration: 0.75,
        ease: 'back.out(1.7)',
        stagger: 0.12,
        delay: 1.5,
        clearProps: 'willChange',
      });

      // ── Mobile widgets — premium scattered entrance ──
      const mobileWidgets = [
        mobileTodoWrapRef.current,
        mobileStampWrapRef.current,
        mobileFolderWrapRef.current,
        mobileNoteWrapRef.current,
      ].filter(Boolean);
      gsap.set(mobileWidgets, { willChange: 'transform, opacity', y: 40, opacity: 0 });
      gsap.to(mobileWidgets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 1.5,
        onComplete: () => gsap.set(mobileWidgets, { willChange: 'auto' }),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-8 md:pt-16 md:pb-20" style={{ overflow: 'clip' }}>
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(232,115,46,0.10) 0%, rgba(232,115,46,0.04) 40%, transparent 70%)' }} />

      {/* ═══════════════════════════════════════════════
       *  MOBILE LAYOUT
       * ═══════════════════════════════════════════════ */}
      <div className="lg:hidden relative z-20 w-full mx-auto px-4">
        <div className="relative mx-auto" style={{ minHeight: '740px', maxWidth: '420px' }}>
          <div ref={mobileTodoWrapRef} className="absolute z-[5]" style={{ top: '15px', left: '0px', transform: 'rotate(-7deg)', opacity: 0 }}>
            <TodoList mobile />
          </div>
          <div ref={mobileStampWrapRef} className="absolute z-[5]" style={{ top: '8px', right: '0px', transform: 'rotate(3deg)', opacity: 0 }}>
            <LocationStamp mobile />
          </div>
          <div className="absolute z-[15]" style={{ top: '125px', left: '50%', transform: 'translateX(-50%)' }}>
            <SwingingCardWrapper className="!p-0">
              <IDCardBadge badgeRef={mobileBadgeRef} mobile />
            </SwingingCardWrapper>
          </div>
          <div ref={mobileFolderWrapRef} className="absolute z-[5]" style={{ bottom: '35px', left: '0px', transform: 'rotate(-3deg)', opacity: 0 }}>
            <ProfileBoard mobile />
          </div>
          <div ref={mobileNoteWrapRef} className="absolute z-[5]" style={{ bottom: '45px', right: '0px', transform: 'rotate(3deg)', opacity: 0 }}>
            <StickyNote mobile />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[20]">
            <a
              href="https://drive.google.com/file/d/1qlAnCEhAHHn72egY5KgitfQw8KjzSe8I/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border-2 text-[10px] uppercase tracking-wider font-semibold transition-all duration-200"
              style={{ borderColor: '#B8860B', color: '#B8860B', backgroundColor: '#FDFBF7' }}
            >
              Resume <Download className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
       *  DESKTOP LAYOUT
       * ═══════════════════════════════════════════════ */}
      <div className="hidden lg:grid relative z-20 grid-cols-3 gap-8 items-center max-w-[1100px] mx-auto px-4">
        <div className="flex flex-col gap-4 items-end">
          <TodoList todoRef={todoRef} />
          <div className="mt-2">
            <ProfileBoard folderRef={folderRef} />
          </div>
        </div>
        <div className="flex justify-center">
          <SwingingCardWrapper>
            <IDCardBadge badgeRef={desktopBadgeRef} />
          </SwingingCardWrapper>
        </div>
        <div className="flex flex-col gap-6 items-start">
          <LocationStamp stampRef={stampRef} />
          <StickyNote noteRef={noteRef} />
        </div>
      </div>
    </section>
  );
}
