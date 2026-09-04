import { BRAND } from "@/lib/brand";
import { TuxIcon } from "./ui";

/* Final CTA — teardown-matched: frosted glass card floating over the
   user-provided meadow artwork. */
export default function FinalCta() {
  return (
    <section className="px-[clamp(16px,3vw,40px)] pb-[var(--secpad)]">
      <div className="relative min-h-[min(72vh,640px)] overflow-hidden rounded-[32px] shadow-[var(--shadow-lift)]">
        <div className="animate-kenburns meadow-cta absolute inset-0" aria-hidden />
        <div className="grain absolute inset-0 opacity-[0.05]" aria-hidden />

        {/* frosted glass card */}
        <div className="relative flex min-h-[min(72vh,640px)] items-center justify-center px-6 py-20">
          <div className="w-[min(640px,100%)] rounded-[28px] border border-white/55 bg-[#fffde9]/45 px-8 py-14 text-center shadow-[0_30px_70px_-30px_rgba(26,26,23,0.35)] backdrop-blur-[14px] md:px-16">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-forest">
              ◦ A world of ease ◦
            </p>
            <h2 className="mx-auto mt-4 max-w-md font-serif text-[clamp(30px,3.6vw,44px)] font-medium leading-[1.12] tracking-[-0.01em] text-ink [text-wrap:balance]">
              Your voice is your best <em className="italic">prompt engineer</em>.
            </h2>
            <a href="#pricing" className="btn btn-dark mt-8">
              <TuxIcon className="h-4 w-4" />
              Download for {BRAND.os}
            </a>
            <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-inksoft/90">
              All Linux distros · Set up in 2 minutes · No credit card
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
