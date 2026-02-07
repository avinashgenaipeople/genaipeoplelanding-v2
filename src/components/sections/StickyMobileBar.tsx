import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/contexts/FormModalContext";

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
        <span className="text-base font-medium text-foreground">
          Free 28-min Roadmap
        </span>
        <button
          type="button"
          onClick={openFormModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-lg"
        >
          Watch Now
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
