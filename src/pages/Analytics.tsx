import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Summary = { views: number; clicks: number; opens: number; submits: number };
type FunnelRow = { page: string; views: number; clicks: number; opens: number; submits: number };
type UtmRow = { source: string; views: number; clicks: number; opens: number; submits: number };
type DailyRow = { date: string; views: number; clicks: number; opens: number; submits: number };

type MetaAccount = {
  id: string;
  name: string;
  currency: string;
  balance: string;
  amountSpent: string;
  todaySpend: string;
  monthSpend: string;
  monthImpressions: string;
  monthClicks: string;
};

type MetaAdset = {
  adsetId: string;
  adsetName: string;
  spend: string;
  todaySpend: string;
  impressions: string;
  clicks: string;
};

type MetaDailySpend = { date: string; spend: string };

type MediumRow = { medium: string; views: number; clicks: number; opens: number; submits: number };

type FilterOptions = {
  pages: string[];
  sources: string[];
  mediums: string[];
  campaigns: string[];
  adnames: string[];
  adids: string[];
  placements: string[];
  adAccounts: string[];
  utmIds: string[];
};

type Filters = {
  page: string;
  source: string;
  medium: string;
  campaign: string;
  adname: string;
  adid: string;
  placement: string;
  ad_account: string;
  utm_id: string;
};

type QuizAnswers = Record<string, Record<string, number>>;

type AnalyticsData = {
  summary: Summary;
  funnel: FunnelRow[];
  utmSources: UtmRow[];
  byMedium: MediumRow[];
  daily: DailyRow[];
  quizAnswers: QuizAnswers;
  filterOptions: FilterOptions;
};

// Quiz questions + answer labels — mirrors LpV7.tsx for readable analytics display
const QUIZ_META: { id: number; question: string; options: { value: string; label: string }[] }[] = [
  { id: 1, question: "Are you currently working as a software developer?", options: [
    { value: "yes_fulltime", label: "Yes, full-time" },
    { value: "yes_looking", label: "Yes, but looking for a change" },
    { value: "no_laid_off", label: "No, I was recently laid off" },
    { value: "no_different", label: "No, I'm in a different role" },
  ]},
  { id: 2, question: "Years of professional development experience?", options: [
    { value: "lt_3", label: "Less than 3 years" },
    { value: "3_5", label: "3-5 years" },
    { value: "5_10", label: "5-10 years" },
    { value: "10_plus", label: "10+ years" },
  ]},
  { id: 3, question: "Primary programming language?", options: [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "js_ts", label: "JavaScript / TypeScript" },
    { value: "csharp", label: "C# / .NET" },
    { value: "other", label: "Other" },
  ]},
  { id: 4, question: "Have you used AI tools in daily work?", options: [
    { value: "yes_regularly", label: "Yes, regularly" },
    { value: "tried_few", label: "Tried a few times" },
    { value: "no", label: "No, not yet" },
  ]},
  { id: 5, question: "What concerns you most about AI's impact?", options: [
    { value: "automated", label: "Role could be automated" },
    { value: "falling_behind", label: "Falling behind devs using AI" },
    { value: "no_path", label: "Don't know how to transition" },
    { value: "want_growth", label: "Not concerned — want to grow" },
  ]},
  { id: 6, question: "How soon would you start an AI role?", options: [
    { value: "immediately", label: "Immediately" },
    { value: "1_3_months", label: "Within 1-3 months" },
    { value: "exploring", label: "Just exploring" },
  ]},
  { id: 7, question: "Open to a free strategy call?", options: [
    { value: "yes", label: "Yes, let's do it" },
    { value: "maybe", label: "Maybe — learn more first" },
  ]},
];

const DAYS_OPTIONS = [1, 7, 14, 30, 90] as const;

function pct(numerator: number, denominator: number) {
  if (denominator === 0) return "–";
  return ((numerator / denominator) * 100).toFixed(1) + "%";
}

export default function Analytics() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({ page: "", source: "", medium: "", campaign: "", adname: "", adid: "", placement: "", ad_account: "", utm_id: "" });

  // Meta Ads state
  const [metaData, setMetaData] = useState<MetaAccount[] | null>(null);
  const [metaAdsets, setMetaAdsets] = useState<MetaAdset[]>([]);
  const [metaDailySpend, setMetaDailySpend] = useState<MetaDailySpend[]>([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState("");

  // Refs for auto-refresh (to access latest values without re-creating interval)
  const passwordRef = useRef(password);
  const daysRef = useRef(days);
  const filtersRef = useRef(filters);
  passwordRef.current = password;
  daysRef.current = days;
  filtersRef.current = filters;

  const fetchMetaData = useCallback(async (pw?: string, d?: number) => {
    setMetaLoading(true);
    setMetaError("");
    try {
      const res = await fetch("/api/meta-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw ?? password, days: d ?? days }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setMetaData(json.accounts);
      setMetaAdsets(json.adsets ?? []);
      setMetaDailySpend(json.dailySpend ?? []);
    } catch (e: unknown) {
      setMetaError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setMetaLoading(false);
    }
  }, [password, days]);

  // Auto-refresh every 5 minutes when authenticated
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => {
      // Use refs for latest values
      fetchData(passwordRef.current, daysRef.current, filtersRef.current);
      fetchMetaData(passwordRef.current, daysRef.current);
    }, 300_000);
    return () => clearInterval(id);
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchData(pw?: string, d?: number, f?: Filters) {
    setLoading(true);
    setError("");
    const activeFilters = f ?? filters;
    // Only send non-empty filter values
    const filterPayload: Record<string, string> = {};
    for (const [k, v] of Object.entries(activeFilters)) {
      if (v) filterPayload[k] = v;
    }
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pw ?? password,
          days: d ?? days,
          ...(Object.keys(filterPayload).length > 0 ? { filters: filterPayload } : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json: AnalyticsData = await res.json();
      setData(json);
      setAuthed(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchData();
    fetchMetaData();
  }

  function changeDays(d: number) {
    setDays(d);
    fetchData(undefined, d, filters);
    fetchMetaData(undefined, d);
  }

  function changeFilter(key: keyof Filters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchData(undefined, undefined, next);
  }

  // --- Password gate ---
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4 text-gray-900">Analytics Dashboard</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-gray-900"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard ---
  const { summary, funnel, utmSources, byMedium, daily, quizAnswers = {} } = data!;

  // Build cost-per-submit by joining byMedium (submits) with metaAdsets (spend)
  const adsetSpendMap = new Map(metaAdsets.map((a) => [a.adsetId, a]));
  const costPerSubmit = (byMedium ?? [])
    .filter((m) => m.medium !== "(none)" && m.medium !== "(direct)")
    .map((m) => {
      const adset = adsetSpendMap.get(m.medium);
      const spend = adset ? Number(adset.spend) : 0;
      const todaySpend = adset ? Number(adset.todaySpend) : 0;
      const cps = m.submits > 0 && spend > 0 ? spend / m.submits : 0;
      return {
        medium: m.medium,
        adsetName: adset?.adsetName ?? "–",
        spend,
        todaySpend,
        views: m.views,
        submits: m.submits,
        costPerSubmit: cps,
      };
    })
    .filter((r) => r.spend > 0 || r.submits > 0)
    .sort((a, b) => b.spend - a.spend);

  // Build cost-per-submit by day: join daily submits with Meta daily spend
  const dailySpendMap = new Map(metaDailySpend.map((d) => [d.date, Number(d.spend)]));
  const costPerSubmitDaily = (daily ?? []).map((d) => {
    const spend = dailySpendMap.get(d.date) ?? 0;
    const cps = d.submits > 0 && spend > 0 ? spend / d.submits : 0;
    return { date: d.date, spend, submits: d.submits, views: d.views, costPerSubmit: cps };
  }).filter((d) => d.spend > 0 || d.submits > 0)
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-2">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => changeDays(d)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  days === d
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {d === 1 ? "Today" : `${d}d`}
              </button>
            ))}
            <button
              onClick={() => { fetchData(); fetchMetaData(); }}
              disabled={loading}
              className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <span className="text-xs text-gray-400 self-center">Auto-refreshes every 5 min</span>
          </div>
        </div>

        {/* Filter bar */}
        {data?.filterOptions && (
          <div className="flex flex-wrap gap-3 mb-6">
            {([
              ["page", "Page", data.filterOptions.pages],
              ["source", "Source", data.filterOptions.sources],
              ["medium", "Medium", data.filterOptions.mediums],
              ["campaign", "Campaign", data.filterOptions.campaigns],
              ["adname", "Ad Name", data.filterOptions.adnames ?? []],
              ["adid", "Ad ID", data.filterOptions.adids ?? []],
              ["placement", "Placement", data.filterOptions.placements ?? []],
              ["ad_account", "Ad Account", data.filterOptions.adAccounts ?? []],
              ["utm_id", "UTM ID", data.filterOptions.utmIds ?? []],
            ] as const).filter(([, , options]) => options.length > 0).map(([key, label, options]) => (
              <label key={key} className="flex items-center gap-1.5 text-sm text-gray-700">
                {label}
                <select
                  value={filters[key as keyof Filters]}
                  onChange={(e) => changeFilter(key as keyof Filters, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
                >
                  <option value="">All</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}

        {loading && <p className="text-gray-500 mb-4">Refreshing…</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {([
            ["Page Views", summary.views],
            ["CTA Clicks", summary.clicks],
            ["Form Opens", summary.opens],
            ["Form Submits", summary.submits],
          ] as const).map(([label, value]) => (
            <div key={label} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Meta Ads */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Meta Ads</h2>
          {metaLoading && <p className="text-gray-500 text-sm mb-2">Loading Meta data…</p>}
          {metaError && <p className="text-red-600 text-sm mb-2">{metaError}</p>}
          {metaData && metaData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaData.map((acct) => (
                <div key={acct.id} className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3 truncate" title={acct.id}>
                    {acct.name} <span className="text-gray-400">({acct.currency})</span>
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Today Spend</p>
                      <p className="text-xl font-bold text-gray-900">{acct.currency === "INR" ? "₹" : "$"}{Number(acct.todaySpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">This Month</p>
                      <p className="text-xl font-bold text-gray-900">{acct.currency === "INR" ? "₹" : "$"}{Number(acct.monthSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Balance</p>
                      <p className="text-xl font-bold text-green-700">{acct.currency === "INR" ? "₹" : "$"}{Number(acct.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {metaData && metaData.length === 0 && (
            <p className="text-gray-500 text-sm">No Meta ad accounts found.</p>
          )}
        </section>

        {/* Cost per Submit by Adset */}
        {costPerSubmit.length > 0 && (
          <section className="bg-white rounded-lg shadow p-4 mb-8 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Cost per Submit (by Adset)</h2>
            <p className="text-xs text-gray-400 mb-3">Meta adset spend (last {days}d) matched with form submits via utm_medium</p>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 pr-4">Adset</th>
                  <th className="py-2 pr-4 text-right">Today</th>
                  <th className="py-2 pr-4 text-right">Spend ({days}d)</th>
                  <th className="py-2 pr-4 text-right">Views</th>
                  <th className="py-2 pr-4 text-right">Submits</th>
                  <th className="py-2 text-right">Cost / Submit</th>
                </tr>
              </thead>
              <tbody>
                {costPerSubmit.map((r) => (
                  <tr key={r.medium} className="border-b last:border-0">
                    <td className="py-2 pr-4 text-gray-900">
                      <span className="block">{r.adsetName}</span>
                      <span className="block text-xs text-gray-400 font-mono">{r.medium}</span>
                    </td>
                    <td className="py-2 pr-4 text-right text-blue-700 font-semibold">₹{r.todaySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2 pr-4 text-right text-gray-900">₹{r.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2 pr-4 text-right text-gray-900">{r.views}</td>
                    <td className="py-2 pr-4 text-right text-gray-900 font-semibold">{r.submits}</td>
                    <td className="py-2 text-right font-bold text-gray-900">{r.costPerSubmit > 0 ? `₹${r.costPerSubmit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "–"}</td>
                  </tr>
                ))}
                {/* Totals row */}
                {costPerSubmit.length > 1 && (() => {
                  const totalTodaySpend = costPerSubmit.reduce((s, r) => s + r.todaySpend, 0);
                  const totalSpend = costPerSubmit.reduce((s, r) => s + r.spend, 0);
                  const totalViews = costPerSubmit.reduce((s, r) => s + r.views, 0);
                  const totalSubs = costPerSubmit.reduce((s, r) => s + r.submits, 0);
                  const totalCps = totalSubs > 0 ? totalSpend / totalSubs : 0;
                  return (
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-2 pr-4 text-gray-900">Total</td>
                      <td className="py-2 pr-4 text-right text-blue-700">₹{totalTodaySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-2 pr-4 text-right text-gray-900">₹{totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-2 pr-4 text-right text-gray-900">{totalViews}</td>
                      <td className="py-2 pr-4 text-right text-gray-900">{totalSubs}</td>
                      <td className="py-2 text-right text-gray-900">{totalCps > 0 ? `₹${totalCps.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "–"}</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </section>
        )}

        {/* Cost per Submit per Day */}
        {costPerSubmitDaily.length > 0 && (
          <section className="bg-white rounded-lg shadow p-4 mb-8 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Cost per Submit (by Day)</h2>
            <p className="text-xs text-gray-400 mb-3">Meta daily ad spend matched with form submits per day</p>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4 text-right">Spend</th>
                  <th className="py-2 pr-4 text-right">Views</th>
                  <th className="py-2 pr-4 text-right">Submits</th>
                  <th className="py-2 text-right">Cost / Submit</th>
                </tr>
              </thead>
              <tbody>
                {costPerSubmitDaily.map((r) => (
                  <tr key={r.date} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-gray-900">{r.date}</td>
                    <td className="py-2 pr-4 text-right text-gray-900">₹{r.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2 pr-4 text-right text-gray-900">{r.views}</td>
                    <td className="py-2 pr-4 text-right text-gray-900 font-semibold">{r.submits}</td>
                    <td className="py-2 text-right font-bold text-gray-900">{r.costPerSubmit > 0 ? `₹${r.costPerSubmit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "–"}</td>
                  </tr>
                ))}
                {costPerSubmitDaily.length > 1 && (() => {
                  const totalSpend = costPerSubmitDaily.reduce((s, r) => s + r.spend, 0);
                  const totalViews = costPerSubmitDaily.reduce((s, r) => s + r.views, 0);
                  const totalSubs = costPerSubmitDaily.reduce((s, r) => s + r.submits, 0);
                  const avgCps = totalSubs > 0 ? totalSpend / totalSubs : 0;
                  return (
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-2 pr-4 text-gray-900">Average</td>
                      <td className="py-2 pr-4 text-right text-gray-900">₹{totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-2 pr-4 text-right text-gray-900">{totalViews}</td>
                      <td className="py-2 pr-4 text-right text-gray-900">{totalSubs}</td>
                      <td className="py-2 text-right text-gray-900">{avgCps > 0 ? `₹${avgCps.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "–"}</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </section>
        )}

        {/* Funnel by page */}
        <section className="bg-white rounded-lg shadow p-4 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Funnel by Page</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">Page</th>
                <th className="py-2 pr-4 text-right">Views</th>
                <th className="py-2 pr-4 text-right">Clicks</th>
                <th className="py-2 pr-4 text-right">Click %</th>
                <th className="py-2 pr-4 text-right">Opens</th>
                <th className="py-2 pr-4 text-right">Open %</th>
                <th className="py-2 pr-4 text-right">Submits</th>
                <th className="py-2 text-right">Submit %</th>
              </tr>
            </thead>
            <tbody>
              {funnel.map((r) => (
                <tr key={r.page} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono text-gray-900">{r.page}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.views}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.clicks}</td>
                  <td className="py-2 pr-4 text-right text-gray-600">{pct(r.clicks, r.views)}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.opens}</td>
                  <td className="py-2 pr-4 text-right text-gray-600">{pct(r.opens, r.views)}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.submits}</td>
                  <td className="py-2 text-right text-gray-600">{pct(r.submits, r.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* UTM source table */}
        <section className="bg-white rounded-lg shadow p-4 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Traffic Sources (UTM)</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4 text-right">Views</th>
                <th className="py-2 pr-4 text-right">Clicks</th>
                <th className="py-2 pr-4 text-right">Opens</th>
                <th className="py-2 pr-4 text-right">Submits</th>
                <th className="py-2 text-right">Conv %</th>
              </tr>
            </thead>
            <tbody>
              {utmSources.map((r) => (
                <tr key={r.source} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono text-gray-900">{r.source}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.views}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.clicks}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.opens}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.submits}</td>
                  <td className="py-2 text-right text-gray-600">{pct(r.submits, r.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Quiz answer breakdown */}
        <section className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quiz Answer Breakdown</h2>
          {Object.keys(quizAnswers).length === 0 ? (
            <p className="text-gray-500">No quiz answers recorded in this period.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUIZ_META.map((q) => {
                const counts = quizAnswers[String(q.id)] || {};
                const chartData = q.options.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                  count: counts[opt.value] || 0,
                }));
                const total = chartData.reduce((s, r) => s + r.count, 0);
                return (
                  <div key={q.id} className="border rounded-md p-3">
                    <div className="text-xs text-gray-500 mb-1">Q{q.id} · {total} answers</div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">{q.question}</h3>
                    {total === 0 ? (
                      <p className="text-xs text-gray-400">No answers yet.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 36)}>
                        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                          <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={160} />
                          <Tooltip
                            formatter={(value: number) => [`${value} (${pct(value, total)})`, "Answers"]}
                          />
                          <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Daily trend chart */}
        <section className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Daily Trend</h2>
          {daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" stackId="a" fill="#3b82f6" name="Views" />
                <Bar dataKey="clicks" stackId="a" fill="#f59e0b" name="Clicks" />
                <Bar dataKey="opens" stackId="a" fill="#8b5cf6" name="Opens" />
                <Bar dataKey="submits" stackId="a" fill="#10b981" name="Submits" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data for this period.</p>
          )}
        </section>

        {/* Daily data table (for Claude readability) */}
        <section className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Daily Data</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4 text-right">Views</th>
                <th className="py-2 pr-4 text-right">Clicks</th>
                <th className="py-2 pr-4 text-right">Opens</th>
                <th className="py-2 text-right">Submits</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((r) => (
                <tr key={r.date} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono text-gray-900">{r.date}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.views}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.clicks}</td>
                  <td className="py-2 pr-4 text-right text-gray-900">{r.opens}</td>
                  <td className="py-2 text-right text-gray-900">{r.submits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
