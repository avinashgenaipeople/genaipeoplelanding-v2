import { SectionLabel } from "@/components/ui/section-label";
import { CTAButton } from "@/components/ui/cta-button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "I don't know Python — can I still do this?",
    answer:
      "Absolutely. The program is designed for Java developers. You'll learn to leverage AI tools and frameworks using your existing Java and JVM expertise. Python knowledge is not a prerequisite.",
  },
  {
    question: "How much time do I need to invest daily?",
    answer:
      "Most developers dedicate 1–2 hours per day alongside their current job. The curriculum is structured for working professionals, with recorded sessions you can watch at your own pace and weekend mentorship calls.",
  },
  {
    question: "Is this relevant if I have 15+ years of experience?",
    answer:
      "That's actually the sweet spot. The more enterprise experience you have, the faster you can transition. Senior developers already understand system design, architecture trade-offs, and production concerns — those skills directly transfer to AI Architect roles.",
  },
];

export function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 sm:py-10 px-4" ref={ref}>
      <div className="container max-w-3xl">
        <SectionLabel>Common Questions</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
          Frequently Asked Questions
        </h2>

        <div
          className={`glass-card p-6 sm:p-8 mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-lg sm:text-xl font-semibold text-foreground text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center">
          <CTAButton size="default">Watch the Free Video</CTAButton>
        </div>
      </div>
    </section>
  );
}
