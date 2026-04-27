import { getUtmParams, getAllParams } from "./utm";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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

  // Raw fetch with keepalive: true so the insert survives page navigation.
  // The Supabase JS client uses regular fetch internally which gets aborted
  // when window.location changes — this ensures analytics events are never lost.
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const utm = getUtmParams();
    const urlParams = getAllParams();
    const { page_path: _p, cta_section: _s, cta_label: _l, ...extraParams } = params;
    const mergedParams = { ...urlParams, ...extraParams };
    fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        event_name: eventName,
        page_path: String(params.page_path ?? window.location.pathname),
        cta_section: params.cta_section ? String(params.cta_section) : null,
        cta_label: params.cta_label ? String(params.cta_label) : null,
        utm_source: utm.utm_source ?? null,
        utm_medium: utm.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? null,
        utm_term: utm.utm_term ?? null,
        utm_content: utm.utm_content ?? null,
        url_params: Object.keys(mergedParams).length > 0 ? mergedParams : {},
      }),
    }).catch(() => {});
  }
}
