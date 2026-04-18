import { useEffect } from "react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";

export default function LpV7Short() {
  const { openFormModal, setFormHeader } = useFormModal();

  useEffect(() => {
    setFormHeader({
      title: "Get Instant Access",
      subtitle: "Enter your info and the 28-min training plays immediately",
      theme: "amber",
    });
    trackEvent("page_view_lp_v7_short", { page_path: window.location.pathname });
  }, []);

  const handleCTA = () => {
    trackEvent("cta_click", { cta_label: "Get Instant Access", cta_section: "hero", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0a0a0a 60%)" }}>
      <PageMeta
        title="GenAI People | Frontend Devs: AI Is Rewriting Your Role"
        description="Frontend developers with 10+ years: AI generates UI faster than you code it. Learn how to stay indispensable. Free 28-min training."
      />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl text-center">
          <p className="text-lg sm:text-base font-bold tracking-[0.2em] uppercase mb-8 text-amber-400/80">
            Frontend Devs with 10+ Years
          </p>

          <h1 className="font-display text-2xl sm:text-4xl md:text-[3.25rem] font-extrabold text-white leading-[1.15] mb-6">
            AI Generates UI in Seconds.{" "}
            <span className="text-amber-400">What's Your Edge Now?</span>
          </h1>

          <div className="w-16 h-0.5 bg-amber-400/40 mx-auto my-6" />

          <p className="text-lg sm:text-xl text-amber-200/90 font-medium mb-6 leading-relaxed">
            Pixels and components aren't your moat anymore. Product thinking is.
          </p>

          <div className="text-left max-w-xl mx-auto mb-8 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
              <p className="text-base sm:text-lg text-white/65">Learn how to <span className="text-white font-medium">move from building UIs to designing AI-powered experiences</span></p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
              <p className="text-base sm:text-lg text-white/65">Your 10+ years of <span className="text-white font-medium">user empathy and system thinking</span> is exactly what AI product teams need</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
              <p className="text-base sm:text-lg text-white/65">See the <span className="text-white font-medium">28-min roadmap</span> 150+ senior devs used to transition into AI roles — without starting over</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-white/45 mb-6">
            Watch the free 28-min training — enter your info to get instant access.
          </p>

          <button
            type="button"
            onClick={handleCTA}
            className="group inline-flex items-center gap-2.5 px-10 py-5 text-lg sm:text-xl font-bold rounded-full transition-all duration-300 text-gray-900"
            style={{
              background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
              boxShadow: "0 0 30px rgba(251, 191, 36, 0.3), 0 4px 20px rgba(0,0,0,0.4)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 50px rgba(251, 191, 36, 0.5), 0 4px 24px rgba(0,0,0,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 30px rgba(251, 191, 36, 0.3), 0 4px 20px rgba(0,0,0,0.4)"; }}
          >
            Get Instant Access
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-5 text-sm text-white/35">
            Free training. No credit card. No strings.
          </p>
        </div>
      </main>

      <footer className="py-4 px-4 text-center border-t border-white/5">
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} GenAI People ·{" "}
          <Link to="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>{" · "}
          <Link to="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
