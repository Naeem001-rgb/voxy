"use client";

import { CheckIcon } from "@/components/site/ui";

export default function CardPrompt() {
  return (
    <article className="card card-lift flex h-full flex-col overflow-hidden !rounded-2xl">
      {/* ===== visual area ===== */}
      <div className="relative h-[296px] overflow-hidden">
        {/* blue noisy gradient background (user-provided) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/card-bg/blue.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* frosted glass prompt card */}
        <div className="absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/70 bg-white/75 p-4 text-left shadow-[var(--shadow-lift)] backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] leading-none text-[#d97757]">✳</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss">
              Prompt · at your cursor
            </span>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink">
            Compare pricing for the top 3 tools in our category. Include tiers,
            per-seat cost, and positioning. Format: table + 3 takeaways.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-moss/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-moss">
            <CheckIcon className="h-3 w-3" />
            Prompt ready
          </div>
        </div>
      </div>
      {/* ===== end visual area ===== */}
      <div className="px-6 py-5 text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">03 · Prompt</p>
        <h3 className="mt-2.5 text-[19px] font-semibold text-ink">Press Ctrl+V, done</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-inksoft">
          One keystroke and your transcription lands right where your cursor is — whole,
          instant, no typing it out. Goal, context, constraints — all there.
        </p>
      </div>
    </article>
  );
}
