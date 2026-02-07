import { CTAButton } from "@/components/ui/cta-button";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-hero-pattern px-4 py-20">
      <div className="container max-w-4xl text-center">
        {/* Eyebrow */}
        <p className="text-sm sm:text-base font-semibold uppercase tracking-widest text-primary mb-6 animate-fade-up">
          For Senior Java Developers Earning 20L+
        </p>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Worried AI Will Replace Your Java Career?
        </h1>

        {/* Subheadline */}
        <p className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-medium mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Architect the Agents, or Compete Against Them.
        </p>

        {/* Body */}
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.3s" }}>
          AI agents write 4% of all GitHub commits today. That number doubles every few months.
          You can compete against them — or become the person who architects them.
        </p>

        {/* CTA */}
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <CTAButton size="large">
            Watch the Free Roadmap Video
          </CTAButton>
        </div>

        {/* Below CTA */}
        <p className="text-lg text-muted-foreground/70 mt-6 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          No email required. Takes 28 minutes.
        </p>
      </div>
    </section>
  );
}
