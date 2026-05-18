import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { assetUrl } from "@/lib/utils";
import { ActionCardsSection } from "./sections/ActionCardsSection";
import { HeroContentSection } from "./sections/HeroContentSection";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { FooterSection } from "./sections/FooterSection";
import { useLocation } from "wouter";

export const HomePage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const actionRef = useRef<HTMLElement>(null);
  const scrollToAction = () => {
    actionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-black">
      <NavigationBarSection />

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative h-screen overflow-hidden bg-black scroll-mt-24"
        aria-label="Hero section"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={assetUrl("/coral_reef_underwater.mp4")} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[rgba(5,38,152,0.45)]" />
        <div className="absolute inset-x-0 bottom-0 h-[212px] bg-[linear-gradient(180deg,rgba(5,38,152,0)_0%,rgba(17,107,248,0.7)_100%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col">
          <div className="flex flex-1 items-start justify-center pt-32 md:pt-36">
            <HeroContentSection />
          </div>
        </div>

        {/* ── Scroll-down arrow — always visible at the bottom of the viewport ── */}
        <button
          type="button"
          onClick={scrollToAction}
          data-testid="button-scroll-to-action"
          aria-label="Scroll to Take Action"
          className="group absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center focus:outline-none"
        >
          <div className="animate-bounce">
            <ChevronDown
              className="h-9 w-9 text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.9)] transition-all duration-200 group-hover:scale-125 group-hover:text-[#21bcee]"
              strokeWidth={2.5}
            />
          </div>
        </button>
      </section>

      {/* ── TAKE ACTION (carousel) ── */}
      <section
        ref={actionRef}
        id="adopt"
        className="bg-black pt-8 pb-20 md:pt-12 md:pb-28 scroll-mt-24"
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <ActionCardsSection />
        </div>
      </section>

      <section id="volunteer" className="scroll-mt-24" aria-hidden="true" />

      {/* ── DONATE CALLOUT ── */}
      <section
        id="donate"
        className="bg-black px-9 pb-20 md:pb-28 scroll-mt-24"
        aria-label="Donate section"
      >
        <div className="mx-auto w-full max-w-[1288px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">

            {/* Left — text + stats + CTA */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-3 [font-family:'DM_Sans',Helvetica] text-sm font-semibold uppercase tracking-[0.15em] text-[#21bcee]">
                  Make a Local Impact
                </p>
                <h2 className="[font-family:'Inter',Helvetica] text-[52px] font-bold leading-[1.05] tracking-tight text-white sm:text-[68px] lg:text-[80px]">
                  Every peso<br />saves a reef.
                </h2>
              </div>

              <p className="[font-family:'Poppins',Helvetica] text-[16px] font-normal leading-relaxed text-white/70 max-w-md">
                Your contribution funds Zamboanga City cleanup crews, coral fragment cultivation in our Santa Cruz Island nurseries, and reef monitoring expeditions that protect our local marine ecosystems — in partnership with BFAR Zamboanga and coastal communities.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                {[
                  { value: "15+", label: "Reef sites restored" },
                  { value: "₱1.2M+", label: "Funds raised" },
                  { value: "320+", label: "Local volunteers" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="[font-family:'DM_Sans',Helvetica] text-[32px] font-bold leading-none text-white sm:text-[38px]">
                      {stat.value}
                    </span>
                    <span className="[font-family:'Poppins',Helvetica] text-[13px] text-white/50">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                data-testid="button-donate-callout"
                onClick={() => setLocation("/donate")}
                className="self-start rounded-[5px] bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-8 py-3 [font-family:'DM_Sans',Helvetica] text-[18px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0px_8px_30px_-4px_rgba(17,107,248,0.5)] active:scale-[0.98]"
              >
                Donate Now →
              </button>
            </div>

            {/* Right — underwater reef video */}
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-auto lg:h-[560px]">
              <video
                src={assetUrl("/zamboanga_underwater_reef.mp4")}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              {/* Subtle inner border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>

          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};
