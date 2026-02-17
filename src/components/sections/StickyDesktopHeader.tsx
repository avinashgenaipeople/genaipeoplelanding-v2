import { useEffect, useState } from "react";
import { CTAButton } from "@/components/ui/cta-button";

export function StickyDesktopHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsVisible(scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-card/95 backdrop-blur-lg border-b border-border px-6 py-3 flex items-center justify-between">
        <span className="font-display text-lg font-bold text-foreground">
          GenAI People
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Senior Java Dev → AI Architect in 120 Days
          </span>
          <CTAButton size="small">Get Instant Access</CTAButton>
        </div>
      </div>
    </div>
  );
}
