import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Loader2, CreditCard, QrCode, CheckCircle2, ChevronLeft,
  Star, MapPin, Award, Camera, Leaf, Globe, Users, TrendingUp,
  ShieldCheck, Clock, ChevronDown, ChevronUp, Plus, Minus,
  MessageCircle, HelpCircle,
} from "lucide-react";
import { AdoptionCertificate } from "@/components/AdoptionCertificate";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Adoption, Coral } from "@shared/schema";
import { FooterSection } from "./sections/FooterSection";

import { assetUrl } from "@/lib/utils";

const PLACEHOLDER_IMAGE = assetUrl("/figmaAssets/adopt/coral-1.png");
const CORALS_KEY = ["/api/corals"] as const;

const PAYMENT_METHODS = [
  { id: "gcash",  label: "GCash",       color: "#0078FF", type: "qr"   },
  { id: "maya",   label: "Maya",        color: "#22C55E", type: "qr"   },
  { id: "debit",  label: "Debit Card",  color: "#7c3aed", type: "card" },
  { id: "credit", label: "Credit Card", color: "#f59e0b", type: "card" },
] as const;
type PaymentId = (typeof PAYMENT_METHODS)[number]["id"];

const cardSchema = z.object({
  holderName: z.string().trim().min(2, "Cardholder name is required"),
  cardNumber: z.string().transform((v) => v.replace(/\s/g, "")).pipe(z.string().regex(/^\d{16}$/, "Enter a valid 16-digit card number")),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
  zipCode: z.string().trim().min(4, "Zip code is required"),
  address: z.string().trim().min(3, "Address is required"),
  country: z.string().trim().min(2, "Country is required"),
});
type CardFormValues = z.infer<typeof cardSchema>;

const inputClass = "h-[42px] w-full rounded-[5px] border-2 border-[#052698] bg-white px-4 font-bold text-black shadow-[0px_4px_16px_-2px_rgba(0,0,0,0.2)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm";

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function buildQrUrl(method: string, amount: number, coral: string) {
  const data = `${method === "gcash" ? "GCash" : "Maya"} Payment\nCoral: ${coral}\nAmount: ₱${amount.toLocaleString()}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(data)}`;
}

const STATS = [
  { value: "1,200+", label: "Corals Planted",    icon: Leaf       },
  { value: "15",     label: "Reef Sites in ZC",  icon: MapPin     },
  { value: "15",     label: "Partner Barangays", icon: Users      },
  { value: "91%",    label: "Survival Rate",     icon: TrendingUp },
];

const WHATS_INCLUDED = [
  { icon: Award,      title: "Digital Adoption Certificate", description: "A beautiful certificate with your name, coral species, and unique ID — ready to download and share." },
  { icon: MapPin,     title: "GPS Reef Coordinates",         description: "Know exactly where your coral lives in Zamboanga City's reefs. Each adoption is tagged with precise GPS data via live reef mapping tools." },
  { icon: Camera,     title: "Photo Updates",                description: "Receive before-and-after photos of your coral fragment as our AdZU volunteer team documents its growth in the Basilan Strait and Santa Cruz Island sites." },
  { icon: ShieldCheck,title: "1-Year Monitoring",            description: "Our marine science volunteers, in partnership with BFAR Zamboanga, monitor and care for your coral fragment for a full year after planting." },
  { icon: Users,      title: "Zamboanga Adopter Community",  description: "Join a local network of ocean champions from Zamboanga City. Stay informed about reef restoration milestones and community impact reports." },
  { icon: Globe,      title: "SDG 14 Impact",                description: "Every adoption directly advances UN Sustainable Development Goal 14: Life Below Water — protecting Zamboanga's marine biodiversity and coastal livelihoods." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Choose Your Coral",    description: "Browse our catalog of real coral species found in Zamboanga City's reefs — each one hand-selected by our AdZU restoration team for local planting." },
  { step: "02", title: "Complete Adoption",    description: "Pick your quantity and complete your adoption securely. Every peso goes directly to coral propagation, planting, and monitoring in Zamboanga City." },
  { step: "03", title: "We Plant & Tag It",    description: "Our volunteer divers plant your coral fragment at a reef site in the Basilan Strait or near Great Santa Cruz Island and attach a GPS tag for tracking." },
  { step: "04", title: "Track Its Growth",     description: "Receive your digital certificate, reef coordinates, and photo updates as your coral grows — with transparent reporting via our live reef maps." },
];

const REVIEWS = [
  { name: "Rosario Dela Cruz",  location: "Zamboanga City",          rating: 5, date: "March 2025",    avatar: "RD", review: "I adopted a Staghorn Coral for my daughter's birthday and she was so touched. Seeing the GPS coordinates of her coral near Santa Cruz Island made it feel incredibly real and meaningful. Proud to support our own city's reefs!" },
  { name: "Engr. Jun Mahusay",  location: "Barangay Canelar, ZC",    rating: 5, date: "January 2025",  avatar: "JM", review: "The photo updates of our Brain Coral growing in the Basilan Strait are wonderful. As someone who grew up fishing in these waters, watching the reef come back to life month by month is genuinely emotional." },
  { name: "AdZU Biology Club",  location: "Ateneo de Zamboanga Univ", rating: 5, date: "February 2025", avatar: "AB", review: "Our club adopted three Elkhorn Corals as part of our marine conservation thesis. The AdZU team made the process seamless, and the impact report aligned perfectly with our SDG 14 research goals." },
  { name: "Fatima Albarico",    location: "Rio Hondo, Zamboanga City", rating: 5, date: "April 2025",    avatar: "FA", review: "As a fisherwoman from Rio Hondo, I never thought I could be part of reef restoration. This platform made it easy and affordable. I can track exactly where my coral is growing — just offshore from where I fish." },
];

const FAQS = [
  { question: "What exactly does 'adopting' a coral mean?",    answer: "When you adopt a coral, you're funding the propagation, planting, and monitoring of a real coral fragment at one of our Zamboanga City restoration sites. AdZU volunteer divers grow fragments from local parent colonies in our nurseries, then plant them on degraded sections of Zamboanga's reefs. Your adoption directly funds this entire process with full transparency." },
  { question: "Where are the coral reef sites located?",       answer: "All our restoration sites are in Zamboanga City and its surrounding waters — including Great Santa Cruz Island, the Basilan Strait, and Sibugay Bay. When you adopt, your digital certificate will show the specific GPS coordinates of your coral within these local reef systems." },
  { question: "How long does a coral fragment take to grow?",  answer: "Growth rates vary by species. Staghorn and Elkhorn corals are fast growers and can reach several centimeters in their first year in Zamboanga's warm Sulu Sea waters. Brain corals are slow but extremely resilient. Our BFAR-partnered team monitors each fragment and documents progress throughout the year." },
  { question: "Can I adopt a coral as a gift?",                answer: "Absolutely! Coral adoptions make a unique and locally meaningful gift. During checkout you can enter the recipient's name on the digital certificate. Many Zamboangueños give coral adoptions for birthdays, anniversaries, and school milestones — supporting our city's reefs in a personal way." },
  { question: "What happens if my coral doesn't survive?",     answer: "Coral restoration carries natural risks, and we maintain full transparency about survival rates. If your coral fragment doesn't survive its first year, we will replant a new fragment at one of our Zamboanga City sites at no extra cost and notify you when it's back in the water." },
  { question: "Who built this platform?",                      answer: "This platform was designed and developed by programming students and organizers from Ateneo de Zamboanga University (AdZU) who deeply care about the ocean. It operates as a GoFundMe-inspired crowdfunding tool dedicated entirely to marine conservation in Zamboanga City, advancing UN SDG 14: Life Below Water." },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-[#21bcee] text-[#21bcee]" : "text-white/20"}`} />
      ))}
    </div>
  );
}

export const AdoptPage = (): JSX.Element => {
  const [amount, setAmount] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [dialogStep, setDialogStep] = useState<"closed" | "method" | "qr" | "card">("closed");
  const [selectedMethod, setSelectedMethod] = useState<PaymentId | null>(null);
  const [certificateAdoption, setCertificateAdoption] = useState<Adoption | null>(null);

  // refs for scrolling
  const heroRef        = useRef<HTMLElement>(null);
  const statsRef       = useRef<HTMLElement>(null);
  const missionRef     = useRef<HTMLElement>(null);
  const includedRef    = useRef<HTMLElement>(null);
  const howItWorksRef  = useRef<HTMLElement>(null);
  const reviewsRef     = useRef<HTMLElement>(null);
  const faqRef         = useRef<HTMLElement>(null);

  // sticky nav arrow state
  const [atBottom, setAtBottom] = useState(false);

  const coralsQuery = useQuery<Coral[]>({ queryKey: CORALS_KEY });
  const corals = useMemo(() => coralsQuery.data ?? [], [coralsQuery.data]);

  useEffect(() => {
    if (corals.length === 0) { setActiveId(null); return; }
    if (!activeId || !corals.find((c) => c.id === activeId)) setActiveId(corals[0].id);
  }, [corals, activeId]);

  useEffect(() => {
    const onScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      setAtBottom(scrolledToBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStickyArrow = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const sections = [statsRef, missionRef, includedRef, howItWorksRef, reviewsRef, faqRef];
    const midPoint = window.scrollY + window.innerHeight * 0.45;
    for (const ref of sections) {
      if (ref.current && ref.current.offsetTop > midPoint) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };


  const activeCoral = corals.find((c) => c.id === activeId) ?? null;
  const stockLeft   = activeCoral?.stock ?? 0;
  const isSoldOut   = !!activeCoral && stockLeft <= 0;
  const totalCost   = activeCoral ? amount * activeCoral.price : 0;

  const incAmount = () => setAmount((a) => Math.min(stockLeft || 999, a + 1));
  const decAmount = () => setAmount((a) => Math.max(1, a - 1));

  const handleCardClick = (coralId: string) => {
    setActiveId(coralId);
    setAmount(1);
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cardForm = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { holderName: "", cardNumber: "", cvc: "", zipCode: "", address: "", country: "" },
  });

  const adoptMutation = useMutation({
    mutationFn: async () => {
      if (!activeCoral) throw new Error("Pick a coral first");
      if (amount <= 0) throw new Error("Please enter a valid amount");
      if (amount > stockLeft) throw new Error(`Only ${stockLeft} left in stock`);
      const res = await apiRequest("POST", "/api/adoptions", { coralId: activeCoral.id, amount });
      return (await res.json()) as Adoption;
    },
    onSuccess: (adoption) => {
      queryClient.invalidateQueries({ queryKey: ["/api/adoptions"] });
      queryClient.invalidateQueries({ queryKey: CORALS_KEY });
      queryClient.invalidateQueries({ queryKey: ["/api/expense-breakdown"] });
      setDialogStep("closed");
      setSelectedMethod(null);
      cardForm.reset();
      setAmount(1);
      setCertificateAdoption(adoption);
    },
    onError: (err: Error) => {
      const msg = err.message.replace(/^\d+:\s*/, "");
      let description = msg;
      try { const p = JSON.parse(msg); if (p?.message) description = p.message; } catch { /* */ }
      toast({ title: "Couldn't complete adoption", description, variant: "destructive" });
      setDialogStep("closed");
    },
  });

  const handleAdoptClick = () => {
    if (!isAuthenticated) {
      toast({ title: "Please sign in to adopt", description: "Create a free account to track your reef." });
      setLocation("/auth");
      return;
    }
    if (!activeCoral || isSoldOut) return;
    if (amount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid number of corals.", variant: "destructive" });
      return;
    }
    if (amount > stockLeft) {
      toast({ title: "Not enough stock", description: `Only ${stockLeft} left in stock.`, variant: "destructive" });
      return;
    }
    setDialogStep("method");
  };

  const handleMethodConfirm = () => {
    if (!selectedMethod) return;
    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod)!;
    setDialogStep(method.type === "qr" ? "qr" : "card");
  };

  const closeAll = () => { setDialogStep("closed"); setSelectedMethod(null); cardForm.reset(); };

  return (
    <main className="relative w-full overflow-x-hidden bg-black">
      <AdoptionCertificate
        adoption={certificateAdoption}
        username={user?.username ?? ""}
        onClose={() => { setCertificateAdoption(null); setLocation("/account"); }}
      />
      <NavigationBarSection />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative flex h-screen items-center justify-center bg-black px-4 pt-[120px] sm:px-6 lg:px-12"
        aria-label="Adopt a coral"
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-12">

          {/* ── Featured image ── */}
          <div className="w-full max-w-[520px] flex-shrink-0 aspect-[3/4] overflow-hidden rounded-[4.185px]">
            {activeCoral ? (
              <img
                key={activeCoral.id}
                src={assetUrl(activeCoral.image)}
                alt={activeCoral.name}
                className="h-full w-full object-cover animate-in fade-in duration-500"
                data-testid="img-coral-featured"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
                No coral selected
              </div>
            )}
          </div>

          {/* ── Info + adopt panel ── */}
          <div className="flex w-full max-w-[490px] flex-col gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#21bcee]/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#21bcee]">
                Real Reef Restoration
              </span>
            </div>
            <h1 className="[font-family:'Inter',Helvetica] text-[36px] font-bold leading-tight text-white sm:text-[44px] lg:text-[52px]" data-testid="text-adopt-title">
              Adopt a Coral
            </h1>
            <p className="[font-family:'DM_Sans',Helvetica] text-[20px] font-medium text-white sm:text-[24px] lg:text-[28px]" data-testid="text-coral-name">
              {activeCoral?.name ?? "—"}
            </p>
            <p className="[font-family:'Poppins',Helvetica] text-[14px] font-normal leading-relaxed text-white/70 sm:text-[15px] lg:text-[16px]">
              {activeCoral?.description || "Pick a coral to learn more and confirm your adoption."}
            </p>

            {activeCoral && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Price per coral</p>
                  <p className="text-xl font-bold text-white" data-testid="text-coral-price">₱{activeCoral.price}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Available</p>
                  <p className={`text-xl font-bold ${isSoldOut ? "text-red-300" : "text-white"}`} data-testid="text-coral-stock">
                    {isSoldOut ? "Sold out" : `${stockLeft} left`}
                  </p>
                </div>
              </div>
            )}

            {/* ── Amount stepper ── */}
            <div className="flex items-center gap-2" data-testid="amount-stepper">
              <button
                type="button"
                onClick={decAmount}
                disabled={amount <= 1 || !activeCoral || isSoldOut}
                data-testid="button-amount-dec"
                className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-[5px] border-2 border-[#052698] bg-white text-[#052698] shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition hover:bg-[#052698] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex flex-1 items-center justify-center rounded-[5px] border-2 border-[#052698] bg-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)]" style={{ height: 44 }}>
                <span className="[font-family:'DM_Sans',Helvetica] text-[18px] font-bold text-black" data-testid="text-amount-value">
                  {amount}
                </span>
              </div>
              <button
                type="button"
                onClick={incAmount}
                disabled={amount >= stockLeft || !activeCoral || isSoldOut}
                data-testid="button-amount-inc"
                className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-[5px] border-2 border-[#052698] bg-white text-[#052698] shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition hover:bg-[#052698] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {activeCoral && totalCost > 0 && (
              <div
                className="flex items-center justify-between rounded-lg border border-[#21bcee]/40 bg-[#21bcee]/10 px-4 py-3"
                data-testid="text-total-cost"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#21bcee]">Total</span>
                <span className="text-2xl font-extrabold text-white">₱{totalCost.toLocaleString()}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAdoptClick}
              disabled={!activeCoral || isSoldOut}
              data-testid="button-adopt-coral"
              className="h-[46px] w-full max-w-[240px] rounded-[5px] bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[22px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0px_8px_30px_-4px_rgba(17,107,248,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] sm:text-[24px]"
            >
              Adopt a Coral
            </Button>

            {/* ── "Why it matters" link ── */}
            <button
              type="button"
              onClick={() => scrollTo(missionRef)}
              data-testid="button-mission-link"
              className="flex w-fit items-center gap-1.5 text-sm text-white/45 transition hover:text-white/80"
            >
              <Globe className="h-4 w-4" />
              <span>Why it matters?</span>
            </button>

            {/* ── "How does this work?" link ── */}
            <button
              type="button"
              onClick={() => scrollTo(faqRef)}
              data-testid="button-how-link"
              className="flex w-fit items-center gap-1.5 text-sm text-white/45 transition hover:text-white/80"
            >
              <HelpCircle className="h-4 w-4" />
              <span>How does this work?</span>
            </button>

          </div>
        </div>

      </section>

      {/* ── CORAL SELECTION CARDS ── */}
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#21bcee]">Our Collection</p>
            <h2 className="text-[28px] font-bold text-white sm:text-[36px]">Choose Your Coral</h2>
            <p className="mt-3 text-sm text-white/50">Click any coral to select it and begin your adoption</p>
          </div>
          {coralsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#21bcee]" />
            </div>
          ) : corals.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
              <p className="text-white/50">No corals available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {corals.map((coral) => {
                const isSelected = activeId === coral.id;
                const soldOut = coral.stock <= 0;
                return (
                  <button
                    key={coral.id}
                    type="button"
                    onClick={() => handleCardClick(coral.id)}
                    data-testid={`card-coral-${coral.id}`}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none ${
                      isSelected
                        ? "border-[#21bcee] shadow-[0_0_24px_rgba(33,188,238,0.35)]"
                        : "border-white/10 hover:border-[#21bcee]/50 hover:shadow-[0_0_16px_rgba(33,188,238,0.15)]"
                    } ${soldOut ? "opacity-60" : ""}`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={assetUrl(coral.image)}
                        alt={coral.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#21bcee]/10 pointer-events-none" />
                      )}
                      {soldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <span className="rounded-full bg-red-500/80 px-3 py-1 text-xs font-bold text-white">Sold Out</span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#21bcee]">
                          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1 bg-white/[0.04] p-3">
                      <p className="line-clamp-1 text-sm font-semibold text-white">{coral.name}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-bold text-[#21bcee]">₱{coral.price}</span>
                        <span className={`text-xs font-medium ${soldOut ? "text-red-400" : "text-white/50"}`}>
                          {soldOut ? "Sold out" : `${coral.stock} left`}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section ref={statsRef} id="stats" className="border-y border-white/10 bg-white/[0.03] py-12 px-4 sm:px-6 lg:px-12 scroll-mt-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21bcee]/10">
                  <Icon className="h-5 w-5 text-[#21bcee]" />
                </div>
                <p className="text-[28px] font-bold leading-none text-white sm:text-[36px]">{value}</p>
                <p className="text-sm text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLURB / MISSION ── */}
      <section ref={missionRef} className="bg-black px-4 py-20 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#21bcee]">Why It Matters</p>
              <h2 className="mb-5 text-[32px] font-bold leading-tight text-white sm:text-[40px]">
                Coral reefs are disappearing.<br />You can help bring them back.
              </h2>
              <p className="mb-4 text-base leading-relaxed text-white/60">
                Coral reefs cover less than 1% of the ocean floor — yet they support over 25% of all marine life. Climate change, ocean acidification, and human activity have wiped out more than 50% of the world's coral reefs in the last 30 years.
              </p>
              <p className="text-base leading-relaxed text-white/60">
                Our reef restoration program grows coral fragments in underwater nurseries, plants them on degraded reefs, and monitors their growth for a full year. Every adoption directly funds this science-backed process and gets you a named stake in the reef's recovery.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { val: "50%",  desc: "of the world's coral reefs lost since 1950" },
                { val: "1B+",  desc: "people depend on coral reefs for food and income" },
                { val: "$375B",desc: "annual economic value of global coral reef ecosystems" },
                { val: "2050", desc: "projected year most reefs functionally disappear without action" },
              ].map(({ val, desc }) => (
                <div key={val} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[32px] font-bold text-[#21bcee]">{val}</p>
                  <p className="mt-1 text-sm text-white/60">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── FAQ ── */}
      <section ref={faqRef} id="faq" className="border-t border-white/10 bg-white/[0.02] px-4 py-20 sm:px-6 lg:px-12 scroll-mt-20">
        <div className="mx-auto max-w-[860px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#21bcee]">FAQ</p>
            <h2 className="text-[32px] font-bold text-white sm:text-[40px]">Common questions</h2>
          </div>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {FAQS.map(({ question, answer }, idx) => (
              <AccordionItem
                key={question}
                value={`faq-${idx}`}
                className="rounded-xl border border-white/10 bg-white/5 px-6 data-[state=open]:border-[#21bcee]/30 data-[state=open]:bg-white/[0.07] transition-all duration-200"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-white hover:no-underline hover:text-[#21bcee] [&[data-state=open]]:text-[#21bcee] [&>svg]:text-white/40">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-white/60">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── PAYMENT DIALOGS ── */}

      <Dialog open={dialogStep === "method"} onOpenChange={(o) => { if (!o) closeAll(); }}>
        <DialogContent className="max-w-md border-white/10 bg-[#0a0a1a] text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <CreditCard className="h-5 w-5 text-[#21bcee]" />
              Choose Payment Method
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Select how you'd like to pay for your coral adoption
              {activeCoral && totalCost > 0 && (
                <span className="block mt-1 font-semibold text-white">
                  Total: <span className="text-[#21bcee]">₱{totalCost.toLocaleString()}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                data-testid={`button-method-${m.id}`}
                onClick={() => setSelectedMethod(m.id)}
                className={`relative flex h-[72px] flex-col items-center justify-center gap-1 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                  selectedMethod === m.id
                    ? "border-transparent text-white scale-[1.03] shadow-lg"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                }`}
                style={selectedMethod === m.id ? { backgroundColor: m.color, borderColor: m.color } : {}}
              >
                {m.type === "qr" ? <QrCode className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                {m.label}
              </button>
            ))}
          </div>
          {selectedMethod && (
            <p className="text-center text-xs text-white/40 -mt-1">
              {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.type === "qr"
                ? "A QR code will be shown for you to scan and pay."
                : "You'll fill in your card details on the next screen."}
            </p>
          )}
          <Button
            type="button"
            disabled={!selectedMethod}
            onClick={handleMethodConfirm}
            data-testid="button-method-confirm"
            className="w-full bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] font-bold text-white hover:opacity-90 disabled:opacity-40"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogStep === "qr"} onOpenChange={(o) => { if (!o) closeAll(); }}>
        <DialogContent className="max-w-sm border-white/10 bg-[#0a0a1a] text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <QrCode className="h-5 w-5 text-[#21bcee]" />
              Scan to Pay via {selectedMethod === "gcash" ? "GCash" : "Maya"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Open your {selectedMethod === "gcash" ? "GCash" : "Maya"} app and scan the QR code below
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              {activeCoral && selectedMethod && (
                <img src={buildQrUrl(selectedMethod, totalCost, activeCoral.name)} alt="Payment QR Code" width={200} height={200} className="block" data-testid="img-qr-code" />
              )}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">${totalCost.toLocaleString()}</p>
              <p className="mt-1 text-sm text-white/60">{amount}× {activeCoral?.name}</p>
            </div>
            <p className="text-center text-xs text-white/40 px-4">After completing payment in your app, press the button below to confirm your adoption.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setDialogStep("method")} data-testid="button-qr-back" className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10">
              <ChevronLeft className="mr-1 h-4 w-4" />Back
            </Button>
            <Button type="button" onClick={() => adoptMutation.mutate()} disabled={adoptMutation.isPending} data-testid="button-qr-done" className="flex-2 flex-grow bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] font-bold text-white hover:opacity-90">
              {adoptMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing…</> : <><CheckCircle2 className="mr-2 h-4 w-4" />Payment Done</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogStep === "card"} onOpenChange={(o) => { if (!o) closeAll(); }}>
        <DialogContent className="max-w-md border-white/10 bg-[#0a0a1a] text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <CreditCard className="h-5 w-5 text-[#21bcee]" />
              Card Details
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedMethod === "debit" ? "Debit" : "Credit"} card · Total:{" "}
              <span className="font-semibold text-white">${totalCost.toLocaleString()}</span>
            </DialogDescription>
          </DialogHeader>
          <Form {...cardForm}>
            <form onSubmit={cardForm.handleSubmit(() => adoptMutation.mutate())} className="flex flex-col gap-3" data-testid="form-card-payment">
              <FormField control={cardForm.control} name="holderName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs uppercase tracking-wide">Cardholder Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Juan dela Cruz" data-testid="input-card-holder" className={inputClass} /></FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />
              <FormField control={cardForm.control} name="cardNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs uppercase tracking-wide">Card Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0000 0000 0000 0000" data-testid="input-card-number" maxLength={19} onChange={(e) => field.onChange(formatCardNumber(e.target.value))} className={inputClass + " tracking-widest"} />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={cardForm.control} name="cvc" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wide">CVC</FormLabel>
                    <FormControl><Input {...field} placeholder="•••" maxLength={4} data-testid="input-card-cvc" className={inputClass + " tracking-widest"} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
                <FormField control={cardForm.control} name="zipCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wide">Zip Code</FormLabel>
                    <FormControl><Input {...field} placeholder="12345" data-testid="input-card-zip" className={inputClass} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
              </div>
              <FormField control={cardForm.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs uppercase tracking-wide">Address</FormLabel>
                  <FormControl><Input {...field} placeholder="123 Ocean Street" data-testid="input-card-address" className={inputClass} /></FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />
              <FormField control={cardForm.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs uppercase tracking-wide">Country</FormLabel>
                  <FormControl><Input {...field} placeholder="Philippines" data-testid="input-card-country" className={inputClass} /></FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />
              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" onClick={() => setDialogStep("method")} data-testid="button-card-back" className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10">
                  <ChevronLeft className="mr-1 h-4 w-4" />Back
                </Button>
                <Button type="submit" disabled={adoptMutation.isPending} data-testid="button-card-submit" className="flex-grow bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] font-bold text-white hover:opacity-90 disabled:opacity-60">
                  {adoptMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing…</> : <><CheckCircle2 className="mr-2 h-4 w-4" />Confirm Payment</>}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── FOOTER ── */}
      <FooterSection />
      {/* ── Sticky section nav arrow ── */}
      <button
        type="button"
        onClick={handleStickyArrow}
        data-testid="button-sticky-nav"
        aria-label={atBottom ? "Scroll to top" : "Scroll to next section"}
        className="group fixed bottom-8 left-1/2 z-50 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:border-[#21bcee]/70 hover:bg-[#21bcee]/20 hover:text-[#21bcee] hover:scale-110 focus:outline-none"
      >
        {atBottom ? (
          <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={2.5} />
        )}
      </button>
    </main>
  );
};
