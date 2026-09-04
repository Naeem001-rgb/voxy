"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { BRAND } from "@/lib/brand";
import { Reveal, Waveform, useTypewriter } from "./ui";

/* Filler words get the coral treatment in the dictated card. */
function F({ children }: { children: string }) {
  return <span className="text-clay underline decoration-clay/40 underline-offset-2">{children}</span>;
}

/* The dictated text as segments so filler words stay coral while typing. */
const DICTATED: { t: string; f?: boolean }[] = [
  { t: "Quick notes from this morning's kickoff — " },
  { t: "um,", f: true },
  { t: " we're locking the beta for March 3rd. Sara owns the waitlist, Dev takes the pricing page, and " },
  { t: "uh,", f: true },
  { t: " I'll draft the announcement this week. Two risks to watch: onboarding load times on older machines, and " },
  { t: "you know,", f: true },
  { t: " the billing migration for annual plans. Next check-in is Friday at ten. If anything slips, we cut scope on the template gallery first — " },
  { t: "like,", f: true },
  { t: " not the launch date." },
];
const DICTATED_FULL = DICTATED.map((s) => s.t).join("");

const KEYBOARD_TEXT =
  "Quick notes from this morning's kickoff — we're locking the beta for March 3rd. Sara owns";

/* Render the dictated text up to `count` characters, keeping fillers coral. */
function TypedFillers({ count }: { count: number }) {
  let offset = 0;
  const out: ReactNode[] = [];
  DICTATED.forEach((seg, i) => {
    const visible = Math.max(0, Math.min(count - offset, seg.t.length));
    offset += seg.t.length;
    if (visible > 0) {
      const slice = seg.t.slice(0, visible);
      out.push(seg.f ? <F key={i}>{slice}</F> : <span key={i}>{slice}</span>);
    }
  });
  return <>{out}</>;
}

function DictatedCard({ active }: { active: boolean }) {
  const typed = useTypewriter(DICTATED_FULL, active, 85);
  const typing = typed.length < DICTATED_FULL.length;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#fbf8ef] shadow-[var(--shadow-lift)]">
      {/* dark app header */}
      <div className="flex items-center gap-2 bg-ink px-4 py-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-4 w-4 shrink-0 text-cream/90" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v4.8M12 16.2V21M3 12h4.8M16.2 12H21M5.7 5.7l3.3 3.3M15 15l3.3 3.3M18.3 5.7 15 9M9 15l-3.3 3.3" />
        </svg>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-cream/90">
          {BRAND.name}
        </span>
        <Waveform bars={7} center className="ml-1 text-sun" />
        <span className="ml-auto rounded-full bg-sun px-2.5 py-1 font-mono text-[10px] font-medium text-ink">
          200 WPM
        </span>
      </div>
      {/* dictated body — types in when the section enters the viewport */}
      <p className="min-h-[200px] flex-1 px-5 py-4 text-left text-[12.5px] leading-[1.75] text-ink">
        <TypedFillers count={typed.length} />
        {typing && <span className="type-caret" aria-hidden />}
      </p>
      {/* dashed footer */}
      <div className="mt-auto flex items-center justify-between border-t border-dashed border-line px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-inksoft/70">
          Cleaning up the ums…
        </span>
        <span className="rounded-full bg-moss/20 px-2.5 py-1 font-mono text-[10px] font-medium text-moss">
          72 words
        </span>
      </div>
    </div>
  );
}

function KeyboardCard({ active }: { active: boolean }) {
  const typed = useTypewriter(KEYBOARD_TEXT, active, 22);
  const typing = typed.length < KEYBOARD_TEXT.length;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/75 shadow-[var(--shadow-soft)] backdrop-blur-md">
      {/* light header */}
      <div className="flex items-center gap-2 bg-[#f0ede2] px-4 py-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4 shrink-0 text-inksoft" aria-hidden>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M7 11h.01M11 11h.01M15 11h.01M8 14h8" />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-inksoft">
          Keyboard
        </span>
        <span className="ml-auto rounded-full border border-line bg-white/70 px-2.5 py-1 font-mono text-[10px] text-inksoft">
          40 WPM
        </span>
      </div>
      {/* still-typing body — crawls along at keyboard speed */}
      <p className="min-h-[200px] flex-1 px-5 py-4 text-left text-[12.5px] leading-[1.75] text-inksoft">
        {typed}
        {typing && <span className="type-caret" aria-hidden />}
      </p>
      {/* dashed footer */}
      <div className="mt-auto flex items-center justify-between border-t border-dashed border-line px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-inksoft/60">
          Still typing…
        </span>
        <span className="rounded-full bg-ink/10 px-2.5 py-1 font-mono text-[10px] text-inksoft">
          15 words
        </span>
      </div>
    </div>
  );
}

export default function Dictation() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardsRef, { once: true, amount: 0.35 });

  return (
    <section id="speed" className="scroll-mt-20 px-[clamp(16px,3vw,40px)] py-[var(--secpad)]">
      <div className="relative overflow-hidden rounded-[24px] shadow-[var(--shadow-soft)]">
        {/* user-provided meadow background */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: "url(/card-bg/dictation-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />

        <div className="relative px-6 py-[clamp(48px,6vw,80px)]">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink/60">
              ◦ Dictation ◦
            </p>
            <h2 className="mt-3 font-serif text-[clamp(32px,4.2vw,52px)] leading-[1.06] tracking-tight text-ink">
              Write at the speed
              <br />
              of <em>thought</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink/70">
              You think at 200 words a minute and type at 40. Hold control and
              dictate — your exact words on the page five times faster, ums and
              stumbles cleaned automatically.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            {/* both cards stretch to identical dimensions; typing starts on scroll-in */}
            <div
              ref={cardsRef}
              className="relative mx-auto mt-12 grid max-w-[860px] items-stretch gap-8 md:grid-cols-2 md:gap-14"
            >
              {/* VS badge */}
              <span
                className="absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-medium text-sun shadow-[var(--shadow-lift)] max-md:hidden"
                aria-hidden
              >
                VS
              </span>
              <DictatedCard active={inView} />
              <KeyboardCard active={inView} />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-10 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/55">
              Your exact words · Fillers cleaned automatically · One-fifth of the time
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
