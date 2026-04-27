import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import { LeadFormModal } from "@/components/LeadFormModal";

export default function LpV1Short() {
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    trackEvent("page_view_lp_v1_short", { page_path: window.location.pathname });
  }, []);

  const openForm = (source: string) => {
    trackEvent("cta_click", { cta_label: "Watch the Free Training", cta_section: source, page_path: window.location.pathname });
    trackEvent("lead_form_open", { page_path: window.location.pathname });
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Free Training — Senior Java Dev → AI Engineer"
        description="How Senior Java Devs are landing 30-70L AI jobs without starting over. Get instant access to the 28-min free training."
      />

      <div className="w-full py-3 text-center" style={{ backgroundColor: "#2563eb" }}>
        <span className="text-white font-bold text-sm sm:text-base tracking-wide">Software Professional Earning 15L+? This Free Training Is for You →</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            Senior Java Developers — "Learn Python. Get Certified. Start Over."{" "}
            <span style={{ color: "#2563eb" }}>That's the Worst Advice You'll Hear in 2026.</span>
          </h1>

          <p className="text-base sm:text-lg mb-6 leading-relaxed" style={{ color: "#444" }}>
            The developers landing 30–70L AI roles didn't start over. They repositioned. Architecture, system design, production thinking — AI teams need exactly what you already know.
          </p>

          <div className="text-left max-w-xl mx-auto mb-6 space-y-3">
            {[
              ["No new language required", " — your Java foundation IS the AI advantage"],
              ["Certificates impress HR", " — system thinking impresses hiring managers paying 50L+"],
              ["150+ devs proved it", " — same background, 2–3X salary jump"],
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
            onClick={() => openForm("video_thumbnail")}
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
            This 28-min training shows the exact repositioning playbook. Free. No strings.
          </p>

          <button
            type="button"
            onClick={() => openForm("cta_button")}
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

      <LeadFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        source="lp-v1-short"
      />
    </div>
  );
}
