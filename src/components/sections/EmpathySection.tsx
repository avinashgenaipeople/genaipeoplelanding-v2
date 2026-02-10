import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const quotes = [
  {
    quote: "I don't have a math background.",
    response: "You don't need one.",
  },
  {
    quote: "I'm too senior to start over.",
    response: "You're not starting over. You're stepping up.",
  },
];

export function EmpathySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4 bg-section-alt" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>You're Not Alone</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          We Help Senior Java Developers With This Every Day.
        </h2>

        {/* Quote blocks */}
        <div className="space-y-6 mb-12">
          {quotes.map((item, index) => (
            <div
              key={index}
              className={`glass-card p-6 sm:p-8 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p className="text-xl sm:text-2xl text-muted-foreground italic mb-3">
                "{item.quote}"
              </p>
              <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {item.response}
              </p>
            </div>
          ))}
        </div>

        {/* Body text */}
        <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed">
          We've helped hundreds of senior Java developers make this exact transition — with a structured, no-fluff approach built around your career.
        </p>

        {/* CTA */}
        <div className="mt-8 text-center">
          <CTAButton size="default">See How We Can Help — Free</CTAButton>
          <p className="text-base text-muted-foreground mt-3">No commitment. Just a 28-minute roadmap.</p>
        </div>
      </div>
    </section>
  );
}
