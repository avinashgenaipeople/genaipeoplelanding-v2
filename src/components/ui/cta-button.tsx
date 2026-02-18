import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
  variant?: "primary" | "sticky";
  showSubtext?: boolean;
  section?: string;
}

export function CTAButton({ children, className, size = "default", variant = "primary", showSubtext = true, section }: CTAButtonProps) {
  const { openFormModal } = useFormModal();
  const ctaLabel = typeof children === "string" ? children : "cta";

  const sizeClasses = {
    small: "px-5 py-3 text-base",
    default: "px-7 py-4 text-lg",
    large: "px-10 py-5 text-xl",
  };

  return (
    <div className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", {
            cta_label: ctaLabel,
            cta_variant: variant,
            cta_size: size,
            cta_section: section || "unknown",
            page_path: window.location.pathname,
          });
          if (section) {
            trackEvent(`cta_click_${section}`, {
              cta_label: ctaLabel,
              page_path: window.location.pathname,
            });
          }
          openFormModal();
        }}
        className={cn(
          "inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-300 cursor-pointer",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "animate-pulse-glow hover:scale-105",
          sizeClasses[size],
          variant === "sticky" && "animate-none shadow-lg",
          className
        )}
      >
        {children}
        <ArrowRight className="w-4 h-4" />
      </button>
      {showSubtext && (
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
          28 min Java to GenAI Architect Roadmap
        </p>
      )}
    </div>
  );
}
