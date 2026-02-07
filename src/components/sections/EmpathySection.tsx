import { SectionLabel } from "@/components/ui/section-label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const quotes = [
  {
    quote: "I don't have a math background.",
    response: "You don't need one.",
  },
  {
    quote: "I'd have to learn Python from scratch.",
    response: "You don't.",
  },
  {
    quote: "I'm too senior to start over.",
    response: "You're not starting over. You're stepping up.",
  },
];

export function EmpathySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 sm:py-28 px-4 bg-section-alt" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>You're Not Alone</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
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
              <p className="text-lg sm:text-xl text-muted-foreground italic mb-3">
                "{item.quote}"
              </p>
              <p className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {item.response}
              </p>
            </div>
          ))}
        </div>

        {/* Body text */}
        <p className="text-muted-foreground text-lg leading-relaxed">
          We've sat across from developers earning 15–20L who felt stuck. Experienced. Skilled. 
          But watching the ground shift under them. We know that feeling. And we know the way through 
          — because we've walked other developers through it already.
        </p>
      </div>
    </section>
  );
}
