"use client";

import { useEffect, useRef, useState } from "react";

/* Copy button for command blocks: invisible until you hover the block,
   flips to a check for a beat after clicking. Sits top-right, docs-site
   style. Clipboard API needs the page to be in a secure context —
   localhost and Vercel both are — with a fallback for anything else. */
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API unavailable (permissions/insecure context) — the old
      // execCommand path still works in those browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy command"}
      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md border border-ink/15 bg-white/90 text-ink opacity-0 shadow-[0_2px_8px_-2px_rgba(26,26,23,0.25)] backdrop-blur transition-opacity duration-150 focus-visible:opacity-100 group-hover/cmd:opacity-100"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-forest" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
