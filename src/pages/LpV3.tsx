import { useEffect } from "react";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/sections/Footer";
import { StickyDesktopHeader } from "@/components/sections/StickyDesktopHeader";
import { StickyMobileBar } from "@/components/sections/StickyMobileBar";
import { useFormModal } from "@/contexts/FormModalContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { trackEvent } from "@/lib/analytics";
import { TrendingUp, Lightbulb, Rocket, AlertTriangle, ArrowRight } from "lucide-react";

/* ── Hero ──────────────────────────────────────────────────── */
function HeroV3() {
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
          Free Video: Why Senior Engineers Who Think Like Entrepreneurs Will Dominate AI
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl text-center">
          <h1 className="mt-7 font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
            The Software Industry Is Changing.{" "}
            <span className="text-primary">Engineers Who Think Like Entrepreneurs Will Win.</span>
          </h1>

          <p className="mt-9 text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            AI is rewriting what it means to be an engineer. The ones who understand business, product, and AI together won't just survive — they'll have 10x the leverage of everyone else.
          </p>

          <div className="mt-9">
            <CTAButton size="default" section="hero_v3">Watch the Free Training (28 min)</CTAButton>
            <p className="mt-3 text-sm text-muted-foreground/70">Free training. No credit card. No strings.</p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── The Shift ─────────────────────────────────────────────── */
function ShiftSection() {
  const { ref, isVisible } = useScrollAnimation();

  const shifts = [
    {
      before: "Write code to spec",
      after: "Decide what to build and ship it end-to-end",
    },
    {
      before: "Wait for a PM to define requirements",
      after: "Identify the problem, scope the solution, build it",
    },
    {
      before: "Compete on code quality alone",
      after: "Compete on business impact and speed to market",
    },
  ];

  return (
    <section className="py-8 sm:py-12 px-4 bg-section-alt" ref={ref}>
      <div className="container max-w-5xl">
        <SectionLabel>The Industry Is Shifting</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Satya Nadella called it: <span className="text-primary">"Every engineer will be a product engineer."</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-4xl leading-relaxed">
          When AI can generate code, the engineer who only writes code becomes a commodity. The engineer who understands <em>why</em> to build, <em>what</em> to build, and <em>how to ship it fast</em> — that engineer becomes irreplaceable. The nature of work itself is changing.
        </p>

        {/* Before → After table */}
        <div className="space-y-4">
          {shifts.map((item, index) => (
            <div
              key={index}
              className={`glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1">Before</p>
                <p className="text-lg text-muted-foreground line-through decoration-1">{item.before}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary hidden sm:block flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Now</p>
                <p className="text-lg font-semibold text-foreground">{item.after}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          Scaler just launched a <strong>PGP in Business & AI</strong> — a 12-month program teaching engineers business thinking. That's how fast the industry is moving. The market is telling you: <em>technical skills alone are no longer enough.</em>
        </p>
      </div>
    </section>
  );
}

/* ── Leverage ──────────────────────────────────────────────── */
function LeverageSection() {
  const { ref, isVisible } = useScrollAnimation();

  const leveragePoints = [
    {
      icon: TrendingUp,
      title: "AI = 10x Leverage",
      text: "One senior engineer with AI can now do what a team of five did before. But only if you know what to point it at. Business thinking is the targeting system.",
    },
    {
      icon: Lightbulb,
      title: "Think Like a Founder",
      text: "The best-paid engineers in the AI era won't just execute — they'll identify opportunities, scope MVPs, and ship products. They'll think in outcomes, not tasks.",
    },
    {
      icon: Rocket,
      title: "Speed Is the New Moat",
      text: "When AI handles the boilerplate, the bottleneck shifts from coding to decision-making. Engineers who make fast, smart product decisions will dominate.",
    },
  ];

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl">
        <SectionLabel>The Opportunity</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          These changes aren't a threat.{" "}
          <span className="text-primary">They're massive leverage — if you know how to use them.</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-4xl leading-relaxed">
          Every wave of technology creates a new class of winners. The engineers who combine deep technical skill with business understanding and AI fluency will have career leverage that didn't exist two years ago.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {leveragePoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <CTAButton size="default" section="leverage">Watch the Free Training (28 min)</CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ── Risk / Wake-up ───────────────────────────────────────── */
function RiskSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4 bg-section-alt" ref={ref}>
      <div className="container max-w-4xl">
        <div
          className={`glass-card p-8 sm:p-10 border-accent/30 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-7 h-7 text-accent" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              The uncomfortable truth
            </h2>
          </div>

          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Coding is being commoditised.</strong> AI tools are already writing production code. Junior-level tasks are disappearing. "Years of experience" is losing its premium.
            </p>
            <p>
              The engineers who get ahead now are the ones who <strong className="text-foreground">think entrepreneurially</strong> — who can see a business problem, architect an AI-powered solution, and ship it. Not just take tickets.
            </p>
            <p>
              This isn't about starting a startup. It's about <strong className="text-foreground">operating like one inside your career</strong> — owning outcomes, moving fast, and building things that matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── What You Need ────────────────────────────────────────── */
function WhatYouNeedSection() {
  const { ref, isVisible } = useScrollAnimation();

  const pillars = [
    { label: "Your Engineering Foundation", desc: "Java, architecture, system design — this is your edge. AI amplifies it.", pct: "40%", color: "primary" },
    { label: "AI & LLM Fluency", desc: "Agents, RAG, MLOps — the tools that give you 10x leverage.", pct: "30%", color: "success" },
    { label: "Product & Business Thinking", desc: "Identifying problems, scoping solutions, shipping outcomes. The new competitive advantage.", pct: "30%", color: "accent" },
  ];

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>The Entrepreneurial Engineer Stack</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Technical depth + business thinking + AI fluency ={" "}
          <span className="text-primary">unstoppable</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
          You already have the first pillar. Our program adds the other two — fast, practical, and designed for working engineers.
        </p>

        <div className="space-y-4">
          {pillars.map((item, index) => (
            <div
              key={index}
              className={`glass-card p-5 sm:p-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={`font-display text-xl font-bold text-${item.color}`}>{item.label}</p>
                <span className={`text-sm font-bold text-${item.color}`}>{item.pct}</span>
              </div>
              <div className="h-3 rounded-full bg-muted/30 overflow-hidden mb-3">
                <div
                  className={`h-full bg-${item.color}/40 rounded-full origin-left transition-transform duration-1000 ease-out`}
                  style={{
                    transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                    transitionDelay: `${index * 200 + 300}ms`,
                    width: item.pct,
                  }}
                />
              </div>
              <p className="text-base text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <CTAButton size="default" section="pillars">Watch the Free Training (28 min)</CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA (v3-specific) ──────────────────────────────── */
function FinalCTAV3() {
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
            Stop waiting for the industry to decide your future.{" "}
            <span className="text-primary">Take the entrepreneurial path.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Watch the free 28-min training and see exactly how senior engineers are combining AI skills with business thinking to land roles paying 30–70L.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" section="final_cta_v3" className="text-lg px-10 py-5">
            Watch the Free Training (28 min)
          </CTAButton>
        </div>

        <p
          className={`text-base text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          Free 28-min training. No credit card. No strings.
        </p>
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
const LpV3 = () => {
  const { setFormHeader } = useFormModal();

  useEffect(() => {
    trackEvent("page_view_lp_v3", { page_path: window.location.pathname });
    setFormHeader({
      title: "Watch the Free Training",
      subtitle: "See how entrepreneurial engineers are landing 30–70L AI roles",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroV3 />
      <ShiftSection />
      <LeverageSection />
      <RiskSection />
      <WhatYouNeedSection />
      <TestimonialsSection />
      <FinalCTAV3 />
      <Footer />
      <StickyDesktopHeader />
      <StickyMobileBar />
    </div>
  );
};

export default LpV3;
