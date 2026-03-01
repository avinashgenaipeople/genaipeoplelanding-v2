import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toISTDateString(date: Date): string {
  const istTime = new Date(date.getTime() + IST_OFFSET_MS);
  const y = istTime.getUTCFullYear();
  const m = String(istTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(istTime.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayIST(): string {
  return toISTDateString(new Date());
}

function istDayStartUTC(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - IST_OFFSET_MS).toISOString();
}

function utcToISTDate(utcTimestamp: string): string {
  return toISTDateString(new Date(utcTimestamp));
}

function subtractDaysIST(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  const ry = dt.getUTCFullYear();
  const rm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const rd = String(dt.getUTCDate()).padStart(2, "0");
  return `${ry}-${rm}-${rd}`;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, days = 30, filters = {} } = req.body ?? {};
  const {
    page: filterPage, source: filterSource, medium: filterMedium, campaign: filterCampaign,
    adname: filterAdname, adid: filterAdid, placement: filterPlacement, ad_account: filterAdAccount, utm_id: filterUtmId,
  } = filters as {
    page?: string; source?: string; medium?: string; campaign?: string;
    adname?: string; adid?: string; placement?: string; ad_account?: string; utm_id?: string;
  };

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const numDays = Number(days) || 30;
  const sinceUTC = istDayStartUTC(subtractDaysIST(todayIST(), numDays - 1));

  const { data: events, error } = await supabase
    .from("analytics_events")
    .select("event_name, page_path, cta_section, cta_label, utm_source, utm_medium, utm_campaign, url_params, created_at")
    .gte("created_at", sinceUTC)
    .order("created_at", { ascending: false })
    .limit(50_000);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // --- Aggregate server-side to keep the response small ---

  type Row = (typeof events)[number];

  // 1. Funnel by page
  const funnelMap = new Map<string, { views: number; clicks: number; opens: number; submits: number }>();
  const ensure = (p: string) => {
    if (!funnelMap.has(p)) funnelMap.set(p, { views: 0, clicks: 0, opens: 0, submits: 0 });
    return funnelMap.get(p)!;
  };

  // 2. UTM source table
  const utmMap = new Map<string, { views: number; clicks: number; opens: number; submits: number }>();
  const ensureUtm = (s: string) => {
    if (!utmMap.has(s)) utmMap.set(s, { views: 0, clicks: 0, opens: 0, submits: 0 });
    return utmMap.get(s)!;
  };

  // 3. Daily trend
  const dailyMap = new Map<string, { views: number; clicks: number; opens: number; submits: number }>();
  const ensureDay = (d: string) => {
    if (!dailyMap.has(d)) dailyMap.set(d, { views: 0, clicks: 0, opens: 0, submits: 0 });
    return dailyMap.get(d)!;
  };

  // 4. By medium (adset ID) — for cost-per-submit calculation
  const mediumMap = new Map<string, { views: number; clicks: number; opens: number; submits: number }>();
  const ensureMedium = (m: string) => {
    if (!mediumMap.has(m)) mediumMap.set(m, { views: 0, clicks: 0, opens: 0, submits: 0 });
    return mediumMap.get(m)!;
  };

  // Collect distinct values for filter dropdowns
  const pageSet = new Set<string>();
  const sourceSet = new Set<string>();
  const mediumSet = new Set<string>();
  const campaignSet = new Set<string>();
  const adnameSet = new Set<string>();
  const adidSet = new Set<string>();
  const placementSet = new Set<string>();
  const adAccountSet = new Set<string>();
  const utmIdSet = new Set<string>();

  // Summary totals
  let totalViews = 0;
  let totalClicks = 0;
  let totalOpens = 0;
  let totalSubmits = 0;

  for (const row of events as Row[]) {
    const page = row.page_path || "(unknown)";
    const source = row.utm_source || "(direct)";
    const medium = row.utm_medium || "(none)";
    const campaign = row.utm_campaign || "(none)";

    // Extract Facebook ad params from url_params JSONB
    const up = (row.url_params && typeof row.url_params === "object" ? row.url_params : {}) as Record<string, string>;
    const adname = up.utm_adname || "(none)";
    const adid = up.utm_adid || "(none)";
    const placement = up.utm_placement || "(none)";
    const adAccount = up.utm_ad_account || "(none)";
    const utmId = up.utm_id || "(none)";

    // Collect all distinct values before filtering
    pageSet.add(page);
    sourceSet.add(source);
    mediumSet.add(medium);
    campaignSet.add(campaign);
    if (adname !== "(none)") adnameSet.add(adname);
    if (adid !== "(none)") adidSet.add(adid);
    if (placement !== "(none)") placementSet.add(placement);
    if (adAccount !== "(none)") adAccountSet.add(adAccount);
    if (utmId !== "(none)") utmIdSet.add(utmId);

    // Apply filters — skip rows that don't match active filters
    if (filterPage && page !== filterPage) continue;
    if (filterSource && source !== filterSource) continue;
    if (filterMedium && medium !== filterMedium) continue;
    if (filterCampaign && campaign !== filterCampaign) continue;
    if (filterAdname && adname !== filterAdname) continue;
    if (filterAdid && adid !== filterAdid) continue;
    if (filterPlacement && placement !== filterPlacement) continue;
    if (filterAdAccount && adAccount !== filterAdAccount) continue;
    if (filterUtmId && utmId !== filterUtmId) continue;

    // Convert date only for rows that pass filters (avoids expensive call on filtered-out rows)
    const day = utcToISTDate(row.created_at);

    const f = ensure(page);
    const u = ensureUtm(source);
    const d = ensureDay(day);
    const m = ensureMedium(medium);

    switch (row.event_name) {
      case "page_view_lander":
      case "page_view_lp_v2":
      case "page_view_lp_v3":
        f.views++;
        u.views++;
        d.views++;
        m.views++;
        totalViews++;
        break;
      case "cta_click":
        f.clicks++;
        u.clicks++;
        d.clicks++;
        m.clicks++;
        totalClicks++;
        break;
      case "lead_form_open":
        f.opens++;
        u.opens++;
        d.opens++;
        m.opens++;
        totalOpens++;
        break;
      case "lead_form_submit":
        f.submits++;
        u.submits++;
        d.submits++;
        m.submits++;
        totalSubmits++;
        break;
    }
  }

  // Convert maps to sorted arrays
  const funnel = [...funnelMap.entries()]
    .map(([page, v]) => ({ page, ...v }))
    .sort((a, b) => b.views - a.views);

  const utmSources = [...utmMap.entries()]
    .map(([source, v]) => ({ source, ...v }))
    .sort((a, b) => b.views - a.views);

  const daily = [...dailyMap.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byMedium = [...mediumMap.entries()]
    .map(([medium, v]) => ({ medium, ...v }))
    .sort((a, b) => b.views - a.views);

  return res.status(200).json({
    summary: {
      views: totalViews,
      clicks: totalClicks,
      opens: totalOpens,
      submits: totalSubmits,
    },
    funnel,
    utmSources,
    byMedium,
    daily,
    filterOptions: {
      pages: [...pageSet].sort(),
      sources: [...sourceSet].sort(),
      mediums: [...mediumSet].sort(),
      campaigns: [...campaignSet].sort(),
      adnames: [...adnameSet].sort(),
      adids: [...adidSet].sort(),
      placements: [...placementSet].sort(),
      adAccounts: [...adAccountSet].sort(),
      utmIds: [...utmIdSet].sort(),
    },
  });
}
