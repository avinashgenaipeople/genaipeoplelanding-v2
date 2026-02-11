import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function FinalCTASection() {
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
            Your Next Job Should Pay You What You're <span className="text-primary">Really Worth</span>.
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Senior Java developers with AI skills are landing ₹40–72L+ roles. You're next.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" className="text-lg px-10 py-5">
            Watch the Free Roadmap Video
          </CTAButton>
        </div>

        <p
          className={`text-lg text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          28 Minute Exclusive Roadmap for Senior Java Developers
        </p>
      </div>
    </section>
  );
}
