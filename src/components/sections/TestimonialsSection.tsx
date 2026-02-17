import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote: (
      <>
        I'm a corporate Java developer with 8 years experience. After this mentoring program, I landed a{" "}
        <strong className="text-foreground font-bold">24 LPA role</strong>. I was getting just{" "}
        <strong className="text-foreground font-bold">15</strong>. What an amazing transformation!
      </>
    ),
    name: "Pradeep M.",
    detail: "Pune, India",
  },
  {
    quote: (
      <>
        The GenAI Mentoring Program redirected my career. Moving from a Senior Java role to{" "}
        <strong className="text-foreground font-bold">AI Solutions Architect</strong>, the structured curriculum and 1-on-1 mentorship made all the difference.
      </>
    ),
    name: "Ravi Sharma",
    detail: "Bangalore, India",
  },
  {
    quote: (
      <>
        They told me &ldquo;just learn Python.&rdquo; That's terrible advice — they didn't tell me the real path. Jerry's program showed me how to use what I already knew. Got an AI architecture role in{" "}
        <strong className="text-foreground font-bold">4 months</strong>.
      </>
    ),
    name: "Rahul Narvekar",
    detail: "Mumbai, India",
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
                &ldquo;{testimonial.quote}&rdquo;
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
          <CTAButton size="large">Get Instant Access</CTAButton>
        </div>
      </div>
    </section>
  );
}
