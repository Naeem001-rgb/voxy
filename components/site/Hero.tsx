"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BRAND } from "@/lib/brand";
import { CheckIcon, TuxIcon, Waveform, useTypewriter } from "./ui";

const RAMBLE =
  "okay help me think through the beta launch for the team… channels, timeline, what could go wrong with each…";

/* Same structure as a real structured prompt, original content. */
const CLEAN = `Act as a launch strategist. Plan the beta launch of our Linux voice-to-text app: 3 channels, a timeline, and one success metric for each.

For each channel:
• Why it fits a developer audience
• Effort to set up and maintain
• The biggest risk
• One cheap experiment to validate it

End with your recommendation and the two metrics to watch in the first 30 days.`;

type Phase = "listening" | "typing" | "prompted";
const PHASE_ORDER: Phase[] = ["listening", "typing", "prompted"];
const PHASE_MS: Record<Phase, number> = { listening: 3600, typing: 5200, prompted: 3400 };

const HIGHLIGHT_CHARS = 16;

function HeroDemo() {
  const [phase, setPhase] = useState<Phase>("listening");

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase((p) => PHASE_ORDER[(PHASE_ORDER.indexOf(p) + 1) % PHASE_ORDER.length]);
    }, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  const typed = useTypewriter(CLEAN, phase !== "listening", 90);
  const hlStart = Math.max(0, typed.length - HIGHLIGHT_CHARS);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[680px] px-4">
      {/* dark listening pill — sits just above the window so the title stays readable */}
      <div className="relative z-10 mx-auto -mb-2 flex w-[min(552px,88%)] items-center gap-3 rounded-full bg-ink py-3 pl-4 pr-5 shadow-[var(--shadow-lift)]">
        {/* citrus-ring glyph, cream on dark — like the reference */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-[22px] w-[22px] shrink-0 text-cream/90" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v4.8M12 16.2V21M3 12h4.8M16.2 12H21M5.7 5.7l3.3 3.3M15 15l3.3 3.3M18.3 5.7 15 9M9 15l-3.3 3.3" />
        </svg>
        <Waveform bars={10} center className="shrink-0 text-sun" />
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-cream/90">
          &ldquo;{RAMBLE}&rdquo;
        </span>
        <AnimatePresence mode="wait">
          {phase === "prompted" ? (
            <motion.span
              key="prompted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.22 }}
              className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9fc46a]"
            >
              <CheckIcon className="h-3.5 w-3.5" /> Prompted
            </motion.span>
          ) : (
            <motion.span
              key="listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#f2c94c]"
            >
              Listening
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* chat app window — generous like the reference */}
      <div className="card overflow-hidden !rounded-2xl !border-ink/10 !shadow-[var(--shadow-lift)]">
        <div className="flex items-center gap-2 border-b border-line bg-[#f7f4ec] px-5 py-3">
          <span className="flex gap-2" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-1.5 flex items-center gap-2 text-[18px] font-semibold text-ink">
            <span className="text-[21px] leading-none text-[#d97757]">✳</span> Claude
          </span>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-inksoft/60">
            New chat
          </span>
        </div>
        <div className="bg-[#f7f4ec] px-5 pb-5 pt-4">
          {/* the clearly-visible inner white box */}
          <div className="min-h-[260px] rounded-xl border border-line bg-white px-6 py-5">
            <p className="whitespace-pre-line text-left text-[14.5px] leading-[1.7] text-ink">
              {phase === "listening" ? (
                <span className="text-inksoft/40">
                  Your structured prompt lands here — ready to send.
                </span>
              ) : (
                <>
                  {typed.slice(0, hlStart)}
                  <span className="-mx-0.5 rounded-[3px] bg-sun/50 px-0.5">
                    {typed.slice(hlStart)}
                  </span>
                  {typed.length < CLEAN.length && (
                    <span className="type-caret" aria-hidden />
                  )}
                </>
              )}
            </p>
          </div>
          <div className="mt-3.5 flex items-center justify-between">
            <span className="rounded-full border border-line bg-[#f0ede4] px-3.5 py-1.5 font-mono text-[11px] text-inksoft">
              Claude Opus 5
            </span>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-[10px] text-base transition-colors ${
                phase === "prompted" || phase === "typing"
                  ? "bg-[#d97757] text-white"
                  : "bg-[#ece8dd] text-inksoft/50"
              }`}
              aria-hidden
            >
              ↑
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="px-[clamp(16px,3vw,40px)] pb-10 pt-3">
      <div className="relative min-h-[min(88vh,900px)] overflow-hidden rounded-2xl md:rounded-[24px]">
        <div className="animate-kenburns meadow absolute inset-0" aria-hidden />
        <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />

        {/* cream dome */}
        <div
          className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[170%] -translate-x-1/2 rounded-[100%] bg-cream"
          aria-hidden
        />

        <div className="relative flex min-h-[min(88vh,900px)] flex-col items-center pt-[clamp(48px,9vh,104px)] text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-inksoft"
          >
            ◦ Meet {BRAND.name} · voice to text ◦
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-4 font-serif text-[clamp(44px,6.6vw,84px)] leading-[1.02] tracking-[-0.01em]"
          >
            Stop typing prompts.
            <br />
            Start <em>talking</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-5 max-w-xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-inksoft"
          >
            The voice-to-text AI that turns your speech into clear, polished
            text in your editor, browser, terminal and every app on Linux.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-7"
          >
            <a href="#pricing" className="btn btn-dark">
              <TuxIcon className="h-4 w-4" />
              Download for Linux
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 font-mono text-[10.5px] tracking-[0.18em] uppercase text-inksoft/80"
          >
            Free to start · No credit card · 2-minute setup
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-auto w-full pt-12"
          >
            <HeroDemo />
          </motion.div>

          <div className="h-6" aria-hidden />
        </div>
      </div>
    </section>
  );
}
