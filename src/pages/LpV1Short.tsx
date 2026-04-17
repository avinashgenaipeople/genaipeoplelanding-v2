import { useEffect } from "react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";

export default function LpV1Short() {
  const { openFormModal, setFormHeader } = useFormModal();

  useEffect(() => {
    setFormHeader({
      title: "Get Instant Access",
      subtitle: "Enter your info and the 28-min training plays immediately",
      theme: "amber",
    });
    trackEvent("page_view_lp_v1_short", { page_path: window.location.pathname });
  }, []);

  const handleCTA = () => {
    trackEvent("cta_click", { cta_label: "Get Instant Access", cta_section: "hero", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 20%, #1a1a2e 0%, #0a0a0a 50%)" }}>
      <PageMeta
        title="GenAI People | Free Training — Senior Java Dev → AI Engineer"
        description="How Senior Java Devs are landing 30-70L AI jobs without starting over. Get instant access to the 28-min free training."
      />

      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="max-w-2xl w-full">
          {/* Qualifier badge */}
          <div className="flex justify-center mb-10">
            <span className="inline-block px-5 py-2 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-400 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase">
              Senior Java Developers
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-center text-[1.75rem] sm:text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.2] mb-4">
            Land a <span className="text-amber-400">30–70L AI Role</span>
            <br className="hidden sm:block" /> in 6 Months
          </h1>
          <p className="text-center text-lg sm:text-2xl text-white/50 font-medium mb-10">
            Using the skills you already have.
          </p>

          {/* Value props — card style */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 sm:px-8 py-6 mb-10">
            <div className="space-y-4">
              {[
                "No starting over — your Java experience IS the foundation",
                "No certificates — companies want builders, not collectors",
                "No mass-applying — get noticed for what you already know",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-amber-400 text-lg mt-0.5">✓</span>
                  <p className="text-[15px] sm:text-[17px] text-white/70 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action line */}
          <p className="text-center text-sm sm:text-base text-white/45 mb-6">
            Watch the free 28-min training — enter your info to get instant access.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCTA}
              className="group inline-flex items-center gap-2.5 px-10 py-5 text-lg sm:text-xl font-bold rounded-full transition-all duration-300 text-gray-900"
              style={{
                background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                boxShadow: "0 0 30px rgba(251, 191, 36, 0.25), 0 4px 20px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 50px rgba(251, 191, 36, 0.45), 0 4px 24px rgba(0,0,0,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 30px rgba(251, 191, 36, 0.25), 0 4px 20px rgba(0,0,0,0.4)"; }}
            >
              Get Instant Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="mt-4 text-center text-xs sm:text-sm text-white/30">
            Free training. No credit card. No strings.
          </p>
        </div>
      </main>

      <footer className="py-4 px-4 text-center border-t border-white/5">
        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} GenAI People ·{" "}
          <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>{" · "}
          <Link to="/terms" className="hover:text-white/40 transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
