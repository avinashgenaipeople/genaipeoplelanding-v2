import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const roles = [
  {
    role: "AI Backend Engineer",
    ctc: "20–30L",
    tag: "Java/Spring Boot preferred",
  },
  {
    role: "ML Platform Engineer",
    ctc: "30–45L",
    tag: "Distributed systems experience",
  },
  {
    role: "AI Solutions Architect",
    ctc: "40–70L",
    tag: "System design + AI integration",
  },
  {
    role: "AI/ML Engineering Manager",
    ctc: "50–80L",
    tag: "Backend architecture leadership",
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
        <SectionLabel>Roles Hiring Now</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          These Are Real Roles. Open Today.
        </h2>

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

        {/* Source text */}
        <p className="text-lg text-muted-foreground/70 text-center">
          Source: LinkedIn, Naukri, and direct company postings. Most list Java/backend experience as a core requirement.
        </p>

        {/* CTA */}
        <div className="mt-8 text-center">
          <CTAButton size="default">Get Your Personalized Roadmap</CTAButton>
          <p className="text-base text-muted-foreground mt-3">Free. No credit card. Just 28 minutes of your time.</p>
        </div>
      </div>
    </section>
  );
}
