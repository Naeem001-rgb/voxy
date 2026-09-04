"use client";

import CardPress from "./cards/CardPress";
import CardTalk from "./cards/CardTalk";
import CardPrompt from "./cards/CardPrompt";
import { ArrowIcon, Reveal } from "./ui";

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 px-[clamp(16px,3vw,40px)] py-[var(--secpad)]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-inksoft/80">
          ◦ How it works ◦
        </p>
        <h2 className="mt-3 font-serif text-[clamp(32px,4.2vw,52px)] leading-[1.06] tracking-tight">
          Ramble in. <em>Prompt out.</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-inksoft">
          No frameworks to memorize. No &ldquo;act as&hellip;&rdquo; templates to
          fill in. Just hold a key and think out loud.
        </p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
        {/* connector arrows between cards, floating over the gaps */}
        <span
          className="absolute left-[calc(33.333%-18px)] top-[158px] z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[var(--shadow-soft)] md:flex"
          aria-hidden
        >
          <ArrowIcon className="h-4 w-4" />
        </span>
        <span
          className="absolute left-[calc(66.666%-18px)] top-[158px] z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[var(--shadow-soft)] md:flex"
          aria-hidden
        >
          <ArrowIcon className="h-4 w-4" />
        </span>

        <Reveal>
          <CardPress />
        </Reveal>
        <Reveal delay={0.12}>
          <CardTalk />
        </Reveal>
        <Reveal delay={0.24}>
          <CardPrompt />
        </Reveal>
      </div>
    </section>
  );
}
