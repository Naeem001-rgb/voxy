"use client";

import { useTypewriter } from "@/components/site/ui";

const AGENT_TEXT = `Investigate why payments.spec.ts is flaky.

- Identify the root cause: timing, state leakage, or fixtures
- Fix it properly; no retry wrappers`;

const BARS: { w: string; c: string }[] = [
  { w: "58%", c: "#8957e5" },
  { w: "72%", c: "#3fb950" },
  { w: "46%", c: "#4a463f" },
  { w: "80%", c: "#3fb950" },
  { w: "38%", c: "#8957e5" },
  { w: "64%", c: "#4a463f" },
];

export default function WindowCursor({ active }: { active: boolean }) {
  const typed = useTypewriter(AGENT_TEXT, active, 70);

  return (
    <div className="w-[470px] max-w-full overflow-hidden rounded-2xl bg-[#181614] shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#211e1a] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-[14px] font-semibold text-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cursor-white.svg" alt="" className="h-[15px] w-[15px]" />
          Cursor
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">
          Payments
        </span>
      </div>
      <div className="grid grid-cols-[44%_56%]">
        <div className="border-r border-white/10 px-4 py-4">
          {BARS.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 py-[5px]">
              <span className="w-4 text-right font-mono text-[9px] text-cream/25">{12 + i}</span>
              <span className="h-[5px] rounded-full" style={{ width: b.w, background: b.c }} />
            </div>
          ))}
        </div>
        <div className="relative flex flex-col px-4 py-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">Agent</span>
          <p className="mt-2 whitespace-pre-line font-mono text-[10.5px] leading-[1.7] text-cream/85">
            {typed}
            {typed.length < AGENT_TEXT.length && (
              <span className="type-caret" aria-hidden />
            )}
          </p>
          <div className="mt-auto flex justify-end pt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                typed.length >= AGENT_TEXT.length ? "bg-[#6c5ce7] text-white" : "bg-[#6c5ce7]/40 text-white/60"
              }`}
            >
              Send to Agent
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
