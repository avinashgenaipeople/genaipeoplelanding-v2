import { useEffect, useState, useRef } from "react";
import { PageMeta } from "@/components/PageMeta";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";

const WISTIA_MEDIA_ID = "w1jyay48pm";
const APPLY_URL = "https://learning.genaipeople.com/apply-70";
const REPORT_URL = "https://drive.google.com/file/d/1vtVjMzNepvfIfKXjrwSK6YG1xZsItKk1/view?usp=sharing";
const CTA_SHOW_AFTER_SECONDS = 120;

export default function Training() {
  const [showApply, setShowApply] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    // Fire Lead pixel — ONLY place Lead fires in the entire funnel
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", { content_name: "GenAI Training Page" });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }
    trackEvent("training_page_view", { page_path: window.location.pathname });

    // Load Wistia scripts
    const playerScript = document.createElement("script");
    playerScript.src = "https://fast.wistia.com/player.js";
    playerScript.async = true;
    document.head.appendChild(playerScript);

    const embedScript = document.createElement("script");
    embedScript.src = `https://fast.wistia.com/embed/${WISTIA_MEDIA_ID}.js`;
    embedScript.async = true;
    embedScript.type = "module";
    document.head.appendChild(embedScript);

    // Poll wistia-player currentTime to detect 120s mark
    const pollId = setInterval(() => {
      if (shownRef.current) { clearInterval(pollId); return; }
      const player = document.querySelector("wistia-player") as HTMLElement & { currentTime?: number } | null;
      if (player && typeof player.currentTime === "number" && player.currentTime >= CTA_SHOW_AFTER_SECONDS) {
        shownRef.current = true;
        setShowApply(true);
        trackEvent("training_cta_unlocked", { seconds: player.currentTime, page_path: window.location.pathname });
        clearInterval(pollId);
      }
    }, 1000);

    // Also listen for time-update event (new Wistia web component)
    const handleTimeUpdate = () => {
      if (shownRef.current) return;
      const player = document.querySelector("wistia-player") as HTMLElement & { currentTime?: number } | null;
      if (player && typeof player.currentTime === "number" && player.currentTime >= CTA_SHOW_AFTER_SECONDS) {
        shownRef.current = true;
        setShowApply(true);
        trackEvent("training_cta_unlocked", { seconds: player.currentTime, page_path: window.location.pathname });
      }
    };

    const attachId = setInterval(() => {
      const player = document.querySelector("wistia-player");
      if (player) { player.addEventListener("time-update", handleTimeUpdate); clearInterval(attachId); }
    }, 500);

    return () => {
      clearInterval(pollId);
      clearInterval(attachId);
      const player = document.querySelector("wistia-player");
      if (player) player.removeEventListener("time-update", handleTimeUpdate);
      document.head.removeChild(playerScript);
      document.head.removeChild(embedScript);
    };
  }, []);

  const handleApply = () => {
    trackEvent("cta_click", { cta_label: "Apply Now", cta_section: "training_page", page_path: window.location.pathname });
    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", { content_name: "Training Page Apply" });
    }
    window.location.href = APPLY_URL;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | How to Get Into Generative AI?"
        description="Watch the 28-min roadmap video. See how 150+ senior devs transitioned into 30-70L AI roles."
      />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-center text-2xl sm:text-4xl font-extrabold mb-6" style={{ color: "#1a1a1a" }}>
            How to Get Into <span style={{ color: "#2563eb" }}>Generative AI</span>?
          </h1>

          {/* Video */}
          <div className="w-full rounded-2xl overflow-hidden mb-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <style>{`
              wistia-player[media-id='${WISTIA_MEDIA_ID}']:not(:defined) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${WISTIA_MEDIA_ID}/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 56.25%;
              }
            `}</style>
            <div dangerouslySetInnerHTML={{
              __html: `<wistia-player media-id="${WISTIA_MEDIA_ID}" aspect="1.7777777777777777"></wistia-player>`
            }} />
          </div>

          {/* Apply CTA — appears after 120s */}
          {showApply && (
            <div className="text-center rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(37,99,235,0.12)", border: "2px solid #2563eb" }}>
              <p className="text-lg sm:text-xl font-bold mb-4" style={{ color: "#1a1a1a" }}>
                Ready? Apply now and get your personalised AI transition plan.
              </p>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center justify-center px-10 py-4 text-lg sm:text-xl font-extrabold text-white rounded-xl transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#2563eb" }}
              >
                Apply Now →
              </button>
              <p className="mt-3 text-xs" style={{ color: "#999" }}>
                Limited spots. No obligation. Takes 30 seconds.
              </p>
              <a
                href={REPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_click", { cta_label: "Download Career Report", cta_section: "training_page", page_path: window.location.pathname })}
                className="inline-block mt-4 text-sm font-medium underline transition-colors hover:opacity-70"
                style={{ color: "#2563eb" }}
              >
                Download Career Report (PDF)
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 px-4 text-center">
        <p className="text-xs" style={{ color: "#aaa" }}>
          Copyright © {new Date().getFullYear()} GenAI People. All Rights Reserved ·{" "}
          <Link to="/privacy" className="underline hover:opacity-70">Privacy Policy</Link>{" · "}
          <Link to="/terms" className="underline hover:opacity-70">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
