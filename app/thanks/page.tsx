import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { CitrusGlyph } from "@/components/site/ui";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Download ${BRAND.name} — thank you!`,
  description: `Your ${BRAND.name} license is confirmed. Download the app for Linux.`,
  robots: { index: false }, // checkout-return page: keep it out of search
};

/* Post-checkout page. Flow: pricing → gateway checkout → gateway redirects
   here with ?checkout_id=… → the server verifies the payment with the
   gateway's API → only then does the download link unlock.
   Until gateway keys exist (CREEM_API_KEY etc.), the page runs in preview
   mode: it shows the instructions but requires ?preview=1 to unlock. */

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

/* Static keycap — the site's KeyCap visual language, minus the demo
   animation (this page's one motion is the button, not the keys). */
function Key({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 min-w-[2.4rem] items-center justify-center rounded-lg border border-ink/25 bg-white px-2 font-mono text-[12.5px] font-medium text-ink shadow-[0_2px_0_0_rgba(26,26,23,0.3)]">
      {label}
    </span>
  );
}

function Command({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl bg-parchment px-4 py-3 font-mono text-[13px] leading-relaxed text-ink">
      {lines.map((l) => (
        <div key={l} className="whitespace-pre">
          <span className="mr-2 select-none text-clay">$</span>
          {l}
        </div>
      ))}
    </pre>
  );
}

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
      <main className="mx-auto w-full max-w-3xl px-6 pb-28 pt-[clamp(48px,8vw,88px)]">
        {verified ? (
          <>
            {/* ── headline ── */}
            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-forest">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Payment confirmed
            </p>
            <h1 className="mt-4 font-serif text-[clamp(40px,6vw,64px)] leading-[1.05] tracking-[-0.01em] text-ink">
              Thank you — {BRAND.name} is yours.
            </h1>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-inksoft">
              Your license is active. One download, lifetime updates, your own
              free Groq key — no account, no monthly fee. A receipt is on its
              way to your inbox.
            </p>

            {/* ── the download card: ink slab, sun pill — the one bold move ── */}
            <div className="mt-10 rounded-[26px] bg-ink p-6 text-cream shadow-[0_30px_60px_-30px_rgba(26,26,23,0.5)] sm:p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun/15 text-sun">
                    <CitrusGlyph className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-cream/90">
                      {FILE_NAME}
                    </p>
                    <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream/50">
                      {BRAND.os} x64 · tar.gz · lifetime license
                    </p>
                  </div>
                </div>

                <a
                  href={DOWNLOAD_URL}
                  download
                  className="group flex shrink-0 items-center justify-center gap-3 rounded-full bg-sun py-2.5 pl-6 pr-2.5 text-[15px] font-semibold text-ink transition-transform duration-200 hover:scale-[1.03]"
                >
                  Download for {BRAND.os}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-200 group-hover:translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                      <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* ── install steps ── */}
            <div className="card mt-8 p-7 sm:p-8">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-inksoft/70">
                Install in under a minute
              </p>
              <ol className="mt-6 space-y-7">
                <li className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-cream">
                    1
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-ink">
                      Unpack the download
                    </p>
                    <Command
                      lines={[
                        `tar -xzf ${FILE_NAME}`,
                        "cd voxy-1.0.0",
                      ]}
                    />
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-cream">
                    2
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-ink">
                      Run the installer
                    </p>
                    <p className="mt-1 text-[14px] leading-relaxed text-inksoft">
                      It installs everything missing, asks for your free Groq
                      key, and sets up the background service.
                    </p>
                    <Command lines={["bash install.sh"]} />
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-cream">
                    3
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-ink">
                      Dictate anywhere
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] text-inksoft">
                      <Key label="Ctrl" />
                      <Key label="Shift" />
                      <span>speak</span>
                      <Key label="Ctrl" />
                      <Key label="V" />
                      <span>— your words appear at your cursor.</span>
                    </div>
                  </div>
                </li>
              </ol>

              <div className="mt-8 flex items-start gap-2.5 border-t border-line pt-5 text-[13px] leading-relaxed text-inksoft">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden>
                  <path d="M15 7a2 2 0 1 1 4 0v4a2 2 0 0 1-2 2h-4m-6 4a2 2 0 1 1-4 0v-4a2 2 0 0 1 2-2h4" />
                  <path d="M9 18h6M7 11h.01M17 7h.01" />
                </svg>
                <p>
                  Need a Groq key? It&apos;s free at{" "}
                  <a
                    href="https://console.groq.com/keys"
                    className="font-medium text-ink underline decoration-sun decoration-2 underline-offset-2 hover:decoration-clay"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    console.groq.com/keys
                  </a>{" "}
                  — takes a minute. Trouble installing? Email us, the address
                  is in the footer.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">
              Almost there
            </p>
            <h1 className="mt-4 font-serif text-[clamp(38px,5.5vw,56px)] leading-[1.05] tracking-[-0.01em] text-ink">
              Finish your checkout first
            </h1>
            <p className="mt-5 max-w-[50ch] text-[17px] leading-relaxed text-inksoft">
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
