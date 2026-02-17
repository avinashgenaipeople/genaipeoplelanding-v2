import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const metrics = [
  { value: "15L → 24L", label: "Avg. salary jump" },
  { value: "120 Days", label: "Avg. transition time" },
  { value: "150+", label: "Developers in the program" },
];

export function SocialProofBar() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      className="py-6 sm:py-8 px-4 bg-section-alt border-y border-border"
      ref={ref}
    >
      <div className="container max-w-4xl">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                {metric.value}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
