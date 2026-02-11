import { CTAButton } from "@/components/ui/cta-button";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-hero-pattern px-4 pt-8 pb-20">
      <div className="container max-w-4xl text-center">
        {/* Eyebrow */}
        <span className="inline-block text-sm sm:text-base font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6 animate-fade-up">
          For Senior Java Developers Earning 15L+
        </span>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Go From Senior Java Developer to AI Architect in 120 Days
        </h1>

        {/* Subheadline */}
        <p className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-medium mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Your Java skills are the foundation. We'll help you build the rest.
        </p>

        {/* Body */}
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.3s" }}>
          AI Architects earn ₹40–60L+, and companies are hiring now. Watch our free 28-minute roadmap to see the exact path.
        </p>

        {/* CTA */}
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <CTAButton size="large">
            Watch the Free Roadmap Video
          </CTAButton>
        </div>

        {/* Below CTA */}
        <p className="text-lg text-muted-foreground/70 mt-6 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          28 Minute Exclusive Roadmap for Senior Java Developers
        </p>
      </div>
    </section>
  );
}
