import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { Video, ExternalLink, Calendar, Clock } from "lucide-react";

/* ── Zoom Registration Embed ────────────────────────────────── */
const ZOOM_REGISTER_URL =
  "https://us06web.zoom.us/meeting/register/r8NyOJ5kSkOMvgKocIzVoQ";

export default function WebinarMeeting() {
  /* Fire Facebook CompleteRegistration + page view on mount */
  useEffect(() => {
    window.fbq?.("track", "CompleteRegistration");
    trackEvent("webinar_meeting_view", {
      page_path: "/webinar/meeting",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header bar */}
      <header className="w-full bg-primary text-primary-foreground py-3 px-4">
        <div className="container max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5" />
            <span className="font-semibold text-sm sm:text-base">
              GenAI People — Live Workshop with Jerry Kurian
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> March 21st
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 10:45 AM IST
            </span>
          </div>
        </div>
      </header>

      {/* Zoom embed area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl">
          {/* Embedded Zoom registration */}
          <div className="relative w-full rounded-xl overflow-hidden border border-border shadow-lg bg-white" style={{ minHeight: "600px" }}>
            <iframe
              src={ZOOM_REGISTER_URL}
              className="w-full h-full absolute inset-0"
              style={{ minHeight: "600px" }}
              allow="fullscreen; clipboard-write"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              title="Zoom Registration — GenAI People Workshop"
            />
          </div>

          {/* Fallback: direct registration link */}
          <div className="mt-4 text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              If the form doesn't load above, register directly:
            </p>
            <a
              href={ZOOM_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_label: "register_zoom_fallback",
                  cta_section: "meeting",
                  page_path: "/webinar/meeting",
                })
              }
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Register on Zoom
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center border-t border-border">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} GenAI People. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
