import { useEffect, useState, useRef } from "react";
import { PageMeta } from "@/components/PageMeta";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";

const WISTIA_MEDIA_ID = "w1jyay48pm";
const APPLY_URL = "https://learning.genaipeople.com/apply-70";
const CTA_SHOW_AFTER_SECONDS = 120;

export default function TrainingVSL() {
  const [showStep2, setShowStep2] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const shownRef = useRef(false);

  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", { content_name: "GenAI Training VSL" });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }
    trackEvent("training_vsl_page_view", { page_path: window.location.pathname });

    const playerScript = document.createElement("script");
    playerScript.src = "https://fast.wistia.com/player.js";
    playerScript.async = true;
    document.head.appendChild(playerScript);

    const embedScript = document.createElement("script");
    embedScript.src = `https://fast.wistia.com/embed/${WISTIA_MEDIA_ID}.js`;
    embedScript.async = true;
    embedScript.type = "module";
    document.head.appendChild(embedScript);

    const pollId = setInterval(() => {
      const player = document.querySelector("wistia-player") as HTMLElement & { currentTime?: number } | null;
      if (player && typeof player.currentTime === "number") {
        setWatchedSeconds(Math.floor(player.currentTime));
        if (!shownRef.current && player.currentTime >= CTA_SHOW_AFTER_SECONDS) {
          shownRef.current = true;
          setShowStep2(true);
          trackEvent("training_vsl_calendar_unlocked", { seconds: player.currentTime, page_path: window.location.pathname });
        }
      }
    }, 1000);

    const handleTimeUpdate = () => {
      const player = document.querySelector("wistia-player") as HTMLElement & { currentTime?: number } | null;
      if (player && typeof player.currentTime === "number") {
        setWatchedSeconds(Math.floor(player.currentTime));
        if (!shownRef.current && player.currentTime >= CTA_SHOW_AFTER_SECONDS) {
          shownRef.current = true;
          setShowStep2(true);
          trackEvent("training_vsl_calendar_unlocked", { seconds: player.currentTime, page_path: window.location.pathname });
        }
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

  // Load Synamate embed script when calendar unlocks
  useEffect(() => {
    if (!showStep2) return;
    const script = document.createElement("script");
    script.src = "https://share.synamate.com/js/embed.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [showStep2]);

  const progressPercent = Math.min((watchedSeconds / CTA_SHOW_AFTER_SECONDS) * 100, 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>
      <PageMeta
        title="GenAI People | Watch Your AI Career Roadmap"
        description="Watch the 28-min training, then book your free strategy call."
      />

      {/* Minimal top bar */}
      <div className="py-3 px-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e8e4de" }}>
        <span className="font-bold text-sm tracking-wide" style={{ color: "#1a1a1a" }}>GenAI People</span>
        {!showStep2 && watchedSeconds > 0 && (
          <span className="text-xs font-medium" style={{ color: "#999" }}>
            Calendar unlocks in {Math.max(0, CTA_SHOW_AFTER_SECONDS - watchedSeconds)}s
          </span>
        )}
        {showStep2 && (
          <a href="#book" className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: "#2563eb" }}>
            Book Call ↓
          </a>
        )}
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">

        {/* Step 1 — Video */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: "#2563eb" }}>1</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#1a1a1a" }}>Watch Your AI Career Roadmap</h1>
              <p className="text-sm" style={{ color: "#888" }}>28-min training · 150+ devs used this to reposition</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
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

          {/* Progress bar to Step 2 */}
          {!showStep2 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: "#aaa" }}>
                  {watchedSeconds > 0 ? "Keep watching to unlock Step 2" : "Press play to begin"}
                </span>
                <span className="text-xs font-bold" style={{ color: progressPercent >= 100 ? "#2563eb" : "#ccc" }}>
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e8e4de" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: "#2563eb",
                    transition: "width 1s linear",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Calendar */}
        <div
          id="book"
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: showStep2 ? "#ffffff" : "#f0ede8",
            border: showStep2 ? "2px solid #2563eb" : "2px dashed #d1cdc6",
            boxShadow: showStep2 ? "0 8px 40px rgba(37,99,235,0.1)" : "none",
            transition: "all 0.5s ease",
          }}
        >
          <div className="p-5 sm:p-6" style={{ borderBottom: showStep2 ? "1px solid #eee" : "none" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: showStep2 ? "#2563eb" : "#ccc", transition: "background-color 0.5s" }}
              >
                2
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: showStep2 ? "#1a1a1a" : "#bbb" }}>
                  Book Your Free Strategy Call
                </h2>
                {showStep2 ? (
                  <p className="text-sm" style={{ color: "#888" }}>45-min 1-on-1 · personalised AI transition plan</p>
                ) : (
                  <p className="text-sm" style={{ color: "#ccc" }}>
                    Watch the video above to unlock booking
                  </p>
                )}
              </div>
            </div>
          </div>

          {showStep2 ? (
            <div className="w-full px-4 sm:px-6 pb-6">
              <iframe
                src="https://share.synamate.com/widget/booking/1vdsmi8pGKXjPm2WP8dA"
                className="w-full border-none"
                style={{ minHeight: 650, overflow: "hidden" }}
                scrolling="no"
                id="msgsndr-calendar"
                title="Book Your Strategy Call"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#e8e4de" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: "#bbb" }}>Calendar locked</p>
              <p className="text-sm max-w-xs" style={{ color: "#ccc" }}>
                Watch the training video above — the calendar unlocks automatically once you've seen the key part.
              </p>
            </div>
          )}
        </div>

        {/* Direct apply link — always visible */}
        <div className="text-center mt-6">
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("cta_click", { cta_label: "Skip to Apply", cta_section: "training_vsl", page_path: window.location.pathname });
              if (typeof window.fbq === "function") {
                window.fbq("track", "InitiateCheckout", { content_name: "Training VSL Skip Apply" });
              }
            }}
            className="text-sm font-medium underline"
            style={{ color: "#999" }}
          >
            Already watched? Skip to booking →
          </a>
        </div>
      </main>

      <footer className="py-6 px-4 text-center" style={{ borderTop: "1px solid #e8e4de" }}>
        <p className="text-xs" style={{ color: "#bbb" }}>
          Copyright © {new Date().getFullYear()} GenAI People. All Rights Reserved ·{" "}
          <Link to="/privacy" className="underline hover:opacity-70">Privacy Policy</Link>{" · "}
          <Link to="/terms" className="underline hover:opacity-70">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
