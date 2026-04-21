import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getAllParams } from "@/lib/utm";
import { X } from "lucide-react";

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/HADyq7BakZrOyu15lic7/webhook-trigger/e5a21b54-2012-479a-a948-233c0c543245";

const TRAINING_URL = "/training";

type LeadFormModalProps = {
  open: boolean;
  onClose: () => void;
  source: string;
  title?: string;
  subtitle?: string;
};

export function LeadFormModal({
  open,
  onClose,
  source,
  title = "Watch the Free Training",
  subtitle = "Enter your details and the 28-min training plays immediately",
}: LeadFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setSubmitting(true);

    trackEvent("lead_form_submit", {
      form_id: source,
      form_name: `${source} Lead Form`,
      page_path: window.location.pathname,
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }

    const urlParams = getAllParams();
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        quiz_source: source,
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

    // Redirect immediately — webhook is fire-and-forget, no need to wait
    window.location.href = TRAINING_URL;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div className="px-6 py-5" style={{ backgroundColor: "#2563eb" }}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-white/80 mt-1">{subtitle}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: "#dbeafe" }}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1a1a1a" }}>You're in!</h3>
              <p className="text-sm" style={{ color: "#666" }}>Redirecting to the 28-min training...</p>
              <a href={TRAINING_URL} className="inline-block mt-3 text-sm underline" style={{ color: "#2563eb" }}>
                Click here if not redirected
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3.5 rounded-lg text-base border transition-colors"
                style={{ borderColor: "#d1d5db", color: "#1a1a1a" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg text-base border transition-colors"
                style={{ borderColor: "#d1d5db", color: "#1a1a1a" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; }}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg text-base border transition-colors"
                style={{ borderColor: "#d1d5db", color: "#1a1a1a" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; }}
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
          )}
        </div>
      </div>
    </div>
  );
}
