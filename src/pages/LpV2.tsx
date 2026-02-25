import { useEffect } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Footer } from "@/components/sections/Footer";
import { StickyDesktopHeader } from "@/components/sections/StickyDesktopHeader";
import { StickyMobileBar } from "@/components/sections/StickyMobileBar";
import { trackEvent } from "@/lib/analytics";
import { useFormModal } from "@/contexts/FormModalContext";

const LpV2 = () => {
  const { setFormHeader } = useFormModal();

  useEffect(() => {
    trackEvent("page_view_lp_v2", { page_path: window.location.pathname });
    setFormHeader({
      title: "Get Instant Access",
      subtitle: "Enter your info and the 28-min training plays immediately",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <TestimonialsSection />
      <FinalCTASection showGuarantee={false} />
      <Footer />
      <StickyDesktopHeader />
      <StickyMobileBar />
    </div>
  );
};

export default LpV2;
