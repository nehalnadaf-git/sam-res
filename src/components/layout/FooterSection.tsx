'use client';

import { useState } from 'react';
import { ArrowUpRight, Mail, Heart } from 'lucide-react';
import { useLiveClock } from '@/hooks/useLiveClock';

const footerLinks = [
  { label: 'HOME',         href: '#hero'         },
  { label: 'PROJECTS',     href: '#work'         },
  { label: 'SKILLS',       href: '#stats'        },
  { label: 'ACHIEVEMENTS', href: '#achievements' },
  { label: 'CONTACT',      href: '#contact'      },
];

const statusItems = [
  { text: 'Open to hospitality roles globally', icon: '🌍' },
  { text: 'Serving guests with a smile — always', icon: '😊' },
  { text: 'Available for interviews — reach out!', icon: '📞' },
  { text: 'Fluent in English, Hindi & Kannada', icon: '💬' },
  { text: 'F&B service: expert mode ON', icon: '🍽️' },
  { text: 'Reading about hospitality management', icon: '📚' },
  { text: 'Fresher with 5+ years experience — ready!', icon: '🚀' },
  { text: 'Exploring luxury hotel opportunities', icon: '🏫' },
  { text: 'Fine-tuning my customer service skills', icon: '💡' },
  { text: 'Sipping chai & reviewing menus', icon: '☕' },
];

const NAME_TEXT = 'SAMIULLA SHAIKH';

/**
 * Premium interactive name glow — pure text-shadow only.
 * Mouse-following per-letter glow with fire orange bloom on desktop.
 * Uses clamp() for responsive font sizing so text always fits in one line.
 */
function InteractiveName() {
  const letters = NAME_TEXT.split('');

  return (
    <div
      className="py-4 md:py-10 relative cursor-default select-none"
      style={{ overflow: 'visible' }}
    >
      <h2
        className="relative text-center font-bold leading-none whitespace-nowrap"
        style={{
          fontFamily: "'Caveat', cursive",
          overflow: 'visible',
          fontSize: 'clamp(1.5rem, 8vw, 120px)',
          color: '#3D3935',
        }}
      >
        {letters.map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={char === ' ' ? { width: '0.32em' } : {}}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h2>
    </div>
  );
}

export default function FooterSection() {
  const { time, date } = useLiveClock();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('mrsam70220@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = 'mrsam70220@gmail.com';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* Lenis-aware smooth scroll — same logic as Navbar */
  const scrollTo = (href: string) => {
    if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = (window as unknown as Record<string, unknown>).__lenis as { scrollTo?: (el: Element, opts: object) => void } | undefined;
    if (lenis?.scrollTo) {
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer style={{ backgroundColor: '#2A2522', overflow: 'visible' }}>
      {/* Info bar */}
      <div
        className="px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3"
        style={{ borderBottom: '1px solid rgba(245, 240, 232, 0.1)' }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: '#A09A94' }}>
          <span className="italic font-medium">Built with</span>
          {/* Tool icons */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#A09A94' }}>
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#A09A94' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#A09A94' }}>
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
            <path d="M12 12L20 7.5" />
            <path d="M12 12V21" />
            <path d="M12 12L4 7.5" />
          </svg>
          <span className="italic">and a lot of passion!</span>
          <Heart className="w-3.5 h-3.5 fill-current" style={{ color: '#B8860B' }} />
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: '#A09A94' }}>
          <span className="font-mono">{time}</span>
          <span style={{ color: 'rgba(245, 240, 232, 0.2)' }}>|</span>
          <span>{date}</span>
        </div>
      </div>

      {/* CTA + Links */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - CTA */}
          <div>
            <span
              className="text-lg block mb-4"
              style={{ color: '#B8860B', fontFamily: "'Caveat', cursive" }}
            >
              hire me or say hello
            </span>
            <h3
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight"
              style={{ color: '#F5F0E8' }}
            >
              OPEN TO<br />
              OPPORTUNITIES?<br />
              LET&apos;S TALK.
            </h3>
            <a
              href="mailto:mrsam70220@gmail.com"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-lg text-xs md:text-sm font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#B8860B' }}
            >
              REACH OUT &rarr;
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right - Links */}
          <div className="md:text-right">
            <h4
              className="text-xs font-bold uppercase tracking-wider mb-6"
              style={{ color: '#B8860B' }}
            >
              LINKS
            </h4>
            <nav className="space-y-3">
              {footerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="flex items-center md:justify-end gap-2 text-sm transition-all duration-200 cursor-pointer group w-full md:w-auto"
                  style={{ color: '#F5F0E8', background: 'none', border: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#B8860B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#F5F0E8'; }}
                >
                  <span className="group-hover:translate-x-1 transition-all duration-200">
                    {link.label}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Divider + Copy Email */}
      <div
        className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 flex justify-end"
        style={{ borderTop: '1px solid rgba(245, 240, 232, 0.1)' }}
      >
        <button
          onClick={handleCopyEmail}
          className="relative flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-all duration-200 hover:border-accent-orange hover:text-accent-orange"
          style={{
            borderColor: 'rgba(245, 240, 232, 0.2)',
            color: '#A09A94',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#B8860B';
            e.currentTarget.style.color = '#B8860B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
            e.currentTarget.style.color = '#A09A94';
          }}
        >
          <Mail className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy my mail'}
        </button>
      </div>

      {/* Large Name with Interactive Mouse-Following Glow */}
      <InteractiveName />

      {/* Status Marquee */}
      <div className="py-4 overflow-hidden" style={{ borderTop: '1px solid rgba(245, 240, 232, 0.08)', borderBottom: '1px solid rgba(245, 240, 232, 0.08)' }}>
        <div className="flex animate-marquee-slow whitespace-nowrap">
          {[...statusItems, ...statusItems, ...statusItems].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 mx-6 text-lg"
              style={{
                color: '#A09A94',
                fontFamily: "'Caveat', cursive",
              }}
            >
              {item.text}
              <span className="text-sm">{item.icon}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="py-6 text-center">
        <p className="text-xs" style={{ color: '#A09A94' }}>
          &copy; 2026 SS
        </p>
      </div>
    </footer>
  );
}
