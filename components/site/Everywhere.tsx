"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, motion } from "motion/react";
import { BRAND } from "@/lib/brand";
import { CheckIcon, CitrusGlyph, Reveal, Waveform, useTypewriter } from "./ui";

/* ---------- Slack window ---------- */

const CHECKS = [
  "Onboarding is complete",
  "QA surfaced two edge cases — both being resolved",
  "Friday's launch is still on track.",
];

function WindowSlack({ active }: { active: boolean }) {
  return (
    <div className="w-[470px] max-w-full overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-2 border-b border-line bg-[#f7f4ec] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-[14px] font-semibold text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/slack.svg" alt="" className="h-4 w-4" />
          Slack
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-inksoft/50">
          Message
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span className="text-[13px] font-semibold text-ink">#launch-team</span>
        <span className="text-[11px] text-inksoft/60">12 members</span>
      </div>
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#5966d2] text-[12px] font-semibold text-white" aria-hidden>
            A
          </span>
          <div className="min-w-0">
            <p className="text-[13px] leading-none">
              <span className="font-semibold text-ink">Alex</span>
              <span className="ml-1.5 text-[11px] text-inksoft/50">9:12 AM</span>
            </p>
            <p className="mt-2 text-[12.5px] leading-[1.7] text-ink">Quick launch update:</p>
            <div className="mt-1.5 space-y-1.5">
              {CHECKS.map((c, i) => (
                <motion.p
                  key={c}
                  initial={{ opacity: 0, x: -8 }}
                  animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.35, delay: 0.7 + i * 0.55 }}
                  className="flex items-start gap-1.5 text-[12.5px] leading-[1.5] text-ink"
                >
                  <CheckIcon className="mt-[3px] h-3 w-3 shrink-0 text-moss" />
                  {c}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 mb-4 flex items-center justify-between rounded-lg border border-line px-3 py-2">
        <span className="text-[12px] text-inksoft/50">Aa</span>
        <span className="flex h-6 w-9 items-center justify-center rounded-md bg-[#007a5a] text-white" aria-hidden>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M3 11.5 21 3l-8.5 18-2.3-7.2L3 11.5Z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ---------- Gmail window ---------- */

function WindowGmail({ active }: { active: boolean }) {
  const BODY = `Hi Maya, I loved the proposal. Would Thursday at 10:00 work to talk it through? I'll send my notes beforehand. Best, Alex`;
  const typed = useTypewriter(BODY, active, 55);

  return (
    <div className="w-[470px] max-w-full overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-2 border-b border-line bg-[#f7f4ec] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gmail.svg" alt="" className="h-4 w-4" />
          New message
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-inksoft/50">
          Gmail
        </span>
      </div>
      <div className="px-4 pt-1">
        <p className="border-b border-line py-2 text-[12.5px] text-inksoft">
          To: Maya Chen
        </p>
        <p className="border-b border-line py-2 text-[12.5px] text-inksoft">
          Subject: <span className="text-ink">Re: Proposal follow-up</span>
        </p>
        <p className="min-h-[96px] py-3 text-left text-[12.5px] leading-[1.7] text-ink">
          {typed.length < BODY.length ? (
            <>
              {typed}
              <span className="type-caret" aria-hidden />
            </>
          ) : (
            BODY
          )}
        </p>
      </div>
      <div className="px-4 pb-4">
        <span
          className={`inline-flex items-center rounded-md px-4 py-1.5 text-[12px] font-medium text-white transition-colors ${
            typed.length >= BODY.length ? "bg-[#1a73e8]" : "bg-[#1a73e8]/40"
          }`}
        >
          Send
        </span>
      </div>
    </div>
  );
}

/* ---------- tabs ---------- */

type Tab = {
  id: string;
  label: string;
  icon: ReactNode;
  kicker: string;
  h3: ReactNode;
  sub: string;
  say: string;
  Window: React.ComponentType<{ active: boolean }>;
};

const TABS: Tab[] = [
  {
    id: "email",
    label: "Email",
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/brand/gmail.svg" alt="" className="h-[15px] w-[15px]" />
    ),
    kicker: "Inbox, handled",
    h3: (
      <>
        Say the gist. Send the <strong className="font-bold">polished version</strong>.
      </>
    ),
    sub: "Voxy matches the thread and writes it in your tone. Nobody can tell you didn't type it.",
    say: "tell maya I loved the proposal, ask if thursday at ten works, and mention I'll send notes before then",
    Window: WindowGmail,
  },
  {
    id: "slack",
    label: "Slack",
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/brand/slack.svg" alt="" className="h-[15px] w-[15px]" />
    ),
    kicker: "Team updates",
    h3: (
      <>
        A spoken <strong className="font-bold">status</strong> your team can scan.
      </>
    ),
    sub: "Rambled once — structured for the channel, checkmarks and all.",
    say: "quick update: onboarding is done, QA found two edge cases, and we're still on track for Friday",
    Window: WindowSlack,
  },
];

const TAB_MS = 6500;

export default function Everywhere() {
  const [active, setActive] = useState(1); // Slack, like the reference
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.3 });

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (hovering || reduced || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TABS.length), TAB_MS);
    return () => clearTimeout(t);
  }, [active, hovering, reduced, inView]);

  const tab = TABS[active];
  const Win = tab.Window;

  return (
    <section id="more" className="scroll-mt-20 py-[var(--secpad)]">
      <div className="mx-auto max-w-6xl px-[clamp(16px,3vw,40px)]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-moss">
            ◦ And everything in between ◦
          </p>
          <h2 className="mt-3 font-serif text-[clamp(32px,4.2vw,52px)] leading-[1.06] tracking-tight">
            Prompts are just the beginning,
            <br />
            {BRAND.name} helps you write faster
            <br />
            <em>everywhere</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-inksoft">
            The same key turns a spoken thought into a clear email, an update
            your team can scan, or an instant answer — in your tone.
          </p>
        </Reveal>

        {/* channel tabs */}
        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-2.5" delay={0.08}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`btn !gap-2 !px-5 !py-2.5 !text-[14px] ${
                i === active
                  ? "btn-dark !shadow-[var(--shadow-lift)]"
                  : "border border-line bg-white text-ink hover:bg-sand/60"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </Reveal>

        {/* the ripple stage — single fixed-height compositor layer, no crossfade ghosts */}
        <div
          ref={stageRef}
          className="relative mt-6 overflow-hidden rounded-[28px] shadow-[var(--shadow-soft)]"
          style={{ transform: "translateZ(0)" }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          {/* user-provided ripple background */}
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              backgroundImage: "url(/card-bg/ripple-bg.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative px-6 pb-12 pt-12 md:px-10">
            {/* stage header — fixed height so tab switches never shift layout */}
            <div
              key={tab.id}
              className="fade-up mx-auto min-h-[172px] max-w-2xl text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                ◦ {tab.kicker} ◦
              </p>
              <h3 className="mt-3 font-serif text-[clamp(22px,2.6vw,34px)] leading-[1.15] text-ink">
                {tab.h3}
              </h3>
              <p className="mx-auto mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-ink/70">
                {tab.sub}
              </p>
            </div>

            {/* bottom row: YOU SAY → arrow → app window */}
            <div
              key={`row-${tab.id}`}
              className="fade-up mt-8 flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-8"
            >
              <div className="w-[350px] max-w-full shrink-0 rounded-2xl bg-ink/95 p-5 shadow-[var(--shadow-lift)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sun">
                    <CitrusGlyph className="h-4 w-4 text-cream/90" />
                    You say
                  </span>
                  <Waveform bars={8} center className="text-sun" />
                </div>
                <p className="mt-3 font-mono text-[12px] leading-[1.8] text-cream/90">
                  &ldquo;{tab.say}&rdquo;
                </p>
              </div>

              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-cream shadow-[var(--shadow-lift)]"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>

              <div className="flex w-[470px] max-w-full items-center justify-center">
                <Win active={inView} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
