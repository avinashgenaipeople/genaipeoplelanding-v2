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

/* ── 3 Blind Spots (from ad scripts) ────────────────────────────── */
const blindSpots = [
  {
    label: "Blind Spot #1",
    title: '"I code fast enough to stay relevant."',
    text: "Speed isn't the metric anymore. Right now, somewhere, a non-developer just built something in 20 minutes that would've taken your team a sprint. AI writes 30% of Microsoft's code and more than a quarter of Google's. Mark Zuckerberg wants most of Meta's code written by AI agents — soon. The developers who survive aren't the fastest coders. They're the ones who build, manage, and lead systems where AI does the coding.",
  },
  {
    label: "Blind Spot #2",
    title: '"I\'ll wait and see how this plays out."',
    text: "52,000 tech jobs vanished in 90 days — a 40% jump from the same period last year. One month, AI accounted for 10% of all tech layoffs. The next month, 25%. This isn't a slow shift. This is acceleration. Companies cutting in one area are actively hiring in AI, security, and core product development — simultaneously. There are two tracks. One is shrinking. One is growing. Waiting means the shrinking track decides for you.",
  },
  {
    label: "Blind Spot #3",
    title: '"My experience will protect me."',
    text: 'Atlassian laid off 1,600 people — 10% of their company. But their CEO said team members with "transferable skills" were spared. They\'re not cutting everyone. They\'re sorting. Salesforce says AI handles 30–50% of work in some areas — maintaining output with fewer people. This is the new math every CTO is running. The filter is simple: who\'s AI-ready, and who isn\'t.',
  },
];

/* ── What You Get on the Call ─────────────────────────────────────── */
const callBenefits = [
  {
    title: "Audit your position",
    text: "We'll assess where you stand on the two tracks — the one that's shrinking and the one companies are desperately trying to fill.",
  },
  {
    title: "Map the architect path",
    text: "AI owns execution. Architects own everything above it. We'll show you how your Java systems thinking becomes your GenAI foundation.",
  },
  {
    title: "Build your transition plan",
    text: "Not a generic course. A personalised roadmap built around your experience, your timeline, and the roles companies are actively hiring for right now.",
  },
];

/* ── V6 Sticky Desktop Header ─────────────────────────────────────── */
function V6StickyDesktopHeader() {
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
            AI agents are building autonomously. Who's going to govern them?
          </span>
          <CTAButton size="small" section="sticky_desktop" showSubtext={false}>Book Free Strategy Call</CTAButton>
        </div>
      </div>
    </div>
  );
}

/* ── V6 Sticky Mobile Bar ─────────────────────────────────────────── */
function V6StickyMobileBar() {
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

/* ── V6 Hero Section ──────────────────────────────────────────────── */
function V6HeroSection() {
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
          52,000 tech jobs gone in 90 days. AI was the #1 reason. Which track are you on?
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              <span className="text-primary">Senior Java Developer:</span> AI Agents Now Build, Test & Deploy{" "}
              <span className="text-primary">Autonomously.</span> The Question Is — Who Governs Them?
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
                aria-label="Watch free 27-minute training"
              >
                <div className="absolute inset-0">
                  <img
                    src="/hero-thumbnail.webp"
                    alt="From Java to GenAI — Free 27-Minute Training — Jerry Kurian, GenAI People"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </button>
            </div>

            <p className="mt-9 text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Anthropic's 2026 report says it plainly — AI coding agents build, test, and deploy with no human in the loop. Developers who watched called it "brain-breaking." But these agents don't architect themselves. Someone has to define the boundaries, the failure modes, the data flow, the governance. That someone isn't a coder. It's an <em>architect</em>. And your 10+ years of Java is the foundation.
            </p>

            <div className="mt-9">
              <CTAButton size="default" section="hero">Watch Free 27-Min Training</CTAButton>
              <p className="mt-3 text-sm text-muted-foreground/70">Free training by Jerry Kurian, founder of GenAI People. Then book your 1-on-1 strategy call.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── V6 Context Section — The Numbers ────────────────────────────── */
function V6ContextSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="container max-w-4xl text-center">
        <SectionLabel>The Numbers Don't Lie</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
          This isn't a slow shift. <span className="text-primary">This is acceleration.</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
          {[
            { stat: "52,000", label: "tech jobs gone in 90 days", detail: "A 40% jump from the same period last year" },
            { stat: "25%", label: "of all tech layoffs cite AI", detail: "Up from 10% just one month earlier" },
            { stat: "1,600", label: "Atlassian employees sorted out", detail: 'CEO spared those with "transferable skills"' },
            { stat: "30%+", label: "of Microsoft's code written by AI", detail: "Google, Meta following the same trajectory" },
          ].map((item, index) => (
            <div
              key={item.stat}
              className={`bg-card border border-border rounded-2xl p-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-primary text-4xl font-display font-bold mb-1">{item.stat}</p>
              <p className="text-lg font-semibold text-foreground mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          But here's what the headlines miss: companies cutting in one area are actively hiring in AI, security, and core product development — simultaneously. There are two tracks right now. One is shrinking. One is growing.
        </p>

        <CTAButton size="default" section="context">Book Your Free Strategy Call</CTAButton>
      </div>
    </section>
  );
}

/* ── V6 Blind Spots Section ────────────────────────────────────────── */
function V6BlindSpotsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>The 3 Dangerous Blind Spots</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            3 Beliefs That Are <span className="text-primary">Quietly Ending</span> Senior Developer Careers
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            We've helped hundreds of developers navigate this shift. These are the patterns we see again and again — and recognising yourself in them is the first step to getting on the right track.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-4 mb-10">
          {blindSpots.map((spot, index) => (
            <div
              key={spot.label}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm text-left ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-primary text-2xl font-display font-bold mb-2">{spot.label}</h3>
              <p className="text-xl font-semibold text-foreground mb-4 leading-snug">{spot.title}</p>
              <p className="text-base text-muted-foreground leading-relaxed">{spot.text}</p>
            </div>
          ))}
        </div>

        <CTAButton size="default" section="blind_spots_bottom">Book Your Free Strategy Call</CTAButton>
      </div>
    </section>
  );
}

/* ── V6 Reframe Section ──────────────────────────────────────────── */
function V6ReframeSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="container max-w-4xl text-center">
        <SectionLabel>The Architect Advantage</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Your Java experience isn't baggage. <span className="text-primary">It's your foundation.</span>
        </h2>
        <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
          AI optimises for code that runs — not code that's secure. It doesn't remember the architectural decisions it made last week. It can't translate a client's "feeling" into a database schema. The more design-dependent and conceptually complex a task, the more it stays in human hands. You already think in systems — in dependencies, in failure points, in scale. You just haven't pointed that thinking at AI yet.
        </p>

        {/* What you get on the call */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8">
          On your free strategy call, we'll:
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {callBenefits.map((b, index) => (
            <div
              key={b.title}
              className={`bg-card border border-border rounded-2xl p-6 transition-all duration-500 shadow-sm ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-primary text-5xl font-display font-bold mb-3">{index + 1}</p>
              <p className="text-lg font-semibold text-foreground mb-2">{b.title}</p>
              <p className="text-base text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <CTAButton size="default" section="reframe">Book Your Free Strategy Call</CTAButton>
        <p className="mt-3 text-sm text-muted-foreground/70">500+ developers have made this transition with our help. No pitch. Just a plan.</p>
      </div>
    </section>
  );
}

/* ── V6 Investment Reframe Section ───────────────────────────────── */
function V6InvestmentSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-4xl text-center">
        <SectionLabel>Two Tracks</SectionLabel>
        <h2
          className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          One track is shrinking. One is growing. <span className="text-primary">You choose.</span>
        </h2>

        <div
          className={`text-left bg-card border border-border rounded-2xl p-8 max-w-3xl mx-auto mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <ul className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <li className="flex gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong className="text-foreground">The shrinking track:</strong> Writing code that AI can already write. Competing on speed with machines that don't sleep. Waiting for the next round of "sorting."</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong className="text-foreground">The growing track:</strong> Designing what AI runs on. Governing the agents. Catching what AI gets wrong. Being the architect, the decision maker — the one they can't cut.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong className="text-foreground">The window:</strong> Companies are hiring for AI, security, and core product development right now. But the roles are filling fast — and the bar rises every quarter.</span>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-lg text-foreground font-semibold mb-2">
              Our Java to GenAI Sprint exists for exactly this moment.
            </p>
            <p className="text-base text-muted-foreground">
              It takes your existing architectural instincts and builds the GenAI layer on top — so you stop being the person who writes what AI could write, and become the person who designs what AI runs on.
            </p>
          </div>
        </div>

        <p className="text-xl sm:text-2xl text-foreground font-semibold mb-8">
          Your Java experience isn't the problem. It's actually your biggest asset —{" "}
          <span className="text-primary">if you layer the right skills on top of it.</span>
        </p>

        <CTAButton size="default" section="investment">Watch Free 27-Min Training</CTAButton>
      </div>
    </section>
  );
}

/* ── V6 Final CTA Section ─────────────────────────────────────────── */
function V6FinalCTASection() {
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
            The agents are already here. The question is{" "}
            <span className="text-primary">who's going to govern them.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            You don't learn to compete with AI. You learn to be the person who catches what AI gets wrong. The architect. The decision maker. The one they can't cut.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" section="final_cta" className="text-lg px-10 py-5">
            Watch Free 27-Min Training
          </CTAButton>
        </div>

        <p
          className={`text-base text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          Watch the training. Book your strategy call. That architect — it should be you.
        </p>
      </div>
    </section>
  );
}

/* ── Page Component ────────────────────────────────────────────────── */
const LpV6 = () => {
  const { setFormHeader } = useFormModal();

  useEffect(() => {
    trackEvent("page_view_lp_v6", { page_path: window.location.pathname });
    setFormHeader({
      title: "Watch the Free 27-Min Training",
      subtitle: "Then let's map your move from Java developer to GenAI architect — together",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="GenAI People | AI Agents Are Here — Senior Java Devs, Who Governs Them?"
        description="52,000 tech jobs gone in 90 days. AI agents now build, test, and deploy autonomously. Senior Java Developers: your systems thinking is the foundation. Watch the free 27-min training."
      />
      <V6HeroSection />
      <V6ContextSection />
      <V6BlindSpotsSection />
      <V6ReframeSection />
      <V6InvestmentSection />
      <TestimonialsSection />
      <V6FinalCTASection />
      <Footer />
      <V6StickyDesktopHeader />
      <V6StickyMobileBar />
    </div>
  );
};

export default LpV6;
