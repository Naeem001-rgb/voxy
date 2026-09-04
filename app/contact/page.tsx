import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Contact — ${BRAND.name}`,
  description: `Talk to the ${BRAND.name} support team — we read every message.`,
};

/* Contact — model style: big serif headline + intro left, grey form panel
   right, contact rows under the intro. No phone number. */

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 0 1 13 0c0 4.8-6.5 10-6.5 10Z" />
      <circle cx="12" cy="10.7" r="2.3" />
    </svg>
  );
}

const FIELD =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-inksoft/60 outline-none transition-colors duration-200 focus:border-ink/40";

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto w-[min(1220px,calc(100%-2*clamp(16px,3vw,40px)))] py-[clamp(48px,6vw,88px)]">
          {/* everything sits inside one big white card, like the model */}
          <div className="rounded-[28px] border border-line bg-white p-[clamp(24px,4.5vw,64px)] shadow-[0_30px_70px_-40px_rgba(26,26,23,0.35)]">
            <div className="grid items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-2">
            {/* left: headline + contact rows */}
            <div className="lg:pt-6">
              <h1 className="font-serif text-[clamp(38px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.018em] [text-wrap:balance]">
                Talk to our support&nbsp;team
              </h1>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-inksoft">
                Feel free to reach out for help with your license or any
                questions you may have about {BRAND.name}.
              </p>

              <ul className="mt-14 space-y-6">
                <li className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white">
                    <MailIcon className="h-4 w-4 text-ink" />
                  </span>
                  <a
                    href={`mailto:support@${BRAND.name.toLowerCase()}.ai`}
                    className="text-sm font-medium text-ink transition-opacity hover:opacity-70"
                  >
                    support@{BRAND.name.toLowerCase()}.ai
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white">
                    <PinIcon className="h-4 w-4 text-ink" />
                  </span>
                  <span className="text-sm font-medium text-ink">
                    Remote — we ship from the internet
                  </span>
                </li>
              </ul>
            </div>

            {/* right: form panel */}
            <div className="rounded-[24px] bg-[#f4f4f6] p-6 shadow-[0_20px_50px_-30px_rgba(26,26,23,0.3)] md:p-8">
              <form
                action={`mailto:support@${BRAND.name.toLowerCase()}.ai`}
                method="post"
                encType="text/plain"
                className="space-y-5"
              >
                <div>
                  <label htmlFor="name" className="mb-2 block text-[13px] font-medium text-ink">
                    Full Name
                  </label>
                  <input id="name" name="name" type="text" required placeholder="Enter Your Full Name" className={FIELD} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-ink">
                    Email Address
                  </label>
                  <input id="email" name="email" type="email" required placeholder="Enter Your Email Address" className={FIELD} />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-[13px] font-medium text-ink">
                    Message
                  </label>
                  <textarea id="message" name="message" required rows={7} placeholder="Write Your Message Here" className={`${FIELD} resize-none`} />
                </div>
                <button type="submit" className="btn btn-dark !px-6 !py-3 !text-sm">
                  Send Message
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
