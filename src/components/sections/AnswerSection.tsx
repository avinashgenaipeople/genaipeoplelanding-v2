import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const points = [
  {
    number: "1",
    title: "The gap is small.",
    text: "Every AI system needs backend architecture, APIs, data pipelines, and production reliability. That's your current job. The missing 20% is learnable in weeks.",
  },
  {
    number: "2",
    title: "The roles are real.",
    text: 'AI Backend Engineer. ML Platform Architect. AI Solutions Lead. Open on LinkedIn and Naukri right now. Most require "strong Java/backend experience."',
  },
  {
    number: "3",
    title: "The path is clear.",
    text: "Not a generic course. A step-by-step roadmap from where you are to where you need to be. 30 minutes a day.",
  },
];

export function AnswerSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 px-4 bg-section-accent" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>The Answer</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Watch the Free Roadmap Video.
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          In 22 minutes, you'll see three things:
        </p>

        {/* Numbered points */}
        <div className="space-y-8 mb-12">
          {points.map((point, index) => (
            <div
              key={point.number}
              className={`flex gap-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="font-display text-xl font-bold text-primary-foreground">
                  {point.number}
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <CTAButton size="large">
            Watch the Free Roadmap Video
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
