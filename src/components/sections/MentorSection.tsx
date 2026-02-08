import { SectionLabel } from "@/components/ui/section-label";
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
                Founder & Chief Mentor, GenAI People
              </p>

              <div className="space-y-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                <p>
                  20+ years in software development. Director of Engineering at an AI company — before ChatGPT even existed.
                </p>
                <p>
                  When ChatGPT dropped, Jerry saw what most missed: this wasn't just another tool. It was a turning point for every software developer's career. That's why he started GenAI People — to help experienced developers make the shift before the window closes.
                </p>
                <p className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                  He's not teaching theory. He's walked this path and now guides others through it.
                </p>
              </div>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/jerryk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
