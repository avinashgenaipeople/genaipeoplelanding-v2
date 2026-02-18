import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const points = [
  "Why AI makes senior devs faster, not redundant.",
  "The exact workflow to ship 10x faster in 120 days.",
  "How to book a 1:1 plan call with Jerry.",
];

export function AnswerSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4 bg-section-accent" ref={ref}>
      <div className="container max-w-4xl text-center">
        <SectionLabel>Free Video</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Watch the Free Training Video.
        </h2>
        <p className="text-2xl sm:text-3xl text-muted-foreground mb-12">
          In 28 minutes, see exactly how senior Java devs are shipping 10x faster.
        </p>

        {/* Check points */}
        <div className="flex flex-col items-center gap-4 mb-12">
          {points.map((point, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-semibold text-foreground">
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <CTAButton size="large" section="answer">
          Watch the Free Video
        </CTAButton>
      </div>
    </section>
  );
}
