import { SectionLabel } from "@/components/ui/section-label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, ArrowRight } from "lucide-react";

const comparisons = [
  {
    label: "Role",
    before: "Senior Java Developer",
    after: "AI/ML Engineer or Lead",
  },
  {
    label: "Focus",
    before: "Building microservices & APIs",
    after: "Designing AI-powered systems",
  },
  {
    label: "Impact",
    before: "Delivering features for one team",
    after: "Shaping technical direction across teams",
  },
  {
    label: "AI Leverage",
    before: "Using Copilot for code completion",
    after: "Orchestrating AI agents & workflows",
  },
  {
    label: "Compensation",
    before: "15–25L (Senior Java range)",
    after: "30–70L (AI role range)",
  },
];

export function TransformationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>The Shift</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          From Senior Java Developer to High-Paying AI Role
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Same domain expertise. 30–70L compensation.
        </p>

        {/* Desktop table */}
        <div className="hidden md:block mb-12">
          <div
            className={`overflow-hidden rounded-xl border border-border transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Header */}
            <div className="grid grid-cols-3 bg-card">
              <div className="p-4 font-semibold text-muted-foreground"></div>
              <div className="p-4 font-semibold text-center text-muted-foreground bg-muted/50">
                TODAY
              </div>
              <div className="p-4 font-semibold text-center text-foreground bg-success/10">
                AFTER THE PROGRAM
              </div>
            </div>

            {/* Rows */}
            {comparisons.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-t border-border"
              >
                <div className="p-4 font-medium text-foreground bg-card/50">
                  {row.label}
                </div>
                <div className="p-4 text-center text-muted-foreground bg-muted/30">
                  {row.before}
                </div>
                <div className="p-4 text-center text-foreground font-medium bg-success/5">
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    {row.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-6 mb-12">
          <div
            className={`glass-card p-6 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h3 className="font-display text-lg font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Today
            </h3>
            <div className="space-y-4">
              {comparisons.map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {row.label}
                  </p>
                  <p className="text-foreground">
                    {row.before}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`glass-card after-tint p-6 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">
              After the Program
            </h3>
            <div className="space-y-4">
              {comparisons.map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {row.label}
                  </p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    {row.after}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center">
          Same Java skills. Up to 2–3x the compensation.
        </p>
      </div>
    </section>
  );
}
