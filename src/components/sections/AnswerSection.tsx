import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const points = [
  {
    number: "1",
    title: "The gap is small.",
    text: "",
  },
  {
    number: "2",
    title: "The roles are real.",
    text: "",
  },
  {
    number: "3",
    title: "The path is clear.",
    text: "",
  },
];

export function AnswerSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4 bg-section-accent" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>The Answer</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Watch the Free Roadmap Video.
        </h2>
        <p className="text-2xl sm:text-3xl text-muted-foreground mb-12">
          In 27 minutes, you'll see exactly how to make the shift.
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
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                  {point.title}
                </h3>
                {point.text && (
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mt-2">
                    {point.text}
                  </p>
                )}
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
