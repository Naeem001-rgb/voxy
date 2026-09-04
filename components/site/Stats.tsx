"use client";

import { BRAND } from "@/lib/brand";
import { Reveal, TuxIcon } from "./ui";

type Stat = {
  value: string;
  label: string;
  src: string;
  bg: string;
  arc: string;
  ink: string;
};

const STATS: Stat[] = [
  {
    value: "4×",
    label: "faster than typing",
    src: "Speaking speed, avg.",
    bg: "#a79ef0",
    arc: "#8f85e2",
    ink: "#3d3378",
  },
  {
    value: "130+",
    label: "languages handled",
    src: "By whisper-large-v3",
    bg: "#c9f0a0",
    arc: "#b3e385",
    ink: "#3a5a1e",
  },
  {
    value: "0",
    label: "servers of ours involved",
    src: "Your desktop → Groq, directly",
    bg: "#f9cd92",
    arc: "#f5b96b",
    ink: "#8a5416",
  },
];

export default function Stats() {
  return (
    <section className="bg-[#201e1a] py-[var(--secpad)]">
      <div className="mx-auto max-w-6xl px-[clamp(16px,3vw,40px)]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-sun">
            ◦ Why it matters ◦
          </p>
          <h2 className="mt-4 font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.08] tracking-tight text-cream">
            You&rsquo;re not unproductive.
            <br />
            You&rsquo;re <em>interrupted</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[clamp(15px,1.3vw,17px)] leading-relaxed text-cream/65">
            The average knowledge worker spends 3 hours a day typing and
            switches tabs 1,100 times. {BRAND.name} brings the AI to you — so
            you never leave what you&rsquo;re working on.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 0.1}>
              <div
                className="relative overflow-hidden rounded-[20px] px-6 pb-7 pt-9 text-center"
                style={{ background: s.bg }}
              >
                {/* hill arc at the bottom of the card */}
                <div
                  className="pointer-events-none absolute -bottom-9 left-1/2 h-[90px] w-[135%] -translate-x-1/2 rounded-[100%] opacity-60"
                  style={{ background: s.arc }}
                  aria-hidden
                />
                <div className="relative">
                  <p
                    className="font-serif text-[56px] font-bold leading-none"
                    style={{ color: s.ink }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="mt-3 text-[15px] font-semibold"
                    style={{ color: s.ink }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: s.ink, opacity: 0.65 }}
                  >
                    {s.src}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-12 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream/40">
            Source: speaking &amp; typing pace, conversational averages
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="#pricing"
              className="btn gap-2 bg-sun text-ink shadow-[0_10px_30px_-10px_rgba(242,201,76,0.5)] hover:brightness-105"
            >
              <TuxIcon className="h-4 w-4" />
              Download for Linux
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
