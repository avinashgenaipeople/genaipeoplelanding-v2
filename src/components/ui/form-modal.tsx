import { useMemo, useEffect, useState } from "react";
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
}

export function FormModal({ open, onOpenChange, title = "Watch the Free Training", subtitle = "Get instant access to the 28-min roadmap" }: FormModalProps) {
  const formUrl = useMemo(() => buildFormUrl(), []);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset on open (not close) — resetting on close triggers a state change
  // during Radix's exit animation which causes a React insertBefore crash.
  useEffect(() => {
    if (open) setIframeLoaded(false);
  }, [open]);

  // Listen for Synamate form submission via postMessage
  useEffect(() => {
    if (!open) return;

    const handleMessage = (event: MessageEvent) => {
      // Normalise: Synamate may send an object OR a JSON string
      let data = event.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { /* keep as string */ }
      }

      // Dev: log every postMessage from the form origin to catch format changes
      if (import.meta.env.DEV && event.origin.includes("synamate")) {
        console.log("[Synamate postMessage]", data);
      }

      const isSubmit =
        (typeof data === "object" &&
          data !== null &&
          (data.type === "form:submit" ||
            data.type === "form_submitted" ||
            data.event === "form_submit" ||
            data.action === "submit")) ||
        (typeof data === "string" &&
          (data === "form:submit" || data === "form_submitted" || data === "submit"));

      if (isSubmit) {
        trackEvent("lead_form_submit", {
          form_id: "TW7vEwm553MbqKYmfMPP",
          form_name: "LFMVP Optin -Improved",
          page_path: window.location.pathname,
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
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl w-full p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col border-2 border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-white">

          {/* Header — matches CTA language */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 shrink-0">
            <DialogTitle className="text-xl font-bold text-center text-white">
              {title}
            </DialogTitle>
            <p className="text-sm text-white/90 text-center mt-1">
              {subtitle}
            </p>
          </div>

          {/* Iframe + loading spinner */}
          <div className="overflow-y-auto flex-1 relative">
            {/* Spinner shown until iframe fires onLoad */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Loading your roadmap…</p>
              </div>
            )}
            <iframe
              src={formUrl}
              className="w-full border-none"
              style={{ height: "944px" }}
              id="inline-TW7vEwm553MbqKYmfMPP"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="LFMVP Optin -Improved"
              data-height="944"
              data-layout-iframe-id="inline-TW7vEwm553MbqKYmfMPP"
              data-form-id="TW7vEwm553MbqKYmfMPP"
              title="LFMVP Optin -Improved"
              onLoad={() => setIframeLoaded(true)}
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
