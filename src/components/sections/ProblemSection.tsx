import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const secrets = [
  {
    title: "Secret #1",
    subtitle: "AI multiplies senior engineers.",
    text: "The developers shipping fastest aren't juniors — they're experienced engineers who know what to build and use AI to build it 10x faster.",
  },
  {
    title: "Secret #2",
    subtitle: "Your Java skills are the foundation.",
    text: "Enterprise architecture, system design, production debugging — AI amplifies all of it. You're not starting over, you're levelling up.",
  },
  {
    title: "Secret #3",
    subtitle: "Speed is the new seniority.",
    text: "The engineers getting promoted now ship in days what used to take weeks. AI is their multiplier, not their replacement.",
  },
];

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-12 px-4" ref={ref}>
      <div className="container max-w-5xl text-center">
        <div className="border-t border-border pt-8">
          <SectionLabel>Video Highlights</SectionLabel>
          <p className="text-base sm:text-lg font-semibold text-foreground/85 mb-4">
            Why senior Java devs have an unfair advantage in the AI shift.
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            How senior Java devs are landing <span className="text-primary">AI Architect roles</span> paying{" "}
            <span className="text-primary">30–70L per year</span>.
          </h2>
          <CTAButton size="default" section="problem_top">Watch the Free Training (28 min)</CTAButton>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10 mb-10">
          {secrets.map((secret, index) => (
            <div
              key={secret.title}
              className={`bg-card border border-border rounded-2xl p-6 sm:p-7 transition-all duration-500 shadow-sm ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-primary text-3xl font-display font-bold underline mb-4">{secret.title}</h3>
              <p className="text-2xl font-semibold text-foreground mb-5 leading-snug">{secret.subtitle}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">{secret.text}</p>
            </div>
          ))}
        </div>

        <p className="text-2xl sm:text-3xl text-foreground mb-6">
          Watch the <span className="text-primary font-semibold">free 28-min training</span> and see how senior Java devs are landing 30–70L AI roles
        </p>
        <CTAButton size="default" section="problem_bottom">Watch the Free Training (28 min)</CTAButton>
      </div>
    </section>
  );
}
