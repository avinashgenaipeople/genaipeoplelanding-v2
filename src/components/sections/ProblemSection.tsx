import { SectionLabel } from "@/components/ui/section-label";
import { Briefcase, Bot, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const problems = [
  {
    icon: Briefcase,
    title: "No Posts Changed",
    text: "The top-paying roles now require AI skills. Same companies, same teams — but much higher compensation.",
  },
  {
    icon: Bot,
    title: "AI Skills = Higher Pay",
    text: "Developers who can build with AI earn ₹40–72L+. Those who can't are stuck at ₹15–25L.",
  },
  {
    icon: Clock,
    title: "Window's Open Now",
    text: "Companies need Java developers who understand AI. The demand is high and supply is low — for now.",
  },
];

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container">
        <SectionLabel>The Reality</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          The Highest Paying Jobs Now Require AI Skills
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Your Java expertise is valuable — but the best-paying roles have moved. Here's what's happening.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

      </div>
    </section>
  );
}
