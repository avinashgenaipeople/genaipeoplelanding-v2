import { CTAButton } from "@/components/ui/cta-button";
import { Maximize, Play, Settings, Sparkles, Volume2 } from "lucide-react";
import { useFormModal } from "@/contexts/FormModalContext";

export function HeroSection() {
  const { openFormModal } = useFormModal();

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
            Video Training for Senior Developers earning at least 15 Lakhs Per Annum
          </p>

          <h1 className="mt-7 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
            Senior <span className="text-primary">Java Developers</span>, the era of pure coding is ending.
            <br />
            The next winners are those who can <span className="text-primary">lead AI agents</span>.
          </h1>

          <div className="mt-8 glass-card max-w-4xl mx-auto overflow-hidden">
            <button
              type="button"
              onClick={openFormModal}
              className="group relative w-full bg-gradient-to-r from-amber-100 via-fuchsia-100 to-violet-300 min-h-[260px] sm:min-h-[340px] flex items-end justify-between p-6 sm:p-8 text-left cursor-pointer"
              aria-label="Open free training popup"
            >
              <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-md bg-red-600 px-2.5 py-1 text-white text-xs font-bold tracking-wide shadow-md">
                <Play className="w-3 h-3 fill-white" />
                YouTube
              </div>

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

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25" />

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/95 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                </div>
              </div>

              <div className="absolute bottom-14 right-4 z-20 rounded bg-black/85 px-2 py-1 text-xs font-semibold text-white">
                28:12
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/85 px-4 py-3">
                <div className="h-1 w-full rounded-full bg-white/30">
                  <div className="h-1 w-[34%] rounded-full bg-red-600" />
                </div>
                <div className="mt-2 flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>0:34 / 28:12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <Settings className="w-4 h-4" />
                    <Maximize className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
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
