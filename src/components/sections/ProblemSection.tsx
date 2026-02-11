import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const secrets = [
  {
    title: "Secret #1",
    subtitle: "Enterprise AI is already here.",
    text: "Infosys has partnered with Cognition to deploy Devin, the AI software engineer. This shift is no longer theoretical.",
  },
  {
    title: "Secret #2",
    subtitle: "This is not the end of your career.",
    text: "Your Java and enterprise architecture background is exactly what companies need to run AI safely at scale.",
  },
  {
    title: "Secret #3",
    subtitle: "Lead agents, don't compete with them.",
    text: "The premium roles now go to senior leaders who can direct AI agents, design systems, and own outcomes.",
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
            Watch the 3 shifts that move you from coding-only to AI leadership.
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            How to move from <span className="text-primary">Senior Java Developer</span> to{" "}
            <span className="text-primary">AI Architect</span> without taking a pay cut.
          </h2>
          <CTAButton size="default">Watch the Free Video</CTAButton>
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
          Watch the <span className="text-primary font-semibold">free training video</span> now and see your transition plan
        </p>
        <CTAButton size="default">Watch the Free Video</CTAButton>
      </div>
    </section>
  );
}
