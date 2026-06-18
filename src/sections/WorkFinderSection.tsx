'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════
 *  PROJECT DATA — add / remove entries freely. Each gets a plastic bag.
 *  The layout auto-adjusts for ANY number of projects (1, 2, 3, 4, 5+).
 * ═══════════════════════════════════════════════════════════════════ */

const projects = [
  {
    name: 'Tara Emerald Hotel',
    link: '',
    certificate: '/assets/certificates/Tara.webp',
  },
  {
    name: 'Al Baik',
    link: 'https://wa.me/917338564132',
    certificate: null,
  },
  {
    name: 'Wind Mills Env.',
    link: '',
    certificate: '/assets/certificates/windmill.webp',
  },
];

/* ═══════════════════════════════════════════════════════════════════
 *  DYNAMIC FAN LAYOUT
 *  Computes position, rotation, scale, and z-index for N bags in a
 *  tight overlapping curved arc.  Center bag is always largest/front.
 *  As N grows, individual bags shrink proportionally so the total
 *  composition stays within bounds.
 *
 *  BAG_W / BAG_H are the base (rendered) size for 1–3 projects.
 *  For 4+ projects, each bag shrinks via a dynamic scale factor
 *  so everything fits without overflow.
 * ═══════════════════════════════════════════════════════════════════ */

const BAG_W = 300; // base bag width  in px (the SVG viewBox is always 240×310)
const BAG_H = 390; // base bag height in px

function computeLayout(n: number) {
  if (n === 0) return { items: [], containerW: 0, containerH: 0, bagW: 0, bagH: 0 };

  // Dynamic sizing: for n<=3 use full size, for n>3 shrink proportionally
  const sizeFactor = n <= 3 ? 1 : Math.max(0.55, 1 - (n - 3) * 0.1);
  const bagW = Math.round(BAG_W * sizeFactor);
  const bagH = Math.round(BAG_H * sizeFactor);

  if (n === 1) {
    return {
      items: [{ x: 0, y: 0, rotate: 0, scale: 1, z: 2 }],
      containerW: bagW + 60,
      containerH: bagH + 40,
      bagW,
      bagH,
    };
  }

  // Overlap: each bag overlaps the previous by ~55-60% of its width
  const overlap = 0.58;
  const stepX = Math.round(bagW * (1 - overlap));

  // Rotation: spread evenly, capped
  const maxRot = Math.min(12 + n * 3, 38);

  // Scale drop from center to edge
  const scaleDrop = Math.min(0.06 + n * 0.008, 0.14);

  const half = (n - 1) / 2;

  const items = Array.from({ length: n }, (_, i) => {
    const t    = i - half;             // -half … 0 … +half
    const absT = half > 0 ? Math.abs(t) / half : 0;  // 0 (center) to 1 (edge)
    return {
      x:      Math.round(t * stepX),
      y:      Math.round(-absT * 24),  // edges dip down (negative = lower)
      rotate: Math.round(t * (maxRot / Math.max(half, 1)) * 10) / 10,
      scale:  Math.round((1 - absT * scaleDrop) * 1000) / 1000,
      z:      Math.round((1 - absT) * n) + 1,
    };
  });

  // Compute total width the fan spans
  const minX = items[0].x;
  const maxX = items[items.length - 1].x;
  const containerW = (maxX - minX) + bagW + 80; // extra breathing room
  const containerH = bagH + 50;

  return { items, containerW, containerH, bagW, bagH };
}

/* ═══════════════════════════════════════════════════════════════════
 *  TABLETS / CAPSULES DRAWING HELPER
 * ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
 *  TABLETOP HOSPITALITY ITEMS DRAWING HELPER
 * ═══════════════════════════════════════════════════════════════════ */

function renderTabletopItems(name: string, id: string) {
  const isAlBaik = name.toLowerCase().includes('baik');
  const isTara = name.toLowerCase().includes('tara') || name.toLowerCase().includes('emerald');
  const isTaj = name.toLowerCase().includes('taj') || name.toLowerCase().includes('gateway');
  
  if (isTaj) {
    // Taj Hotels (Luxury Hotel): Gold/Brass guest key, round gold coin
    return (
      <g>
        {/* Shiny Gold Key Tag + Key */}
        <g transform="translate(62, 276) rotate(-8)" filter={`url(#item-shadow-${id})`}>
          {/* Key tag */}
          <path d="M 0 -35 L 17.5 0 L 0 35 L -17.5 0 Z" fill="#78350F" />
          <path d="M 0 -34 L 16.5 0 L 0 34 L -16.5 0 Z" fill="#B45309" stroke="#FBBF24" strokeWidth="0.8" />
          <circle cx="0" cy="-24" r="3" fill="#D97706" />
          <text x="0" y="-7" textAnchor="middle" fontSize="5.5" fill="#FBBF24" fontWeight="bold" fontFamily="sans-serif">TAJ</text>
          <text x="0" y="6" textAnchor="middle" fontSize="9" fill="url(#gold-coin-grad)" fontWeight="bold" fontFamily="monospace">101</text>
        </g>
        
        {/* Gold Coin */}
        <g transform="translate(160, 278) rotate(22)" filter={`url(#item-shadow-${id})`}>
          <circle cx="0" cy="0" r="14" fill="url(#gold-coin-grad)" stroke="#D97706" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="12" fill="none" stroke="#FBBF24" strokeWidth="0.6" strokeDasharray="2 1" opacity="0.8" />
          <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#78350F" fontFamily="sans-serif">T</text>
        </g>
      </g>
    );
  }

  if (isAlBaik) {
    // Al Baik (Fast Food / Restaurant): Wrapped mints, sauce pouch, wrapped toothpick
    return (
      <g>
        {/* Fast-Food Sauce Pouch */}
        <g transform="translate(52, 276) rotate(-14)" filter={`url(#item-shadow-${id})`}>
          {/* Silver foil background */}
          <rect x="-18" y="-24" width="36" height="48" rx="2.5" fill="url(#sauce-pouch-grad)" stroke="#9CA3AF" strokeWidth="0.4" />
          
          {/* Crimped borders top/bottom */}
          <line x1="-18" y1="-21" x2="18" y2="-21" stroke="#4B5563" strokeWidth="0.8" strokeDasharray="1.5 1" opacity="0.6" />
          <line x1="-18" y1="21" x2="18" y2="21" stroke="#4B5563" strokeWidth="0.8" strokeDasharray="1.5 1" opacity="0.6" />
          
          {/* Crimson logo label */}
          <rect x="-14" y="-15" width="28" height="30" fill="#B91C1C" rx="1.5" stroke="#EF4444" strokeWidth="0.3" />
          <text x="0" y="-7.5" textAnchor="middle" fontSize="4.2" fontWeight="900" fill="#FDE047" fontFamily="sans-serif" letterSpacing="0.2">AL BAIK</text>
          
          {/* Sauce type */}
          <text x="0" y="-0.5" textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#FFFFFF" fontFamily="sans-serif">GARLIC</text>
          <text x="0" y="4.5" textAnchor="middle" fontSize="4" fontWeight="bold" fill="#FFFFFF" fontFamily="sans-serif">PASTE</text>
          
          {/* Tear notches */}
          <path d="M -18 -10 L -15 -8.5 L -18 -7 Z" fill="#4B5563" />
          <path d="M 18 -10 L 15 -8.5 L 18 -7 Z" fill="#4B5563" />

          {/* Shiny plastic/foil crease overlays */}
          <path d="M -15 -20 L 5 22" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.28" />
          <path d="M -8 -22 L 12 20" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.22" />
        </g>

        {/* Wrapped Toothpick (semi-translucent wrapper showing the toothpick inside) */}
        <g transform="translate(192, 275) rotate(42)" filter={`url(#item-shadow-${id})`}>
          {/* Wooden toothpick (under layer) */}
          <rect x="-1" y="-21" width="2" height="42" rx="0.5" fill="#D5A96C" />
          <path d="M 0 -23.5 L 1 -21 L -1 -21 Z" fill="#D5A96C" />
          <path d="M 0 23.5 L 1 21 L -1 21 Z" fill="#D5A96C" />
          
          {/* Paper sleeve wrapper (semi-translucent) */}
          <rect x="-4.5" y="-28" width="9" height="56" rx="1.5" fill="#FFFFFF" fillOpacity="0.84" stroke="#E5E7EB" strokeWidth="0.4" />
          
          {/* Crimped borders at ends */}
          <path d="M -4.5 -28 L 4.5 -28 L 4.5 -25 L -4.5 -25 Z" fill="url(#metal-grad)" opacity="0.15" />
          <path d="M -4.5 28 L 4.5 28 L 4.5 25 L -4.5 25 Z" fill="url(#metal-grad)" opacity="0.15" />
          
          {/* Green sanitised label band */}
          <rect x="-4.5" y="-5" width="9" height="10" fill="#059669" opacity="0.9" />
          <text x="0" y="-1" textAnchor="middle" fontSize="3.8" fill="#FFFFFF" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.2">SANITIZED</text>
          <text x="0" y="3.2" textAnchor="middle" fontSize="3.8" fill="#FFFFFF" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.2">TOOTHPICK</text>
        </g>

        {/* Red wrapped mints (translucent cellophane twists + highlight shines) */}
        <g transform="translate(108, 281) rotate(12)" filter={`url(#item-shadow-${id})`}>
          <path d="M -8 0 C -15 -4, -15 4, -17 8 Z" fill="url(#wrapper-red-grad)" opacity="0.82" />
          <path d="M 8 0 C 15 -4, 15 4, 17 8 Z" fill="url(#wrapper-red-grad)" opacity="0.82" />
          <path d="M -8 0 L -13 -3 M -8 0 L -12 2" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
          <path d="M 8 0 L 13 -3 M 8 0 L 12 2" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
          
          <circle cx="0" cy="0" r="9" fill="url(#candy-red-grad)" stroke="#B91C1C" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="8.2" fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.25" />
          <ellipse cx="-3" cy="-3" rx="2.8" ry="1.4" fill="white" opacity="0.5" transform="rotate(-28 -3 -3)" />
        </g>
        
        <g transform="translate(148, 284) rotate(-22)" filter={`url(#item-shadow-${id})`}>
          <path d="M -8 0 C -15 -4, -15 4, -17 8 Z" fill="url(#wrapper-red-grad)" opacity="0.82" />
          <path d="M 8 0 C 15 -4, 15 4, 17 8 Z" fill="url(#wrapper-red-grad)" opacity="0.82" />
          <path d="M -8 0 L -13 -3 M -8 0 L -12 2" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
          <path d="M 8 0 L 13 -3 M 8 0 L 12 2" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
          
          <circle cx="0" cy="0" r="9" fill="url(#candy-red-grad)" stroke="#B91C1C" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="8.2" fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.25" />
          <ellipse cx="-3" cy="-3" rx="2.8" ry="1.4" fill="white" opacity="0.5" transform="rotate(-28 -3 -3)" />
        </g>
      </g>
    );
  }

  if (isTara) {
    // Tara Emerald Hotel (Luxury Hotel): Molded room key tag, split keyring chain, vintage brass key, gold chocolate coin
    return (
      <g>
        {/* Retro Emerald & Gold Key Tag + Brass Key */}
        <g transform="translate(68, 274) rotate(-16)" filter={`url(#item-shadow-${id})`}>
          {/* Key tag back plastic shadow ridge */}
          <path d="M 0 -35 L 17.5 0 L 0 35 L -17.5 0 Z" fill="#022C22" />
          {/* Front molded face */}
          <path d="M 0 -34 L 16.5 0 L 0 34 L -16.5 0 Z" fill="#064E3B" stroke="#047857" strokeWidth="0.8" />
          
          {/* Gold inner hot-stamp border */}
          <path d="M 0 -30 L 13 0 L 0 30 L -13 0 Z" fill="none" stroke="url(#gold-coin-grad)" strokeWidth="1" opacity="0.95" />
          
          {/* Brass grommet eyelet */}
          <circle cx="0" cy="-24" r="3.5" fill="#047857" stroke="url(#gold-coin-grad)" strokeWidth="1.5" />

          {/* Room details */}
          <text x="0" y="-7" textAnchor="middle" fontSize="6.2" fill="#FBBF24" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.5">ROOM</text>
          <text x="0" y="6" textAnchor="middle" fontSize="11" fill="url(#gold-coin-grad)" fontWeight="bold" fontFamily="monospace" letterSpacing="0.4">302</text>
          <text x="0" y="16" textAnchor="middle" fontSize="3.8" fill="#6EE7B7" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.2">TARA EMERALD</text>

          {/* Brass Split Ring Keychain */}
          <circle cx="-6" cy="-29" r="7.2" fill="none" stroke="url(#gold-coin-grad)" strokeWidth="1.5" />
          {/* Overlay overlap to simulate coiled metal wire split ring */}
          <path d="M -11 -32.5 A 7.2 7.2 0 0 1 -2 -26.5" fill="none" stroke="#D97706" strokeWidth="1" />

          {/* Vintage Brass Key hanging on the ring */}
          <g transform="translate(-10, -18) rotate(25)">
            {/* Key Bow (handle) */}
            <circle cx="0" cy="-12" r="5.5" fill="none" stroke="url(#gold-coin-grad)" strokeWidth="1.6" />
            <circle cx="0" cy="-12" r="2.5" fill="none" stroke="url(#gold-coin-grad)" strokeWidth="0.8" />
            {/* Key Collar */}
            <rect x="-1.8" y="-7.5" width="3.6" height="1.8" rx="0.5" fill="url(#gold-coin-grad)" />
            {/* Key Shaft */}
            <rect x="-1" y="-6" width="2" height="18" fill="url(#gold-coin-grad)" />
            {/* Key Bit (teeth) */}
            <path d="M 0 6 H 4.5 V 8.5 H 0 V 10 H 3.5 V 12 H 0 V 12.5 H -1 V 6 Z" fill="url(#gold-coin-grad)" />
          </g>
        </g>

        {/* Gold Chocolate Coin with detailed foil wrinkles */}
        <g transform="translate(156, 280) rotate(14)" filter={`url(#item-shadow-${id})`}>
          <circle cx="0" cy="0" r="17" fill="url(#gold-coin-grad)" stroke="#D97706" strokeWidth="0.4" />
          {/* Outer ridged teeth */}
          <circle cx="0" cy="0" r="14.5" fill="none" stroke="#FBBF24" strokeWidth="0.8" strokeDasharray="2.5 1.2" opacity="0.85" />
          
          {/* Inner embossed motif */}
          <path d="M -6 4 L -6 1 L -4 -2 L 0 2 L 4 -2 L 6 1 L 6 4 Z" fill="#D97706" />
          <path d="M -6 3.2 L -6 1 L -4 -2 L 0 2 L 4 -2 L 6 1 L 6 3.2 Z" fill="#FBBF24" />
          <circle cx="-4" cy="-4.2" r="0.8" fill="#FBBF24" />
          <circle cx="0" cy="-3.2" r="0.9" fill="#FBBF24" />
          <circle cx="4" cy="-4.2" r="0.8" fill="#FBBF24" />
          <text x="0" y="10" textAnchor="middle" fontSize="4.2" fontWeight="950" fill="#78350F" fontFamily="sans-serif" letterSpacing="0.2">VIP</text>

          {/* Gold foil wrinkle lines */}
          <path d="M -11 -11 L -2 -4 M 5 -12 L 0 -1 M -8 9 L -3 3 M 11 5 L 4 0.5" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.45" />
          <path d="M -13 0 L -8 -2" stroke="#B45309" strokeWidth="0.4" opacity="0.4" />
          {/* Foil 3D light sheen */}
          <path d="M -12 -12 L 12 12" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.22" />
        </g>
      </g>
    );
  }

  // Wind Mills Env. (Brewery & Restaurant): Wooden beverage coaster, metal bottle cap, green mint
  return (
      <g>
        {/* Beer Coaster (Wood grain circles + realistic textures) */}
        <g transform="translate(68, 275) rotate(16)" filter={`url(#item-shadow-${id})`}>
          {/* Wood coaster base */}
          <circle cx="0" cy="0" r="28" fill="url(#coaster-grad)" stroke="#78350F" strokeWidth="0.8" />
          
          {/* Inner border stitching */}
          <circle cx="0" cy="0" r="24.5" fill="none" stroke="#B45309" strokeWidth="0.6" strokeDasharray="4 2" opacity="0.5" />
          
          {/* Ring wood grain lines */}
          <path d="M -18 -10 C -10 -18, 10 -18, 18 -10" fill="none" stroke="#78350F" strokeWidth="0.6" opacity="0.22" />
          <path d="M -22 -5 C -12 -15, 12 -15, 22 -5" fill="none" stroke="#78350F" strokeWidth="0.6" opacity="0.22" />
          <path d="M -15 15 C -5 22, 5 22, 15 15" fill="none" stroke="#78350F" strokeWidth="0.6" opacity="0.18" />
          {/* Wood organic noise specks */}
          <circle cx="-5" cy="-12" r="0.5" fill="#78350F" opacity="0.15" />
          <circle cx="12" cy="8" r="0.6" fill="#78350F" opacity="0.15" />
          <circle cx="-14" cy="5" r="0.4" fill="#78350F" opacity="0.15" />

          {/* Beer Mug logo */}
          <path d="M -6 -7 L 4 -7 L 4 7 L -6 7 Z" fill="none" stroke="#78350F" strokeWidth="1.2" opacity="0.6" />
          <path d="M 4 -4 H 8 A 2.2 2.2 0 0 1 10 -1.8 V 1.8 A 2.2 2.2 0 0 1 8 4 H 4" fill="none" stroke="#78350F" strokeWidth="1.2" opacity="0.6" />
          
          {/* Windmills text */}
          <text x="0" y="14" textAnchor="middle" fontSize="4.2" fill="#78350F" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.5">WIND MILLS</text>
        </g>

        {/* Metal Bottle Cap with crimps and reflection highlights */}
        <g transform="translate(184, 278) rotate(-35)" filter={`url(#item-shadow-${id})`}>
          {/* Outer flanged ridges */}
          <circle cx="0" cy="0" r="12" fill="url(#metal-grad)" stroke="#9CA3AF" strokeWidth="0.3" />
          {Array.from({ length: 18 }).map((_, bi) => {
            const deg = bi * 20;
            const rad = (deg * Math.PI) / 180;
            const x = parseFloat((13.2 * Math.cos(rad)).toFixed(4));
            const y = parseFloat((13.2 * Math.sin(rad)).toFixed(4));
            return (
              <path
                key={bi}
                d={`M 0 0 L ${x} ${y}`}
                stroke="url(#metal-grad)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            );
          })}
          {/* Cap inner liner */}
          <circle cx="0" cy="0" r="10" fill="#1E3A8A" stroke="#1D4ED8" strokeWidth="0.4" />
          {/* Metal edge reflection ring */}
          <circle cx="0" cy="0" r="9.5" fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.25" />
          {/* 3D Highlight ellipse */}
          <ellipse cx="-3.5" cy="-3.5" rx="5" ry="2.2" fill="#FFFFFF" opacity="0.18" transform="rotate(-30 -3.5 -3.5)" />
          {/* Star symbol */}
          <path d="M 0 -3.8 L 1.1 -1 L 3.8 -1 L 1.6 0.8 L 2.6 3.6 L 0 1.8 L -2.6 3.6 L -1.6 0.8 L -3.8 -1 L -1.1 -1 Z" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Green wrapped mint */}
        <g transform="translate(126, 283) rotate(-6)" filter={`url(#item-shadow-${id})`}>
          <path d="M -8 0 C -15 -4, -15 4, -17 8 Z" fill="url(#wrapper-green-grad)" opacity="0.82" />
          <path d="M 8 0 C 15 -4, 15 4, 17 8 Z" fill="url(#wrapper-green-grad)" opacity="0.82" />
          <path d="M -8 0 L -13 -3 M -8 0 L -12 2" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
          <path d="M 8 0 L 13 -3 M 8 0 L 12 2" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
          
          <circle cx="0" cy="0" r="9" fill="url(#candy-green-grad)" stroke="#047857" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="8.2" fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.25" />
          <ellipse cx="-3" cy="-3" rx="2.8" ry="1.4" fill="white" opacity="0.5" transform="rotate(-28 -3 -3)" />
        </g>
      </g>
    );
}

/* ═══════════════════════════════════════════════════════════════════
 *  DYNAMIC PERFORATED RECEIPT PATH GENERATOR (with organic wobbly sides)
 * ═══════════════════════════════════════════════════════════════════ */

function getReceiptPath(xStart: number, xEnd: number, yTop: number, yBottom: number) {
  // Let's create an irregular torn-looking boundary
  let path = `M ${xStart} ${yTop + 1}`;
  
  // Top edge (torn off pad - slightly jagged)
  path += ` L 50 ${yTop - 0.4} L 90 ${yTop + 0.3} L 130 ${yTop - 0.2} L 170 ${yTop + 0.4} L ${xEnd} ${yTop}`;
  
  // Right edge (natural paper side - slightly wobbly)
  path += ` L ${xEnd + 0.4} 60 L ${xEnd - 0.3} 110 L ${xEnd + 0.6} 160 L ${xEnd - 0.5} 210 L ${xEnd + 0.3} 250 L ${xEnd} ${yBottom}`;
  
  // Bottom edge (perforated rip)
  const step = 6;
  const amp = 3.5;
  let isUp = true;
  for (let x = xEnd - step; x >= xStart; x -= step) {
    const sinOffset = parseFloat((Math.sin(x) * 0.4).toFixed(4));
    const y = yBottom + (isUp ? amp : 0) + sinOffset;
    path += ` L ${x} ${y}`;
    isUp = !isUp;
  }
  
  // Left edge (natural paper side - slightly wobbly)
  path += ` L ${xStart} ${yBottom} L ${xStart - 0.4} 240 L ${xStart + 0.5} 190 L ${xStart - 0.6} 140 L ${xStart + 0.3} 90 L ${xStart - 0.4} 40 L ${xStart} ${yTop + 1} Z`;
  
  return path;
}

/* ═══════════════════════════════════════════════════════════════════
 *  REALISTIC RESTAURANT GUEST CHECK — pure SVG
 * ═══════════════════════════════════════════════════════════════════ */

function GuestCheck({
  id,
  index,
  name,
}: {
  id: string;
  index: number;
  name: string;
}) {
  const W = 240;
  const H = 310;

  const xStart = 20;
  const xEnd = 220;
  const yTop = 15;
  const yBottom = 286;

  const cardPath = getReceiptPath(xStart, xEnd, yTop, yBottom);

  // Sticker rotation per check (organic look)
  const rotationSeed = (name.charCodeAt(0) + index) % 3 - 1;
  const checkAngle = -1.2 + rotationSeed * 0.7;

  const isAlBaik = name.toLowerCase().includes('baik');
  const isTara = name.toLowerCase().includes('tara') || name.toLowerCase().includes('emerald');
  const isTaj = name.toLowerCase().includes('taj') || name.toLowerCase().includes('gateway');

  // Custom data items based on company name
  const getOrderItems = () => {
    if (isAlBaik) {
      return [
        { qty: '01', desc: 'SR. GUEST SERVICE', val: '100%' },
        { qty: '01', desc: 'GUEST WELCOME', val: 'PASS' },
        { qty: '01', desc: 'F&B OPS & SERVICE', val: '100%' },
        { qty: '01', desc: 'ORDER ACCURACY', val: 'PASS' },
        { qty: '01', desc: 'UPSELLING SPECS', val: 'YES' },
      ];
    }
    if (isTara) {
      return [
        { qty: '01', desc: 'HOTEL STANDARDS', val: '100%' },
        { qty: '01', desc: 'SOP ADHERENCE', val: 'OK' },
        { qty: '01', desc: 'GUEST SERVICE', val: 'MAX' },
        { qty: '01', desc: 'ROOM SERVICE OPS', val: 'PASS' },
        { qty: '01', desc: 'TEAM PLAYER', val: 'TRUE' },
      ];
    }
    if (isTaj) {
      return [
        { qty: '01', desc: 'FRONT OFFICE OPS', val: 'PASS' },
        { qty: '01', desc: 'HOUSEKEEPING SOP', val: '100%' },
        { qty: '01', desc: 'F&B SERVICE', val: 'GOOD' },
        { qty: '01', desc: 'EXPOSURE TRAINING', val: 'PASS' },
        { qty: '01', desc: 'TAJ STANDARDS', val: '100%' },
      ];
    }
    return [
      { qty: '01', desc: 'MENU KNOWLEDGE', val: 'EXCEL' },
      { qty: '01', desc: 'F&B OPERATIONS', val: '100%' },
      { qty: '01', desc: 'GUEST RELATIONS', val: 'OK' },
      { qty: '01', desc: 'BILLING ACCURACY', val: '100%' },
      { qty: '01', desc: 'DYNAMIC SERVICE', val: 'PASS' },
    ];
  };

  const getCheckMetadata = () => {
    if (isAlBaik) return { serial: 'No. 085694', date: '2024.03', table: '01' };
    if (isTara) return { serial: 'No. 041280', date: '2022.08', table: '02' };
    if (isTaj) return { serial: 'No. 018488', date: '2019.03', table: '04' };
    return { serial: 'No. 093375', date: '2021.05', table: '03' };
  };

  const items = getOrderItems();
  const meta = getCheckMetadata();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        {/* ── Paper gradients (branded & glassmorphic) ── */}
        <linearGradient id={`paper-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          {isAlBaik ? (
            <>
              {/* Al Baik: warm cream glass */}
              <stop offset="0%" stopColor="#FFFDF9" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FAF3E6" stopOpacity="0.60" />
            </>
          ) : isTara ? (
            <>
              {/* Tara Emerald: light emerald/mint glass */}
              <stop offset="0%" stopColor="#F5FAF6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#E2EFE7" stopOpacity="0.60" />
            </>
          ) : isTaj ? (
            <>
              {/* Taj Gateway: light golden/orange glass */}
              <stop offset="0%" stopColor="#FFFBF0" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FDF0D5" stopOpacity="0.60" />
            </>
          ) : (
            <>
              {/* Wind Mills Env: natural warm-grey glass */}
              <stop offset="0%" stopColor="#FAFAF7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#EFF0E8" stopOpacity="0.60" />
            </>
          )}
        </linearGradient>

        {/* ── Glass Edge highlight gradient ── */}
        <linearGradient id={`glass-edge-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
        </linearGradient>

        {/* ── Glass Shimmer Reflection gradient ── */}
        <linearGradient id={`glass-shine-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="26%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="71%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>

        {/* ── Tabletop items gradients ── */}
        <linearGradient id="metal-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="35%" stopColor="#D1D5DB" />
          <stop offset="70%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>

        <linearGradient id="sauce-pouch-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E5E7EB" />
          <stop offset="80%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>

        <linearGradient id="wrapper-red-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#FCA5A5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="candy-red-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="70%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>

        <linearGradient id="gold-coin-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <radialGradient id="coaster-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.1" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>

        <linearGradient id="wrapper-green-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="candy-green-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </radialGradient>

        {/* ── Guest check background grid ── */}
        <pattern id={`grid-${id}`} width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="M 13 0 L 0 0 0 13" fill="none" stroke="#0E8B7D" strokeWidth="0.5" opacity="0.09" />
        </pattern>

        {/* ── Crinkle folding crease ── */}
        <linearGradient id={`crinkle-${id}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.03" />
          <stop offset="45%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.04" />
        </linearGradient>

        {/* ── 3D Lighting fold overlay ── */}
        <linearGradient id={`fold-light-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="52%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
        </linearGradient>

        {/* ── Paper shadows ── */}
        <filter id={`shadow-${id}`} x="-20%" y="-15%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#2A2522" floodOpacity="0.11" />
          <feDropShadow dx="0" dy="3" stdDeviation="4"  floodColor="#2A2522" floodOpacity="0.07" />
        </filter>

        {/* ── Tabletop item shadow ── */}
        <filter id={`item-shadow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="2" dy="6" stdDeviation="4.5" floodColor="#1C1816" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ── Guest Check Card with animations ── */}
      <g transform={`rotate(${checkAngle} 120 150)`}>
        {/* Receipt drop shadow & background */}
        <path
          d={cardPath}
          filter={`url(#shadow-${id})`}
          fill={`url(#paper-grad-${id})`}
          stroke={`url(#glass-edge-grad-${id})`}
          strokeWidth="1.2"
          style={{
            // backdropFilter is non-functional on SVG path elements — removed
            // to eliminate unnecessary GPU layer allocation per card
          }}
        />

        {/* Specular glass reflection shine (diagonal gradient overlay) */}
        <path
          className="wf-glass-shine"
          d={cardPath}
          fill={`url(#glass-shine-grad-${id})`}
          style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
        />

        {/* Grid pattern overlay */}
        <path d={cardPath} fill={`url(#grid-${id})`} />

        {/* Paper crease / lighting fold */}
        <path d={cardPath} fill={`url(#fold-light-${id})`} style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} />
        <path d={cardPath} fill={`url(#crinkle-${id})`} style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }} />

        {/* Staple at top */}
        <g opacity="0.95">
          {/* Staple holes */}
          <ellipse cx="108" cy="15.5" rx="1.2" ry="0.6" fill="#1F2937" opacity="0.75" />
          <ellipse cx="132" cy="15.5" rx="1.2" ry="0.6" fill="#1F2937" opacity="0.75" />
          {/* Staple bar */}
          <rect x="106" y="11" width="28" height="4" rx="1" fill="url(#metal-grad)" stroke="#4B5563" strokeWidth="0.3" />
          {/* Staple highlight */}
          <line x1="107" y1="12" x2="133" y2="12" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.65" />
        </g>

        {/* Coffee Cup Ring Stain (Organic touch) */}
        <path
          d="M 175 60 C 190 55, 215 70, 212 90 C 209 110, 185 115, 170 100 C 155 85, 160 65, 175 60 Z"
          fill="none"
          stroke="#7C2D12"
          strokeWidth="1.6"
          strokeDasharray="20 4 8 2 40 6"
          opacity="0.15"
          transform="rotate(15 190 85)"
          filter="blur(0.8px)"
        />
        {/* Coffee Stain Splatters */}
        <circle cx="188" cy="115" r="1.2" fill="#7C2D12" opacity="0.15" filter="blur(0.4px)" />
        <circle cx="150" cy="95" r="0.8" fill="#7C2D12" opacity="0.12" filter="blur(0.4px)" />
        <circle cx="202" cy="72" r="1.6" fill="#7C2D12" opacity="0.14" filter="blur(0.4px)" />

        {/* PRINTED TICKET CONTENT */}
        
        {/* Shop/Employer Name - Uniform font, weight, and size across all cards */}
        <text
          x="120"
          y="39"
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fontFamily="'Outfit', 'Inter', 'system-ui', sans-serif"
          fill="#111827"
          letterSpacing="0.8"
        >
          {name.toUpperCase()}
        </text>

        {/* Header Stamped Title */}
        <text x="120" y="51" textAnchor="middle" fontSize="7" fontWeight="800"
          fontFamily="system-ui, sans-serif" fill="#0E8B7D" letterSpacing="2.5">
          GUEST CHECK
        </text>

        {/* Metadata Table Header */}
        <line x1="26" y1="58" x2="214" y2="58" stroke="#0E8B7D" strokeWidth="0.8" opacity="0.4" />
        <line x1="26" y1="80" x2="214" y2="80" stroke="#0E8B7D" strokeWidth="0.8" opacity="0.4" />
        
        <line x1="72" y1="58" x2="72" y2="80" stroke="#0E8B7D" strokeWidth="0.8" opacity="0.4" />
        <line x1="110" y1="58" x2="110" y2="80" stroke="#0E8B7D" strokeWidth="0.8" opacity="0.4" />
        <line x1="154" y1="58" x2="154" y2="80" stroke="#0E8B7D" strokeWidth="0.8" opacity="0.4" />

        <text x="49" y="66" textAnchor="middle" fontSize="5.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">DATE</text>
        <text x="49" y="75" textAnchor="middle" fontSize="7.5" fontWeight="bold" fontFamily="monospace" fill="#2A2522">{meta.date}</text>

        <text x="91" y="66" textAnchor="middle" fontSize="5.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">TABLE</text>
        <text x="91" y="75" textAnchor="middle" fontSize="7.5" fontWeight="bold" fontFamily="monospace" fill="#2A2522">{meta.table}</text>

        <text x="132" y="66" textAnchor="middle" fontSize="5.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">GUESTS</text>
        <text x="132" y="75" textAnchor="middle" fontSize="7.5" fontWeight="bold" fontFamily="monospace" fill="#2A2522">01</text>

        <text x="184" y="66" textAnchor="middle" fontSize="5.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">SERVER</text>
        <text x="184" y="75" textAnchor="middle" fontSize="7" fontWeight="bold" fontFamily="monospace" fill="#2A2522">SAMIULLA</text>

        {/* Serial Number removed per request */}

        {/* Order Items Table */}
        <text x="28" y="93" fontSize="6.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">QTY</text>
        <text x="50" y="93" fontSize="6.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">DESCRIPTION</text>
        <text x="212" y="93" textAnchor="end" fontSize="6.5" fontWeight="bold" fontFamily="monospace" fill="#0E8B7D">VAL</text>

        <line x1="26" y1="97" x2="214" y2="97" stroke="#0E8B7D" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4" />

        {/* Item Rows */}
        {items.map((item, ii) => {
          const yPos = 111 + ii * 14;
          return (
            <g key={ii} fontSize="7" fontWeight="bold" fontFamily="monospace" fill="#2A2522">
              <text x="28" y={yPos}>{item.qty}</text>
              <text x="50" y={yPos}>{item.desc}</text>
              
              {/* Leader dots */}
              <text x="195" y={yPos} textAnchor="end" opacity="0.25" letterSpacing="1.5">
                ....................
              </text>
              
              <text x="212" y={yPos} textAnchor="end" fill="#0E8B7D">{item.val}</text>
            </g>
          );
        })}

        {/* Billing total summary */}
        <line x1="26" y1="184" x2="214" y2="184" stroke="#0E8B7D" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4" />
        
        <text x="50" y="196" fontSize="7.5" fontWeight="bold" fontFamily="monospace" fill="#2A2522">SUBTOTAL</text>
        <text x="212" y="196" textAnchor="end" fontSize="7.5" fontWeight="bold" fontFamily="monospace" fill="#2A2522">SUCCESS</text>

        <text x="50" y="209" fontSize="9" fontWeight="950" fontFamily="monospace" fill="#2A2522">TOTAL</text>
        <text x="212" y="209" textAnchor="end" fontSize="9" fontWeight="950" fontFamily="monospace" fill="#0E8B7D">EXCELLENT</text>

        {/* Diagnostic/Served Stamp - Green serving stamp for Al Baik, Gold/Yellow for Taj, Red for others */}
        <g transform="translate(122, 195) rotate(-16)">
          <rect x="-42" y="-12" width="84" height="24" rx="2" fill="none" stroke={isAlBaik ? '#10B981' : isTaj ? '#D97706' : '#EF4444'} strokeWidth="2.2" strokeDasharray="35 3 10 2" opacity="0.35" />
          <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="900" fontFamily="sans-serif" fill={isAlBaik ? '#10B981' : isTaj ? '#D97706' : '#EF4444'} opacity="0.35" letterSpacing="2.2">
            {isAlBaik ? 'SERVING' : 'SERVED'}
          </text>
        </g>

        {/* Handwritten Footer */}
        <text x="120" y="231" textAnchor="middle" fontSize="13.5"
          fontFamily="'Caveat', cursive" fill="#0E8B7D">
          Thank you! Come again
        </text>

        {/* Barcode */}
        <g opacity="0.7" transform="translate(38, 243)">
          {[0, 3.5, 6, 9.5, 12.5, 15, 18, 21.5, 24, 27.5, 31, 34, 37.5, 41, 44.5, 47, 50.5, 54, 57, 60.5, 64, 67, 70, 73.5, 76].map((bx, bi) => (
            <rect key={bi} x={bx} y="0" width={bi % 4 === 0 ? 2 : bi % 3 === 0 ? 1.5 : 0.8} height="12" fill="#2A2522" />
          ))}
        </g>
        
        {/* barcode sub text */}
        <text x="120" y="260" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="#71717A" letterSpacing="1">
          *SAMIULLAH-SHAIKH-CV*
        </text>

        {/* Tabletop candies and accessories peeking out at bottom */}
        {renderTabletopItems(name, id)}
      </g>
    </svg>
  );
}


/* ═══════════════════════════════════════════════════════════════════
 *  MAIN SECTION COMPONENT
 * ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
 *  CERTIFICATE MODAL — Premium GSAP-animated polaroid viewer
 * ═══════════════════════════════════════════════════════════════════ */
function CertificateModal({
  image,
  title,
  onClose,
}: {
  image: string;
  title: string;
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

    // GSAP cannot tween backdropFilter — the inline style already has blur(16px)
    // applied on the overlay element. Just animate opacity.
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
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' },
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

  const caption =
    title === 'Taj Gateway Hotel'   ? 'Taj Hotels Resorts & Palaces ✦' :
    title === 'Tara Emerald Hotel'  ? 'Tara Emerald Hospitality ✦' :
                                      'TotalEnvironment Hospitality ✦';

  const tapeColor =
    title === 'Taj Gateway Hotel'   ? '#FCD34D' :
    title === 'Tara Emerald Hotel'  ? '#A7F3D0' : '#93C5FD';

  const glowColor =
    title === 'Taj Gateway Hotel'   ? 'rgba(251, 191, 36, 0.45)' :
    title === 'Tara Emerald Hotel'  ? 'rgba(52, 211, 153, 0.45)' : 'rgba(96, 165, 250, 0.45)';

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
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
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
            opacity: 0,
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
            Official Verification Document
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
              alt={caption}
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
            {caption}
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
                id="seal-text-path"
                d="M 10 30 A 20 20 0 1 1 50 30"
                fill="none"
                stroke="none"
              />
              <text fontSize="4.6" fontWeight="bold" fill="#0E8B7D" letterSpacing="0.6">
                <textPath href="#seal-text-path" startOffset="10%">
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

export default function WorkFinderSection() {
  const sectionRef     = useRef<HTMLDivElement>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
    setSelectedTitle(null);
  }, []);

  /* ── Pause blob animations when section is off-screen ────────────────
     Blobs have will-change:transform + filter:blur — even GPU-composited
     they consume power when animating. Pause them when not visible.     */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const comp = compositionRef.current;
        if (!comp) return;
        if (entry.isIntersecting) {
          comp.classList.remove('wf-blobs-paused');
        } else {
          comp.classList.add('wf-blobs-paused');
        }
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);


  const { items: layouts, containerW, containerH, bagW, bagH } =
    computeLayout(projects.length);

  /* ── responsive scaling: scales the composition down on smaller screens ── */
  useEffect(() => {
    const wr = wrapperRef.current;
    const co = compositionRef.current;
    if (!wr || !co) return;

    const update = () => {
      const isMobile = wr.clientWidth < 768;
      // Desktop: allow upscaling up to 1.5× so cards fill more screen width
      // Mobile:  cap at 1× so the fan never overflows the viewport
      const maxScale = isMobile ? 1.0 : 1.5;
      const s = Math.min(maxScale, wr.clientWidth / containerW);
      co.style.transform = `translateX(-50%) scale(${s})`;
      wr.style.height = `${containerH * s}px`;
    };

    const ro = new ResizeObserver(update);
    ro.observe(wr);
    update();
    return () => ro.disconnect();
  }, [containerW, containerH]);

  /* ── scroll entrance animation ── */
  useEffect(() => {
    if (!sectionRef.current) return;

    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const ctx = gsap.context(() => {
      /* ── Title entrance: smooth fade + slide ── */
      gsap.from('.wf-title', {
        opacity: 0,
        y: 30,
        duration: isMobile ? 0.5 : 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: isMobile ? 'top 93%' : 'top 87%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      if (isMobile) {
        /* ── Mobile: snappy staggered entrance ── */
        gsap.set('.wf-bag', { willChange: 'transform, opacity' });
        gsap.from('.wf-bag', {
          opacity: 0,
          y: 60,
          scale: 0.7,
          duration: 0.5,
          stagger: { from: 'center', amount: 0.25 },
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 91%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      } else {
        /* ── Desktop: instant snap entrance — no scrub lag ── */
        const bags = gsap.utils.toArray<HTMLElement>('.wf-bag');
        const centerIdx = Math.floor(bags.length / 2);

        // Prime GPU layers before animating
        gsap.set(bags, { willChange: 'transform, opacity' });

        bags.forEach((bag, i) => {
          const distFromCenter = Math.abs(i - centerIdx);
          const delay = distFromCenter * 0.07;

          gsap.fromTo(
            bag,
            { opacity: 0, y: 60 + distFromCenter * 14, scale: 0.65 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              delay,
              ease: 'power3.out',
              clearProps: 'willChange',
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: 'top 82%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4" style={{ overflowX: 'clip' }}>

      {/* hover lift + mobile float + glassmorphic blobs and interactive animations */}
      <style>{`
        .wf-lift{transition:transform .32s cubic-bezier(.4,0,.2,1)}
        .wf-lift:hover{transform:translateY(-18px)}

        /* Glowing background blobs — GPU-composited only, no mix-blend-mode
           (mix-blend-mode forces software rendering; removing it allows the
           browser to fully GPU-composite via will-change:transform) */
        .wf-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.18;
          pointer-events: none;
          will-change: transform;
          z-index: 0;
        }
        .wf-blob-1 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(14,139,125,0.55) 0%, rgba(14,139,125,0) 70%);
          left: 10%;
          top: 0px;
          animation: wf-blob-move-1 18s ease-in-out infinite alternate;
        }
        .wf-blob-2 {
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(217,119,6,0.5) 0%, rgba(217,119,6,0) 70%);
          right: 15%;
          bottom: 20px;
          animation: wf-blob-move-2 20s ease-in-out infinite alternate-reverse;
        }
        .wf-blob-3 {
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0) 70%);
          left: 38%;
          top: 100px;
          animation: wf-blob-move-3 16s ease-in-out infinite alternate;
        }

        @keyframes wf-blob-move-1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(30px, -20px) scale(1.08); }
          100% { transform: translate(-15px, 10px) scale(0.94); }
        }
        @keyframes wf-blob-move-2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-25px, 25px) scale(0.9); }
          100% { transform: translate(20px, -10px) scale(1.06); }
        }
        @keyframes wf-blob-move-3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-10px, -30px) scale(1.05); }
          100% { transform: translate(18px, 20px) scale(0.96); }
        }

        /* Pause blob animations when section is off-screen */
        .wf-blobs-paused .wf-blob { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .wf-blob { animation: none !important; }
        }

        /* Reactive glass shine reflection */
        .wf-glass-shine {
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease;
          transform: translate(0px, 0px);
          transform-origin: center;
        }
        .wf-bag:hover .wf-glass-shine {
          transform: translate(14px, 14px) scale(1.02);
          opacity: 1;
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
        @keyframes wf-float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-18px); }
          100% { transform: translateY(0px); }
        }

        @media (hover: none) and (pointer: coarse) {
          .wf-lift {
            animation: wf-float 2.8s ease-in-out infinite;
            transition: none;
          }
          .wf-lift:hover { transform: none; }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto">

        {/* Heading — matches theme: bold uppercase + script subtitle */}
        <div className="wf-title text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight" style={{ color: '#2A2522' }}>
            SAMIULLA&apos;S
          </h2>
          <span
            className="text-2xl md:text-3xl lg:text-4xl -mt-1 block"
            style={{ color: '#0E8B7D', fontFamily: "'Caveat', cursive" }}
          >
            work history
          </span>
        </div>

        {/* Fan composition wrapper */}
        <div
          ref={wrapperRef}
          className="relative mx-auto"
          style={{ width: '100%', overflow: 'visible' }}
        >
          <div
            ref={compositionRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: `${containerW}px`,
              height: `${containerH}px`,
              transformOrigin: 'top center',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Glowing background liquid glassmorphism blobs */}
            <div className="wf-blob wf-blob-1" />
            <div className="wf-blob wf-blob-2" />
            <div className="wf-blob wf-blob-3" />

            {projects.map((project, i) => {
              const l = layouts[i];
              const hasLink = !!project.link || !!project.certificate;
              const uid = `bag-${i}`;

              const bag = (
                <GuestCheck
                  id={uid}
                  index={i}
                  name={project.name}
                />
              );

              const handleClick = (e: React.MouseEvent) => {
                if (project.certificate) {
                  e.preventDefault();
                  setSelectedImage(project.certificate);
                  setSelectedTitle(project.name);
                }
              };

              const wrappedBag = hasLink ? (
                <a
                  href={project.link || '#'}
                  target={project.link ? "_blank" : undefined}
                  rel={project.link ? "noopener noreferrer" : undefined}
                  onClick={handleClick}
                  aria-label={project.name}
                  style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}
                >
                  {bag}
                </a>
              ) : (
                <div style={{ width: '100%', height: '100%' }}>{bag}</div>
              );

              return (
                <div
                  key={i}
                  className="wf-bag"
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${l.x}px - ${bagW / 2}px)`,
                    bottom: `calc(4% + ${l.y}px)`,
                    width: `${bagW}px`,
                    height: `${bagH}px`,
                    zIndex: l.z,
                    cursor: hasLink ? 'pointer' : 'default',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* hover lift layer — staggered float on mobile */}
                  <div className="wf-lift" style={{ width: '100%', height: '100%', animationDelay: `${i * 0.55}s` }}>
                    {/* rotation + scale layer */}
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${l.rotate}deg) scale(${l.scale})`,
                        transformOrigin: 'bottom center',
                      }}
                    >
                      {wrappedBag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Certificate Modal — rendered in a portal so it escapes
          any CSS containment / stacking-context on the section element */}
      {selectedImage && selectedTitle &&
        createPortal(
          <CertificateModal
            image={selectedImage}
            title={selectedTitle}
            onClose={handleCloseModal}
          />,
          document.body
        )
      }
    </section>
  );
}
