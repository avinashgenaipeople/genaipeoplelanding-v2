import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://graph.facebook.com/v21.0";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, days = 30 } = req.body ?? {};

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = process.env.META_ACCESS_TOKEN;
  const accountIdsRaw = process.env.META_AD_ACCOUNT_IDS;

  if (!token || !accountIdsRaw) {
    return res.status(500).json({ error: "Meta credentials not configured" });
  }

  const accountIds = accountIdsRaw.split(",").map((id) => id.trim()).filter(Boolean);

  // Build date range matching the dashboard's "days" selector
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - Number(days));
  const sinceStr = since.toISOString().split("T")[0];
  const untilStr = now.toISOString().split("T")[0];
  const todayStr = untilStr;

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
    const accounts = await Promise.all(
      accountIds.map(async (actId) => {
        // 1. Account info (balance, lifetime spend)
        const info = await metaGet(actId, {
          fields: "name,currency,account_status,balance,amount_spent",
        });

        // 2. Today's spend
        const todayInsights = await metaGet(`${actId}/insights`, {
          fields: "spend,impressions,clicks,ctr,cpc,cpm",
          date_preset: "today",
        });

        // 3. Period spend (matching dashboard date range)
        const periodInsights = await metaGet(`${actId}/insights`, {
          fields: "spend,impressions,clicks,ctr,cpc,cpm",
          time_range: JSON.stringify({ since: sinceStr, until: untilStr }),
        });

        const todayData = todayInsights.data?.[0];
        const periodData = periodInsights.data?.[0];

        return {
          id: info.id,
          name: info.name,
          currency: info.currency,
          balance: info.balance ? (Number(info.balance) / 100).toFixed(2) : "0.00",
          amountSpent: info.amount_spent ? (Number(info.amount_spent) / 100).toFixed(2) : "0.00",
          todaySpend: todayData?.spend ?? "0.00",
          periodSpend: periodData?.spend ?? "0.00",
          periodImpressions: periodData?.impressions ?? "0",
          periodClicks: periodData?.clicks ?? "0",
        };
      })
    );

    return res.status(200).json({ accounts });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown Meta API error";
    return res.status(502).json({ error: message });
  }
}
