import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { Video } from "lucide-react";

const ZOOM_REGISTER_URL =
  "https://us06web.zoom.us/meeting/register/r8NyOJ5kSkOMvgKocIzVoQ";

const REDIRECT_DELAY = 4000; // ms before redirect

export default function WebinarMeeting() {
  const [step, setStep] = useState(0); // 0→logo, 1→text, 2→redirect msg

  useEffect(() => {
    // Fire pixel + analytics immediately
    window.fbq?.("track", "CompleteRegistration");
    trackEvent("webinar_meeting_view", { page_path: "/webinar/meeting" });

    // Animation sequence
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => {
      window.location.href = ZOOM_REGISTER_URL;
    }, REDIRECT_DELAY);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b5cff] flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center text-white max-w-lg">

        {/* Zoom logo + pulse ring */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          {/* Pulse rings */}
          <span className="absolute inset-0 rounded-full bg-white/10 animate-[ping_2s_ease-out_infinite]" />
          <span className="absolute inset-2 rounded-full bg-white/10 animate-[ping_2s_ease-out_0.4s_infinite]" />
          {/* Icon circle */}
          <div
            className="relative z-10 w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl transition-transform duration-700"
            style={{ transform: step >= 0 ? "scale(1)" : "scale(0)" }}
          >
            <Video className="w-14 h-14 text-[#0b5cff]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 transition-all duration-700"
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? "translateY(0)" : "translateY(20px)",
          }}
        >
          This webinar is hosted on Zoom
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/80 text-lg mb-10 transition-all duration-700 delay-200"
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Live Workshop with Jerry Kurian — March 21st, 10:45 AM IST
        </p>

        {/* Redirect message + loader */}
        <div
          className="transition-all duration-500"
          style={{ opacity: step >= 2 ? 1 : 0 }}
        >
          <p className="text-white/90 font-medium mb-4">
            Taking you to Zoom to register…
          </p>

          {/* Progress bar */}
          <div className="mx-auto w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all ease-linear"
              style={{
                width: step >= 2 ? "100%" : "0%",
                transitionDuration: `${REDIRECT_DELAY - 2000}ms`,
              }}
            />
          </div>

          <a
            href={ZOOM_REGISTER_URL}
            className="inline-block mt-6 text-white/60 text-sm underline underline-offset-2 hover:text-white transition-colors"
          >
            Click here if you're not redirected
          </a>
        </div>
      </div>
    </div>
  );
}
