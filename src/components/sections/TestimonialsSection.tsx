import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote:
      "In my company, an AI team was formed and someone from management noticed my LinkedIn posts. I was invited to join the AI team and got a good salary hike — all thanks to the steps I took through this program.",
    name: "Punyakeerthi BL",
    detail: "Senior Software Engineer → Now on AI Team (with salary hike)",
  },
  {
    quote:
      "The GenAI Mentorship Program transformed my career — helping me move to a Senior Associate role at Standard Chartered. The structured curriculum, hands-on projects, and weekly mentor check-ins equipped me with real-world GenAI skills and accelerated my growth.",
    name: "Sureshkumar Mani",
    detail: "Senior Developer → Senior Associate at Standard Chartered",
  },
  {
    quote:
      "They don't just teach you step by step — they provide an end goal and guide you through the process. I feel very confident about achieving my goals. The structure, resources, and collaborative environment have built my confidence.",
    name: "Sunil Vijendra",
    detail: "Director of Engineering",
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container">
        <SectionLabel>Success Stories</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          They Made the Shift. So Can You.
        </h2>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-6 sm:p-8 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-base text-muted-foreground">
                  {testimonial.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <CTAButton size="large">Join 150+ Developers — Watch Free Roadmap</CTAButton>
        </div>
      </div>
    </section>
  );
}
