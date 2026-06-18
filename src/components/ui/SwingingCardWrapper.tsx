'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════════════
 *  SwingingCardWrapper
 *  ─────────────────────────────────────────────────────────────
 *  HOVER  — original 3-D tilt tracking (rotateX/Y/Z, rAF lerp)
 *           transformOrigin '50% -100px' → pivot above card
 *           pendulum swing-back on mouse leave
 *
 *  PULL-DOWN — hold + drag DOWN only (translateY ≥ 0)
 *              left / right / up are intentionally blocked
 *              elastic spring-back on release
 *              applied on OUTER wrapper so GSAP breathing
 *              animations on the inner badge are never touched
 *
 *  TOUCH  — tap-to-bounce tilt (original) + pull-down tracking
 * ═══════════════════════════════════════════════════════════════ */

// ── Pull-down constants ──────────────────────────────────────
const MAX_PULL   = 130;   // px — maximum downward stretch
const SPRING_K   = 200;   // stiffness
const SPRING_D   = 22;    // damping
const DT         = 1 / 60;

// ── Hover tilt constants (unchanged from original) ───────────
const MAX_TILT   = 10;
const MAX_SWAY   = 3;
const PERSPECTIVE = 1200;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface Props { children: ReactNode; className?: string; }

export default function SwingingCardWrapper({ children, className = '' }: Props) {
  // outer — pull-down translateY + event listener
  const wrapRef   = useRef<HTMLDivElement>(null);
  // inner — hover tilt rotations (transformOrigin -100px)
  const cardRef   = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const rafRef    = useRef<number>(0);

  // ── Hover tilt state ─────────────────────────────────────
  const isHovering = useRef(false);
  const targetTilt = useRef({ rx: 0, ry: 0, rz: 0 });
  const currentTilt = useRef({ rx: 0, ry: 0, rz: 0 });

  // ── Pull-down state ───────────────────────────────────────
  const isPulling    = useRef(false);
  const pullStartY   = useRef(0);     // pointer Y when hold started
  const pullY        = useRef(0);     // current pull distance (px, ≥ 0)
  const pullVel      = useRef(0);     // velocity for spring
  const prevPullPtrY = useRef(0);     // previous pointer Y for velocity

  /* ── Set up inner card's 3-D perspective (original) ── */
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, {
      transformPerspective: PERSPECTIVE,
      transformOrigin: '50% -100px',
      transformStyle: 'preserve-3d',
    });
  }, []);

  /* ───────────────────────────────────────────────────────────
   *  PULL-DOWN HELPERS
   * ───────────────────────────────────────────────────────────*/

  /** Write the pull-down translateY to the outer wrapper */
  const applyPull = useCallback(() => {
    if (!wrapRef.current) return;
    const y = pullY.current;
    wrapRef.current.style.transform = y > 0.1 ? `translateY(${y.toFixed(2)}px)` : '';

    // Shadow grows / descends as card is pulled
    if (shadowRef.current && !isHovering.current) {
      const blur = 28 + y * 0.18;
      const oy   = 12 + y * 0.35;
      shadowRef.current.style.transform = `translateY(${oy.toFixed(1)}px)`;
      shadowRef.current.style.filter    = `blur(${blur.toFixed(0)}px)`;
    }
  }, []);

  /** Spring-back loop for the pull-down */
  const springLoop = useCallback(() => {
    const force = -SPRING_K * pullY.current - SPRING_D * pullVel.current;
    pullVel.current += force * DT;
    pullY.current   += pullVel.current * DT;

    applyPull();

    const settled =
      Math.abs(pullY.current) < 0.15 && Math.abs(pullVel.current) < 0.15;

    if (settled) {
      pullY.current = 0; pullVel.current = 0;
      applyPull();
      return;
    }
    rafRef.current = requestAnimationFrame(springLoop);
  }, [applyPull]);

  /* ───────────────────────────────────────────────────────────
   *  HOVER TILT HELPERS  (original rAF lerp approach)
   * ───────────────────────────────────────────────────────────*/

  const hoverLoop = useCallback(() => {
    if (!cardRef.current || !isHovering.current) return;

    const c = currentTilt.current;
    const t = targetTilt.current;
    const s = 0.06; // silky trail

    c.rx = lerp(c.rx, t.rx, s);
    c.ry = lerp(c.ry, t.ry, s);
    c.rz = lerp(c.rz, t.rz, s);

    cardRef.current.style.transform =
      `rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg) ` +
      `rotateZ(${c.rz.toFixed(3)}deg) scale3d(1.015,1.015,1.015)`;

    if (shadowRef.current) {
      const sx   = -c.ry * 0.8;
      const sy   =  c.rx * 0.6 + 12;
      const blur =  28 + Math.abs(c.ry) * 0.8;
      shadowRef.current.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`;
      shadowRef.current.style.filter    = `blur(${blur.toFixed(0)}px)`;
    }

    rafRef.current = requestAnimationFrame(hoverLoop);
  }, []);

  const calcTilt = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const nx = Math.max(-1, Math.min(1, (clientX - cx) / (rect.width  / 2)));
    const ny = Math.max(-1, Math.min(1, (clientY - cy) / (rect.height / 2)));
    targetTilt.current = { ry: nx * MAX_TILT, rx: -ny * MAX_TILT, rz: nx * MAX_SWAY };
  }, []);

  /* ───────────────────────────────────────────────────────────
   *  MOUSE EVENTS
   * ───────────────────────────────────────────────────────────*/

  const handleMouseEnter = useCallback(() => {
    if (isPulling.current) return;
    isHovering.current = true;
    rafRef.current = requestAnimationFrame(hoverLoop);
  }, [hoverLoop]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPulling.current) return;
    calcTilt(e.clientX, e.clientY);
    if (!isHovering.current) {
      isHovering.current = true;
      rafRef.current = requestAnimationFrame(hoverLoop);
    }
  }, [calcTilt, hoverLoop]);

  const handleMouseLeave = useCallback(() => {
    if (isPulling.current) return;
    isHovering.current = false;
    cancelAnimationFrame(rafRef.current);

    if (!cardRef.current) return;
    const c = currentTilt.current;

    // Original pendulum swing-back
    const tl = gsap.timeline({ overwrite: true });
    tl.to(cardRef.current, {
      rotationX: -c.rx * 0.35,
      rotationY: -c.ry * 0.35,
      rotationZ: -c.rz * 0.3,
      scale: 1,
      duration: 0.45,
      ease: 'power2.out',
    });
    tl.to(cardRef.current, {
      rotationX:  c.rx * 0.12,
      rotationY:  c.ry * 0.12,
      rotationZ:  c.rz * 0.08,
      duration: 0.4,
      ease: 'sine.inOut',
    });
    tl.to(cardRef.current, {
      rotationX: 0, rotationY: 0, rotationZ: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        currentTilt.current = { rx: 0, ry: 0, rz: 0 };
        targetTilt.current  = { rx: 0, ry: 0, rz: 0 };
      },
    });

    if (shadowRef.current) {
      gsap.to(shadowRef.current, { x: 0, y: 12, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
    }
  }, []);

  /** Mouse down — begin pull-down tracking */
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Stop hover tilt while pulling
    isHovering.current = false;
    cancelAnimationFrame(rafRef.current);

    isPulling.current  = true;
    pullStartY.current = e.clientY;
    prevPullPtrY.current = e.clientY;
    pullVel.current    = 0;
  }, []);

  /* Global mouse move / up so release outside container still fires */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isPulling.current) return;
      const dy = e.clientY - pullStartY.current;
      // Only DOWN (positive), block left/right/up
      pullY.current = Math.max(0, Math.min(MAX_PULL, dy));
      // Velocity
      pullVel.current = (e.clientY - prevPullPtrY.current) / DT / 60;
      prevPullPtrY.current = e.clientY;
      applyPull();
    };

    const onUp = () => {
      if (!isPulling.current) return;
      isPulling.current = false;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(springLoop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [applyPull, springLoop]);

  /* ───────────────────────────────────────────────────────────
   *  TOUCH EVENTS
   * ───────────────────────────────────────────────────────────*/

  /** Tap-to-bounce tilt (original) + begin pull tracking */
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch || !cardRef.current) return;

    isPulling.current    = true;
    pullStartY.current   = touch.clientY;
    prevPullPtrY.current = touch.clientY;
    pullVel.current      = 0;
    cancelAnimationFrame(rafRef.current);

    // Original tap tilt effect
    calcTilt(touch.clientX, touch.clientY);
    const t = targetTilt.current;
    gsap.to(cardRef.current, {
      rotationY: t.ry,
      rotationX: t.rx,
      rotationZ: t.rz,
      scale: 1.015,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    });
  }, [calcTilt]);

  /** Touch move — pull-down + reduced tilt tracking (original) */
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    // Pull-down (downward only)
    const dy = touch.clientY - pullStartY.current;
    if (dy > 0) {
      pullY.current = Math.min(MAX_PULL, dy);
      pullVel.current = (touch.clientY - prevPullPtrY.current) / DT / 60;
      applyPull();
    }
    prevPullPtrY.current = touch.clientY;

    // Reduced tilt tracking (original behaviour)
    if (cardRef.current) {
      calcTilt(touch.clientX, touch.clientY);
      const t = targetTilt.current;
      gsap.to(cardRef.current, {
        rotationX: t.rx * 0.3,
        rotationY: t.ry * 0.3,
        rotationZ: t.rz * 0.2,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, [calcTilt, applyPull]);

  /** Touch end — spring back tilt + pull */
  const handleTouchEnd = useCallback(() => {
    isPulling.current = false;

    // Spring tilt back (original elastic release)
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.4)',
        overwrite: true,
      });
    }

    // Spring pull-down back
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(springLoop);
  }, [springLoop]);

  /* ── Cleanup ── */
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ cursor: 'grab', touchAction: 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic shadow */}
      <div
        ref={shadowRef}
        className="absolute -z-10 pointer-events-none"
        style={{
          left: '15%', right: '15%', bottom: '-8px',
          height: '40px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(42,37,34,0.13) 0%, transparent 70%)',
          filter: 'blur(28px)',
          transform: 'translateY(12px)',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Inner card — hover tilt applied here via cardRef */}
      <div ref={cardRef}>
        {children}
      </div>
    </div>
  );
}
