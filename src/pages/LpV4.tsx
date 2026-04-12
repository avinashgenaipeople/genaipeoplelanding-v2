import { useEffect, useState, useRef } from "react";
import { PageMeta } from "@/components/PageMeta";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import { Footer } from "@/components/sections/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";

/* ── V4 Secrets (Hormozi-optimized) ──────────────────────────────── */
const secrets = [
  {
    title: "The Market",
    subtitle: "Companies are hiring senior devs for AI roles — at 30–70L.",
    text: "Hiring managers don't want juniors who learned AI from a bootcamp. They want engineers who've shipped production systems and can now build with AI. That's you. And the market is paying 30–70L for exactly this profile.",
  },
  {
    title: "Your Edge",
    subtitle: "Your 8+ years of Java? That's the part AI can't replace.",
    text: "System design. Production debugging. Enterprise architecture. These are the exact skills AI companies are hiring for — and they can't train a junior to have them. Your decade of experience is the moat. AI just makes it 10x more valuable.",
  },
  {
    title: "The Shift",
    subtitle: "Speed is the new seniority — and companies are paying a premium for it.",
    text: "Engineers using AI-augmented workflows ship in 3 days what used to take 3 weeks. Companies are restructuring comp bands around this speed. The ones who can do it are getting 30–70L offers. The window is open now.",
  },
];

/* ── V4 Testimonials (curated + reordered) ───────────────────────── */
const v4Testimonials = [
  {
    quote:
      "In my current company, an AI team was formed, and someone from management noticed my LinkedIn posts and contacted me. I was invited to join the AI team, got a good salary hike, and moved to work in AI — all thanks to the steps I took through this course. They show us the path, and I walked it.",
    name: "Punyakeerthi BL",
    role: "Senior Software Engineer",
  },
  {
    quote:
      "The GenAI Mentorship Program transformed my career — helping me move to a Senior Associate role at Standard Chartered. The hands-on projects and personal branding support equipped me with real-world GenAI skills, boosted my visibility, and accelerated my professional growth.",
    name: "Sureshkumar Mani",
    role: "Senior Developer",
  },
  {
    quote:
      "By the end of the program, I felt confident in leveraging GenAI to build applications and articulate its potential. This confidence led me to actively explore ways to integrate GenAI into my work and engage in discussions with industry professionals, opening up exciting career opportunities.",
    name: "Sunil Vijendra",
    role: "Director — Engineering",
  },
  {
    quote:
      "Along with technical knowledge in generative AI, I've gained valuable feedback on how to think about problems and systems from a senior perspective. It has helped me approach solutions more effectively, especially for interviews and real-world challenges.",
    name: "Jamil Ahmed",
    role: "Technical Lead",
  },
  {
    quote:
      "They don't just teach you step by step — instead, they provide an end goal, and you're encouraged to come up with a plan to reach it. They guide you through the process, making sure you're on the right track. The mentorship feels like a partnership rather than just teaching.",
    name: "Swapnil Vernekar",
    role: "DevOps & Deployment Specialist",
  },
];

/* ── V4 Testimonials Section ─────────────────────────────────────── */
function V4TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 360;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 24 : cardWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel>Proof It Works</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              150+ Senior Java Devs Are Making the Switch. Here's What's Happening.
            </h2>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-border bg-card hover:bg-card/80 disabled:opacity-30 transition-opacity"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-border bg-card hover:bg-card/80 disabled:opacity-30 transition-opacity"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable testimonial cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
        >
          {v4Testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-6 sm:p-8 flex-shrink-0 w-[85vw] sm:w-[400px] snap-start transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${Math.min(index, 3) * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4 mt-auto">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <p className="mt-8 text-xl sm:text-2xl text-center text-muted-foreground">
          They were senior Java devs — just like you. The free training is where they started.
        </p>
        <div className="mt-4 text-center">
          <CTAButton size="large" section="testimonials">Start My Free 90-Day Roadmap</CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ── V4 Sticky Desktop Header ────────────────────────────────────── */
function V4StickyDesktopHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const { openFormModal } = useFormModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBarClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    trackEvent("cta_click", { cta_label: "sticky_desktop_bar", cta_section: "sticky_desktop", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className="bg-card/95 backdrop-blur-lg border-b border-border px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-card/100 transition-colors"
        onClick={handleBarClick}
        role="button"
        tabIndex={0}
      >
        <span className="font-display text-lg font-bold text-foreground">
          GenAI People
        </span>
        <div className="flex items-center gap-4">
          <span className="text-base text-muted-foreground">
            Java Dev → AI Architect (30–70L)
          </span>
          <CTAButton size="small" section="sticky_desktop" showSubtext={false}>Get the Free Roadmap</CTAButton>
        </div>
      </div>
    </div>
  );
}

/* ── V4 Sticky Mobile Bar ────────────────────────────────────────── */
function V4StickyMobileBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { openFormModal } = useFormModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => {
          trackEvent("cta_click", { cta_label: "sticky_mobile_bar", cta_section: "sticky_mobile", page_path: window.location.pathname });
          openFormModal();
        }}
      >
        <span className="text-lg font-medium text-foreground">
          Free 90-Day AI Roadmap (28 min)
        </span>
        <button
          type="button"
          onClick={() => {
            trackEvent("cta_click", { cta_label: "Watch Now", cta_section: "sticky_mobile", page_path: window.location.pathname });
            trackEvent("cta_click_sticky_mobile", { cta_label: "Watch Now", page_path: window.location.pathname });
            openFormModal();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-base font-semibold rounded-full shadow-lg"
        >
          Watch Now
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── V4 Hero Section ─────────────────────────────────────────────── */
function V4HeroSection() {
  const { openFormModal } = useFormModal();

  return (
    <>
      {/* Sumo bar */}
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", { cta_label: "sumo_bar", cta_section: "sumo_bar", page_path: window.location.pathname });
          openFormModal();
        }}
        className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <p className="text-sm sm:text-base font-semibold">
          Free 28-Min Training: How Senior Java Devs Are Preparing for 30–70L AI Roles
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              Senior Java Devs Are Building Their Path to{" "}
              <span className="text-primary">AI Architect</span> Roles at{" "}
              <span className="text-primary">30–70L</span> — No New Degree Required.
            </h1>

            {/* Video thumbnail */}
            <div className="mt-8 glass-card max-w-none sm:max-w-4xl overflow-hidden -mx-[calc(1rem+24px)] sm:mx-auto rounded-none sm:rounded-xl">
              <button
                type="button"
                onClick={() => {
                  trackEvent("cta_click", { cta_label: "hero_video_thumbnail", cta_section: "hero_video", page_path: window.location.pathname });
                  trackEvent("cta_click_hero_video", { cta_label: "hero_video_thumbnail", page_path: window.location.pathname });
                  openFormModal();
                }}
                className="group relative w-full aspect-[1408/736] overflow-hidden bg-black text-left cursor-pointer"
                aria-label="Open free training popup"
              >
                <div className="absolute inset-0">
                  <img
                    src="/hero-thumbnail.webp"
                    alt="How to use your Java skills to land a high-paying AI job — Jerry Kurian"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </button>
            </div>

            <p className="mt-9 text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              150+ senior Java devs are inside this program, building their path to AI roles paying 30–70L. No new degree. No new cert. Just the skills you already have, deployed differently.
            </p>

            <div className="mt-9">
              <CTAButton size="default" section="hero">Get the Free 90-Day Roadmap</CTAButton>
              <p className="mt-3 text-sm text-muted-foreground/70">150+ senior Java devs in the program. Completely free. Starts playing instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── V4 Problem / Secrets Section ────────────────────────────────── */
function V4ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>Why This Works</SectionLabel>
          <p className="text-base sm:text-lg font-semibold text-foreground/85 mb-4">
            3 reasons the market is shifting toward senior Java devs for AI Architect roles at 30–70L.
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Senior Java Devs Are Moving Into{" "}
            <span className="text-primary">AI Architect Roles at 30–70L</span> — With Skills They Already Have.
          </h2>
          <CTAButton size="default" section="problem_top">Get the Free 90-Day Roadmap</CTAButton>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10 mb-10">
          {secrets.map((secret, index) => (
            <div
              key={secret.title}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-primary text-3xl font-display font-bold underline mb-4">{secret.title}</h3>
              <p className="text-2xl font-semibold text-foreground mb-5 leading-snug">{secret.subtitle}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">{secret.text}</p>
            </div>
          ))}
        </div>

        <p className="text-2xl sm:text-3xl text-foreground mb-6">
          See the exact <span className="text-primary font-semibold">90-day roadmap</span> 150+ Java devs are already using — <span className="text-primary font-semibold">free</span>.
        </p>
        <CTAButton size="default" section="problem_bottom">Get the Free 90-Day Roadmap</CTAButton>
      </div>
    </section>
  );
}

/* ── V4 Final CTA Section ────────────────────────────────────────── */
function V4FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      className="py-8 sm:py-10 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background border-t border-primary/20"
      ref={ref}
    >
      <div className="container max-w-3xl text-center">
        <div
          className={`space-y-4 mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Your personalised <span className="text-primary">90-day AI career roadmap</span> starts with one 28-minute video. 150+ Java devs are already inside.
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            <strong>Step 1:</strong> Watch the free 28-min training. <strong>Step 2:</strong> Get your personalised roadmap to a 30–70L AI Architect role. That's it.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" section="final_cta" className="text-lg px-10 py-5">
            Start My Free 90-Day Roadmap
          </CTAButton>
        </div>

        <p
          className={`text-base text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          150+ senior Java devs already inside. Takes 28 minutes. Plays instantly.
        </p>
      </div>
    </section>
  );
}

/* ── Page Component ───────────────────────────────────────────────── */
const LpV4 = () => {
  const { setFormHeader } = useFormModal();

  useEffect(() => {
    trackEvent("page_view_lp_v4", { page_path: window.location.pathname });
    setFormHeader({
      title: "Your 90-Day AI Career Roadmap Is Ready",
      subtitle: "Plays immediately — the same training 150+ senior Java devs are using to prepare for AI roles",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="GenAI People | Senior Java Devs: Companies Are Hiring for AI Roles Now"
        description="Senior Java Developers with 10+ years: companies are actively hiring experienced engineers for AI roles. Your system design and production experience is exactly what they need. Watch the free training."
      />
      <V4HeroSection />
      <V4ProblemSection />
      <V4TestimonialsSection />
      <V4FinalCTASection />
      <Footer />
      <V4StickyDesktopHeader />
      <V4StickyMobileBar />
    </div>
  );
};

export default LpV4;
