import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND.name}`,
  description: `How ${BRAND.name} handles (and mostly, doesn't handle) your data.`,
};

/* Privacy — terms-page style: white card with numbered sidebar on the left,
   scrolling content on the right, footer bar with contact link + back-to-top
   button. Same card chrome as /terms so all policy pages read as one system. */

type Section = {
  id: string;
  title: string;
  paras: string[];
};

const SECTIONS: Section[] = [
  {
    id: "about",
    title: "About this policy",
    paras: [
      `This policy sets out how ${`"${BRAND.name}"`} (that's us) handles personal information in connection with the ${BRAND.name} desktop application and this website. The short version: the app runs locally, your audio goes directly from your machine to Groq under your own API key, and we never see your audio, your transcripts, or your key.`,
      `By using the website or the application, you consent to this policy. If you don't agree with it, please don't use the Services. We may update this policy from time to time — your continued use after a change means you accept the revised policy.`,
    ],
  },
  {
    id: "collect",
    title: "What information we collect",
    paras: [
      `Almost nothing. ${BRAND.name} is a desktop application that runs entirely on your machine. We don't require an account, and using the app doesn't send anything to us.`,
      `If you buy a license, our commerce provider receives your name, email address, and billing details — that's the only personal information we ever hold, and it exists so we can issue your license and honor refunds.`,
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    paras: [
      `The only information we use is your purchase contact details, and we use them to deliver your license, provide support, process refunds, and — if you ask us to — send you product updates.`,
      `We don't build advertising profiles, we don't sell information, and we don't share it with marketers.`,
    ],
  },
  {
    id: "groq",
    title: "What Groq receives",
    paras: [
      `When you dictate, your audio goes from your computer directly to Groq, Inc., which performs speech recognition using OpenAI's Whisper model — through the API key you created yourself.`,
      `We are never in that path: your audio and transcripts don't touch our servers, because we don't operate any. Groq's handling of API requests is governed by Groq's terms and privacy policy; under Groq's published policy, API inputs are not used to train their models.`,
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paras: [
      `We keep your purchase record for as long as needed to honor your lifetime license and any legal accounting obligations.`,
      `Your audio and transcripts are retained by no one: the app keeps them locally on your disk under your control, and what you delete stays deleted.`,
    ],
  },
  {
    id: "cookies",
    title: "Cookies & tracking",
    paras: [
      `This website runs no advertising cookies, no analytics scripts, and no cross-site trackers. If the site sets any cookie at all, it's a strictly functional one — and we'd rather ship none.`,
      `Your browsing here isn't profiled.`,
    ],
  },
  {
    id: "sharing",
    title: "When we share information",
    paras: [
      `Only when the law compels us, or when it's required to complete your purchase (the commerce provider processing your payment).`,
      `We never sell personal information, and there's no data broker arrangement anywhere in this product.`,
    ],
  },
  {
    id: "security",
    title: "Security",
    paras: [
      `Because we hold so little, there's little to protect — and what we hold is guarded by the commerce provider's PCI-compliant infrastructure.`,
      `On your machine, the app stores your Groq API key in your system's standard secret storage and never transmits it anywhere except to Groq's API endpoint over TLS.`,
    ],
  },
  {
    id: "rights",
    title: "Your choices and rights",
    paras: [
      `You can ask us what purchase information we hold about you, ask us to correct or delete it, and opt out of any future emails — just write to us.`,
      `Deleting ${BRAND.name} from your machine removes the app, its local history, and your stored API key. Since your dictated content never leaves your control except as audio sent straight to Groq, there's nothing on our side to erase.`,
    ],
  },
  {
    id: "children",
    title: "Children",
    paras: [
      `${BRAND.name} is not directed at children under 13, and we don't knowingly collect their personal information. If you believe a child has provided us information, contact us and we'll delete it.`,
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paras: [
      `If we change this policy, we'll update the date below and note material changes on this page. Given how the product works, we expect changes to be rare — the architecture itself is the privacy policy.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto w-[min(1220px,calc(100%-2*clamp(16px,3vw,40px)))] py-[clamp(48px,6vw,88px)]">
          {/* the card: sidebar left, scrolling content right, action bar bottom */}
          <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_30px_70px_-40px_rgba(26,26,23,0.35)] lg:grid lg:grid-cols-[300px_1fr]">
            {/* sidebar */}
            <aside className="border-b border-line bg-[#fafafa] px-7 py-9 lg:border-b-0 lg:border-r">
              <ol className="flex gap-6 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
                {SECTIONS.map((s, i) => (
                  <li key={s.id} className="shrink-0 lg:shrink">
                    <a
                      href={`#${s.id}`}
                      className="group flex items-center gap-3 py-1.5"
                    >
                      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-moss/15 font-mono text-[11px] font-medium text-moss transition-colors duration-200 group-hover:bg-moss/25">
                        {i + 1}
                      </span>
                      <span className="whitespace-nowrap text-[13px] text-inksoft transition-colors duration-200 group-hover:text-ink lg:whitespace-normal">
                        {s.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            {/* content column */}
            <div className="flex flex-col">
              <div className="flex-1 px-[clamp(24px,4vw,56px)] py-10">
                <h1 className="font-serif text-[clamp(32px,3.6vw,44px)] font-semibold tracking-[-0.015em] text-ink">
                  Privacy Policy
                </h1>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-inksoft/70">
                  Updated September 2026
                </p>

                {SECTIONS.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-24 pt-9">
                    <div className="flex items-baseline gap-4">
                      <h2 className="font-serif text-[21px] font-semibold text-ink">
                        {s.title}
                      </h2>
                      <span className="hidden h-px flex-1 bg-line sm:block" aria-hidden />
                    </div>
                    {s.paras.map((p, i) => (
                      <p key={i} className="mt-4 text-[14px] leading-[1.75] text-ink/80">
                        {p}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              {/* action bar */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-line bg-[#fafafa] px-[clamp(24px,4vw,56px)] py-5 sm:flex-row">
                <a
                  href={`mailto:support@${BRAND.name.toLowerCase()}.ai?subject=${encodeURIComponent(
                    `Please send me a copy of the ${BRAND.name} Privacy Policy`,
                  )}`}
                  className="flex items-center gap-2 text-[13px] font-medium text-ink transition-opacity hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-moss" aria-hidden>
                    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                  </svg>
                  Questions? Get in touch
                </a>
                <a href="#about" className="btn btn-dark !px-8 !text-[13px] !tracking-wide">
                  Back to top
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
