import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      className="py-12 sm:py-16 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background border-t border-primary/20"
      ref={ref}
    >
      <div className="container max-w-3xl text-center">
        <div
          className={`space-y-4 mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-lg text-muted-foreground">
            Worried AI will replace your Java career?
          </p>
          <p className="text-lg text-muted-foreground">
            We help Senior Java Developers with this every day.
          </p>
          <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Watch the free Roadmap video.
          </p>
          <p className="text-lg text-muted-foreground">
            Go from writing code to designing the systems AI runs on.
          </p>
          <p className="font-display text-xl sm:text-2xl font-bold text-primary">
            Never worry about being replaced again.
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
          className={`text-sm text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          No email required. No sales pitch. Just the plan.
        </p>
      </div>
    </section>
  );
}
