import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { EmpathySection } from "@/components/sections/EmpathySection";
import { AnswerSection } from "@/components/sections/AnswerSection";
import { TransformationSection } from "@/components/sections/TransformationSection";
import { RolesSection } from "@/components/sections/RolesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { MentorSection } from "@/components/sections/MentorSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { StickyMobileBar } from "@/components/sections/StickyMobileBar";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <EmpathySection />
      <TransformationSection />
      <RolesSection />
      <HowItWorksSection />
      <MentorSection />
      <AnswerSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
      <StickyMobileBar />
    </div>
  );
};

export default Index;
