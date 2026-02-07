import { SectionLabel } from "@/components/ui/section-label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const comparisons = [
  {
    label: "Role",
    before: "You write code",
    after: "You design systems where agents write code",
  },
  {
    label: "Relationship with AI",
    before: "You compete with AI tools",
    after: "You orchestrate AI tools",
  },
  {
    label: "How companies see you",
    before: "A senior coder",
    after: "An AI architect",
  },
  {
    label: "Compensation",
    before: "15–20L",
    after: "25–50L",
  },
];

export function TransformationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 sm:py-28 px-4" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>The Shift</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
          Go From Writing Code to Designing the Systems AI Runs On.
        </h2>

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
              <div className="p-4 font-semibold text-center text-destructive/80 bg-destructive/5">
                TODAY
              </div>
              <div className="p-4 font-semibold text-center text-success-foreground bg-success/5">
                AFTER THE SHIFT
              </div>
            </div>

            {/* Rows */}
            {comparisons.map((row, index) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-t border-border"
              >
                <div className="p-4 font-medium text-foreground bg-card/50">
                  {row.label}
                </div>
                <div className="p-4 text-center text-muted-foreground bg-destructive/5">
                  {row.before}
                </div>
                <div className="p-4 text-center text-foreground font-medium bg-success/5">
                  {row.after}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-6 mb-12">
          <div
            className={`glass-card before-tint p-6 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h3 className="font-display text-lg font-semibold text-destructive/80 mb-4 uppercase tracking-wide">
              Today
            </h3>
            <div className="space-y-4">
              {comparisons.map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {row.label}
                  </p>
                  <p className="text-foreground">{row.before}</p>
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
            <h3 className="font-display text-lg font-semibold text-success-foreground mb-4 uppercase tracking-wide">
              After the Shift
            </h3>
            <div className="space-y-4">
              {comparisons.map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {row.label}
                  </p>
                  <p className="text-foreground font-medium">{row.after}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="font-display text-xl sm:text-2xl font-semibold text-foreground text-center">
          That's not a side step. That's a transformation.
        </p>
      </div>
    </section>
  );
}
