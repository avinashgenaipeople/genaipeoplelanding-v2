import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://graph.facebook.com/v21.0";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, days } = req.body ?? {};

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
  const nowIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
  const untilStr = nowIST;

  // "This month" range for account-level cards (1st of current month in IST)
  const [istYear, istMonth] = nowIST.split("-");
  const monthSinceStr = `${istYear}-${istMonth}-01`;

  // Days-based range for adset spend (matches dashboard filter)
  const adsetSince = new Date(nowIST);
  adsetSince.setDate(adsetSince.getDate() - Number(days || 30));
  const adsetSinceStr = adsetSince.toISOString().split("T")[0];

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
        // 1. Account info + funding source (prepaid balance)
        const info = await metaGet(actId, {
          fields: "name,currency,account_status,balance,amount_spent,funding_source_details",
        });

        // 2. Today's spend
        const todayInsights = await metaGet(`${actId}/insights`, {
          fields: "spend,impressions,clicks,ctr,cpc,cpm",
          date_preset: "today",
        });

        // 3. This month's spend (1st of month → today)
        const monthInsights = await metaGet(`${actId}/insights`, {
          fields: "spend,impressions,clicks,ctr,cpc,cpm",
          time_range: JSON.stringify({ since: monthSinceStr, until: untilStr }),
        });

        const todayData = todayInsights.data?.[0];
        const monthData = monthInsights.data?.[0];

        // Extract funding source balance from display_string
        // Format: "Available balance (₹77,584.79 INR)"
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
          balance: fundingBalance,
          amountSpent: info.amount_spent ? (Number(info.amount_spent) / 100).toFixed(2) : "0.00",
          todaySpend: todayData?.spend ?? "0.00",
          monthSpend: monthData?.spend ?? "0.00",
          monthImpressions: monthData?.impressions ?? "0",
          monthClicks: monthData?.clicks ?? "0",
        };
      })
    );

    // Adset-level spend (across all accounts) for cost-per-submit
    const adsetResults = await Promise.all(
      accountIds.map(async (actId) => {
        const adsetInsights = await metaGet(`${actId}/insights`, {
          level: "adset",
          fields: "adset_id,adset_name,spend,impressions,clicks",
          time_range: JSON.stringify({ since: adsetSinceStr, until: untilStr }),
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
    );
    const adsets = adsetResults.flat().map((a) => ({
      adsetId: a.adset_id,
      adsetName: a.adset_name,
      spend: a.spend,
      impressions: a.impressions,
      clicks: a.clicks,
    }));

    return res.status(200).json({ accounts, adsets });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown Meta API error";
    return res.status(502).json({ error: message });
  }
}
