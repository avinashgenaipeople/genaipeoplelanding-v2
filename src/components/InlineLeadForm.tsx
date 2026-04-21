import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getAllParams } from "@/lib/utm";

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/HADyq7BakZrOyu15lic7/webhook-trigger/e5a21b54-2012-479a-a948-233c0c543245";

const TRAINING_URL = "/training";

type InlineLeadFormProps = {
  source: string; // e.g. "lp-v1-short"
};

export function InlineLeadForm({ source }: InlineLeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setSubmitting(true);

    // Analytics
    trackEvent("lead_form_submit", {
      form_id: source,
      form_name: `${source} Inline Form`,
      page_path: window.location.pathname,
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }

    // Webhook with all URL params
    const urlParams = getAllParams();
    fetch(WEBHOOK_URL, { keepalive: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        quiz_source: source,
        // URL/attribution params — flattened for CRM field mapping
        utm_source: urlParams.utm_source ?? "",
        utm_medium: urlParams.utm_medium ?? "",
        utm_campaign: urlParams.utm_campaign ?? "",
        utm_term: urlParams.utm_term ?? "",
        utm_content: urlParams.utm_content ?? "",
        utm_adname: urlParams.utm_adname ?? "",
        utm_adid: urlParams.utm_adid ?? "",
        utm_placement: urlParams.utm_placement ?? "",
        utm_ad_account: urlParams.utm_ad_account ?? "",
        utm_id: urlParams.utm_id ?? "",
        fbclid: urlParams.fbclid ?? "",
        gclid: urlParams.gclid ?? "",
        url_params: urlParams,
      }),
    }).catch(() => {});

    setSubmitted(true);
    setSubmitting(false);

    // Redirect to training after short delay
    setTimeout(() => {
      window.location.href = TRAINING_URL;
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: "#dbeafe" }}>
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "#1a1a1a" }}>You're in! Loading your training...</h3>
        <p className="text-sm" style={{ color: "#666" }}>Redirecting to the 28-min video now.</p>
        <a href={TRAINING_URL} className="inline-block mt-4 text-sm underline" style={{ color: "#2563eb" }}>
          Click here if not redirected
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-3.5 rounded-lg text-base border focus:outline-none focus:ring-2 transition-colors"
        style={{ borderColor: "#d1d5db", color: "#1a1a1a", backgroundColor: "#fff" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(37,99,235,0.2)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
      />
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3.5 rounded-lg text-base border focus:outline-none focus:ring-2 transition-colors"
        style={{ borderColor: "#d1d5db", color: "#1a1a1a", backgroundColor: "#fff" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(37,99,235,0.2)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full px-4 py-3.5 rounded-lg text-base border focus:outline-none focus:ring-2 transition-colors"
        style={{ borderColor: "#d1d5db", color: "#1a1a1a", backgroundColor: "#fff" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(37,99,235,0.2)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-4 rounded-lg text-lg font-extrabold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#2563eb" }}
      >
        {submitting ? "Submitting…" : "Watch the Free Training →"}
      </button>
      <p className="text-center text-xs" style={{ color: "#999" }}>
        Free. No credit card. No strings.
      </p>
    </form>
  );
}
