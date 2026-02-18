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
            Ready to <span className="text-primary">ship 10x faster</span>? Watch the video, then let's build your plan.
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Book a call with Jerry after the free training and get a practical plan to 10x your shipping speed.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <CTAButton size="large" section="final_cta" className="text-lg px-10 py-5">
            Watch the Free Training (28 min)
          </CTAButton>
        </div>

        <p
          className={`text-lg text-muted-foreground/70 mt-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          Free 28-min training. No credit card. No strings. And if you join the program and do the work — we stay with you until you get the results.
        </p>
      </div>
    </section>
  );
}
