"use client";

export default function CardPress() {
  return (
    <article className="card card-lift flex h-full flex-col overflow-hidden !rounded-2xl">
      {/* ===== visual area ===== */}
      <div className="relative h-[296px] overflow-hidden">
        {/* purple-to-white gradient background (user-provided) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/card-bg/purple.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* glowing dot + sonar rings on the left edge */}
        <div className="absolute left-9 top-1/2 -translate-y-1/2">
          <span className="absolute left-0 top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.55)]" />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute left-0 top-1/2 block h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50"
              style={{
                animation: "press-ring 3.2s cubic-bezier(0.2,0.7,0.3,1) infinite",
                animationDelay: `${i * 1.05}s`,
              }}
            />
          ))}
        </div>
        {/* large cream Ctrl+Shift keycap pair */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
          <div className="rounded-[18px] bg-cream px-5 pb-4 pt-5 text-center shadow-[0_24px_50px_-24px_rgba(26,26,23,0.5)]">
            <div className="text-[19px] font-semibold leading-none text-ink">ctrl</div>
          </div>
          <div className="rounded-[18px] bg-cream px-5 pb-4 pt-5 text-center shadow-[0_24px_50px_-24px_rgba(26,26,23,0.5)]">
            <div className="text-[19px] font-semibold leading-none text-ink">shift</div>
          </div>
        </div>
      </div>
      {/* ===== end visual area ===== */}
      <div className="px-6 py-5 text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">01 · Press</p>
        <h3 className="mt-2.5 text-[19px] font-semibold text-ink">Hold Ctrl+Shift, anywhere</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-inksoft">
          Claude, ChatGPT, Cursor, your terminal — if you can type there, you can talk there.
        </p>
      </div>
    </article>
  );
}
