import { useEffect, useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/sections/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";

/* ── V5 Pillars (from Jerry's QA video script) ───────────────────── */
const pillars = [
  {
    title: "Pillar #1",
    subtitle: "Become GenAI Native — not just a prompt user.",
    text: "Understand the architecture: LLMs, agents, RAG, vector databases. You don't need to be a data scientist. But you need to look at any problem and say, 'I can build a solution for this with AI.' End to end.",
  },
  {
    title: "Pillar #2",
    subtitle: "Build and deploy something real — at your current company.",
    text: "An AI-driven test framework. An intelligent bug triaging system. A reporting agent. Something that makes your manager say, 'Wait, who built this?' That's how you stop being invisible.",
  },
  {
    title: "Pillar #3",
    subtitle: "Get visible — nobody is coming to look for you.",
    text: "Write about what you're doing. Give a tech talk internally. Post on LinkedIn. One of our mentees went from support engineer to member of technical staff — salary tripled — just because he started showing up differently.",
  },
];

/* ── V5 Mistakes Section ─────────────────────────────────────────── */
const mistakes = [
  {
    label: "Mistake #1",
    title: "Confusing tenure with security",
    text: "You've been at the company for years. The work is stable. But if a less experienced person can do what you do for half the cost, your tenure is a liability — not a shield.",
  },
  {
    label: "Mistake #2",
    title: "Waiting for your company to upskill you",
    text: "Udemy licenses and internal AI sessions aren't a career strategy. If you're still browsing random YouTube videos without a roadmap, without building anything, you're moving sideways, not forward.",
  },
  {
    label: "Mistake #3",
    title: "Thinking QA is still a separate discipline",
    text: "AI can write test scripts. AI can generate frameworks. If your entire value is 'I automate test cases,' you're competing with a tool that works 24/7 for free. The future belongs to people who build end-to-end.",
  },
];

/* ── V5 Sticky Desktop Header ─────────────────────────────────────── */
function V5StickyDesktopHeader() {
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
            QA Professional → GenAI Engineer
          </span>
          <CTAButton size="small" section="sticky_desktop" showSubtext={false}>Book Free Strategy Call</CTAButton>
        </div>
      </div>
    </div>
  );
}

/* ── V5 Sticky Mobile Bar ─────────────────────────────────────────── */
function V5StickyMobileBar() {
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
          Free Strategy Call
        </span>
        <button
          type="button"
          onClick={() => {
            trackEvent("cta_click", { cta_label: "Book Free Call", cta_section: "sticky_mobile", page_path: window.location.pathname });
            openFormModal();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-base font-semibold rounded-full shadow-lg"
        >
          Book Free Call
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── V5 Hero Section ──────────────────────────────────────────────── */
function V5HeroSection() {
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
          Oracle fired 30,000 people at 6 AM. Senior QA leads with 15+ years. Is your career strategy-proof?
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              <span className="text-primary">QA Professionals:</span> Your Testing Skills Are the Foundation for{" "}
              <span className="text-primary">High-Paying GenAI Roles</span>
            </h1>

            {/* Video thumbnail */}
            <div className="mt-8 glass-card max-w-none sm:max-w-4xl overflow-hidden -mx-[calc(1rem+24px)] sm:mx-auto rounded-none sm:rounded-xl">
              <button
                type="button"
                onClick={() => {
                  trackEvent("cta_click", { cta_label: "hero_video_thumbnail", cta_section: "hero_video", page_path: window.location.pathname });
                  openFormModal();
                }}
                className="group relative w-full aspect-[1408/736] overflow-hidden bg-black text-left cursor-pointer"
                aria-label="Book free strategy call"
              >
                <div className="absolute inset-0">
                  <img
                    src="/hero-thumbnail.webp"
                    alt="The QA Career Crisis Nobody's Talking About — Jerry Kurian"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </button>
            </div>

            <p className="mt-9 text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Senior QA engineers are going from stuck at 10–20L to leading GenAI initiatives at 30–50L — without switching to a dev role or starting over.
            </p>

            <div className="mt-9">
              <CTAButton size="default" section="hero">Book Your Free Strategy Call</CTAButton>
              <p className="mt-3 text-sm text-muted-foreground/70">Free 1-on-1 call with a GenAI career mentor. No pitch. Just a plan.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── V5 Mistakes Section ─────────────────────────────────────────── */
function V5MistakesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>The Wake-Up Call</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            3 Career Mistakes <span className="text-primary">Senior QA Professionals</span> Are Making Right Now
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Oracle sent a single email at 6 AM. 30,000 people gone. 12,000 in India. Senior QA leads with 15+ years. No call. No meeting. Here's why it happened — and how to make sure it doesn't happen to you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-4 mb-10">
          {mistakes.map((mistake, index) => (
            <div
              key={mistake.label}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm text-left ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-primary text-2xl font-display font-bold mb-2">{mistake.label}</h3>
              <p className="text-xl font-semibold text-foreground mb-4 leading-snug">{mistake.title}</p>
              <p className="text-base text-muted-foreground leading-relaxed">{mistake.text}</p>
            </div>
          ))}
        </div>

        <CTAButton size="default" section="mistakes_bottom">Book Your Free Strategy Call</CTAButton>
      </div>
    </section>
  );
}

/* ── V5 Pillars Section ──────────────────────────────────────────── */
function V5PillarsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="container max-w-5xl text-center">
        <SectionLabel>The Roadmap</SectionLabel>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          What Actually Works — The <span className="text-primary">3 Pillars</span> That Took QA Pros From Stuck to <span className="text-primary">30–50L</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10 mb-10">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-primary text-3xl font-display font-bold underline mb-4">{pillar.title}</h3>
              <p className="text-2xl font-semibold text-foreground mb-5 leading-snug">{pillar.subtitle}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>

        <CTAButton size="default" section="pillars_bottom">Book Your Free Strategy Call</CTAButton>
        <p className="mt-3 text-sm text-muted-foreground/70">Free 1-on-1 with a GenAI career mentor. We'll build your personalised plan.</p>
      </div>
    </section>
  );
}

/* ── V5 Social Proof Section ─────────────────────────────────────── */
function V5SocialProofSection() {
  const { ref, isVisible } = useScrollAnimation();

  const results = [
    { name: "Punya", from: "Job Support Engineer", to: "Member of Technical Staff", salary: "13L → 32L", note: "Same company. No job switch. Salary nearly tripled." },
    { name: "Rakesh", from: "Basic Java", to: "Leading GenAI Projects", salary: "12L → 23L", note: "Now pulled into GenAI projects across departments." },
    { name: "Soumya", from: "QA Background", to: "Leading AI Testing Initiatives", salary: "Moved to 30L+", note: "Built her own AI-driven testing solution from scratch." },
  ];

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <SectionLabel>Real Results</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
          These aren't overnight stories. But they happened in <span className="text-primary">6–12 months.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {results.map((r, index) => (
            <div
              key={r.name}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm text-left ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-primary text-3xl font-display font-bold mb-2">{r.salary}</p>
              <p className="text-lg font-semibold text-foreground mb-1">{r.name}</p>
              <p className="text-sm text-muted-foreground mb-3">{r.from} → {r.to}</p>
              <p className="text-base text-muted-foreground leading-relaxed italic">"{r.note}"</p>
            </div>
          ))}
        </div>

        <CTAButton size="default" section="social_proof">Book Your Free Strategy Call</CTAButton>
      </div>
    </section>
  );
}

/* ── V5 Final CTA Section ─────────────────────────────────────────── */
function V5FinalCTASection() {
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
            The worst career decision you can make right now is{" "}
            <span className="text-primary">no decision at all.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Book a free 1-on-1 strategy call. We'll look at your career, your skills, your situation — and build a plan for the next 6–12 months.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" section="final_cta" className="text-lg px-10 py-5">
            Book Your Free Strategy Call
          </CTAButton>
        </div>

        <p
          className={`text-base text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          Free 1-on-1 call. No pitch. No strings. Show up ready to be honest with yourself.
        </p>
      </div>
    </section>
  );
}

/* ── Page Component ────────────────────────────────────────────────── */
const LpV5 = () => {
  const { setFormHeader } = useFormModal();

  useEffect(() => {
    trackEvent("page_view_lp_v5", { page_path: window.location.pathname });
    setFormHeader({
      title: "Book Your Free Strategy Call",
      subtitle: "A real 1-on-1 conversation about your QA-to-GenAI career path",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="GenAI People | QA Professionals: Transition to GenAI Engineering"
        description="QA professionals: AI is automating testing — but it's creating new roles too. Become GenAI native, build real projects, and get visible. Book your free strategy call."
      />
      <V5HeroSection />
      <V5MistakesSection />
      <V5PillarsSection />
      <V5SocialProofSection />
      <TestimonialsSection />
      <V5FinalCTASection />
      <Footer />
      <V5StickyDesktopHeader />
      <V5StickyMobileBar />
    </div>
  );
};

export default LpV5;
