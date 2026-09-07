import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Refund Policy — ${BRAND.name}`,
  description: `${BRAND.name} comes with a 14-day money-back guarantee. Here's how refunds work.`,
};

/* Refund — terms-page style: white card with numbered sidebar on the left,
   scrolling content on the right, footer bar with contact link + back-to-top
   button. Same card chrome as /terms and /privacy so all policy pages read as
   one system. Backs the 14-day guarantee promised in the Terms of Service. */

type Section = {
  id: string;
  title: string;
  paras: string[];
};

const SECTIONS: Section[] = [
  {
    id: "guarantee",
    title: "The 14-day guarantee",
    paras: [
      `Buying ${BRAND.name} should be risk-free. Every purchase carries a 14-day money-back guarantee, starting the day you buy. If the app doesn't work for you — on your distribution, your audio setup, your workflow — write to us within 14 days and we'll refund you in full.`,
      `No questions asked, no forms to fill, no troubleshooting checklist first. You don't need to prove anything; a one-line email saying "I'd like a refund" is enough.`,
    ],
  },
  {
    id: "how",
    title: "How to request a refund",
    paras: [
      `Email us with the email address you used at checkout (so we can find your order) and ask for a refund. That's the whole process.`,
      `Our support address reaches a human, not a ticket queue, and refund requests are answered before anything else in the inbox.`,
    ],
  },
  {
    id: "processing",
    title: "Processing time",
    paras: [
      `We submit refunds promptly — usually within 1–2 business days of your request. Your bank or card issuer then takes a few more days to post the money back to your statement, typically 5–10 business days in total depending on who you bank with.`,
      `The refund is issued through the same payment provider that processed your purchase, back to the original payment method.`,
    ],
  },
  {
    id: "covered",
    title: "What's covered",
    paras: [
      `The one-time lifetime license fee — the full ${BRAND.price}, all of it. We don't deduct processing fees, "restocking" costs, or anything else.`,
      `If you bought ${BRAND.name} twice by accident, or your first order didn't deliver a license key, that's an automatic full refund of the duplicate or failed order.`,
    ],
  },
  {
    id: "exceptions",
    title: "Exceptions",
    paras: [
      `The guarantee exists so you can try ${BRAND.name} risk-free, so there are only two things we won't refund: purchases made more than 14 days ago, and clear abuse of the guarantee (buying and refunding repeatedly, cycle after cycle).`,
      `Neither applies to an honest first purchase — if you're inside 14 days and you want your money back, you get it.`,
    ],
  },
  {
    id: "license",
    title: "What happens to your license",
    paras: [
      `When a refund is processed, your license is deactivated and the software is no longer licensed to you. Anything you created with ${BRAND.name} before that — every transcript, every dictated draft — is and remains yours.`,
      `We can't and wouldn't want to take it back: it never touched our servers in the first place.`,
    ],
  },
  {
    id: "chargebacks",
    title: "Please talk to us first",
    paras: [
      `Filing a chargeback with your bank instead of emailing us takes weeks and creates dispute paperwork for everyone — and it usually ends with the same result as the guarantee anyway. A one-line email gets your money back faster.`,
      `But the choice is yours; we'd just rather make it easy.`,
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paras: [
      `Refund questions go to the same place as everything else — our support inbox, or the contact page on this site. We read every message.`,
    ],
  },
];

export default function RefundPage() {
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
                  Refund Policy
                </h1>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-inksoft/70">
                  14-day money-back guarantee · Updated September 2026
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
                    `Refund request for ${BRAND.name}`,
                  )}`}
                  className="flex items-center gap-2 text-[13px] font-medium text-ink transition-opacity hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-moss" aria-hidden>
                    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                  </svg>
                  Questions? Get in touch
                </a>
                <a href="#guarantee" className="btn btn-dark !px-8 !text-[13px] !tracking-wide">
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
