import { useEffect } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Footer } from "@/components/sections/Footer";
import { StickyDesktopHeader } from "@/components/sections/StickyDesktopHeader";
import { StickyMobileBar } from "@/components/sections/StickyMobileBar";
import { trackEvent } from "@/lib/analytics";

const LpV2 = () => {
  useEffect(() => {
    trackEvent("page_view_lp_v2", { page_path: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
      <StickyDesktopHeader />
      <StickyMobileBar />
    </div>
  );
};

export default LpV2;
