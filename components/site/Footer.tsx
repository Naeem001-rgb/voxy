import { BRAND } from "@/lib/brand";
import { CitrusGlyph } from "./ui";

/* Footer — teardown-matched dark band: brand left, PRODUCT / COMPANY / LEGAL
   columns, hairline rule, small-print bottom row. */

const PRODUCT = [
  { href: "#how", label: "How it works" },
  { href: "#use", label: "See it work" },
  { href: "#speed", label: "Dictation" },
  { href: "#pricing", label: "Download" },
];

const COMPANY = [
  { href: "/contact", label: "Contact" },
  { href: "#love", label: "About" },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/refund", label: "Refund policy" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-[clamp(16px,3vw,40px)] py-[clamp(48px,6vw,80px)]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand block */}
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <CitrusGlyph className="h-6 w-6 text-cream" />
              <span className="font-serif text-[26px] lowercase tracking-tight">
                {BRAND.name}
              </span>
            </a>
            <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-cream/60">
              A world of ease
            </p>
          </div>

          {/* link columns */}
          {(
            [
              ["Product", PRODUCT],
              ["Company", COMPANY],
              ["Legal", LEGAL],
            ] as const
          ).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
                {title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-cream/85 transition-colors duration-200 hover:text-cream"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* bottom row */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/55">
            © {new Date().getFullYear()} {BRAND.name} — all rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/55">
            support@{BRAND.name.toLowerCase()}.ai
          </p>
        </div>

        <p className="mt-8 max-w-3xl font-mono text-[9.5px] leading-relaxed tracking-[0.04em] text-cream/40">
          {BRAND.name} is an independent product, not affiliated with Groq or
          OpenAI. Whisper is a trademark of OpenAI. Linux® is the registered
          trademark of Linus Torvalds. Transcription runs on Groq under your own
          API key and is subject to Groq&apos;s terms.
        </p>
      </div>
    </footer>
  );
}
