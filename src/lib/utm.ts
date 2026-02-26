const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * Capture UTM params from the current URL into sessionStorage.
 * Call once on app boot. Only overwrites if the URL actually has UTM params
 * (so subsequent in-app navigations don't wipe them).
 */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const found: UtmParams = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      found[key] = val;
      hasAny = true;
    }
  }

  if (hasAny) {
    sessionStorage.setItem("utm", JSON.stringify(found));
  }
}

/** Read whatever UTM params are stored for this session. */
export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("utm") || "{}");
  } catch {
    return {};
  }
}
