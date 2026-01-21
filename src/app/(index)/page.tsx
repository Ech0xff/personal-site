import { cn } from "@/lib/utils";
import FooterSection from "@/components/FooterSection";
import IntroductionSection from "./components/IntroductionSection";
import HeroSection from "./components/HeroSection";

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="relative flex flex-col w-full gap-3 pt-[10svh]">
        {/* background */}
        <div
          className={cn(
            "absolute w-screen left-1/2 -translate-x-1/2 bottom-0 top-0 transition-all duration-(--duration-fast)",
            "bg-linear-to-b from-(--theme-bg)/0 to-(--theme-bg) to-[18svh]",
            "group-data-[scrolled=true]:top-[-18svh]",
          )}
        />
        <IntroductionSection />
        <FooterSection />
      </div>
    </>
  );
}
