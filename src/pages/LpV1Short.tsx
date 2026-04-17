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
    });
    trackEvent("page_view_lp_v1_short", { page_path: window.location.pathname });
  }, []);

  const handleCTA = () => {
    trackEvent("cta_click", { cta_label: "Get Instant Access", cta_section: "hero", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <PageMeta
        title="GenAI People | Free Training — Senior Java Dev → AI Engineer"
        description="How Senior Java Devs are landing 30-70L AI jobs without starting over. Get instant access to the 28-min free training."
      />

      {/* Main content — centered vertically */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl text-center">
          {/* Qualifier */}
          <p className="text-sm sm:text-base font-semibold text-white/60 tracking-wide mb-6">
            ***For Senior Java Developers ONLY***
          </p>

          {/* Headline */}
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            How Senior Java Devs Are Landing{" "}
            <span className="text-primary">30–70L AI Jobs</span>{" "}
            (And How You Can Copy Their Exact Playbook)*
          </h1>

          {/* Pain-point sub */}
          <p className="text-lg sm:text-xl text-primary font-semibold mb-8">
            Without starting over, collecting another certificate, or mass-applying to 100s of jobs
          </p>

          {/* Action line */}
          <p className="text-base sm:text-lg text-white/70 font-medium mb-8">
            Enter your info below and get instant access to the 28-min free training.
          </p>

          {/* CTA */}
          <button
            type="button"
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground text-lg sm:text-xl font-bold rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-200"
          >
            Get Instant Access
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="mt-4 text-sm text-white/40">
            Free training. No credit card. No strings.
          </p>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="py-4 px-4 text-center border-t border-white/5">
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} GenAI People ·{" "}
          <Link to="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>{" · "}
          <Link to="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
