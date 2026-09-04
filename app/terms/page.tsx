import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Terms of Service — ${BRAND.name}`,
  description: `The terms that govern your use of ${BRAND.name}.`,
};

/* Terms — model style: white card with numbered sticky sidebar on the left,
   scrolling content on the right, footer bar with "send copy" + agree button.
   Sticky sidebar tracks the active section via scroll (client component below). */

type Section = {
  id: string;
  title: string;
  paras: string[];
  sub?: { head: string; body: string };
};

const SECTIONS: Section[] = [
  {
    id: "accepting",
    title: "Accepting the terms",
    paras: [
      `By downloading, installing, or using ${BRAND.name} (the "Software"), you agree to these Terms of Service. If you purchase a license, the person or entity paying for it is the licensee, and these terms apply to everyone using the Software under that license.`,
      `${BRAND.name} is a desktop dictation application. Speech recognition is performed by Groq, Inc. using OpenAI's Whisper model, through an API key that you obtain and configure yourself. Your use of Groq's service is additionally governed by Groq's own terms and privacy policy.`,
    ],
  },
  {
    id: "changes",
    title: "Changes to terms",
    paras: [
      `We may update these terms as the product evolves. When we do, we'll revise the "last updated" date above and, for material changes, note them on our website. Continued use of the Software after an update means you accept the revised terms.`,
      `Your lifetime license covers the Software as described at the time of purchase, including the updates we release. If a future change to these terms materially reduces your rights, we'll give you notice before it takes effect.`,
    ],
  },
  {
    id: "using",
    title: "Using our product",
    paras: [
      `Your license is a one-time purchase for lifetime personal use. You may install and use the Software on any computer you personally own and control, for any lawful purpose.`,
      `The Software runs locally on your machine. Audio is processed by Groq under your own API key; we never receive your audio, your transcripts, or your Groq key. You are responsible for your Groq account, your API key, and any charges Groq may apply — though Groq's free tier is more than enough for typical daily dictation.`,
      `You are responsible for keeping your copy of the Software and your license key safe. If you lose your license key, contact us and we'll do our best to recover it.`,
    ],
  },
  {
    id: "restrictions",
    title: "General restrictions",
    paras: [
      `You may not resell, sublicense, or redistribute the Software itself. You may not reverse-engineer it except where such restriction is prohibited by law. You may not use the Software to violate any applicable law, or to transcribe audio you have no right to process.`,
      `These restrictions don't limit what you can do with the text you dictate — your transcripts are yours, with no claim from us.`,
    ],
  },
  {
    id: "content",
    title: "Content policy",
    paras: [
      `Your audio and transcripts are yours. We don't retain, read, or store them — the Software has no data retention and no telemetry pipeline for your content. What Groq's API does with requests is governed by Groq's terms; under Groq's published policy, API inputs are not used to train their models.`,
      `We may publish anonymous, aggregate statistics (like total words dictated) only if you explicitly opt in.`,
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paras: [
      `The text you create with ${BRAND.name} belongs entirely to you. We claim no ownership over your dictated content, and we place no restrictions on how you use it — commercially or otherwise.`,
      `You may use the Software on any Linux distribution, on as many of your own machines as you like. If you ever want to verify our privacy claims, the Groq dashboard shows exactly what your key has processed.`,
    ],
  },
  {
    id: "copyright",
    title: "Copyright policy",
    paras: [
      `The Software is licensed, not sold. We retain all right, title, and interest in the Software itself, including all intellectual property. Apart from the license granted in these terms, you receive no rights to the Software's code, branding, or assets.`,
      `If you believe the Software infringes your copyright, contact us with the details and we'll investigate promptly.`,
    ],
  },
  {
    id: "relationship",
    title: "Relationship guidelines",
    paras: [
      `${BRAND.name} is an independent product. We are not affiliated with, endorsed by, or sponsored by Groq, Inc. or OpenAI. Whisper is a trademark of OpenAI. Linux® is the registered trademark of Linus Torvalds.`,
      `Nothing in these terms creates a partnership, agency, or employment relationship between you and us.`,
    ],
  },
  {
    id: "liability",
    title: "Liability policy",
    paras: [
      `The Software is provided "as is". To the maximum extent permitted by law, we disclaim all warranties, express or implied, and we are not liable for indirect or consequential damages — including transcription errors, lost drafts, or Groq service outages.`,
      `Because your audio and text never touch our servers, the realistic blast radius of a Software defect is small — but dictation is not infallible, so proofread anything important. Our total liability is limited to the amount you paid for your license.`,
    ],
    sub: {
      head: "Refunds",
      body: `Every purchase carries a 14-day refund window, no questions asked. Email support and we'll process it.`,
    },
  },
  {
    id: "legal",
    title: "General legal terms",
    paras: [
      `These terms are the entire agreement between you and us regarding the Software. If any provision is found unenforceable, the remainder stays in force. We may assign these terms in connection with a merger or sale of the product; we'll note it on the website if that happens.`,
      `Questions about these terms? Write to us — the contact page reaches a human, not a ticket queue.`,
    ],
  },
];

export default function TermsPage() {
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
                  Terms of Service
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
                    {s.sub && (
                      <div className="mt-6">
                        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                          {s.sub.head}
                        </h3>
                        <p className="mt-2 text-[14px] leading-[1.75] text-ink/80">
                          {s.sub.body}
                        </p>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* action bar */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-line bg-[#fafafa] px-[clamp(24px,4vw,56px)] py-5 sm:flex-row">
                <a
                  href={`mailto:support@${BRAND.name.toLowerCase()}.ai?subject=${encodeURIComponent(
                    `Please send me a copy of the ${BRAND.name} Terms of Service`,
                  )}`}
                  className="flex items-center gap-2 text-[13px] font-medium text-ink transition-opacity hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-moss" aria-hidden>
                    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                  </svg>
                  Questions? Get in touch
                </a>
                <a href="#accepting" className="btn btn-dark !px-8 !text-[13px] !tracking-wide">
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
