import { useEffect } from "react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";

export default function LpV6Short() {
  const { openFormModal, setFormHeader } = useFormModal();

  useEffect(() => {
    setFormHeader({
      title: "Get Instant Access",
      subtitle: "Enter your info and the 28-min training plays immediately",
    });
    trackEvent("page_view_lp_v6_short", { page_path: window.location.pathname });
  }, []);

  const handleCTA = () => {
    trackEvent("cta_click", { cta_label: "Get Instant Access", cta_section: "hero", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Tech Leads: Stay Relevant in the AI Era"
        description="Tech Leads with 10+ years: AI is rewriting what leadership means. Learn how to lead AI-powered teams and stay indispensable."
      />

      <div className="w-full py-4 text-center" style={{ backgroundColor: "#2563eb" }}>
        <span className="text-white font-bold text-base sm:text-lg tracking-wide">GenAI People</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <p className="text-sm sm:text-base font-bold tracking-wide uppercase mb-6" style={{ color: "#2563eb" }}>
            Tech Leads with 10+ Years
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            AI Changed What "Leadership" Means.{" "}
            <span style={{ color: "#2563eb" }}>Have You?</span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold mb-8 leading-relaxed" style={{ color: "#2563eb" }}>
            Your team will use AI whether you lead the shift or not. The question is — will you be the one driving it?
          </p>

          <div className="text-left max-w-xl mx-auto mb-8 space-y-4">
            {[
              ["Lead AI-powered teams", " — not just manage developers who use Copilot"],
              ["10+ years of architecture and system thinking", " is exactly what AI teams need at the top"],
              ["28-min roadmap", " — 150+ senior devs used to go from Tech Lead to AI Leader"],
            ].map(([bold, rest], i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg mt-0.5" style={{ color: "#2563eb" }}>✓</span>
                <p className="text-base sm:text-lg" style={{ color: "#444" }}>
                  <span className="font-semibold" style={{ color: "#1a1a1a" }}>{bold}</span>{rest}
                </p>
              </div>
            ))}
          </div>

          <p className="text-base sm:text-lg mb-8" style={{ color: "#555" }}>
            Watch the free 28-min training — enter your info to get instant access.
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
