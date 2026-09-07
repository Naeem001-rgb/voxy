"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Scroll-reveal wrapper — the site's only real scroll-driven behavior. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Looping audio waveform, pure CSS. Freezes when `paused`.
   `center` renders a symmetric voice-memo wave (pulses from the middle)
   instead of the bottom-anchored equalizer style. */
export function Waveform({
  bars = 14,
  className = "",
  paused = false,
  center = false,
}: {
  bars?: number;
  className?: string;
  paused?: boolean;
  center?: boolean;
}) {
  return (
    <span
      className={`inline-flex gap-[3px] h-5 ${center ? "items-center wave-center" : "items-end"} ${paused ? "wave-paused" : ""} ${className}`}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar w-[3px] rounded-full bg-current"
          style={{
            height: center
              ? `${24 + Math.abs(Math.sin(i * 0.85)) * 72}%`
              : `${28 + Math.abs(Math.sin(i * 1.7)) * 72}%`,
            animationDelay: `${(i % 7) * 0.12}s`,
            animationDuration: `${0.9 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}

/* Seamless infinite marquee: content is rendered twice, track shifts -50%. */
export function Marquee({
  children,
  duration = 32,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className="marquee-track flex w-max"
        style={
          {
            "--marquee-dur": `${duration}s`,
            animationDirection: reverse ? "reverse" : undefined,
          } as React.CSSProperties
        }
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Citrus-ring brand glyph (cream ring + spokes), used in dark pills/cards. */
export function CitrusGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v4.8M12 16.2V21M3 12h4.8M16.2 12H21M5.7 5.7l3.3 3.3M15 15l3.3 3.3M18.3 5.7 15 9M9 15l-3.3 3.3" />
    </svg>
  );
}

/* Minimal penguin mark for the "Download for Linux" buttons. */
export function TuxIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.5c-2.7 0-4.6 2.3-4.6 5.4 0 2.1.4 3.3-.3 5.2-.6 1.6-1.7 2.4-1.7 4 0 .9.4 1.7 1 2.3.5-.3 1.1-.4 1.7-.2.9.3 1.5 1 2.4 1.2 1 .2 2-.1 2.9-.4.9-.3 1.8-.7 2.8-.6.7.1 1.3.4 1.8.9.9-.7 1.5-1.8 1.5-3 0-1.7-1.1-2.6-1.7-4.2-.7-1.9-.3-3.1-.3-5.2 0-3.1-1.9-5.4-4.6-5.4Z"
      />
      <ellipse cx="10.1" cy="7.6" rx="0.9" ry="1.1" fill="#1a1a17" />
      <ellipse cx="13.9" cy="7.6" rx="0.9" ry="1.1" fill="#1a1a17" />
      <path fill="#e8a13c" d="M10.6 9.4h2.8L12 11.2z" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* Character-by-character reveal; snaps to full text under reduced motion. */
export function useTypewriter(text: string, active: boolean, cps = 32) {
  const [count, setCount] = useState(0);
  const shown = useRef(-1);

  useEffect(() => {
    if (!active) {
      shown.current = -1;
      setCount(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = text.length;
      setCount(text.length);
      return;
    }
    shown.current = 0;
    setCount(0);
    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const n = Math.min(text.length, Math.floor(((t - start) / 1000) * cps));
      if (n !== shown.current) {
        shown.current = n;
        setCount(n);
      }
      if (n < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, active, cps]);

  return text.slice(0, count);
}
