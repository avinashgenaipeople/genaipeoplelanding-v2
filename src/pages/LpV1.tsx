import { useEffect, useState } from "react";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/sections/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";

/* ── V1 Secrets (from marketing landing) ───────────────────────────── */
const secrets = [
  {
    title: "Secret #1",
    subtitle: "Traditional Path is Broken.",
    text: "By the time you finish another certificate course, the AI tech has already changed. You don't need a certificate; you need specific skills that companies are hiring for right now.",
  },
  {
    title: "Secret #2",
    subtitle: "You are already 80% there.",
    text: "Stop worrying about the math and stats. Your Java experience gives you an unfair advantage in backend architecture — the backbone of AI.",
  },
  {
    title: "Secret #3",
    subtitle: "Code Less, Architect More.",
    text: "Being the \"best coder\" doesn't guarantee the best job anymore. Learn how to leverage AI to solve problems — companies pay for solving problems, not writing code.",
  },
];

/* ── V1 Sticky Desktop Header ─────────────────────────────────────── */
function V1StickyDesktopHeader() {
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
            Senior Java Dev → High-Paying AI Job
          </span>
          <CTAButton size="small" section="sticky_desktop" showSubtext={false}>Watch Free Roadmap</CTAButton>
        </div>
      </div>
    </div>
  );
}

/* ── V1 Sticky Mobile Bar ─────────────────────────────────────────── */
function V1StickyMobileBar() {
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
          Free Roadmap Video
        </span>
        <button
          type="button"
          onClick={() => {
            trackEvent("cta_click", { cta_label: "Watch Free Roadmap", cta_section: "sticky_mobile", page_path: window.location.pathname });
            trackEvent("cta_click_sticky_mobile", { cta_label: "Watch Free Roadmap", page_path: window.location.pathname });
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

/* ── V1 Hero Section ──────────────────────────────────────────────── */
function V1HeroSection() {
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
          Watch FREE training video
        </p>
      </button>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center">
            {/* Qualifier pill */}
            <div className="inline-block bg-primary/10 text-primary font-semibold text-sm sm:text-base px-6 py-2.5 rounded-full mb-6">
              Video Training for Senior Developers earning at least <span className="underline">15 Lakhs Per Annum</span>
            </div>

            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
              Senior <span className="text-primary">Java Developers</span> Use Your Java Skills to Land a{" "}
              <span className="text-primary">High-Paying AI Job</span>
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
                    src="/hero-thumbnail.jpg"
                    alt="How to use your Java skills to land a high-paying AI job — Jerry Kurian"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </button>
            </div>

            <p className="mt-9 text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              We know how frustrating it is when your years of Senior Java experience feel undervalued.
              You don't need another certificate. You just need a roadmap to translate your domain knowledge to become an AI architect.
            </p>

            <div className="mt-9">
              <CTAButton size="default" section="hero">Watch the Free Roadmap Video</CTAButton>
              <p className="mt-3 text-sm text-muted-foreground/70">Free training. No credit card. No strings.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── V1 Problem / Secrets Section ─────────────────────────────────── */
function V1ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>Video Highlights</SectionLabel>
          <p className="text-base sm:text-lg font-semibold text-foreground/85 mb-4">
            Watch the 3 secrets to future-proofing your salary and your skillset.
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            How to Switch from "Legacy Coder" to{" "}
            <span className="text-primary">"AI Developer"</span> Without Taking a Pay Cut.
          </h2>
          <CTAButton size="default" section="problem_top">Watch the Free Roadmap Video</CTAButton>
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
          Watch the <span className="text-primary font-semibold">FREE training video</span> now by clicking below
        </p>
        <CTAButton size="default" section="problem_bottom">Watch the Free Roadmap Video</CTAButton>
      </div>
    </section>
  );
}

/* ── V1 Final CTA Section ─────────────────────────────────────────── */
function V1FinalCTASection() {
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
            Ready to switch from "Legacy Coder" to{" "}
            <span className="text-primary">"AI Developer"</span>?
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Watch the free roadmap video and discover how your Java skills give you an unfair advantage in the AI shift.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" section="final_cta" className="text-lg px-10 py-5">
            Watch the Free Roadmap Video
          </CTAButton>
        </div>

        <p
          className={`text-base text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          Free training. No credit card. No strings.
        </p>
      </div>
    </section>
  );
}

/* ── Page Component ────────────────────────────────────────────────── */
const LpV1 = () => {
  const { setFormHeader } = useFormModal();

  useEffect(() => {
    trackEvent("page_view_lp_v1", { page_path: window.location.pathname });
    setFormHeader({
      title: "Watch the Free Roadmap Video",
      subtitle: "Enter your info and the training plays immediately",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <V1HeroSection />
      <V1ProblemSection />
      <TestimonialsSection />
      <V1FinalCTASection />
      <Footer />
      <V1StickyDesktopHeader />
      <V1StickyMobileBar />
    </div>
  );
};

export default LpV1;
