import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import DistroMarquee from "@/components/site/DistroMarquee";
import HowItWorks from "@/components/site/HowItWorks";
import AppSwitcher from "@/components/site/AppSwitcher";
import Dictation from "@/components/site/Dictation";
import Everywhere from "@/components/site/Everywhere";
import WorksEverywhere from "@/components/site/WorksEverywhere";
import Stats from "@/components/site/Stats";
import WallOfLove from "@/components/site/WallOfLove";
import Pricing from "@/components/site/Pricing";
import FinalCta from "@/components/site/FinalCta";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DistroMarquee />
        <HowItWorks />
        <AppSwitcher />
        <Dictation />
        <Everywhere />
        <WorksEverywhere />
        <Stats />
        <WallOfLove />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
