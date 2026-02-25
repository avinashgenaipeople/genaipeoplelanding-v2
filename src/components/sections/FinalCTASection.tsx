import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck } from "lucide-react";

export function FinalCTASection({ showGuarantee = true }: { showGuarantee?: boolean } = {}) {
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
            Ready to <span className="text-primary">land a 30–70L AI role</span>? Watch the video, then let's build your plan.
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Book a call with Jerry after the free training and get a personalised roadmap to your next high-paying AI role.
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

        {/* Guarantee */}
        {showGuarantee && (
          <div
            className={`mt-10 glass-card p-6 sm:p-8 border-success/30 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShieldCheck className="w-6 h-6 text-success" />
              <p className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Our Guarantee
              </p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you join the program, do the work, and don't land a higher-paying AI role — we keep working with you at no extra cost until you do. We're invested in your outcome, not just your enrolment.
            </p>
          </div>
        )}

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
