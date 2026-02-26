import { supabase } from "./supabase";
import { getUtmParams } from "./utm";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  // Dev-mode console log so you can verify events before checking GA4
  if (import.meta.env.DEV) {
    console.log(`[GA] event: ${eventName}`, params);
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }

  // Fire-and-forget Supabase INSERT (no await, no blocking)
  if (supabase) {
    const utm = getUtmParams();
    supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        page_path: String(params.page_path ?? window.location.pathname),
        cta_section: params.cta_section ? String(params.cta_section) : null,
        cta_label: params.cta_label ? String(params.cta_label) : null,
        utm_source: utm.utm_source ?? null,
        utm_medium: utm.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? null,
        utm_term: utm.utm_term ?? null,
        utm_content: utm.utm_content ?? null,
      })
      .then(({ error }) => {
        if (error && import.meta.env.DEV) {
          console.warn("[Supabase] insert failed:", error.message);
        }
      });
  }
}
