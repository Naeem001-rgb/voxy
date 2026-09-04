"use client";

import { useTypewriter } from "@/components/site/ui";

const PROMPT = `Analyze the onboarding flows of the top 3 tools in our category.

Extract: activation steps, time-to-value, friction points, and 5 patterns worth adopting. Format: comparison table + recommendations.`;

function OpenAIGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect
          key={deg}
          x="10.4"
          y="2.5"
          width="3.2"
          height="9"
          rx="1.6"
          fill="currentColor"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

export default function WindowChatGPT({ active }: { active: boolean }) {
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
          <OpenAIGlyph className="h-4 w-4 text-ink" /> ChatGPT
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
            GPT-5
          </span>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors ${
              typed.length >= PROMPT.length ? "bg-ink text-cream" : "bg-[#ece8dd] text-inksoft/50"
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
