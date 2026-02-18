import { CTAButton } from "@/components/ui/cta-button";
import { Play } from "lucide-react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";

export function HeroSection() {
  const { openFormModal } = useFormModal();

  return (
    <>
      {/* Sumo bar */}
      <div className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center">
        <p className="text-sm sm:text-base font-semibold">
          Free Video: How Senior Java Devs Land 30–70L AI Architect Roles in 120 Days
        </p>
      </div>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">

          <div className="text-center">
            <h1 className="mt-7 font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
            Senior Java Developers Are Landing{" "}
            <span className="text-primary">AI Architect Roles Paying 30–70L</span>{" "}
            in 120 Days
          </h1>

          <div className="mt-8 glass-card max-w-4xl mx-auto overflow-hidden">
            <button
              type="button"
              onClick={() => {
                trackEvent("cta_click", {
                  cta_label: "hero_video_thumbnail",
                  cta_section: "hero_video",
                  page_path: window.location.pathname,
                });
                trackEvent("cta_click_hero_video", {
                  cta_label: "hero_video_thumbnail",
                  page_path: window.location.pathname,
                });
                openFormModal();
              }}
              className="group relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-r from-amber-100 via-fuchsia-100 to-violet-300 text-left cursor-pointer"
              aria-label="Open free training popup"
            >

              {/* Desktop thumbnail */}
              <div className="hidden sm:block absolute inset-0">
                <div className="absolute inset-y-0 left-0 w-[62%] px-8 md:px-10 py-8 flex items-end">
                  <div>
                    <p className="font-display text-3xl md:text-4xl font-extrabold text-purple-900/90 leading-snug drop-shadow-sm">Land AI Architect Roles</p>
                    <p className="font-display text-3xl md:text-4xl font-extrabold text-purple-900/90 leading-snug drop-shadow-sm">Paying 30–70L+</p>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 w-[38%] rounded-tl-3xl overflow-hidden bg-white/30">
                  <img
                    src="/jerry-kurian.jpeg"
                    alt="Jerry Kurian — Founder &amp; Chief Mentor"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Mobile thumbnail */}
              <div className="sm:hidden absolute inset-0">
                <img
                  src="/jerry-kurian.jpeg"
                  alt="Jerry Kurian presenting the AI roadmap"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute left-4 right-4 bottom-6">
                  <p className="font-display text-2xl font-extrabold text-white leading-snug drop-shadow-md">Land AI Architect Roles</p>
                  <p className="font-display text-2xl font-extrabold text-white leading-snug drop-shadow-md">Paying 30–70L+</p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

              {/* Wistia-style play button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg group-hover:bg-primary/90 group-hover:scale-105 transition-all">
                  <Play className="w-9 h-9 sm:w-10 sm:h-10 text-white fill-white ml-0.5" />
                </div>
              </div>
            </button>
          </div>

          <p className="mt-9 text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            150+ senior Java developers are already using this system to ship faster, get noticed by AI teams, and land roles paying up to 2–3x their current salary.
          </p>

          <div className="mt-9">
            <CTAButton size="default" section="hero">Watch the Free Training (28 min)</CTAButton>
            <p className="mt-3 text-sm text-muted-foreground/70">Free training. No credit card. No strings.</p>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
