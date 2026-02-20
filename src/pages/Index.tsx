import { useEffect } from "react";
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
      <HeroSection />
      <ProblemSection />
      <EmpathySection />
      <TransformationSection />
      <RolesSection />
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
