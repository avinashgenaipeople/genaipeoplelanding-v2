import { useEffect } from "react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";

export default function LpV4Short() {
  const { openFormModal, setFormHeader } = useFormModal();

  useEffect(() => {
    setFormHeader({
      title: "Get Instant Access",
      subtitle: "Enter your info and the 28-min training plays immediately",
    });
    trackEvent("page_view_lp_v4_short", { page_path: window.location.pathname });
  }, []);

  const handleCTA = () => {
    trackEvent("cta_click", { cta_label: "Get Instant Access", cta_section: "hero", page_path: window.location.pathname });
    openFormModal();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Backend Dev Under 30L? Here's the Fix."
        description="Backend Developers earning under 30 LPA: your skills are worth 30-70L in AI roles. Watch the free 28-min training to see how."
      />

      <div className="w-full py-4 text-center" style={{ backgroundColor: "#2563eb" }}>
        <span className="text-white font-bold text-base sm:text-lg tracking-wide">GenAI People</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <p className="text-sm sm:text-base font-bold tracking-wide uppercase mb-6" style={{ color: "#2563eb" }}>
            Backend Developer earning under 30 LPA?
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            Your Backend Skills Are Worth{" "}
            <span style={{ color: "#2563eb" }}>30–70L in AI.</span>{" "}
            You're Just Positioned Wrong.
          </h1>

          <p className="text-lg sm:text-xl font-semibold mb-6 leading-relaxed" style={{ color: "#2563eb" }}>
            Same architecture skills. Same system design thinking. Same 10+ years. Different positioning = 2–3X salary.
          </p>

          <p className="text-base sm:text-lg mb-10" style={{ color: "#555" }}>
            Watch the free 28-min training that shows how 150+ senior devs made this shift.
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
