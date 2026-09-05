import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CopyButton from "@/components/site/CopyButton";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Download ${BRAND.name} — thank you!`,
  description: `Your ${BRAND.name} license is confirmed. Download the app for Linux.`,
  robots: { index: false }, // checkout-return page: keep it out of search
};

/* Post-checkout page, modeled on the user's reference screenshot:
   big centered checkmark hero → headline → payment-details card →
   get-started CTA → quiet feature strip → support links.
   Flow: pricing → gateway checkout → gateway redirects here with
   ?checkout_id=… → the server verifies the payment with the gateway's
   API → only then does the download unlock.
   Until gateway keys exist (CREEM_API_KEY etc.), the page runs in
   preview mode under `npm run dev`. */

const DOWNLOAD_URL = "/downloads/voxy-1.0.0-linux-x64.tar.gz";
const FILE_NAME = "voxy-1.0.0-linux-x64.tar.gz";

function isVerified(searchParams: { checkout_id?: string }) {
  // Preview mode lets us test the full page without a real checkout.
  if (process.env.NODE_ENV === "development" && !searchParams.checkout_id) {
    return true;
  }
  const checkoutId = searchParams.checkout_id;
  if (!checkoutId) return false;

  // TODO(payments): server-side verification once the gateway is wired:
  //   const res = await fetch(`https://api.creem.io/v1/checkouts/${checkoutId}`, {
  //     headers: { "x-api-key": process.env.CREEM_API_KEY! },
  //   });
  //   const data = await res.json();
  //   return data.status === "completed";
  // Until then a checkout_id alone doesn't unlock anything real.
  return false;
}

/* ── shared bits ─────────────────────────────────────────────────── */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CheckHero() {
  // centered checkmark in a soft ring with confetti — the reference's
  // one big visual moment; our ink/sun palette instead of purple.
  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden>
      {/* outer hairline ring + warm inner disc */}
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-4 rounded-full bg-sand" />
      {/* confetti — sun/moss/clay bits scattered around the ring */}
      <span className="absolute -left-6 top-5 h-2.5 w-2.5 rounded-full bg-sun" />
      <span className="absolute -right-5 top-11 h-2 w-2 rounded-[3px] rotate-12 bg-moss" />
      <span className="absolute -left-8 bottom-10 h-2 w-2 rounded-[2px] -rotate-12 bg-clay/70" />
      <span className="absolute -right-8 bottom-5 h-2.5 w-2.5 rounded-full bg-sun/80" />
      <span className="absolute left-7 -top-4 h-1.5 w-1.5 rounded-full bg-ink/30" />
      <span className="absolute right-9 -top-5 h-2 w-1.5 rotate-45 bg-moss/60" />
      <span className="absolute -bottom-3 left-11 h-2 w-2 rounded-full bg-clay/50" />
      <span className="absolute -bottom-4 right-14 h-1.5 w-1.5 rounded-[2px] rotate-45 bg-sun" />
      {/* the check itself */}
      <div className="absolute inset-8 flex items-center justify-center rounded-full bg-ink text-sun shadow-[0_20px_44px_-18px_rgba(26,26,23,0.55)]">
        <CheckIcon className="h-14 w-14" />
      </div>
    </div>
  );
}

/* Static keycap — the site's KeyCap visual language, minus the demo
   animation (this page's one motion is the button, not the keys). */
function Key({ label }: { label: string }) {
  return (
    <span className="inline-flex h-7 min-w-[2.1rem] items-center justify-center rounded-md border border-ink/25 bg-white px-2 font-mono text-[12px] font-medium text-ink shadow-[0_2px_0_0_rgba(26,26,23,0.3)]">
      {label}
    </span>
  );
}

/* Copyable command block. Ink-dark container, cream code — stands out
   against the sand card; scrollbar suppressed, copy button on hover. */
function Command({ lines }: { lines: string[] }) {
  const text = lines.join("\n");
  return (
    <div className="group/cmd relative mt-2.5 rounded-lg bg-ink">
      <pre className="max-w-full overflow-x-auto px-3.5 py-2.5 font-mono text-[12.5px] leading-relaxed text-cream [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {lines.map((l) => (
          <div key={l} className="whitespace-pre">
            <span className="mr-2 select-none text-sun/80">$</span>
            {l}
          </div>
        ))}
      </pre>
      <CopyButton text={text} />
    </div>
  );
}

/* detail row: label left, value right, hairline rule between */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-line py-3 last:border-b-0">
      <span className="shrink-0 text-[13.5px] text-inksoft">{label}</span>
      <span className="text-right text-[13.5px] font-medium text-ink">{children}</span>
    </div>
  );
}

/* feature strip item: icon tile + title + one-line benefit */
function Feature({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink shadow-[0_8px_20px_-12px_rgba(26,26,23,0.3)]">
        {icon}
      </span>
      <p className="mt-2.5 text-[13px] font-medium text-ink">{title}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-inksoft">{sub}</p>
    </div>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ── page ────────────────────────────────────────────────────────── */

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const params = await searchParams;
  const verified = isVerified(params);
  const devPreview = process.env.NODE_ENV === "development" && !params.checkout_id;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-[clamp(40px,6vw,72px)] text-center">
        {verified ? (
          <>
            <CheckHero />

            <p className="mt-9 font-mono text-[11px] uppercase tracking-[0.2em] text-forest">
              Payment confirmed
            </p>
            <h1 className="mt-3 font-serif text-[clamp(40px,6vw,58px)] leading-[1.05] tracking-[-0.01em] text-ink">
              Thank you — {BRAND.name} is yours.
            </h1>
            <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-relaxed text-inksoft">
              Your payment went through and your lifetime license is active.
              One download, all future updates, your own free Groq key — no
              account, no monthly fee.
            </p>

            {/* ── payment details card ── */}
            <section className="card mt-10 p-6 text-left sm:p-7" aria-label="Payment details">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-[16px] font-semibold text-ink">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sun">
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke} aria-hidden>
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </span>
                  Payment details
                </h2>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-[12px] font-medium text-forest">
                  <CheckIcon className="h-3 w-3" />
                  Confirmed
                </span>
              </div>
              <dl className="mt-5">
                <Row label="Plan">Voxy — Lifetime ({BRAND.price})</Row>
                <Row label="License">Single user · lifetime updates</Row>
                <Row label="Amount">{BRAND.price} USD · one-time</Row>
              </dl>
              <p className="mt-4 text-[12.5px] text-inksoft">
                A receipt is on its way to your inbox — Creem sent it the
                moment your payment completed.
              </p>
            </section>

            {/* ── get started strip ── */}
            <section className="mt-6 rounded-[26px] bg-sand p-6 text-left sm:p-7" aria-label="Get started">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-ink shadow-[0_10px_30px_-14px_rgba(26,26,23,0.25)]">
                    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" {...stroke} aria-hidden>
                      <path d="M12 19v3" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <rect x="9" y="2" width="6" height="13" rx="3" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-ink">
                      Get started with {BRAND.name}
                    </h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-inksoft">
                      Download the app, run one command, and dictate in any
                      field — browser, editor, terminal.
                    </p>
                  </div>
                </div>
                <a
                  href={DOWNLOAD_URL}
                  download
                  className="group flex shrink-0 items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-[14px] font-semibold text-cream transition-transform duration-200 hover:scale-[1.03]"
                >
                  Download
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-200 group-hover:translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                      <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
                    </svg>
                  </span>
                </a>
              </div>

              {/* install steps, tucked under the CTA in the same card */}
              <ol className="mt-7 grid gap-6 border-t border-line pt-6 text-left sm:grid-cols-3">
                <li>
                  <p className="text-[14px] font-medium text-ink">
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[10.5px] text-cream">1</span>
                    Unpack
                  </p>
                  <Command lines={[`tar -xzf ${FILE_NAME}`, "cd voxy-1.0.0"]} />
                </li>
                <li>
                  <p className="text-[14px] font-medium text-ink">
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[10.5px] text-cream">2</span>
                    Install
                  </p>
                  <Command lines={["bash install.sh"]} />
                  <p className="mt-1.5 text-[12px] text-inksoft">
                    Asks for your free Groq key and sets up the service.
                  </p>
                </li>
                <li>
                  <p className="text-[14px] font-medium text-ink">
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[10.5px] text-cream">3</span>
                    Dictate
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[12.5px] text-inksoft">
                    <Key label="Ctrl" />
                    <Key label="Shift" />
                    <span>speak,</span>
                    <Key label="Ctrl" />
                    <Key label="V" />
                    <span>— text lands at your cursor.</span>
                  </div>
                </li>
              </ol>
            </section>

            {/* ── quiet feature strip ── */}
            <section className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4" aria-label="What you get">
              <Feature
                title="Whisper large-v3"
                sub="The most accurate speech model"
                icon={
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke} aria-hidden>
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  </svg>
                }
              />
              <Feature
                title="Instant"
                sub="Whole transcript pasted at once"
                icon={
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke} aria-hidden>
                    <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" />
                  </svg>
                }
              />
              <Feature
                title="Private"
                sub="Your Groq key, your audio"
                icon={
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke} aria-hidden>
                    <rect x="4" y="10" width="16" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                }
              />
              <Feature
                title="Any app"
                sub="Works in every text field"
                icon={
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke} aria-hidden>
                    <rect x="2" y="4" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 18v3" />
                  </svg>
                }
              />
            </section>

            <p className="mt-10 text-[15px] font-medium text-ink">
              We&apos;re excited to have you on board!
            </p>
            <p className="mt-2 text-[13px] text-inksoft">
              Need help?{" "}
              <a href="/contact" className="font-medium text-ink underline decoration-sun decoration-2 underline-offset-2 hover:decoration-clay">
                Contact support
              </a>
              {" · "}
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-sun decoration-2 underline-offset-2 hover:decoration-clay">
                Get a free Groq key
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">
              Almost there
            </p>
            <h1 className="mt-4 font-serif text-[clamp(38px,5.5vw,56px)] leading-[1.05] tracking-[-0.01em] text-ink">
              Finish your checkout first
            </h1>
            <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-relaxed text-inksoft">
              We couldn&apos;t confirm a completed checkout on this link. If
              you just paid, give it a moment and refresh — verification can
              take a few seconds. Still stuck? Email us and we&apos;ll sort it
              out the same day.
            </p>
            <a
              href="/#pricing"
              className="btn btn-ghost mt-9 px-6 py-3.5 text-[15px]"
            >
              Back to pricing
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </>
        )}

        {devPreview && (
          <p className="mt-10 inline-block rounded-full bg-sun/20 px-4 py-2 font-mono text-[12px] text-ink">
            dev preview — showing the verified state without a checkout_id
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
