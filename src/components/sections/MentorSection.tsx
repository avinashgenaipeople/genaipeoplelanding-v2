import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { Linkedin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function MentorSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container max-w-4xl">
        <SectionLabel>Your Mentor</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          Meet Jerry Kurian, Your Chief Mentor.
        </h2>

        <div
          className={`glass-card p-6 sm:p-8 md:p-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              <img
                src="/jerry-kurian.jpeg"
                alt="Jerry Kurian — Founder & Chief Mentor, GenAI People"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover"
              />
            </div>

            {/* Bio */}
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-1">
                Jerry Kurian
              </h3>
              <p className="text-lg text-primary font-medium mb-4">
                Founder of GenAIPeople • Chief Mentor
              </p>

              <div className="space-y-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                <p>
                  We run a focused 6-month program that turns senior Java developers into engineers who ship 10x faster
                  using AI agents, copilots, and automation.
                </p>
                <p>
                  You don't start from zero. Your enterprise experience is the base. We layer on AI-powered workflows,
                  agent orchestration, and the speed techniques top engineers are using right now.
                </p>
              </div>

              {/* CTA + LinkedIn */}
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mt-6">
                <CTAButton size="default">Watch Video, Then Book a Call</CTAButton>
                <a
                  href="https://www.linkedin.com/in/jerryk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
