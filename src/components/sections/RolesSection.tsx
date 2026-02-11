import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const roles = [
  {
    role: "AI Backend Engineer",
    ctc: "18–27L",
    tag: "Java + APIs",
  },
  {
    role: "ML Platform Engineer",
    ctc: "27–41L",
    tag: "Infrastructure",
  },
  {
    role: "AI Solutions Architect",
    ctc: "36–63L",
    tag: "Architecture",
  },
  {
    role: "AI/ML Engineering Manager",
    ctc: "45–72L",
    tag: "Leadership",
  },
];

function AnimatedCTC({ ctc, isVisible }: { ctc: string; isVisible: boolean }) {
  const [display, setDisplay] = useState(ctc);

  useEffect(() => {
    if (!isVisible) return;

    // Extract numbers from CTC string
    const match = ctc.match(/(\d+)–(\d+)/);
    if (!match) return;

    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    const suffix = ctc.includes("+") ? "L+" : "L";

    let current = 0;
    const duration = 1000;
    const steps = 20;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const currentStart = Math.round(start * progress);
      const currentEnd = Math.round(end * progress);
      setDisplay(`${currentStart}–${currentEnd}${suffix}`);

      if (current >= steps) {
        clearInterval(timer);
        setDisplay(ctc);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [ctc, isVisible]);

  return <span>{display}</span>;
}

export function RolesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container">
        <SectionLabel>Real Roles. Open Today.</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          These Are Real Career Paths
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Salaries based on current market data. Your Java experience is a core requirement.
        </p>

        {/* Role cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roles.map((role, index) => (
            <div
              key={role.role}
              className={`glass-card-highlight p-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3">
                {role.role}
              </h3>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
                <AnimatedCTC ctc={role.ctc} isVisible={isVisible} />
              </p>
              <span className="inline-block text-base px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                {role.tag}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <CTAButton size="default">Get Your Personalized Roadmap →</CTAButton>
        </div>
      </div>
    </section>
  );
}
