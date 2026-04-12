import { useEffect } from "react";
import { PageMeta } from "@/components/PageMeta";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { EmpathySection } from "@/components/sections/EmpathySection";
import { TransformationSection } from "@/components/sections/TransformationSection";
import { RolesSection } from "@/components/sections/RolesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { MentorSection } from "@/components/sections/MentorSection";
import { AnswerSection } from "@/components/sections/AnswerSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Footer } from "@/components/sections/Footer";
import { StickyDesktopHeader } from "@/components/sections/StickyDesktopHeader";
import { StickyMobileBar } from "@/components/sections/StickyMobileBar";
import { trackEvent } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    trackEvent("page_view_lander", { page_path: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="GenAI People | Java to GenAI Career Sprint for Senior Developers"
        description="Senior Java Developers: transition from Java to high-paying GenAI roles. 6-month career sprint with mentoring, real projects, and a personalised roadmap. 500+ developers already inside."
      />
      <HeroSection />
      <RolesSection />
      <ProblemSection />
      <EmpathySection />
      <TransformationSection />
      <MentorSection />
      <HowItWorksSection />
      <AnswerSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      <StickyDesktopHeader />
      <StickyMobileBar />
    </div>
  );
};

export default Index;
