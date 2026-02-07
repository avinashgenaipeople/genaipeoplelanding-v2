import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-block text-sm md:text-base font-semibold uppercase tracking-widest text-primary mb-4",
        className
      )}
    >
      {children}
    </span>
  );
}
