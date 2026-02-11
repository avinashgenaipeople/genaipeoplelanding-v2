import { CTAButton } from "@/components/ui/cta-button";
import { Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4 mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 shadow-md" />
            <p className="font-display text-2xl font-semibold tracking-tight">GenAIPeople</p>
          </div>
          <CTAButton size="small" className="text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
            Watch FREE training video
          </CTAButton>
        </div>

        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 text-foreground/90 border border-rose-100 px-5 py-3 text-base sm:text-lg font-medium">
            <Sparkles className="w-4 h-4 text-primary" />
            Infosys + Cognition + Devin: Why this is your career turning point
          </p>

          <h1 className="mt-7 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
            Senior <span className="text-primary">Java Developers</span>, the era of pure coding is ending.
            <br />
            The next winners are those who can <span className="text-primary">lead AI agents</span>.
          </h1>

          <div className="mt-8 glass-card max-w-4xl mx-auto overflow-hidden">
            <div className="relative bg-gradient-to-r from-amber-100 via-fuchsia-100 to-violet-300 min-h-[260px] sm:min-h-[340px] flex items-end justify-between p-6 sm:p-8">
              <div className="text-left max-w-[58%]">
                <p className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-purple-900 leading-tight">
                  From Java
                </p>
                <p className="font-display text-3xl sm:text-5xl font-black text-purple-900 leading-tight">
                  to AI Architect
                </p>
                <p className="font-display text-3xl sm:text-5xl font-black text-purple-900 leading-tight">
                  in 6 Months
                </p>
              </div>

              <img
                src="/jerry-kurian.jpeg"
                alt="Jerry Kurian presenting the AI roadmap"
                className="absolute right-0 bottom-0 h-[94%] w-auto object-cover rounded-tl-3xl"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/95 flex items-center justify-center shadow-xl">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-9 text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            This is not just a threat, it's your biggest opportunity. Companies no longer want only coders, they want
            senior engineers who can manage, build, and lead AI-powered delivery.
          </p>

          <div className="mt-9">
            <CTAButton size="default">Watch the Free Video</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
