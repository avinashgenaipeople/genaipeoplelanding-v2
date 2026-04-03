import { useEffect, useState } from "react";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/sections/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";

/* ── 3 Mistakes (from Jerry's Oracle script) ─────────────────────── */
const mistakes = [
  {
    label: "Mistake #1",
    title: '"This won\'t affect me."',
    text: "You've been coding for years. Survived downturns before. You think experience makes you untouchable. But Oracle just proved — experience alone is no longer a shield. Companies are restructuring around AI. They are not making exceptions based on tenure.",
  },
  {
    label: "Mistake #2",
    title: '"I\'ll just survive."',
    text: "\"I don't need a raise. I just want to keep my job.\" But the market isn't rewarding survival anymore — it's rewarding adaptation. If you're not growing, someone who can do your job plus leverage AI will replace you. Survival mode is a slow fade into irrelevance.",
  },
  {
    label: "Mistake #3",
    title: '"My company or a certificate will save me."',
    text: "Certified in what? The technology changes every few weeks. And your company has two options: invest in training you… or replace you. Which one do you think is cheaper? Waiting for someone else to rescue your career is the riskiest bet you can make.",
  },
];

/* ── What You Get on the Call ─────────────────────────────────────── */
const callBenefits = [
  {
    title: "Understand your situation",
    text: "We'll look at your specific background, skills, and goals — not generic advice.",
  },
  {
    title: "Map the real market demand",
    text: "What companies are actually hiring for in your domain right now — not LinkedIn hype.",
  },
  {
    title: "Build your personalised roadmap",
    text: "Not a generic course. A plan built around your experience, your timeline, and your career goals.",
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
            Oracle laid off 30,000. Is your career strategy-proof?
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
          30,000 Oracle employees got a termination email at 6 AM. No warning. No call. Is your career next?
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              <span className="text-primary">Senior Java Developer:</span> Oracle Just Proved That Experience Alone{" "}
              <span className="text-primary">Won't Save Your Career</span>
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
                    alt="The Oracle Wake-Up Call — Jerry Kurian, GenAI People"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </button>
            </div>

            <p className="mt-9 text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              30,000 people. Gone overnight. 12,000 in India. Senior devs with 15+ years. No call. No meeting. Their Slack was disabled before they woke up. Here's what you need to do — starting this week.
            </p>

            <div className="mt-9">
              <CTAButton size="default" section="hero">Book Your Free Strategy Call</CTAButton>
              <p className="mt-3 text-sm text-muted-foreground/70">Free 1-on-1 call. No pitch. We'll build a real plan for your career.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── V6 Context Section — What Happened ──────────────────────────── */
function V6ContextSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="container max-w-4xl text-center">
        <SectionLabel>What Actually Happened</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
          This wasn't sudden. <span className="text-primary">It was planned for months.</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
          {[
            { stat: "30,000", label: "employees terminated globally", detail: "In a single email at 6 AM" },
            { stat: "12,000", label: "in India alone", detail: "Senior developers, QA leads, 15+ year veterans" },
            { stat: "₹8–10B", label: "in freed cash flow", detail: "Investment analysts had already done the math" },
            { stat: "85,000+", label: "tech jobs cut in 2026", detail: "Meta, Epic Games, Oracle — and it's still April" },
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
          During the planning phase, Oracle asked employees to adopt AI tools. They were watching. Evaluating. Quietly deciding — who is adapting… and who isn't. Then the axe fell.
        </p>

        <CTAButton size="default" section="context">Book Your Free Strategy Call</CTAButton>
      </div>
    </section>
  );
}

/* ── V6 Mistakes Section ─────────────────────────────────────────── */
function V6MistakesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>The 3 Career-Killing Beliefs</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            3 Quiet Beliefs That Are <span className="text-primary">Silently Killing</span> Senior Developer Careers
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            We've worked with hundreds of developers navigating this shift. These are the patterns we see again and again — recognising yourself in them could save your career.
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

/* ── V6 Reframe Section ──────────────────────────────────────────── */
function V6ReframeSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="container max-w-4xl text-center">
        <SectionLabel>The Reframe</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Your experience isn't worthless. <span className="text-primary">It means the opposite.</span>
        </h2>
        <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
          Senior developers who pair their deep domain knowledge with AI capabilities become <em>extraordinarily</em> valuable. The gap between "knowing AI exists" and "actually using it every day to ship real work" — that's where the biggest career opportunities live right now.
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
        <SectionLabel>The Real Cost</SectionLabel>
        <h2
          className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The cost of staying still <span className="text-primary">isn't zero.</span>
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
              <span>The salary you stop earning when the next round of cuts hits <em>your</em> company</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary text-xl">→</span>
              <span>The interviews you don't get because your profile doesn't reflect AI skills</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary text-xl">→</span>
              <span>The 6–18 months of lost income while you scramble to catch up from a position of desperation</span>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-lg text-foreground font-semibold mb-2">
              One of our mentees was noticed by his management through his LinkedIn posts.
            </p>
            <p className="text-base text-muted-foreground">
              He got moved to his company's new AI team. Received a salary hike. All because he chose to invest in himself <em>before</em> he was forced to.
            </p>
          </div>
        </div>

        <p className="text-xl sm:text-2xl text-foreground font-semibold mb-8">
          The best time to upskill was six months ago. The second best time?{" "}
          <span className="text-primary">Right now</span> — while you still have the salary and the choice.
        </p>

        <CTAButton size="default" section="investment">Book Your Free Strategy Call</CTAButton>
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
            The worst outcome isn't investing in yourself too early. It's realising too late that the cost of doing nothing was{" "}
            <span className="text-primary">far, far higher.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            You don't have to figure this out alone. But you do have to start.
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
          Free 1-on-1 call. No pitch. No strings. 500+ developers already inside.
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
      title: "Book Your Free Strategy Call",
      subtitle: "A real 1-on-1 conversation about your career — built around your situation",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <V6HeroSection />
      <V6ContextSection />
      <V6MistakesSection />
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
