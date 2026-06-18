'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // ── Global GSAP performance config ─────────────────────────────
    // Disable lagSmoothing so GSAP never throttles on slow frames
    gsap.ticker.lagSmoothing(0);

    // Force GPU-composited layer for all GSAP animations
    gsap.config({ force3D: true });

    // ScrollTrigger: invalidate cached measurements on resize so
    // triggers are always pinpoint accurate after layout changes
    ScrollTrigger.config({
      ignoreMobileResize: true,  // don't re-trigger on mobile address-bar hide/show
      limitCallbacks: true,      // batch callbacks — reduces JS execution per frame
    });

    if (isTouchDevice) {
      // Native momentum scroll is already fast on mobile.
      // Just make sure ScrollTrigger is calibrated.
      ScrollTrigger.refresh();
      return;
    }

    // ── Desktop Lenis — maximum snappiness ─────────────────────────
    // lerp 0.14 = noticeably crisper than default 0.10
    // syncToNative keeps it in sync with the browser paint cycle
    const lenis = new Lenis({
      lerp: 0.14,
      syncToNative: false,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenisRef.current = lenis;
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    // Wire Lenis → ScrollTrigger so all scroll positions stay in sync
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP's own ticker for the RAF loop — one unified loop,
    // no duplicate requestAnimationFrame calls
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      (window as unknown as Record<string, unknown>).__lenis = undefined;
    };
  }, []);

  return lenisRef;
}
