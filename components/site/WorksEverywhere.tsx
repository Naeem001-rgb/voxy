"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { CheckIcon, CitrusGlyph, Marquee, Waveform, useTypewriter } from "./ui";

/* ---------- app chip icons (fetched official marks; letters where unavailable) ---------- */

type Chip = { label: string; icon?: string; letter?: { bg: string; ch: string } };

const ROW_A: Chip[] = [
  { label: "Google Docs", icon: "/brand/apps/googledocs.svg" },
  { label: "Outlook", letter: { bg: "#0F6CBD", ch: "O" } },
  { label: "Facebook", icon: "/brand/apps/facebook.svg" },
  { label: "LinkedIn", icon: "/brand/apps/linkedin.svg" },
  { label: "Teams", letter: { bg: "#5B5FC7", ch: "T" } },
  { label: "Sheets", icon: "/brand/apps/googlesheets.svg" },
  { label: "WhatsApp", icon: "/brand/apps/whatsapp.svg" },
  { label: "Claude", icon: "/brand/apps/claude.svg" },
  { label: "ChatGPT", icon: "/brand/apps/chatgpt.svg" },
  { label: "Cursor", icon: "/brand/cursor.svg" },
  { label: "Gmail", icon: "/brand/gmail.svg" },
  { label: "Slack", icon: "/brand/slack.svg" },
  { label: "Notion", icon: "/brand/apps/notion.svg" },
];

const ROW_B: Chip[] = [
  { label: "Jira", icon: "/brand/apps/jira.svg" },
  { label: "HubSpot", icon: "/brand/apps/hubspot.svg" },
  { label: "X", icon: "/brand/apps/x.svg" },
  { label: "Figma", icon: "/brand/apps/figma.svg" },
  { label: "Word", letter: { bg: "#2B579A", ch: "W" } },
  { label: "Calendar", icon: "/brand/apps/googlecalendar.svg" },
  { label: "Chrome", icon: "/brand/apps/chrome.svg" },
  { label: "GitHub", icon: "/brand/apps/github.svg" },
  { label: "Gemini", icon: "/brand/apps/googlegemini.svg" },
  { label: "Perplexity", icon: "/brand/apps/perplexity.svg" },
  { label: "Salesforce", icon: "/brand/apps/salesforce.svg" },
  { label: "Telegram", icon: "/brand/apps/telegram.svg" },
];

function LetterIcon({ bg, ch }: { bg: string; ch: string }) {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-[5px] text-[10px] font-bold text-white"
      style={{ background: bg }}
      aria-hidden
    >
      {ch}
    </span>
  );
}

function AppChip({ chip }: { chip: Chip }) {
  return (
    <span className="mx-2 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-[var(--shadow-soft)]">
      {chip.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={chip.icon} alt="" className="h-5 w-5" loading="lazy" />
      ) : chip.letter ? (
        <LetterIcon bg={chip.letter.bg} ch={chip.letter.ch} />
      ) : null}
      <span className="font-mono text-[12.5px] text-ink">{chip.label}</span>
    </span>
  );
}

/* ---------- the cycling notch ---------- */

const NOTCH: { say: string; app: string }[] = [
  { say: "reply that friday works and ask for th", app: "Gmail" },
  { say: "help me structure the pricing analysis", app: "Slack" },
  { say: "summarize this doc in three bullets", app: "Notion" },
];

function Notch({ running }: { running: boolean }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"listening" | "typed" | "gap">("listening");
  const typed = useTypewriter(NOTCH[idx].say, running && phase === "listening", 34);

  useEffect(() => {
    if (!running) return;
    const dur = phase === "listening" ? 3200 : phase === "typed" ? 1700 : 600;
    const t = setTimeout(() => {
      if (phase === "listening") setPhase("typed");
      else if (phase === "typed") setPhase("gap");
      else {
        setPhase("listening");
        setIdx((i) => (i + 1) % NOTCH.length);
      }
    }, dur);
    return () => clearTimeout(t);
  }, [phase, idx, running]);

  return (
    <div className="absolute left-1/2 top-0 z-10 flex h-10 w-[290px] -translate-x-1/2 items-center gap-2 rounded-b-2xl bg-[#0c0b09] px-4 shadow-[0_10px_24px_-10px_rgba(26,26,23,0.5)]">
      {running && phase === "listening" ? (
        <>
          <CitrusGlyph className="h-4 w-4 shrink-0 text-cream/80" />
          <Waveform bars={6} center className="shrink-0 text-sun" />
          <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-cream/85">
            {typed}
          </span>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#f2c94c]">
            Listening
          </span>
        </>
      ) : running && phase === "typed" ? (
        <span className="mx-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f2c94c]">
          <CheckIcon className="h-3 w-3" /> Typed into {NOTCH[idx].app}
        </span>
      ) : (
        <span className="mx-auto" />
      )}
    </div>
  );
}

/* ---------- section ---------- */

export default function WorksEverywhere() {
  const winRef = useRef<HTMLDivElement>(null);
  const inView = useInView(winRef, { amount: 0.25 });

  return (
    <section id="everywhere" className="scroll-mt-20 px-[clamp(16px,3vw,40px)] py-[var(--secpad)]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-moss">
          ◦ No integrations · No plugins · No setup ◦
        </p>
        <h2 className="mt-3 font-serif text-[clamp(32px,4.2vw,52px)] leading-[1.06] tracking-tight">
          Write faster in <em>every app</em>
          <br />
          you work in
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-inksoft">
          Voxy lives at the top of your screen — on every Linux distro, always
          one key away. If it has a text field, Voxy works there.
        </p>
      </div>

      {/* desktop window mockup */}
      <div
        ref={winRef}
        className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[20px] border-[6px] border-[#2a2620] shadow-[0_30px_60px_-30px_rgba(26,26,23,0.45)]"
        style={{ transform: "translateZ(0)" }}
      >
        {/* meadow inside the screen + lavender hills tint like the reference */}
        <div
          className="meadow absolute inset-0"
          style={{ backgroundPosition: "center 78%" }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-[62%]"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, rgba(185,179,234,0.92) 0%, rgba(197,191,232,0.72) 42%, rgba(201,209,168,0.25) 78%, rgba(201,209,168,0) 100%)",
          }}
        />
        <div
          className="absolute left-[8%] top-[16%] h-[36%] w-[55%] rounded-[100%] bg-[#a99ee0]/55 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute right-[4%] top-[20%] h-[32%] w-[45%] rounded-[100%] bg-[#c3b9ec]/50 blur-2xl"
          aria-hidden
        />
        <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />

        {/* menu bar */}
        <div className="relative flex items-center px-5 pt-3 text-[12px]">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <CitrusGlyph className="h-3.5 w-3.5 text-ink/80" />
            Voxy
          </span>
          <span className="ml-4 flex gap-4 text-ink/70" aria-hidden>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
          </span>
          <span className="ml-auto flex items-center gap-3 text-ink/80">
            <span>Tue Jul 14</span>
            <span className="font-semibold text-ink">2:14 PM</span>
          </span>
        </div>

        {/* the notch — cycles listening → typed */}
        <Notch running={inView} />

        {/* center pill */}
        <div className="relative flex justify-center pt-[230px]">
          <span className="rounded-full bg-ink/85 px-4 py-2 font-mono text-[10.5px] tracking-[0.08em] text-[#f2c94c]">
            HOLD CTRL+SPACE · SPEAK · IT TYPES WHERE YOUR CURSOR IS
          </span>
        </div>

        {/* two counter-scrolling rows of app chips */}
        <div className="relative mt-6 space-y-4 pb-14">
          <Marquee duration={32}>
            {ROW_A.map((c) => (
              <AppChip key={c.label} chip={c} />
            ))}
          </Marquee>
          <Marquee duration={36} reverse>
            {ROW_B.map((c) => (
              <AppChip key={c.label} chip={c} />
            ))}
          </Marquee>
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/55">
        …and every other place you type
      </p>
    </section>
  );
}
