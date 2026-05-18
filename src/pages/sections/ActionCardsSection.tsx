import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assetUrl } from "@/lib/utils";

const beachCleanupImg = assetUrl("/assets/beach-cleanup.jpg");
const coralReplantingImg = assetUrl("/assets/coral-replanting.jpg");
const marineSurveyImg = assetUrl("/assets/marine-survey.webp");
const outreachImg = assetUrl("/assets/outreach.jpg");
const replantingImg = assetUrl("/assets/replanting.jpg");
const othersImg = assetUrl("/assets/others.jpg");

const actionCards = [
  {
    image: beachCleanupImg,
    title: "Ocean Clean Up",
    description:
      "Plastic and debris choke Zamboanga City's reefs every day. Fund our volunteer dive and shoreline cleanup events along Cawa-Cawa Boulevard, Rio Hondo, and Santa Cruz Island — removing waste before it destroys the marine habitats our communities depend on.",
    tab: "cleanup",
  },
  {
    image: coralReplantingImg,
    title: "Coral Replanting",
    description:
      "Our coral micro-project program cultivates resilient fragments in underwater nurseries in the Basilan Strait, then transplants them onto degraded reef sections. Every fragment you sponsor takes root and becomes a living part of Zamboanga's ocean heritage.",
    tab: "replanting",
  },
  {
    image: marineSurveyImg,
    title: "Marine Survey",
    description:
      "Data drives conservation. Volunteer as a citizen scientist alongside BFAR Zamboanga researchers to monitor reef health, track biodiversity, and document coral bleaching in Sibugay Bay — your observations directly inform local restoration strategy.",
    tab: "survey",
  },
  {
    image: outreachImg,
    title: "Outreach Program",
    description:
      "Raise awareness in Zamboanga City's coastal barangays and schools about the marine biodiversity of the Sulu Sea. Lead AdZU-organized workshops, distribute educational materials, and inspire the next generation of Zamboangueño ocean stewards.",
    tab: "outreach",
  },
  {
    image: othersImg,
    title: "Others",
    description:
      "From mangrove planting micro-projects and water filtration drives to equipment maintenance and community fundraising — there are many ways to support marine conservation in Zamboanga City. Explore all roles that keep our efforts running strong.",
    tab: "other",
  },
];

const INTERVAL_MS = 3500;

const arrowClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:border-[#21bcee]/70 hover:bg-[#21bcee]/20 hover:text-[#21bcee] hover:scale-110 focus:outline-none";

export const ActionCardsSection = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % actionCards.length);
    }, INTERVAL_MS);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const prev = () => {
    setActive((a) => (a - 1 + actionCards.length) % actionCards.length);
    startTimer();
  };

  const next = () => {
    setActive((a) => (a + 1) % actionCards.length);
    startTimer();
  };

  return (
    <section className="relative w-full px-9 py-0">
      <div className="mx-auto flex w-full max-w-[1288px] flex-col gap-[43px]">
        <header className="flex items-end justify-between">
          <h2 className="[font-family:'Inter',Helvetica] text-white text-[64px] font-bold leading-none tracking-[0] sm:text-[84px] lg:text-[117.2px]">
            Take Action
          </h2>

          {/* Nav arrows — right-aligned with the heading baseline */}
          <div className="mb-3 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              data-testid="button-carousel-prev"
              aria-label="Previous slide"
              className={arrowClass}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={next}
              data-testid="button-carousel-next"
              aria-label="Next slide"
              className={arrowClass}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Carousel viewport */}
        <div className="overflow-hidden rounded-[13px]">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {actionCards.map((card, idx) => (
              <div key={card.tab} className="w-full flex-shrink-0" aria-hidden={idx !== active}>
                <div
                  role="button"
                  tabIndex={idx === active ? 0 : -1}
                  onClick={() => setLocation(`/volunteer?tab=${card.tab}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLocation(`/volunteer?tab=${card.tab}`);
                    }
                  }}
                  data-testid={`card-action-${card.tab}`}
                  className="group relative h-[528px] cursor-pointer overflow-hidden rounded-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[340px] rounded-b-[13px] bg-[linear-gradient(180deg,rgba(33,188,238,0)_0%,rgba(5,38,152,1)_100%)]" />
                  <article className="absolute bottom-0 left-0 right-0 z-10 flex w-full flex-col items-start gap-2 px-6 pb-7 sm:px-8 sm:pb-8">
                    <h3 className="self-stretch [font-family:'DM_Sans',Helvetica] text-white text-[52px] font-bold leading-[1] tracking-[0] sm:text-[58px]">
                      {card.title}
                    </h3>
                    <p className="self-stretch [font-family:'Poppins',Helvetica] text-white text-[15px] font-normal leading-snug tracking-[0] sm:text-[17px]">
                      {card.description}
                    </p>
                  </article>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
