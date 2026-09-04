import { Marquee } from "./ui";

/* Distro marks fetched from simpleicons.org (official brand colors) —
   local copies in public/distros/ so nothing loads from third parties at runtime. */
const DISTROS = [
  { name: "Ubuntu", icon: "/distros/Ubuntu.svg" },
  { name: "Fedora", icon: "/distros/Fedora.svg" },
  { name: "Arch", icon: "/distros/Arch.svg" },
  { name: "Debian", icon: "/distros/Debian.svg" },
  { name: "Linux Mint", icon: "/distros/LinuxMint.svg" },
  { name: "Pop!_OS", icon: "/distros/PopOS.svg" },
  { name: "Manjaro", icon: "/distros/Manjaro.svg" },
  { name: "NixOS", icon: "/distros/NixOS.svg" },
  { name: "CachyOS", icon: "/distros/CachyOS.svg" },
  { name: "openSUSE", icon: "/distros/openSUSE.svg" },
  { name: "Zorin OS", icon: "/distros/Zorin.svg" },
  { name: "Elementary", icon: "/distros/Elementary.svg" },
];

export default function DistroMarquee() {
  return (
    <section aria-label="Supported distributions" className="py-10">
      <p className="text-center font-mono text-[13px] font-medium tracking-[0.22em] uppercase text-ink/85">
        Runs wherever Linux runs
      </p>
      <Marquee duration={36} className="mt-5">
        {DISTROS.map((d) => (
          <span key={d.name} className="flex items-center">
            <span className="flex items-center gap-2.5 px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.icon} alt="" width={38} height={38} className="h-[38px] w-[38px]" loading="lazy" />
              <span className="font-serif text-[25px] italic text-ink/80">{d.name}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-sun" aria-hidden />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
