import type { VercelRequest, VercelResponse } from "@vercel/node";
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

function subtractDaysIST(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  const ry = dt.getUTCFullYear();
  const rm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const rd = String(dt.getUTCDate()).padStart(2, "0");
  return `${ry}-${rm}-${rd}`;
}

const BASE_URL = "https://graph.facebook.com/v21.0";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, days = 30, specificDate } = req.body ?? {};

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = process.env.META_ACCESS_TOKEN;
  const accountIdsRaw = process.env.META_AD_ACCOUNT_IDS;

  if (!token || !accountIdsRaw) {
    return res.status(500).json({ error: "Meta credentials not configured" });
  }

  const accountIds = accountIdsRaw.split(",").map((id) => id.trim()).filter(Boolean);

  // All date calculations in IST (Asia/Kolkata)
  const nowIST = todayIST();
  const [istYear, istMonth] = nowIST.split("-");
  const monthSinceStr = `${istYear}-${istMonth}-01`;
  const numDays = Number(days) || 30;
  const adsetSinceStr = subtractDaysIST(nowIST, numDays - 1);

  async function metaGet(path: string, params: Record<string, string> = {}) {
    const url = new URL(`${BASE_URL}/${path}`);
    url.searchParams.set("access_token", token!);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const resp = await fetch(url.toString());
    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}));
      const msg = body?.error?.message || `Meta API ${resp.status}`;
      throw new Error(msg);
    }
    return resp.json();
  }

  try {
    // Determine date range for specific date query
    const eventDateSince = specificDate ? String(specificDate) : nowIST;
    const eventDateUntil = specificDate ? String(specificDate) : nowIST;

    // Fetch account-level data and adset-level data concurrently
    const [accountResults, adsetResults, adsetTodayResults, dailySpendResults, pixelEventResults] = await Promise.all([
      // Account-level: info + today + month (parallelized per account)
      Promise.all(
        accountIds.map(async (actId) => {
          const [info, todayInsights, monthInsights] = await Promise.all([
            metaGet(actId, {
              fields: "name,currency,account_status,balance,amount_spent,funding_source_details,timezone_name",
            }),
            metaGet(`${actId}/insights`, {
              fields: "spend,impressions,clicks,ctr,cpc,cpm",
              time_range: JSON.stringify({ since: nowIST, until: nowIST }),
            }),
            metaGet(`${actId}/insights`, {
              fields: "spend,impressions,clicks,ctr,cpc,cpm",
              time_range: JSON.stringify({ since: monthSinceStr, until: nowIST }),
            }),
          ]);

          const todayData = todayInsights.data?.[0];
          const monthData = monthInsights.data?.[0];

          // Extract funding source balance from display_string
          let fundingBalance = "0.00";
          const fsd = info.funding_source_details;
          if (fsd?.display_string) {
            const match = fsd.display_string.match(/[\d,]+\.\d{2}/);
            if (match) {
              fundingBalance = match[0].replace(/,/g, "");
            }
          }

          // Fallback: ad account balance (in cents) if no funding source
          if (fundingBalance === "0.00" && info.balance) {
            fundingBalance = (Number(info.balance) / 100).toFixed(2);
          }

          return {
            id: info.id,
            name: info.name,
            currency: info.currency,
            timezone: info.timezone_name,
            balance: fundingBalance,
            amountSpent: info.amount_spent ? (Number(info.amount_spent) / 100).toFixed(2) : "0.00",
            todaySpend: todayData?.spend ?? "0.00",
            monthSpend: monthData?.spend ?? "0.00",
            monthImpressions: monthData?.impressions ?? "0",
            monthClicks: monthData?.clicks ?? "0",
          };
        })
      ),
      // Adset-level spend for period (runs concurrently with account-level)
      Promise.all(
        accountIds.map(async (actId) => {
          const adsetInsights = await metaGet(`${actId}/insights`, {
            level: "adset",
            fields: "adset_id,adset_name,spend,impressions,clicks",
            time_range: JSON.stringify({ since: adsetSinceStr, until: nowIST }),
            limit: "100",
          });
          return (adsetInsights.data ?? []) as Array<{
            adset_id: string;
            adset_name: string;
            spend: string;
            impressions: string;
            clicks: string;
          }>;
        })
      ),
      // Adset-level today spend (runs concurrently)
      Promise.all(
        accountIds.map(async (actId) => {
          const adsetToday = await metaGet(`${actId}/insights`, {
            level: "adset",
            fields: "adset_id,spend",
            time_range: JSON.stringify({ since: nowIST, until: nowIST }),
            limit: "100",
          });
          return (adsetToday.data ?? []) as Array<{
            adset_id: string;
            spend: string;
          }>;
        })
      ),
      // Account-level daily spend breakdown (runs concurrently)
      Promise.all(
        accountIds.map(async (actId) => {
          const dailyInsights = await metaGet(`${actId}/insights`, {
            fields: "spend",
            time_range: JSON.stringify({ since: adsetSinceStr, until: nowIST }),
            time_increment: "1",
            limit: "500",
          });
          return (dailyInsights.data ?? []) as Array<{
            date_start: string;
            spend: string;
          }>;
        })
      ),
      // Pixel events for specific date (or today) — actions breakdown
      Promise.all(
        accountIds.map(async (actId) => {
          const actionsInsights = await metaGet(`${actId}/insights`, {
            fields: "spend,actions,action_values,cost_per_action_type",
            time_range: JSON.stringify({ since: eventDateSince, until: eventDateUntil }),
            limit: "1",
          });
          return {
            accountId: actId,
            data: actionsInsights.data?.[0] ?? null,
          };
        })
      ),
    ]);

    // Build today spend lookup by adset ID
    const todaySpendMap = new Map<string, string>();
    for (const row of adsetTodayResults.flat()) {
      todaySpendMap.set(row.adset_id, row.spend);
    }

    const adsets = adsetResults.flat().map((a) => ({
      adsetId: a.adset_id,
      adsetName: a.adset_name,
      spend: a.spend,
      todaySpend: todaySpendMap.get(a.adset_id) ?? "0.00",
      impressions: a.impressions,
      clicks: a.clicks,
    }));

    // Aggregate daily spend across all accounts
    const dailySpendMap = new Map<string, number>();
    for (const row of dailySpendResults.flat()) {
      const date = row.date_start; // YYYY-MM-DD
      dailySpendMap.set(date, (dailySpendMap.get(date) ?? 0) + Number(row.spend));
    }
    const dailySpend = [...dailySpendMap.entries()]
      .map(([date, spend]) => ({ date, spend: spend.toFixed(2) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Aggregate pixel events across accounts
    const pixelEvents: Record<string, { count: number; value: number; costPer: number }> = {};
    let eventDateSpend = 0;
    for (const result of pixelEventResults) {
      if (!result.data) continue;
      eventDateSpend += Number(result.data.spend ?? 0);
      const actions = result.data.actions as Array<{ action_type: string; value: string }> | undefined;
      const costPerActions = result.data.cost_per_action_type as Array<{ action_type: string; value: string }> | undefined;
      if (actions) {
        for (const action of actions) {
          if (!pixelEvents[action.action_type]) {
            pixelEvents[action.action_type] = { count: 0, value: 0, costPer: 0 };
          }
          pixelEvents[action.action_type].count += Number(action.value);
        }
      }
      if (costPerActions) {
        for (const cpa of costPerActions) {
          if (pixelEvents[cpa.action_type]) {
            pixelEvents[cpa.action_type].costPer = Number(cpa.value);
          }
        }
      }
    }

    return res.status(200).json({
      accounts: accountResults,
      adsets,
      dailySpend,
      pixelEvents,
      eventDateSpend,
      eventDate: eventDateSince,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown Meta API error";
    return res.status(502).json({ error: message });
  }
}
