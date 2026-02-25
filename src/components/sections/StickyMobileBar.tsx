import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";

export function StickyMobileBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { openFormModal } = useFormModal();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (100vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsVisible(scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-medium text-foreground">
          Free 28-min Roadmap
        </span>
        <button
          type="button"
          onClick={() => {
            trackEvent("cta_click", {
              cta_label: "Get Instant Access",
              cta_section: "sticky_mobile",
              page_path: window.location.pathname,
            });
            trackEvent("cta_click_sticky_mobile", {
              cta_label: "Get Instant Access",
              page_path: window.location.pathname,
            });
            openFormModal();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-base font-semibold rounded-full shadow-lg"
        >
          Get Instant Access
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
