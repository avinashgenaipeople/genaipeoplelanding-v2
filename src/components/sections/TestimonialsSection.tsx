import { SectionLabel } from "@/components/ui/section-label";
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote:
      "I was mass-applying to AI roles with zero callbacks. After 8 weeks, I understood exactly where my Java skills fit. Landed an AI Platform Engineer role — 28L CTC.",
    name: "Rahul S.",
    detail: "Ex-Senior Java Developer, 9 years experience",
  },
  {
    quote:
      "I thought I'd need to learn Python from scratch and get a master's. Turns out my Spring Boot + Kafka experience was exactly what AI teams needed.",
    name: "Priya M.",
    detail: "Now AI Backend Engineer at a Series B Startup",
  },
  {
    quote:
      "The 1-on-1 mentoring made all the difference. No generic advice — just a clear plan for my specific situation.",
    name: "Vikram K.",
    detail: "Now ML Platform Architect, 32L CTC",
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 sm:py-28 px-4" ref={ref}>
      <div className="container">
        <SectionLabel>Success Stories</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
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
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
