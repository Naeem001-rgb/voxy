"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BRAND } from "@/lib/brand";
import { Reveal, TuxIcon, Waveform } from "./ui";
import WindowClaude from "./apps/WindowClaude";
import WindowChatGPT from "./apps/WindowChatGPT";
import WindowCursor from "./apps/WindowCursor";
import WindowClaudeCode from "./apps/WindowClaudeCode";

type Tab = {
  id: string;
  label: string;
  icon: (active: boolean) => ReactNode;
  kicker: string;
  h3: ReactNode;
  sub: string;
  say: string;
  Window: React.ComponentType<{ active: boolean }>;
};

/* Tab icons: official brand SVGs, rendered via <img> so each logo keeps its
   own colors. Fixed-size box keeps all four aligned on one visual line. */
function TabIcon({ src, dark }: { src: string; dark?: boolean }) {
  return (
    <span className="flex h-4 w-4 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={dark ? "h-[17px] w-[17px] brightness-0 invert" : "h-[17px] w-[17px]"}
      />
    </span>
  );
}

const TABS: Tab[] = [
  {
    id: "claude",
    label: "Claude",
    icon: (active) => (
      <TabIcon src="/brand/apps/claude.svg" dark={active} />
    ),
    kicker: "Research & strategy",
    h3: (
      <>
        Turn a <strong className="font-bold">fuzzy problem</strong> into a thoughtful plan.
      </>
    ),
    sub: "Talk through what you know and what you're unsure about. Voxy shapes it into a research brief — goals, discussion guide, synthesis plan.",
    say: "help me plan customer interviews for the new onboarding flow — goals, questions, and a way to synthesize the calls",
    Window: WindowClaude,
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    icon: () => <TabIcon src="/brand/apps/openai.svg" />,
    kicker: "Writing & analysis",
    h3: (
      <>
        Give it the <strong className="font-bold">context</strong> behind the ask.
      </>
    ),
    sub: "Audience, source material, output — spoken once, baked into a prompt that comes back actually useful.",
    say: "what should we learn from how the top three tools in our category do onboarding… patterns, not fluff",
    Window: WindowChatGPT,
  },
  {
    id: "cursor",
    label: "Cursor",
    icon: (active) => (
      <TabIcon src={active ? "/brand/cursor-white.svg" : "/brand/cursor.svg"} />
    ),
    kicker: "Building & debugging",
    h3: (
      <>
        Describe the <strong className="font-bold">change, scope, and guardrails</strong>.
      </>
    ),
    sub: "Say the behavior you want and what must stay untouched. Your agent executes on the first pass.",
    say: "the payments test keeps flaking — find out why and fix it properly, not just retries",
    Window: WindowCursor,
  },
  {
    id: "claudecode",
    label: "Claude Code",
    icon: (active) => (
      <TabIcon src="/brand/apps/claudecode.svg" dark={active} />
    ),
    kicker: "Deep code work",
    h3: (
      <>
        Talk through a bug like you would with a <strong className="font-bold">teammate</strong>.
      </>
    ),
    sub: "What changed, what you expected, where to look — turned into an actionable task your agent can run with.",
    say: "the deploy script keeps dying on the migration step — figure out why and fix it, don't touch prod config",
    Window: WindowClaudeCode,
  },
];

const TAB_MS = 5200;

function CitrusGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v4.8M12 16.2V21M3 12h4.8M16.2 12H21M5.7 5.7l3.3 3.3M15 15l3.3 3.3M18.3 5.7 15 9M9 15l-3.3 3.3" />
    </svg>
  );
}

export default function AppSwitcher() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (hovering || reduced) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TABS.length), TAB_MS);
    return () => clearTimeout(t);
  }, [active, hovering, reduced]);

  const tab = TABS[active];
  const Win = tab.Window;

  return (
    <section id="use" className="scroll-mt-20 py-[var(--secpad)]">
      <div className="mx-auto max-w-6xl px-[clamp(16px,3vw,40px)]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-inksoft/80">
            ◦ Built for the apps you work in ◦
          </p>
          <h2 className="mt-3 font-serif text-[clamp(32px,4.2vw,52px)] leading-[1.06] tracking-tight">
            Watch a thought become<br />a <em>powerful prompt</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-inksoft">
            Pick your tool. Say the rough version. {BRAND.name} writes the prompt
            that gets the answer — right where your cursor is.
          </p>
        </Reveal>

        {/* tool tabs */}
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
              {t.icon(i === active)}
              {t.label}
            </button>
          ))}
        </Reveal>

        {/* the dreamy stage */}
        <Reveal delay={0.12}>
          <div
            className="relative mt-6 overflow-hidden rounded-[28px] shadow-[var(--shadow-soft)]"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocus={() => setHovering(true)}
            onBlur={() => setHovering(false)}
          >
            {/* dreamy gradient + soft hills */}
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(120% 85% at 50% 0%, #cdc7f2 0%, rgba(205,199,242,0) 62%), radial-gradient(85% 65% at 12% 48%, #b6c2ee 0%, rgba(182,194,238,0) 60%), radial-gradient(85% 65% at 88% 48%, #c7cef1 0%, rgba(199,206,241,0) 60%), linear-gradient(180deg, #cfc9f1 0%, #c6d2ab 55%, #d5d992 78%, #e4e091 100%)",
              }}
            />
            <div className="absolute -left-24 bottom-[-140px] h-[340px] w-[720px] rounded-[100%] bg-[#9ab86a]/70 blur-3xl" aria-hidden />
            <div className="absolute -right-32 bottom-[-180px] h-[380px] w-[760px] rounded-[100%] bg-[#b9c46e]/60 blur-3xl" aria-hidden />
            <div className="grain absolute inset-0 opacity-[0.04]" aria-hidden />

            <div className="relative px-6 pb-12 pt-12 md:px-10">
              {/* stage header */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto max-w-2xl text-center"
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
                </motion.div>
              </AnimatePresence>

              {/* bottom row: YOU SAY → arrow → app window */}
              <div className="mt-10 flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-center lg:gap-8">
                {/* YOU SAY card */}
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

                {/* arrow */}
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-cream shadow-[var(--shadow-lift)]"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>

                {/* the app window for the active tab */}
                <div className="flex min-h-[300px] w-[470px] max-w-full items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
                      className="w-full"
                    >
                      <Win active />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className="mt-10 flex justify-center" delay={0.16}>
          <a href="#pricing" className="btn btn-dark !px-5 !py-2.5 !text-sm">
            <TuxIcon className="h-4 w-4" />
            Download for Linux
          </a>
        </Reveal>
      </div>
    </section>
  );
}
