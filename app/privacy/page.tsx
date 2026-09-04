import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND.name}`,
  description: `How ${BRAND.name} handles (and mostly, doesn't handle) your data.`,
};

/* Privacy Policy — model style: huge headline + updated date, intro block on
   the left with a sticky table of contents on the right, numbered summary
   items with bold lead-ins. Content is written for Voxy: local app, BYOK
   Groq, no retention, no telemetry. */

const TOC = [
  { id: "collect", label: "What information we collect" },
  { id: "use", label: "How we use your information" },
  { id: "groq", label: "What Groq receives" },
  { id: "retention", label: "Data retention" },
  { id: "cookies", label: "Cookies & tracking" },
  { id: "sharing", label: "When we share information" },
  { id: "security", label: "Security" },
  { id: "rights", label: "Your choices and rights" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

const SUMMARY = [
  {
    id: "collect",
    head: "What information we collect.",
    body: `Almost nothing. ${BRAND.name} is a desktop application that runs entirely on your machine. We don't require an account, and using the app doesn't send anything to us. If you buy a license, our commerce provider receives your name, email address, and billing details — that's the only personal information we ever hold, and it exists so we can issue your license and honor refunds.`,
  },
  {
    id: "use",
    head: "How we use your information.",
    body: "The only information we use is your purchase contact details, and we use them to deliver your license, provide support, process refunds, and — if you ask us to — send you product updates. We don't build advertising profiles, we don't sell information, and we don't share it with marketers.",
  },
  {
    id: "groq",
    head: "What Groq receives.",
    body: `When you dictate, your audio goes from your computer directly to Groq, Inc., which performs speech recognition using OpenAI's Whisper model — through the API key you created yourself. We are never in that path: your audio and transcripts don't touch our servers, because we don't operate any. Groq's handling of API requests is governed by Groq's terms and privacy policy; under Groq's published policy, API inputs are not used to train their models.`,
  },
  {
    id: "retention",
    head: "Data retention.",
    body: "We keep your purchase record for as long as needed to honor your lifetime license and any legal accounting obligations. Your audio and transcripts are retained by no one: the app keeps them locally on your disk under your control, and what you delete stays deleted.",
  },
  {
    id: "cookies",
    head: "Cookies & tracking.",
    body: "This website runs no advertising cookies, no analytics scripts, and no cross-site trackers. If the site sets any cookie at all, it's a strictly functional one — and we'd rather ship none. Your browsing here isn't profiled.",
  },
  {
    id: "sharing",
    head: "When we share information.",
    body: "Only when the law compels us, or when it's required to complete your purchase (the commerce provider processing your payment). We never sell personal information, and there's no data broker arrangement anywhere in this product.",
  },
  {
    id: "security",
    head: "Security.",
    body: "Because we hold so little, there's little to protect — and what we hold is guarded by the commerce provider's PCI-compliant infrastructure. On your machine, the app stores your Groq API key in your system's standard secret storage and never transmits it anywhere except to Groq's API endpoint over TLS.",
  },
  {
    id: "rights",
    head: "Your choices and rights.",
    body: `You can ask us what purchase information we hold about you, ask us to correct or delete it, and opt out of any future emails — just write to us. Deleting ${BRAND.name} from your machine removes the app, its local history, and your stored API key. Since your dictated content never leaves your control except as audio sent straight to Groq, there's nothing on our side to erase.`,
  },
  {
    id: "children",
    head: "Children.",
    body: `${BRAND.name} is not directed at children under 13, and we don't knowingly collect their personal information. If you believe a child has provided us information, contact us and we'll delete it.`,
  },
  {
    id: "changes",
    head: "Changes to this policy.",
    body: "If we change this policy, we'll update the date below and note material changes on this page. Given how the product works, we expect changes to be rare — the architecture itself is the privacy policy.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* headline block */}
        <section className="mx-auto w-[min(1220px,calc(100%-2*clamp(16px,3vw,40px)))] pt-[clamp(40px,6vw,80px)] pb-4 text-center">
          <h1 className="font-sans text-[clamp(44px,7vw,88px)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-inksoft">
            Last updated September 4, 2026
          </p>
        </section>

        {/* body: prose left, sticky TOC right */}
        <section className="mx-auto w-[min(1220px,calc(100%-2*clamp(16px,3vw,40px)))] py-[clamp(32px,5vw,64px)]">
          <div className="grid gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1fr_300px]">
            <div className="max-w-[560px]">
              <p className="font-sans text-[19px] font-medium leading-[1.5] text-ink">
                This Privacy Policy will help you better understand how
                {` ${BRAND.name} `}collects, uses, and shares your personal
                information — which is to say, barely at all.
              </p>

              <h2 className="mt-10 font-sans text-[17px] font-semibold text-ink">
                Privacy Policy
              </h2>
              <p className="mt-3 text-[14px] leading-[1.8] text-ink/80">
                This policy sets out how {`"${BRAND.name}"`} (that&apos;s us)
                handles personal information in connection with the {BRAND.name}{" "}
                desktop application and this website. The short version: the app
                runs locally, your audio goes directly from your machine to Groq
                under your own API key, and we never see your audio, your
                transcripts, or your key.
              </p>
              <p className="mt-4 text-[14px] leading-[1.8] text-ink/80">
                By using the website or the application, you consent to this
                policy. If you don&apos;t agree with it, please don&apos;t use
                the Services. We may update this policy from time to time — your
                continued use after a change means you accept the revised
                policy.
              </p>

              <h2 className="mt-12 font-sans text-[17px] font-semibold text-ink">
                Privacy Summary
              </h2>
              <ol className="mt-4 space-y-5">
                {SUMMARY.map((s) => (
                  <li key={s.id} id={s.id} className="scroll-mt-24 text-[14px] leading-[1.8] text-ink/80">
                    <a href={`#${s.id}`} className="font-semibold text-ink hover:underline">
                      {s.head}
                    </a>{" "}
                    {s.body}
                  </li>
                ))}
              </ol>
            </div>

            {/* table of contents */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-sans text-[17px] font-semibold text-ink">
                Table of contents
              </h2>
              <ol className="mt-4 space-y-2.5">
                {TOC.map((t, i) => (
                  <li key={t.id} className="text-[13px] leading-snug">
                    <a
                      href={`#${t.id}`}
                      className="font-medium text-ink underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink"
                    >
                      {i + 1}. {t.label}
                    </a>
                  </li>
                ))}
              </ol>
              <a
                href="#top"
                className="mt-8 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[13px] font-medium text-ink hover:opacity-70"
              >
                Back to top <span aria-hidden>↑</span>
              </a>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
