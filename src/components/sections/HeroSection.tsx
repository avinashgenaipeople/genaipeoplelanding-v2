import { CTAButton } from "@/components/ui/cta-button";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";

export function HeroSection() {
  const { openFormModal } = useFormModal();

  return (
    <>
      {/* Sumo bar */}
      <div className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center">
        <p className="text-sm sm:text-base font-semibold">
          Free Video: How Senior Java Devs Use Their Skills to Land 30–70L AI Jobs
        </p>
      </div>

      <section className="px-4 pt-6 pb-14 md:pt-8 md:pb-20 bg-background">
        <div className="container max-w-5xl">

          <div className="text-center">
            <h1 className="mt-7 font-display text-xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-5xl mx-auto">
            Senior Java Developers:{" "}
            <span className="text-primary">Use Your Java Skills to Land a High-Paying AI Job</span>
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
              className="group relative w-full aspect-[4/3] overflow-hidden bg-black text-left cursor-pointer"
              aria-label="Open free training popup"
            >

              {/* Thumbnail image */}
              <div className="absolute inset-0">
                <img
                  src="/hero-thumbnail.png"
                  alt="How to use your Java skills to land a high-paying AI job — Jerry Kurian"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

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
