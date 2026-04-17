import React, { useMemo, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

const FORM_BASE_URL = "https://share.synamate.com/widget/form/TW7vEwm553MbqKYmfMPP";

function buildFormUrl() {
  const params = window.location.search;
  if (!params) return FORM_BASE_URL;
  return `${FORM_BASE_URL}${params}`;
}

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  theme?: "default" | "amber";
}

export function FormModal({ open, onOpenChange, title = "Watch the Free Training", subtitle = "Get instant access to the 28-min roadmap", theme = "default" }: FormModalProps) {
  const formUrl = useMemo(() => buildFormUrl(), []);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(500);
  const submitFiredRef = React.useRef(false);
  const iframeLoadCountRef = React.useRef(0);

  // Reset on open (not close) — resetting on close triggers a state change
  // during Radix's exit animation which causes a React insertBefore crash.
  useEffect(() => {
    if (open) {
      setIframeReady(false);
      setIframeHeight(500);
      submitFiredRef.current = false;
      iframeLoadCountRef.current = 0;
    }
  }, [open]);

  const fireSubmitOnce = (method: string) => {
    if (submitFiredRef.current) return;
    submitFiredRef.current = true;

    trackEvent("lead_form_submit", {
      form_id: "TW7vEwm553MbqKYmfMPP",
      form_name: "LFMVP Optin -Improved",
      page_path: window.location.pathname,
      detection_method: method,
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        currency: "INR",
        value: 1,
      });
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: "LFMVP Optin -Improved",
      });
    }
  };

  // Listen for Synamate/GHL form submission via postMessage
  useEffect(() => {
    if (!open) return;

    const handleMessage = (event: MessageEvent) => {
      // Only trust messages from Synamate / GHL origins
      const origin = event.origin || "";
      const trustedOrigin =
        origin.includes("synamate.com") ||
        origin.includes("leadconnectorhq.com") ||
        origin.includes("gohighlevel.com") ||
        origin.includes("msgsndr.com");

      // Normalise: Synamate may send an object OR a JSON string
      let data = event.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { /* keep as string */ }
      }

      // Dev: log every postMessage to catch protocol changes
      if (import.meta.env.DEV) {
        console.log("[postMessage]", origin, data);
      }

      // Track Synamate's ["iframeLoaded"] messages — the iframe loads twice
      // on initial render (form + config reload). Show spinner until 2nd load.
      if (Array.isArray(data) && data[0] === "iframeLoaded") {
        iframeLoadCountRef.current += 1;
        if (iframeLoadCountRef.current >= 2) {
          setIframeReady(true);
        }
      }

      // Resize iframe if Synamate sends height via iFrameSizer protocol
      // Format: "[iFrameSizer]id:height:width:event"
      if (typeof event.data === "string" && event.data.startsWith("[iFrameSizer]")) {
        const parts = event.data.replace("[iFrameSizer]", "").split(":");
        const h = Number(parts[1]);
        if (h && h > 100) setIframeHeight(h);
      }
      // Also handle object-based height messages
      if (
        typeof data === "object" &&
        data !== null &&
        (data.type === "resize" || data.height)
      ) {
        const h = Number(data.height);
        if (h && h > 100) setIframeHeight(h);
      }

      // Only check submit signals from trusted origins
      if (!trustedOrigin) return;

      // GHL / Synamate known submit postMessage formats:
      // - ["set-sticky-contacts", ...] — contact saved after form submit
      // - ["formSubmitted", ...] / ["form-submitted", ...] — direct submit signal
      // - { type: "form:submit" | "form_submitted" } — object-based
      // - { event: "form_submit" } / { action: "submit" } — alternate object shapes
      // - plain string "form:submit" / "form_submitted" / "submit"
      const isSubmit =
        (Array.isArray(data) &&
          (data[0] === "set-sticky-contacts" ||
           data[0] === "formSubmitted" ||
           data[0] === "form-submitted" ||
           data[0] === "form_submitted")) ||
        (typeof data === "object" &&
          data !== null &&
          !Array.isArray(data) &&
          (data.type === "form:submit" ||
            data.type === "form_submitted" ||
            data.type === "formSubmitted" ||
            data.event === "form_submit" ||
            data.event === "formSubmitted" ||
            data.action === "submit")) ||
        (typeof data === "string" &&
          (data === "form:submit" || data === "form_submitted" || data === "formSubmitted" || data === "submit"));

      if (isSubmit) {
        fireSubmitOnce("postMessage");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`max-w-xl w-full p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col border-2 bg-white ${
          theme === "amber"
            ? "border-amber-400/30 shadow-[0_0_30px_rgba(251,191,36,0.2)]"
            : "border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        }`}>

          {/* Header — matches CTA language */}
          <div className={`px-6 py-5 shrink-0 ${
            theme === "amber"
              ? "bg-gradient-to-r from-amber-500 to-amber-400"
              : "bg-gradient-to-r from-primary to-primary/80"
          }`}>
            <DialogTitle className={`text-2xl font-bold text-center ${theme === "amber" ? "text-gray-900" : "text-white"}`}>
              {title}
            </DialogTitle>
            <p className={`text-base text-center mt-1 ${theme === "amber" ? "text-gray-900/70" : "text-white/90"}`}>
              {subtitle}
            </p>
          </div>

          {/* Iframe + loading spinner */}
          <div className="overflow-y-auto flex-1 relative overflow-x-hidden">
            {/* Spinner shown until Synamate sends 2nd iframeLoaded postMessage */}
            {!iframeReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Loading…</p>
              </div>
            )}
            <iframe
              src={formUrl}
              className="w-full border-none -mt-10"
              style={{ height: `${iframeHeight + 40}px`, transition: "height 0.2s ease" }}
              id="inline-TW7vEwm553MbqKYmfMPP"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="LFMVP Optin -Improved"
              data-height={iframeHeight}
              data-layout-iframe-id="inline-TW7vEwm553MbqKYmfMPP"
              data-form-id="TW7vEwm553MbqKYmfMPP"
              title="LFMVP Optin -Improved"
              onLoad={() => {
                // Fallback: if postMessage-based ready detection doesn't fire
                // (e.g. ad blockers), show form after 2s timeout on first load.
                setTimeout(() => setIframeReady(true), 2000);
              }}
            />
          </div>

          <div className="px-6 py-3 border-t border-border/60 text-center">
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Form not loading? Open it in a new tab.
            </a>
          </div>
        </DialogContent>
    </Dialog>
  );
}
