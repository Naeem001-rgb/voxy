"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/* Sample quotes — TODO(before launch): replace with real beta-tester quotes.
   Never publish fabricated testimonials on the live site. */
const QUOTES: {
  text: string;
  highlight?: string;
  name: string;
  role: string;
  feature?: boolean;
}[] = [
  {
    text: "I’m so much faster with dictation. It saves me hours every day.",
    highlight: "saves me hours every day",
    name: "Maren K.",
    role: "Bestselling author",
    feature: true,
  },
  {
    text: "It has become my default way of getting ideas down — much faster and easier than typing.",
    name: "Julian R.",
    role: "Founder & CEO",
  },
  {
    text: "I use it every day for 95% of what I write — I can’t see myself going back to the keyboard.",
    name: "Scott A.",
    role: "Founder",
  },
  {
    text: "It’s like a personal assistant throughout my workday.",
    name: "Tessa M.",
    role: "Managing Partner",
  },
];

function QuoteText({
  q,
  inView,
}: {
  q: (typeof QUOTES)[number];
  inView: boolean;
}) {
  const base =
    "font-serif font-medium tracking-[-0.008em] [text-wrap:pretty]";

  if (!q.highlight) {
    return <p className={`${base} text-[20px] leading-[1.42]`}>{q.text}</p>;
  }

  const [before, after] = q.text.split(q.highlight);
  return (
    <p
      className={`${base} text-[clamp(23px,2.2vw,29px)] leading-[1.35]`}
    >
      {before}
      <span className={`wol-hl ${inView ? "wol-in" : ""}`}>{q.highlight}</span>
      {after}
    </p>
  );
}

function Quote({ q, index }: { q: (typeof QUOTES)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      ref={ref}
      className={`flex flex-col gap-[22px] rounded-[24px] border p-[30px] pb-[26px] transition-[transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_46px_-28px_rgba(26,26,23,0.3)] ${
        q.feature
          ? "border-[#c9aa3b40] bg-gradient-to-br from-[#fffde9] to-[#fff8c4] md:col-span-2"
          : "border-line bg-white"
      } ${
        index === 1
          ? "md:[transition-delay:80ms]"
          : index === 3
            ? "md:[transition-delay:160ms]"
            : ""
      }`}
    >
      <QuoteText q={q} inView={inView || Boolean(reduceMotion)} />
      <figcaption className="flex items-center gap-[13px] [margin-top:auto]">
        <span
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink font-mono text-sm uppercase text-cream"
          aria-hidden
        >
          {q.name.charAt(0)}
        </span>
        <span>
          <b className="block text-[14.5px] font-semibold">{q.name}</b>
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-inksoft/70">
            {q.role}
          </span>
        </span>
      </figcaption>
    </motion.figure>
  );
}

function Equalizer() {
  return (
    <span className="wol-eq" aria-hidden>
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export default function WallOfLove() {
  return (
    <section id="love" className="scroll-mt-20 py-[var(--secpad)]">
      <div className="mx-auto w-[min(1220px,calc(100%-2*clamp(16px,3vw,40px)))]">
        <div className="mx-auto max-w-[820px] text-center">
          <p className="flex items-center justify-center gap-2.5 font-mono text-[13.5px] font-medium uppercase tracking-[0.16em] text-forest before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:opacity-50 before:content-[''] after:h-1.5 after:w-1.5 after:rounded-full after:bg-current after:opacity-50 after:content-['']">
            Wall of love
          </p>
          <h2 className="mt-5 font-serif text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.018em] [text-wrap:balance]">
            Nobody goes <em className="italic font-medium">back</em> to typing
          </h2>
        </div>

        <div className="mt-[clamp(40px,5vw,60px)] grid gap-[clamp(14px,1.8vw,22px)] md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Quote key={q.name} q={q} index={i} />
          ))}

          <motion.figure
            className="flex flex-col items-center justify-center rounded-[24px] bg-ink p-[30px] pb-[26px] text-center text-cream transition-[transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_46px_-28px_rgba(26,26,23,0.3)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <div>
              <Equalizer />
              <p className="mt-3.5 font-serif text-[19px]">Voxy gets it done.</p>
              <a
                href="#pricing"
                className="mt-4 inline-block border-b border-[#fff67e] pb-0.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#fff67e] hover:opacity-80"
              >
                Try it →
              </a>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
