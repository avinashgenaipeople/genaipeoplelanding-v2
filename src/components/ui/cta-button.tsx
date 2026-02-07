import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/contexts/FormModalContext";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
  variant?: "primary" | "sticky";
}

export function CTAButton({ children, className, size = "default", variant = "primary" }: CTAButtonProps) {
  const { openFormModal } = useFormModal();

  const sizeClasses = {
    small: "px-5 py-3 text-base",
    default: "px-7 py-4 text-lg",
    large: "px-10 py-5 text-xl",
  };

  return (
    <button
      type="button"
      onClick={openFormModal}
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
  );
}
