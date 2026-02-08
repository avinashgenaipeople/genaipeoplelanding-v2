import { SectionLabel } from "@/components/ui/section-label";
import { Briefcase, Bot, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const problems = [
  {
    icon: Briefcase,
    title: "Job Posts Changed",
    text: 'Roles that said "Senior Java Developer" last year now say "AI/ML experience required."',
  },
  {
    icon: Bot,
    title: "Agents Write Code",
    text: "AI handles the boilerplate, the CRUD, the standard integrations — the work that used to justify your salary.",
  },
  {
    icon: Clock,
    title: "Window Is Closing",
    text: "Claude Code went from zero to 4% of all GitHub commits in under a year. Developers who wait will compete. Developers who move now will lead.",
  },
];

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container">
        <SectionLabel>The Problem</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          Here's What's Actually Happening
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className={`glass-card p-6 sm:p-8 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {problem.text}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Worried AI will replace your Java career? You should be. But not for the reason you think.
          </p>
          <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed">
            The threat isn't that AI can do everything you do. The threat is staying in a role that shrinks while a bigger role goes unfilled.
          </p>
        </div>
      </div>
    </section>
  );
}
