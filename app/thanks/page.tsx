import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
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
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">
          {verified ? "Payment confirmed" : "Almost there"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          {verified ? (
            <>Thank you — {BRAND.name} is yours.</>
          ) : (
            <>Finish your checkout first</>
          )}
        </h1>

        {verified ? (
          <>
            <p className="mt-4 text-[17px] leading-relaxed text-inksoft">
              Your license is active. One download, lifetime updates, your own
              free Groq key — no account, no monthly fee.
            </p>
            <a
              href={DOWNLOAD_URL}
              className="btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3.5 text-[16px]"
              download
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                <path d="M12 3v11.2l3.6-3.6 1.4 1.4-5 5-5-5 1.4-1.4 3.6 3.6V3h2zM4 19h16v2H4v-2z" />
              </svg>
              Download {BRAND.name} for {BRAND.os}
            </a>
            <div className="mt-10 rounded-2xl border border-line bg-white p-6">
              <h2 className="text-[17px] font-semibold text-ink">
                Install in under a minute
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-inksoft">
                <li>
                  Unpack the download:
                  <pre className="mt-1.5 overflow-x-auto rounded-lg bg-parchment px-3 py-2 font-mono text-[13px] text-ink">
tar -xzf voxy-1.0.0-linux-x64.tar.gz
cd voxy-1.0.0
                  </pre>
                </li>
                <li>
                  Run the installer — it installs everything missing, asks for
                  your free Groq key, and sets up the background service:
                  <pre className="mt-1.5 overflow-x-auto rounded-lg bg-parchment px-3 py-2 font-mono text-[13px] text-ink">
bash install.sh
                  </pre>
                </li>
                <li>
                  Press <strong className="text-ink">Ctrl+Shift</strong>, speak,
                  press <strong className="text-ink">Ctrl+V</strong> — your words
                  appear wherever your cursor is.
                </li>
              </ol>
              <p className="mt-4 text-[13px] text-inksoft">
                Need your Groq key? It&apos;s free at{" "}
                <a
                  href="https://console.groq.com/keys"
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  console.groq.com/keys
                </a>
                . Trouble installing? Email us — the address is in the footer.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-[17px] leading-relaxed text-inksoft">
              We couldn&apos;t confirm a completed checkout on this link. If you
              just paid, give it a moment and refresh — verification can take a
              few seconds. If this keeps happening, email us and we&apos;ll sort
              it out the same day.
            </p>
            <a href="/#pricing" className="btn-primary mt-8 inline-flex px-6 py-3.5 text-[16px]">
              Back to pricing
            </a>
          </>
        )}

        {devPreview && (
          <p className="mt-8 rounded-lg bg-sun/20 px-4 py-2 font-mono text-[12px] text-ink">
            dev preview — showing the verified state without a checkout_id
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
