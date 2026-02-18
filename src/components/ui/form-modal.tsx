import { useMemo, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

const FORM_BASE_URL = "https://share.synamate.com/widget/form/TW7vEwm553MbqKYmfMPP";
const SYNAMATE_ORIGIN = "https://share.synamate.com";

function buildFormUrl() {
  const params = window.location.search;
  if (!params) return FORM_BASE_URL;
  return `${FORM_BASE_URL}${params}`;
}

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormModal({ open, onOpenChange }: FormModalProps) {
  const formUrl = useMemo(() => buildFormUrl(), []);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Warm the Synamate connection as soon as this component mounts.
  // Using link hints only — no hidden iframe — so Radix Dialog's
  // focus restoration and scroll-lock cleanup are not affected.
  useEffect(() => {
    const hints: HTMLLinkElement[] = [];

    const addHint = (rel: string, href: string, as?: string) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (as) link.setAttribute("as", as);
      document.head.appendChild(link);
      hints.push(link);
    };

    addHint("preconnect", SYNAMATE_ORIGIN);
    addHint("dns-prefetch", SYNAMATE_ORIGIN);
    addHint("prefetch", FORM_BASE_URL, "document");

    return () => hints.forEach((l) => document.head.removeChild(l));
  }, []);

  // Reset loaded state when modal closes so spinner shows correctly on re-open
  useEffect(() => {
    if (!open) setIframeLoaded(false);
  }, [open]);

  // Listen for Synamate form submission via postMessage
  useEffect(() => {
    if (!open) return;

    const handleMessage = (event: MessageEvent) => {
      if (
        typeof event.data === "object" &&
        event.data !== null &&
        (event.data.type === "form:submit" ||
          event.data.type === "form_submitted" ||
          event.data.event === "form_submit" ||
          event.data.action === "submit")
      ) {
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl w-full p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col border-2 border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-white">

          {/* Header — Hormozi: lead with dream outcome */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 shrink-0">
            <DialogTitle className="text-xl font-bold text-center text-white">
              Your Free AI Architect Roadmap
            </DialogTitle>
            <p className="text-sm text-white/90 text-center mt-2">
              28 minutes. See exactly how senior Java devs land roles paying 30–70L — without starting over.
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
    </>
  );
}
