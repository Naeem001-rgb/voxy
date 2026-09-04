"use client";

import { useEffect, useState } from "react";
import { useTypewriter } from "@/components/site/ui";

const TASK = `Investigate why scripts/deploy.sh fails at the migration step.

Diagnose the root cause, fix it, and add a guard so it fails loudly next time. Do not modify anything in config/prod.`;

const STATUS = "Investigating… root cause in 2 files";

export default function WindowClaudeCode({ active }: { active: boolean }) {
  const [statusOn, setStatusOn] = useState(false);
  const typed = useTypewriter(TASK, active, 80);
  const status = useTypewriter(STATUS, active && statusOn, 50);

  useEffect(() => {
    if (!active) {
      setStatusOn(false);
      return;
    }
    const t = setTimeout(() => setStatusOn(true), 2200);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="w-[470px] max-w-full overflow-hidden rounded-2xl bg-[#151310] shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#211e1a] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-[14px] font-semibold text-cream">
          <span className="text-[15px] leading-none text-[#d97757]">✳</span> Claude Code
        </span>
        <span className="ml-auto font-mono text-[10px] tracking-[0.08em] text-cream/35">
          ~/voxy-app
        </span>
      </div>
      <div className="min-h-[176px] px-5 py-4">
        <p className="font-mono text-[11px] leading-[1.8] text-cream/85">
          <span className="mr-1.5 text-[#d97757]">›</span>
          {typed.length < TASK.length ? (
            <>
              {typed}
              <span className="type-caret" aria-hidden />
            </>
          ) : (
            TASK
          )}
        </p>
        {status.length > 0 && (
          <p className="mt-3 font-mono text-[11px] text-[#9fc46a]">
            <span className="mr-1.5">✳</span>
            {status}
            {status.length < STATUS.length && (
              <span className="type-caret" aria-hidden />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
