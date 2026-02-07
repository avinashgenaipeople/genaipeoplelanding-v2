import { SectionLabel } from "@/components/ui/section-label";
import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const visionStatements = [
  "A new AI tool launches. Everyone panics. You don't — because you're the one deciding which tools your team uses.",
  "Your next salary conversation starts at 40L. Not because you asked. Because that's what architects get paid.",
  "You open LinkedIn and AI roles don't scare you. They excite you. Because you're qualified.",
];

export function VisionSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4 bg-section-alt" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>Your Future</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          Never Worry About Being Replaced Again.
        </h2>

        <div className="space-y-6">
          {visionStatements.map((statement, index) => (
            <div
              key={index}
              className={`flex gap-4 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                <Check className="w-5 h-5 text-success" />
              </div>
              <p className="text-xl sm:text-2xl text-foreground leading-relaxed">
                {statement}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
