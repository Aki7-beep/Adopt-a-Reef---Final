import { NavigationBarSection } from "./sections/NavigationBarSection";
import { FooterSection } from "./sections/FooterSection";
import { Waves, Eye, Heart, Users, MapPin, Fish, Leaf, Anchor } from "lucide-react";

const initiatives = [
  {
    icon: Fish,
    title: "Coral Fragment Nurseries",
    description:
      "We operate underwater nurseries in the waters of Zamboanga City, cultivating coral fragments from locally sourced parent colonies in Santa Cruz Island and the Basilan Strait.",
  },
  {
    icon: Waves,
    title: "Shoreline & Reef Clean-Ups",
    description:
      "Monthly clean-up drives along Zamboanga City's coastline — from Rio Hondo to Cawa-Cawa Boulevard — remove plastic waste and debris that threaten reef ecosystems.",
  },
  {
    icon: Users,
    title: "Community Diver Training",
    description:
      "We partner with local Badjao and Zamboangueño fishing communities to train volunteer divers in reef monitoring and responsible fishing practices.",
  },
  {
    icon: Leaf,
    title: "School Outreach Program",
    description:
      "Educational visits to public schools in Zamboanga City teach students about coral biodiversity, the importance of Sulu Sea reefs, and how they can help protect them.",
  },
  {
    icon: Anchor,
    title: "Fishermen Partnership",
    description:
      "We work alongside registered fisherfolk in Zamboanga City's coastal barangays, providing reef-safe fishing gear and livelihood alternatives that reduce reef damage.",
  },
  {
    icon: MapPin,
    title: "Reef Monitoring Stations",
    description:
      "Permanent underwater monitoring stations near Great Santa Cruz Island track coral cover, fish population health, and water quality in real time.",
  },
];

const stats = [
  { value: "1,200+", label: "Coral Fragments Grown" },
  { value: "48", label: "Clean-Up Events Held" },
  { value: "320+", label: "Local Volunteers" },
  { value: "15", label: "Partner Barangays" },
];

export const AboutPage = (): JSX.Element => {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-black">
      <NavigationBarSection />

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-24 sm:px-6 sm:pt-28" aria-label="About hero">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#052698] via-[#116bf8] to-[#21bcee]">
              <Waves className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1
            className="[font-family:'Inter',Helvetica] text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            data-testid="text-about-title"
          >
            About Us
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            We are a Zamboanga City–based marine conservation organization dedicated to protecting
            and restoring the coral reefs of the Sulu Sea — one fragment at a time.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 bg-white/5 py-8" aria-label="Impact numbers">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <p className="[font-family:'Inter',Helvetica] text-3xl font-bold text-[#21bcee] sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-16 sm:px-6" aria-label="Mission and Vision">
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Mission */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#052698] to-[#21bcee]">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h2 className="[font-family:'Inter',Helvetica] text-2xl font-bold text-white" data-testid="text-mission-title">
                Our Mission
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/60">
                To restore, protect, and sustain the coral reef ecosystems surrounding Zamboanga
                City by engaging local communities, empowering fisherfolk, and nurturing the next
                generation of ocean stewards in Mindanao.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#052698] to-[#21bcee]">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h2 className="[font-family:'Inter',Helvetica] text-2xl font-bold text-white" data-testid="text-vision-title">
                Our Vision
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/60">
                A Zamboanga City where thriving coral reefs support abundant marine life, sustain
                the livelihoods of coastal communities, and stand as a living legacy of local
                conservation action for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 pb-16 sm:px-6" aria-label="Our story">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-[#21bcee]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[#21bcee]">
                Zamboanga City, Philippines
              </span>
            </div>
            <h2 className="[font-family:'Inter',Helvetica] text-2xl font-bold text-white sm:text-3xl" data-testid="text-story-title">
              Rooted in Our City, Dedicated to Our Sea
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-white/60">
              <p>
                Founded by a group of students of Ateneo de Zamboanga University, and concerned residents of Zamboanga City, Adopt a Reef began
                with a single coral nursery near Great Santa Cruz Island in 2026.
              </p>
              <p>
                The reefs surrounding Zamboanga City — spanning the Basilan Strait, the Sulu
                Archipelago approaches, and the waters of Sibugay Bay — are among the most
                biodiverse in Southeast Asia. They also face severe pressure from dynamite fishing,
                sedimentation, and rising sea temperatures.
              </p>
              <p>
                Today, we work across 15 coastal barangays, partnering with the City Environment
                and Natural Resources Office (CENRO), local fishing cooperatives, and schools to
                make reef conservation a community-wide commitment — not just a government mandate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Initiatives */}
      <section className="px-4 pb-20 sm:px-6" aria-label="Local initiatives">
        <div className="mx-auto w-full max-w-4xl">
          <h2
            className="mb-8 [font-family:'Inter',Helvetica] text-2xl font-bold text-white sm:text-3xl"
            data-testid="text-initiatives-title"
          >
            Our Zamboanga City Initiatives
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/8"
                  data-testid={`card-initiative-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#052698] to-[#21bcee]">
                    <Icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <h3 className="[font-family:'Inter',Helvetica] text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default AboutPage;
