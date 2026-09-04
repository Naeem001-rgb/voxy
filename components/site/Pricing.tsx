import { BRAND } from "@/lib/brand";
import { CheckIcon, Reveal, TuxIcon } from "./ui";

/* Pricing — model image style: soft grey panel, floating card with a lifted
   inner header block, check bullets below. Single lifetime plan. */

const INCLUDED = [
  "Lifetime license — yours forever",
  "No data retention — audio never stored",
  "BYOK — your own free Groq key",
  "Groq free tier is plenty — 8 hours of audio per day",
  "All future updates included",
  "X11 & Wayland · AppImage, .deb, Flatpak",
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 px-[clamp(16px,3vw,40px)] py-[var(--secpad)]">
      <div className="rounded-[32px] bg-[#ececf1] px-6 py-[clamp(48px,6vw,88px)] shadow-[0_16px_44px_-22px_rgba(26,26,23,0.28)] md:px-12">
        {/* header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-inksoft">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3" aria-hidden>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
            </svg>
            Our pricing plan
          </span>
          <h2 className="mt-5 font-sans text-[clamp(34px,4.4vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            One payment. Yours for life.
          </h2>
        </Reveal>

        {/* the single plan card */}
        <Reveal className="mx-auto mt-12 max-w-md" delay={0.08}>
          <div className="rounded-[26px] bg-[#f4f4f6] p-3 shadow-[0_30px_60px_-30px_rgba(26,26,23,0.35)]">
            {/* floating header block */}
            <div className="rounded-[20px] bg-white/80 px-7 pb-7 pt-7 text-center shadow-[0_18px_40px_-20px_rgba(26,26,23,0.3)] backdrop-blur-sm">
              <div>
                <h3 className="inline-block font-sans text-[22px] font-bold tracking-tight text-ink">
                  {BRAND.name} — Lifetime
                </h3>
                <p className="mx-auto mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-inksoft">
                  Pay once, use it forever. Dictation that stays on your desktop.
                </p>
              </div>
              <p className="mt-5 font-sans">
                <span className="text-[34px] font-bold tracking-tight text-ink">
                  {BRAND.price}
                </span>
                <span className="ml-2 text-[13px] font-medium text-inksoft">
                  one-time
                </span>
              </p>
              <a
                href="#pricing"
                className="btn btn-dark mt-6 w-full justify-center !bg-ink !text-cream"
              >
                <TuxIcon className="h-4 w-4" />
                Get {BRAND.name} — {BRAND.price}
              </a>
            </div>

            {/* feature list */}
            <p className="mt-7 px-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-inksoft/70">
              What you get
            </p>
            <ul className="mt-4 space-y-3 px-4 pb-4">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-ink">
                    <CheckIcon className="h-2.5 w-2.5 text-cream" />
                  </span>
                  <span className="text-[13.5px] font-medium text-ink/85">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-inksoft/60">
            Free Groq tier is more than enough · no subscription · no data retention
          </p>
        </Reveal>
      </div>
    </section>
  );
}
