import { SectionLabel } from "@/components/ui/section-label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const comparisons = [
  {
    label: "Role",
    before: "Dev writing CRUD",
    after: "Designing system architectures",
  },
  {
    label: "AI Relationship",
    before: "Building with AI tools",
    after: "Building AI-powered products",
  },
  {
    label: "Impact",
    before: "IC contributor",
    after: "Architecture-level decisions",
  },
];

export function TransformationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>The Shift</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
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
                NOW
              </div>
              <div className="p-4 font-semibold text-center text-foreground bg-success/10">
                120 DAYS
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
              Now
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
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">
              120 Days
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
        <p className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center">
          That's not a side step. That's a transformation.
        </p>
      </div>
    </section>
  );
}
