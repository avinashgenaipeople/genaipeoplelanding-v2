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
  periodSpend: string;
  periodImpressions: string;
  periodClicks: string;
};

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

type AnalyticsData = {
  summary: Summary;
  funnel: FunnelRow[];
  utmSources: UtmRow[];
  daily: DailyRow[];
  filterOptions: FilterOptions;
};

const DAYS_OPTIONS = [7, 14, 30, 90] as const;

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
  const { summary, funnel, utmSources, daily } = data!;

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
                {d}d
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
                      <p className="text-xs text-gray-500">{days}d Spend</p>
                      <p className="text-xl font-bold text-gray-900">{acct.currency === "INR" ? "₹" : "$"}{Number(acct.periodSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
