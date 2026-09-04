"use client";

import { Waveform } from "@/components/site/ui";

export default function CardTalk() {
  return (
    <article className="card card-lift flex h-full flex-col overflow-hidden !rounded-2xl">
      {/* ===== visual area ===== */}
      <div className="relative h-[296px] overflow-hidden">
        <div className="meadow absolute inset-0" style={{ backgroundPosition: "center 62%" }} />
        {/* black YOU SAY pill */}
        <div className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink px-5 py-4 text-center shadow-[var(--shadow-lift)]">
          <p className="font-mono text-[11.5px] leading-[1.75] text-cream/90">
            <Waveform bars={7} center className="mr-2 inline-flex !h-4 align-middle text-sun" />
            <span className="mr-1.5 font-medium tracking-[0.08em] text-sun">YOU SAY</span>
            &ldquo;<span className="text-cream/45 line-through">so um—</span> competitive
            research… no wait, start with pricing, like what the top three&rdquo;
          </p>
        </div>
      </div>
      {/* ===== end visual area ===== */}
      <div className="px-6 py-5 text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">02 · Talk</p>
        <h3 className="mt-2.5 text-[19px] font-semibold text-ink">Say it messy</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-inksoft">
          Ramble, backtrack, change your mind halfway. Half-formed thoughts are the whole point.
        </p>
      </div>
    </article>
  );
}
