import { SectionLabel } from "@/components/ui/section-label";
import { Target, Video, Clock, Route } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Target,
    title: "Your Stack. Your Goals.",
    text: "A roadmap built around your Java stack, your experience level, and your target role.",
  },
  {
    icon: Video,
    title: "1-on-1 Guidance.",
    text: "Not 200 hours of pre-recorded video. Real mentoring with real feedback.",
  },
  {
    icon: Clock,
    title: "10-15 Hours Per Week.",
    text: "Planned at your convenience. Built for working professionals. No need to quit your job or take a sabbatical.",
  },
  {
    icon: Route,
    title: "Shortest Path Only.",
    text: "No generic curriculum. Just the specific skills that close the gap between where you are and where you need to be.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 px-4 bg-section-alt" ref={ref}>
      <div className="container">
        <SectionLabel>How It Works</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
          This Isn't a Course. It's Mentoring Built Around Your Career.
        </h2>

        {/* Feature blocks */}
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-card p-6 sm:p-8 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
