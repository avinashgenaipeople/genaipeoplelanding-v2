import { SectionLabel } from "@/components/ui/section-label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const quotes = [
  {
    quote: "I don't have a math background.",
    response: "You don't need one.",
  },
  {
    quote: "It's too late to start over.",
    response: "You're not starting over. You're stepping up.",
  },
  {
    quote: "I don't have time — I have a full-time job.",
    response: "2–3 hours a day. That's it. We designed this for working professionals.",
  },
];

export function EmpathySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4 bg-section-alt" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>You're Closer Than You Think</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          Your Java Experience Is the Foundation. We Add the AI Layer.
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

        {/* 80/20 Visual Bar */}
        <div
          className={`glass-card p-6 sm:p-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <p className="text-base sm:text-lg text-muted-foreground mb-5">
            What you bring vs. what we teach:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-1 mb-4">
            {/* Your foundation */}
            <div className="sm:w-[60%] relative">
              <div className="h-14 sm:h-16 rounded-lg sm:rounded-r-none bg-primary/15 overflow-hidden">
                <div
                  className="h-full bg-primary/25 origin-left transition-transform duration-1000 ease-out"
                  style={{
                    transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </div>
              <p className="mt-2 text-sm sm:text-base font-semibold text-primary">
                Your Foundation — Java, Architecture, System Design
              </p>
            </div>

            {/* What we add */}
            <div className="sm:w-[40%] relative">
              <div className="h-14 sm:h-16 rounded-lg sm:rounded-l-none bg-success/15 overflow-hidden">
                <div
                  className="h-full bg-success/25 origin-left transition-transform duration-1000 ease-out"
                  style={{
                    transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                    transitionDelay: "500ms",
                  }}
                />
              </div>
              <p className="mt-2 text-sm sm:text-base font-semibold text-success">
                What We Add — AI Agents, LLMs, MLOps, Career Strategy
              </p>
            </div>
          </div>

          <p className="text-center font-display text-lg sm:text-xl font-bold text-foreground mt-4">
            Together = Ready for 30–70L AI Roles
          </p>
        </div>

      </div>
    </section>
  );
}
