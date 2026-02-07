import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
  variant?: "primary" | "sticky";
}

export function CTAButton({ children, className, size = "default", variant = "primary" }: CTAButtonProps) {
  const sizeClasses = {
    small: "px-4 py-2.5 text-sm",
    default: "px-6 py-3.5 text-base",
    large: "px-8 py-4 text-lg",
  };

  return (
    <a
      href="#watch-roadmap"
      className={cn(
        "inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "animate-pulse-glow hover:scale-105",
        sizeClasses[size],
        variant === "sticky" && "animate-none shadow-lg",
        className
      )}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}
