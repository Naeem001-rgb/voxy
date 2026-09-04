import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

/* Nav pill links with real Lucide icons (lucide-static 1.40.0, ISC). */
const LINKS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "#how",
    label: "How it works",
    icon: (
      // workflow
      <>
        <rect width="8" height="8" x="3" y="3" rx="2" />
        <path d="M7 11v4a2 2 0 0 0 2 2h4" />
        <rect width="8" height="8" x="13" y="13" rx="2" />
      </>
    ),
  },
  {
    href: "#use",
    label: "See it work",
    icon: (
      // monitor-play
      <>
        <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
        <rect x="2" y="3" width="20" height="14" rx="2" />
      </>
    ),
  },
  {
    href: "#speed",
    label: "Dictation",
    icon: (
      // mic
      <>
        <path d="M12 19v3" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <rect x="9" y="2" width="6" height="13" rx="3" />
      </>
    ),
  },
  {
    href: "#love",
    label: "Love",
    icon: (
      // heart
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    ),
  },
  {
    href: "#pricing",
    label: "Pricing",
    icon: (
      // tag
      <>
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </>
    ),
  },
];

function LinkIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 bg-transparent">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-full border border-line bg-white/85 py-2 pl-5 pr-2 shadow-[0_10px_30px_-16px_rgba(26,26,23,0.3)] backdrop-blur-md"
      >
        {/* brand */}
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sun">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18" />
              </g>
            </svg>
          </span>
          <span className="font-sans text-[16px] font-bold tracking-tight">
            {BRAND.name}
          </span>
        </a>

        {/* pill links, centered */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors duration-200 hover:bg-sand/60"
            >
              <span className="text-inksoft">
                <LinkIcon>{l.icon}</LinkIcon>
              </span>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA — yellow pill with dark circle icon at the end, like the model */}
        <a
          href="#pricing"
          className="group flex items-center gap-3 rounded-full bg-sun py-1.5 pl-4 pr-1.5 text-[13px] font-semibold text-ink transition-transform duration-200 hover:scale-[1.03]"
        >
          Download for Linux
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-200 group-hover:rotate-45">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </a>
      </nav>
    </header>
  );
}
