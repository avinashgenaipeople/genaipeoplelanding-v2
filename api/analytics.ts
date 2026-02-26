import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, days = 30, filters = {} } = req.body ?? {};
  const { page: filterPage, source: filterSource, medium: filterMedium, campaign: filterCampaign } = filters as {
    page?: string;
    source?: string;
    medium?: string;
    campaign?: string;
  };

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const since = new Date();
  since.setDate(since.getDate() - Number(days));

  const { data: events, error } = await supabase
    .from("analytics_events")
    .select("event_name, page_path, cta_section, cta_label, utm_source, utm_medium, utm_campaign, url_params, created_at")
    .gte("created_at", since.toISOString())
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

  // Collect distinct values for filter dropdowns
  const pageSet = new Set<string>();
  const sourceSet = new Set<string>();
  const mediumSet = new Set<string>();
  const campaignSet = new Set<string>();

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
    const day = row.created_at.slice(0, 10); // YYYY-MM-DD

    // Collect all distinct values before filtering
    pageSet.add(page);
    sourceSet.add(source);
    mediumSet.add(medium);
    campaignSet.add(campaign);

    // Apply filters — skip rows that don't match active filters
    if (filterPage && page !== filterPage) continue;
    if (filterSource && source !== filterSource) continue;
    if (filterMedium && medium !== filterMedium) continue;
    if (filterCampaign && campaign !== filterCampaign) continue;

    const f = ensure(page);
    const u = ensureUtm(source);
    const d = ensureDay(day);

    switch (row.event_name) {
      case "page_view_lander":
      case "page_view_lp_v2":
        f.views++;
        u.views++;
        d.views++;
        totalViews++;
        break;
      case "cta_click":
        f.clicks++;
        u.clicks++;
        d.clicks++;
        totalClicks++;
        break;
      case "lead_form_open":
        f.opens++;
        u.opens++;
        d.opens++;
        totalOpens++;
        break;
      case "lead_form_submit":
        f.submits++;
        u.submits++;
        d.submits++;
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

  return res.status(200).json({
    summary: {
      views: totalViews,
      clicks: totalClicks,
      opens: totalOpens,
      submits: totalSubmits,
    },
    funnel,
    utmSources,
    daily,
    filterOptions: {
      pages: [...pageSet].sort(),
      sources: [...sourceSet].sort(),
      mediums: [...mediumSet].sort(),
      campaigns: [...campaignSet].sort(),
    },
  });
}
