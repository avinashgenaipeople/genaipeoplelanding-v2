import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useRef, useEffect } from "react";

const testimonials = [
  {
    quote:
      "The GenAI Mentorship Program transformed my career — helping me move to a Senior Associate role at Standard Chartered. The structured curriculum, hands-on projects, weekly mentor check-ins, and support for personal branding equipped me with real-world GenAI skills, boosted my visibility, and accelerated my professional growth.",
    name: "Sureshkumar Mani",
    role: "Senior Developer",
  },
  {
    quote:
      "In my current company, an AI team was formed, and someone from management noticed my LinkedIn posts and contacted me. I was invited to join the AI team, got a good salary hike, and moved to work in AI — all thanks to the steps I took through this course. This course is mentor-driven. They show us the path, but we have to walk it ourselves.",
    name: "Punyakeerthi BL",
    role: "Senior Software Engineer",
  },
  {
    quote:
      "This mentorship has been truly impactful. Along with technical knowledge in generative AI and software engineering, I've gained valuable feedback on how to think about problems and systems from a senior perspective. It has helped me approach solutions more effectively, especially for interviews and real-world challenges.",
    name: "Jamil Ahmed",
    role: "Technical Lead",
  },
  {
    quote:
      "By the end of the program, I felt confident in leveraging GenAI to build applications and articulate its potential. This confidence led me to actively explore ways to integrate GenAI into my work and engage in discussions with industry professionals, opening up exciting career opportunities.",
    name: "Sunil Vijendra",
    role: "Director — Engineering",
  },
  {
    quote:
      "With Jerry's mentoring, I am able to enhance my abilities and align with current market demands. His guidance provides solutions for every developer striving to acquire new skills and adapt to the evolving tech landscape. His detail-oriented mentorship is truly impactful — it not only boosts confidence but also helps us identify the right approach to solving problems.",
    name: "Rakesh S. L.",
    role: "Experienced Java Developer",
  },
  {
    quote:
      "I have started my GPT Program along with Self development. I can track my progress each week and I feel real improvements. It's a complete career growth perspective where I can work in my IT field without any hassle. I am feeling confidence in my day to day activities. The real achievement for me is sharing my thoughts to others in a more confident manner.",
    name: "Venkatesh K",
    role: "Senior Software Engineer",
  },
  {
    quote:
      "One of the most significant aspects has been the clarity and confidence I've gained. The mentorship has helped me not just with technical skills but also with soft skills like communication, personal branding on LinkedIn, time management and career planning. I've learned how to approach challenges with a more strategic way.",
    name: "Santosh Jadhavar",
    role: "Java Developer",
  },
  {
    quote:
      "They don't just teach you step by step — instead, they provide an end goal, and you're encouraged to come up with a plan to reach it. They guide you through the process, making sure you're on the right track. The mentorship feels like a partnership rather than just teaching. I feel very confident about working together with Jerry to achieve my goals.",
    name: "Swapnil Vernekar",
    role: "DevOps & Deployment Specialist",
  },
  {
    quote:
      "I really appreciate the help and support from Sowmya, my accountability manager. She is very understanding and always accommodating, which makes the weekly check-ins feel easy and stress-free. She encourages me kindly and helps me stay on track without any pressure. Her support and reminders have really helped me stay consistent.",
    name: "Priyanka Prabhu",
    role: "Senior Staff Software Engineer",
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 360;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 24 : cardWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel>What Our Mentees Say</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Real Stories from Real Developers
            </h2>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-border bg-card hover:bg-card/80 disabled:opacity-30 transition-opacity"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-border bg-card hover:bg-card/80 disabled:opacity-30 transition-opacity"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable testimonial cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-6 sm:p-8 flex-shrink-0 w-[85vw] sm:w-[400px] snap-start transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${Math.min(index, 3) * 150}ms` }}
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
              <p className="text-base sm:text-lg text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4 mt-auto">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
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
