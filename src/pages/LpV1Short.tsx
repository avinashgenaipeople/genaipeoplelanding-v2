import { useEffect } from "react";
import { useFormModal } from "@/contexts/FormModalContext";
import { trackEvent } from "@/lib/analytics";
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Free Training — Senior Java Dev → AI Engineer"
        description="How Senior Java Devs are landing 30-70L AI jobs without starting over. Get instant access to the 28-min free training."
      />

      {/* Header bar */}
      <div className="w-full py-4 text-center" style={{ backgroundColor: "#2563eb" }}>
        <span className="text-white font-bold text-base sm:text-lg tracking-wide">GenAI People</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <p className="text-base sm:text-xl font-bold tracking-wide uppercase mb-6" style={{ color: "#2563eb" }}>
            Senior Java Developer? 10+ Years?
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            AI Handles the Code. Senior Java Devs Own the Thinking.{" "}
            <span style={{ color: "#2563eb" }}>That's Worth 30–70L.</span>
          </h1>

          <p className="text-base sm:text-lg mb-6 leading-relaxed" style={{ color: "#444" }}>
            In 2026, AI writes boilerplate faster than any human. But it can't architect systems, debug production at 2am, or decide what to build and why. That's 10 years of Java experience — and companies are paying 30–70L for it.
          </p>

          <div className="text-left max-w-xl mx-auto mb-6 space-y-3">
            {[
              ["Systems thinking + AI orchestration", " — the #1 skill combo companies pay premium for"],
              ["Your architecture and design patterns", " is the moat AI can't replace"],
              ["AI is a multiplier for senior devs", " — it makes good engineers 10X, not obsolete"],
            ].map(([bold, rest], i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg mt-0.5" style={{ color: "#2563eb" }}>✓</span>
                <p className="text-base sm:text-lg" style={{ color: "#444" }}>
                  <span className="font-semibold" style={{ color: "#1a1a1a" }}>{bold}</span>{rest}
                </p>
              </div>
            ))}
          </div>

          {/* Video thumbnail with play button */}
          <button
            type="button"
            onClick={handleCTA}
            className="group relative w-full max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden cursor-pointer"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
          >
            <img src="/video-thumbnail.webp" alt="Gen AI Roadmap for Senior Devs — Free 28-min Training" className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-16 h-12 sm:w-20 sm:h-14 group-hover:scale-110 transition-transform" viewBox="0 0 68 48">
                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000"/>
                <path d="M45 24L27 14v20" fill="white"/>
              </svg>
            </div>
          </button>

          <p className="text-base sm:text-lg mb-8" style={{ color: "#555" }}>
            This 28-min training shows exactly how 150+ senior devs repositioned from "Java developer" to "AI-era engineer" — without a single new certificate.
          </p>

          <button
            type="button"
            onClick={handleCTA}
            className="inline-flex items-center justify-center px-12 py-5 text-xl sm:text-2xl font-extrabold text-white rounded-xl transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#2563eb", minWidth: 280 }}
          >
            Watch the Free Training
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
