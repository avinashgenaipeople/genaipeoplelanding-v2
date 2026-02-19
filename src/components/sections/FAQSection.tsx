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
    question: "How much does the program cost?",
    answer:
      "We don't publish pricing on this page because the program is personalised based on your experience and target role. After you watch the free training, you can book a 1:1 call with Jerry to get the full details and see if it's the right fit for you.",
  },
  {
    question: "Will Jerry personally mentor me, or is it the team?",
    answer:
      "Jerry is available to speak with you on your questions 4–5 times a week — not just at onboarding or key milestones, but throughout the program. Alongside that, every developer gets a personalised Accountability Partner who checks in regularly to keep you on track. Between Jerry's direct access and your Accountability Partner, you have all the hand-holding needed to make this transition.",
  },
  {
    question: "I already use GitHub Copilot at work. Is this still relevant?",
    answer:
      "Yes — and that's actually the starting point, not the destination. Most developers use Copilot for code completion. This program takes you to the next level: designing AI-powered systems, orchestrating AI agents, and positioning yourself as the person who leads those initiatives.",
  },
  {
    question: "I don't know Python — can I still do this?",
    answer:
      "Absolutely. The program is designed for Java developers. You'll learn to leverage AI tools and frameworks using your existing Java and JVM expertise. Python knowledge is not a prerequisite.",
  },
  {
    question: "How much time do I need to invest daily?",
    answer:
      "The program is 6 months long, but developers who dedicate 2–3 hours a day typically see results within 120 days. The curriculum is designed for working professionals — recorded sessions you can watch at your own pace, plus regular mentorship calls that fit around your job.",
  },
  {
    question: "Is this relevant if I have 15+ years of experience?",
    answer:
      "That's actually the sweet spot. The more enterprise experience you have, the faster you can transition. Senior developers already understand system design, architecture trade-offs, and production concerns — those skills directly transfer to AI Architect roles.",
  },
  {
    question: "What happens after the 6 months?",
    answer:
      "By the end of the program, you'll have a working portfolio of AI projects, a positioned LinkedIn profile, and the technical fluency to interview confidently for AI Architect roles. Most developers who put in 2–3 hours a day hit this milestone well before the 6 months are up. For those who want continued support after the program, extended mentorship options are available.",
  },
  {
    question: "What if I don't get the results I came for?",
    answer:
      "We don't walk away at the end of the 6 months if you haven't hit your goal. If you've done the work and aren't where you want to be, we keep working with you — at no extra cost — until you get there. We're invested in your outcome, not just your enrolment.",
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
          <CTAButton size="default" section="faq">Watch the Free Training (28 min)</CTAButton>
        </div>
      </div>
    </section>
  );
}
