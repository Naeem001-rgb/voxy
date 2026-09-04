"use client";

import { useTypewriter } from "@/components/site/ui";

const PROMPT = `Act as a senior UX researcher. Create a customer interview plan for our redesigned onboarding flow.

Include: 3 learning goals, a 30-minute discussion guide, neutral follow-up probes, and a lightweight synthesis framework.`;

export default function WindowClaude({ active }: { active: boolean }) {
  const typed = useTypewriter(PROMPT, active, 90);

  return (
    <div className="w-[470px] max-w-full overflow-hidden rounded-2xl bg-[#faf9f5] shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-2 border-b border-line bg-[#f4f1e8] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-[14px] font-semibold text-ink">
          <span className="text-[15px] leading-none text-[#d97757]">✳</span> Claude
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-inksoft/50">
          New chat
        </span>
      </div>
      <div className="bg-[#faf9f5] px-4 pb-4 pt-3">
        <div className="min-h-[132px] rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="whitespace-pre-line text-left text-[12px] leading-[1.65] text-ink">
            {typed.length < PROMPT.length ? (
              <>
                {typed}
                <span className="type-caret" aria-hidden />
              </>
            ) : (
              PROMPT
            )}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="rounded-full border border-line bg-[#efece2] px-3 py-1 font-mono text-[10px] text-inksoft">
            Claude Sonnet 5
          </span>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-colors ${
              typed.length >= PROMPT.length ? "bg-[#d97757] text-white" : "bg-[#ece8dd] text-inksoft/50"
            }`}
            aria-hidden
          >
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}
