import { useEffect } from "react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";

export default function LpV5Short() {
  const { openFormModal, setFormHeader } = useFormModal();

  useEffect(() => {
    setFormHeader({
      title: "Get Instant Access",
      subtitle: "Enter your info and the 28-min training plays immediately",
    });
    trackEvent("page_view_lp_v5_short", { page_path: window.location.pathname });
  }, []);

  const handleCTA = () => {
    trackEvent("cta_click", { cta_label: "Get Instant Access", cta_section: "hero", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Stuck in Maintenance? Your Skills Are Worth More in AI."
        description="Senior backend developers stuck in maintenance projects: your architecture and system design skills are worth 30-70L in AI roles."
      />

      <div className="w-full py-4 text-center" style={{ backgroundColor: "#2563eb" }}>
        <span className="text-white font-bold text-base sm:text-lg tracking-wide">GenAI People</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <p className="text-sm sm:text-base font-bold tracking-wide uppercase mb-6" style={{ color: "#2563eb" }}>
            Senior Backend Developer Stuck in Maintenance?
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            Stop Fixing Legacy Code.{" "}
            <span style={{ color: "#2563eb" }}>Start Building the Future.</span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold mb-6 leading-relaxed" style={{ color: "#2563eb" }}>
            Your architecture and system design skills are worth 30–70L in AI roles — not 15L patching someone else's monolith.
          </p>

          <p className="text-base sm:text-lg mb-10" style={{ color: "#555" }}>
            Watch the free 28-min training that shows how 150+ senior devs escaped maintenance and landed AI roles.
          </p>

          <button
            type="button"
            onClick={handleCTA}
            className="inline-flex items-center justify-center px-12 py-5 text-xl sm:text-2xl font-extrabold text-white rounded-xl transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#2563eb", minWidth: 280 }}
          >
            Get Instant Access
          </button>

          <p className="mt-5 text-sm" style={{ color: "#999" }}>
            Free training. No credit card. No strings.
          </p>
        </div>
      </main>

      <footer className="py-6 px-4 text-center">
        <p className="text-xs" style={{ color: "#aaa" }}>
          © {new Date().getFullYear()} GenAI People ·{" "}
          <Link to="/privacy" className="underline hover:opacity-70">Privacy</Link>{" · "}
          <Link to="/terms" className="underline hover:opacity-70">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
