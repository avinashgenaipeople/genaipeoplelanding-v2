import { useEffect, useState, useCallback } from "react";
import { PageMeta } from "@/components/PageMeta";
import { trackEvent } from "@/lib/analytics";
import { getAllParams } from "@/lib/utm";
import { ArrowRight, ArrowLeft, X, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

/* ── Quiz Questions (same as LpV7) ──────────────────────────────── */
const QUIZ_QUESTIONS = [
  { id: 1, question: "Are you currently working as a software developer?", options: [
    { label: "Yes, full-time", value: "yes_fulltime" },
    { label: "Yes, but looking for a change", value: "yes_looking" },
    { label: "No, I was recently laid off", value: "no_laid_off" },
    { label: "No, I'm in a different role", value: "no_different" },
  ]},
  { id: 2, question: "How many years of professional development experience do you have?", options: [
    { label: "Less than 3 years", value: "lt_3" },
    { label: "3–5 years", value: "3_5" },
    { label: "5–10 years", value: "5_10" },
    { label: "10–15 years", value: "10_15" },
    { label: "15+ years", value: "15_plus" },
  ]},
  { id: 3, question: "What is your primary programming language?", options: [
    { label: "Java", value: "java" },
    { label: "Python", value: "python" },
    { label: "JavaScript / TypeScript", value: "js_ts" },
    { label: "C# / .NET", value: "csharp" },
    { label: "Other", value: "other" },
  ]},
  { id: 4, question: "Have you used any AI tools (like ChatGPT, Copilot, or Claude) in your daily work?", options: [
    { label: "Yes, regularly", value: "yes_regularly" },
    { label: "I've tried them a few times", value: "tried_few" },
    { label: "No, not yet", value: "no" },
  ]},
  { id: 5, question: "What concerns you most about AI's impact on your career?", options: [
    { label: "My role could be automated or eliminated", value: "automated" },
    { label: "I'm falling behind developers who use AI", value: "falling_behind" },
    { label: "I don't know how to transition into AI roles", value: "no_path" },
    { label: "I'm not concerned — I just want to grow", value: "want_growth" },
  ]},
  { id: 6, question: "If there were a clear path to an AI role, how soon would you want to start?", options: [
    { label: "Immediately — I'm ready now", value: "immediately" },
    { label: "Within the next 1–3 months", value: "1_3_months" },
    { label: "I'm just exploring for now", value: "exploring" },
  ]},
  { id: 7, question: "Would you like a personalised roadmap for your AI transition?", options: [
    { label: "Yes, show me", value: "yes" },
    { label: "Maybe — I'd like to learn more first", value: "maybe" },
  ]},
];

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/HADyq7BakZrOyu15lic7/webhook-trigger/e5a21b54-2012-479a-a948-233c0c543245";

const TRAINING_URL = "/training";

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  1: { yes_fulltime: "Yes, full-time", yes_looking: "Yes, but looking for a change", no_laid_off: "No, I was recently laid off", no_different: "No, I'm in a different role" },
  2: { lt_3: "Less than 3 years", "3_5": "3-5 years", "5_10": "5-10 years", "10_15": "10-15 years", "15_plus": "15+ years" },
  3: { java: "Java", python: "Python", js_ts: "JavaScript / TypeScript", csharp: "C# / .NET", other: "Other" },
  4: { yes_regularly: "Yes, regularly", tried_few: "I've tried them a few times", no: "No, not yet" },
  5: { automated: "My role could be automated or eliminated", falling_behind: "I'm falling behind developers who use AI", no_path: "I dont know how to transition", want_growth: "I'm not concerned — I just want to grow" },
  6: { immediately: "Immediately", "1_3_months": "Within the next 1-3 months", exploring: "I'm just exploring for now" },
  7: { yes: "Yes", maybe: "Maybe" },
};

const REDIRECT_DELAY = 0;

/* ── Transition Screen ──────────────────────────────────────────── */
function TransitionScreen({ name }: { name: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Lead event removed — fires on training page to avoid duplicate.
    trackEvent("quiz_redirect_training", { page_path: window.location.pathname });

    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => {
      window.location.href = TRAINING_URL;
    }, REDIRECT_DELAY);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
        <CheckCircle2 className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2"
          style={{ opacity: step >= 0 ? 1 : 0, transition: "opacity 0.5s" }}>
        Loading Your Free Training{firstName ? `, ${firstName}` : ""}...
      </h2>
      <p className="text-gray-500 text-lg mb-6" style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
        28-minute video on how senior devs transition into AI
      </p>
      <div style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
        <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
        <p className="text-gray-400 text-sm mt-3">Taking you to the video now...</p>
        <a href={TRAINING_URL} className="inline-block mt-6 text-gray-400 text-sm underline underline-offset-2 hover:text-white/70 transition-colors">
          Click here if you're not redirected
        </a>
      </div>
    </div>
  );
}

/* ── Quiz Overlay ───────────────────────────────────────────────── */
function QuizOverlay({
  isOpen, currentStep, answers, contactInfo, isSubmitting,
  onSelectAnswer, onBack, onClose, onContactChange, onSubmit,
}: {
  isOpen: boolean; currentStep: number; answers: Record<number, string>;
  contactInfo: { name: string; email: string; phone: string }; isSubmitting: boolean;
  onSelectAnswer: (qId: number, value: string) => void;
  onBack: () => void; onClose: () => void;
  onContactChange: (field: "name" | "email" | "phone", value: string) => void;
  onSubmit: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => { document.body.style.position = ""; document.body.style.top = ""; document.body.style.width = ""; window.scrollTo(0, scrollY); };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const question = currentStep >= 1 && currentStep <= 7 ? QUIZ_QUESTIONS[currentStep - 1] : null;
  const progressPercent = currentStep <= 7 ? (currentStep / 7) * 100 : 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" onClick={onClose} />
      <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition-colors" aria-label="Close quiz">
        <X className="w-8 h-8" />
      </button>
      {currentStep <= 7 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      )}
      <div className="relative z-10 w-full max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {question && (
          <div className="text-center">
            {currentStep === 1 ? (
              <div className="mb-6">
                <p className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-2">GenAI Readiness Check</p>
                <p className="text-white/60 text-base leading-relaxed max-w-md mx-auto">
                  Answer 7 quick questions to see where you stand — then get instant access to the 28-min GenAI readiness training.
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-6 font-medium">Question {currentStep} of 7</p>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-8">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((opt) => (
                <button key={opt.value} type="button" onClick={() => onSelectAnswer(question.id, opt.value)}
                  className={`w-full text-left px-6 py-4 rounded-xl text-lg font-medium transition-all duration-200 border ${
                    answers[question.id] === opt.value
                      ? "bg-blue-50 border-blue-500 text-gray-900"
                      : "bg-white border-gray-200 text-gray-900 hover:border-blue-400 hover:bg-blue-50"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
            {currentStep > 1 && (
              <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
        )}

        {currentStep === 8 && (() => {
          const isHotLead =
            (answers[2] === "5_10" || answers[2] === "10_15" || answers[2] === "15_plus") &&
            (answers[6] === "immediately" || answers[6] === "1_3_months") &&
            answers[7] === "yes";
          return (
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {isHotLead ? "Great news — you're a strong fit!" : "Great — let's get you started!"}
              </h2>
              <p className="text-gray-500 text-lg">
                Enter your details to get instant access to the 28-min video explaining the transition from Senior Dev into an AI Engineer.
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 max-w-sm mx-auto">
              <input type="text" placeholder="Full name" value={contactInfo.name}
                onChange={(e) => onContactChange("name", e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              <input type="email" placeholder="Email address" value={contactInfo.email}
                onChange={(e) => onContactChange("email", e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              <input type="tel" placeholder="Phone number" value={contactInfo.phone}
                onChange={(e) => onContactChange("phone", e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              <button type="submit" disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-xl text-white text-lg font-bold transition-all duration-200 disabled:opacity-50 inline-flex items-center justify-center gap-2 hover:opacity-90"
                style={{ backgroundColor: "#2563eb" }}>
                {isSubmitting ? "Submitting…" : "Watch the Free Training"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          );
        })()}

        {currentStep === 9 && <TransitionScreen name={contactInfo.name} />}
      </div>
    </div>
  );
}

/* ── Page Component ─────────────────────────────────────────────── */
export default function LpV3Short() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackEvent("page_view_lp_v3_short", { page_path: window.location.pathname });
  }, []);

  const openQuiz = useCallback(() => {
    setQuizOpen(true);
    setCurrentStep(1);
    setAnswers({});
    setContactInfo({ name: "", email: "", phone: "" });
    setIsSubmitting(false);
    trackEvent("quiz_open", { page_path: window.location.pathname });
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", { content_name: "LpV3Short Quiz" });
    }
  }, []);

  const closeQuiz = useCallback(() => {
    if (currentStep < 9) trackEvent("quiz_close", { last_step: currentStep, page_path: window.location.pathname });
    setQuizOpen(false);
  }, [currentStep]);

  const selectAnswer = useCallback((questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    trackEvent("quiz_answer", { question_id: questionId, answer: value, step: questionId, page_path: window.location.pathname });
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      if (questionId === 7) {
        trackEvent("quiz_completed", {
          page_path: window.location.pathname,
          q1: answers[1] || "", q2: answers[2] || "", q3: answers[3] || "",
          q4: answers[4] || "", q5: answers[5] || "", q6: answers[6] || "", q7: value,
        });
      }
    }, 200);
  }, [answers]);

  const goBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    else closeQuiz();
  }, [currentStep, closeQuiz]);

  const handleContactChange = useCallback((field: "name" | "email" | "phone", value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!contactInfo.name.trim() || !contactInfo.email.trim() || !contactInfo.phone.trim()) return;
    setIsSubmitting(true);

    trackEvent("quiz_form_submit", {
      name: contactInfo.name, email: contactInfo.email, phone: contactInfo.phone,
      page_path: window.location.pathname,
      ...Object.fromEntries(Object.entries(answers).map(([k, v]) => [`q${k}`, v])),
    });
    trackEvent("lead_form_submit", {
      form_id: "lp-v3-short-quiz", form_name: "LpV3Short Quiz Funnel",
      page_path: window.location.pathname,
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }

    const isHot =
      (answers[2] === "5_10" || answers[2] === "10_15" || answers[2] === "15_plus") &&
      (answers[6] === "immediately" || answers[6] === "1_3_months") &&
      answers[7] === "yes";

    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", { content_name: "LpV3Short Quiz Funnel" });
      if (isHot) {
        window.fbq("track", "CompleteRegistration", { content_name: "LpV3Short Hot Lead" });
        window.fbq("track", "InitiateCheckout", { content_name: "LpV3Short Hot Lead" });
      }
    }

    const label = (q: number) => ANSWER_LABELS[q]?.[answers[q]] ?? answers[q] ?? "";
    const urlParams = getAllParams();
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contactInfo.name, email: contactInfo.email, phone: contactInfo.phone,
        quiz_current_role: label(1), quiz_experience: label(2), quiz_language: label(3),
        quiz_ai_usage: label(4), quiz_concern: label(5), quiz_readiness: label(6),
        quiz_call_interest: label(7), quiz_source: "lp-v3-short",
        quiz_lead_score: isHot ? "hot" : "warm",
        utm_source: urlParams.utm_source ?? "", utm_medium: urlParams.utm_medium ?? "",
        utm_campaign: urlParams.utm_campaign ?? "", utm_term: urlParams.utm_term ?? "",
        utm_content: urlParams.utm_content ?? "", utm_adname: urlParams.utm_adname ?? "",
        utm_adid: urlParams.utm_adid ?? "", utm_placement: urlParams.utm_placement ?? "",
        utm_ad_account: urlParams.utm_ad_account ?? "", utm_id: urlParams.utm_id ?? "",
        fbclid: urlParams.fbclid ?? "", gclid: urlParams.gclid ?? "",
        url_params: urlParams,
      }),
    }).catch(() => {});

    setCurrentStep(9);
    setIsSubmitting(false);
  }, [contactInfo, answers]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Are You GenAI-Ready? The Post-Coding Playbook for Java Devs"
        description="AI is rewriting the rules for Java developers. Learn how to contribute through ideas, not just code — and stay ahead in the post-coding world."
      />

      <div className="w-full py-3 text-center" style={{ backgroundColor: "#2563eb" }}>
        <span className="text-white font-bold text-sm sm:text-base tracking-wide">Senior Java Developers — Are You GenAI-Ready? Free Training →</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            The Post-Coding Era Is Here.{" "}
            <span style={{ color: "#2563eb" }}>Are You GenAI-Ready?</span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold mb-8 leading-relaxed" style={{ color: "#2563eb" }}>
            AI isn't replacing Java developers — it's replacing the ones who only write code.
          </p>

          <div className="text-left max-w-xl mx-auto mb-8 space-y-4">
            {[
              ["Contribute through ideas", " — architecture, system design, and AI-augmented problem solving"],
              ["Experienced Java devs have an unfair advantage", " in the GenAI shift"],
              ["28-min roadmap", " — 150+ senior devs used to become GenAI-ready without starting over"],
            ].map(([bold, rest], i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg mt-0.5" style={{ color: "#2563eb" }}>✓</span>
                <p className="text-base sm:text-lg" style={{ color: "#444" }}>
                  <span className="font-semibold" style={{ color: "#1a1a1a" }}>{bold}</span>{rest}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => { trackEvent("cta_click", { cta_label: "Get the GenAI Readiness Roadmap", cta_section: "video_thumbnail", page_path: window.location.pathname }); openQuiz(); }}
            className="group relative w-full max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden cursor-pointer"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
          >
            <img src="/video-thumbnail.webp" alt="Gen AI Roadmap for Senior Devs — Free 28-min Training" className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-16 h-12 sm:w-20 sm:h-14 group-hover:scale-110 transition-transform" viewBox="0 0 68 48">
                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000"/>
                <path d="M45 24L27 14v20" fill="white"/>
              </svg>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              trackEvent("cta_click", { cta_label: "Get the GenAI Readiness Roadmap", cta_section: "cta_button", page_path: window.location.pathname });
              openQuiz();
            }}
            className="inline-flex items-center justify-center px-12 py-5 text-xl sm:text-2xl font-extrabold text-white rounded-xl transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#2563eb", minWidth: 280 }}
          >
            Get the GenAI Readiness Roadmap
          </button>

          <p className="mt-5 text-sm" style={{ color: "#999" }}>
            Quick quiz + free 28-min training. No credit card. No strings.
          </p>
        </div>
      </main>

      <footer className="py-6 px-4 text-center">
        <p className="text-xs" style={{ color: "#aaa" }}>
          © {new Date().getFullYear()} GenAI People ·{" "}
          <Link to="/privacy" className="underline hover:opacity-70">Privacy</Link>{" · "}
          <Link to="/terms" className="underline hover:opacity-70">Terms</Link>
        </p>
      </footer>

      <QuizOverlay
        isOpen={quizOpen} currentStep={currentStep} answers={answers}
        contactInfo={contactInfo} isSubmitting={isSubmitting}
        onSelectAnswer={selectAnswer} onBack={goBack} onClose={closeQuiz}
        onContactChange={handleContactChange} onSubmit={handleSubmit}
      />
    </div>
  );
}
