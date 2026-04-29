import { useEffect, useState, useCallback } from "react";
import { PageMeta } from "@/components/PageMeta";
import { trackEvent } from "@/lib/analytics";
import { getAllParams } from "@/lib/utm";
import {
  scoreQuizLeadV2,
  getTrainingRedirectV2,
  computeRiskScore,
  riskType,
  timeToPivotMonths,
  biggestRiskFactor,
  type ExperienceV2,
  type SalaryV2,
  type TimelineV2,
  type GoalV2,
  type WorryFrequency,
  type Likert,
} from "@/lib/lead-scoring-v2";
import { ArrowRight, ArrowLeft, X, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

/* ── Quiz Configuration ─────────────────────────────────────────── */
type QuestionType = "single" | "multi" | "likert" | "interstitial";
type QuestionDef = {
  step: number;
  type: QuestionType;
  key: string;
  question?: string;
  subtitle?: string;
  body?: string;
  options?: { label: string; value: string }[];
};

const LIKERT_OPTIONS = [
  { label: "Strongly agree", value: "strongly_agree" },
  { label: "Agree", value: "agree" },
  { label: "Neutral", value: "neutral" },
  { label: "Disagree", value: "disagree" },
];

const QUESTIONS: QuestionDef[] = [
  // Stage 1 — Soft Label Trap
  {
    step: 1,
    type: "single",
    key: "worry",
    question: "How often do you worry that AI will make your developer role obsolete?",
    options: [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Rarely", value: "rarely" },
      { label: "Never", value: "never" },
    ],
  },

  // Stage 2 — Agreement Barrage (4 Likert statements)
  {
    step: 2,
    type: "likert",
    key: "likert_velocity",
    question: "Younger devs using AI tools seem to be moving faster than I am.",
    options: LIKERT_OPTIONS,
  },
  {
    step: 3,
    type: "likert",
    key: "likert_implementation",
    question: "Beyond prompts, I'm not sure how to actually use AI in my daily work.",
    options: LIKERT_OPTIONS,
  },
  {
    step: 4,
    type: "likert",
    key: "likert_urgency",
    question: "If I don't pivot to AI in the next 12 months, I'll fall behind for good.",
    options: LIKERT_OPTIONS,
  },
  {
    step: 5,
    type: "likert",
    key: "likert_courses",
    question: "Most courses and certificates feel like a waste of time at my level.",
    options: LIKERT_OPTIONS,
  },

  // Stage 3 — Hope Injection (interstitial)
  {
    step: 6,
    type: "interstitial",
    key: "hope",
    question: "You're not behind. You're under-leveraged.",
    body:
      "83% of senior developers we've placed in 30–70L AI roles already had the architecture skills they needed — they just lacked a structured pivot. Your experience is the asset, not the obstacle.",
  },

  // Stage 4 — Cost Expansion (multi-select)
  {
    step: 7,
    type: "multi",
    key: "costs",
    question: "Which of these are costing you the most right now?",
    subtitle: "Select all that apply.",
    options: [
      { label: "I'm earning less than peers who pivoted to AI", value: "earning_less" },
      { label: "I've been passed over for senior promotions", value: "passed_over" },
      { label: "I see AI features ship without me", value: "watching_ship" },
      { label: "I avoid AI conversations at work — feels exposed", value: "avoid_convos" },
      { label: "I've spent on courses/certs that didn't move the needle", value: "wasted_courses" },
      { label: "My current company isn't going to give me AI work", value: "no_ai_work" },
      { label: "I'm worried about layoffs in the next 12 months", value: "layoff_anxiety" },
    ],
  },

  // Stage 5 — Goal & Timeline (no "do you want help" question — we just route)
  {
    step: 8,
    type: "single",
    key: "goal",
    question: "What would a successful AI pivot look like for you in 12 months?",
    options: [
      { label: "Same role, same company, just AI-fluent", value: "same_role_ai_fluent" },
      { label: "Senior AI engineer at my current level (30–50L)", value: "senior_ai_30_50" },
      { label: "AI architect / staff engineer (50–70L+)", value: "architect_50_70" },
      { label: "Founder / consulting on AI projects", value: "founder_consulting" },
      { label: "Honestly not sure yet", value: "not_sure" },
    ],
  },
  {
    step: 9,
    type: "single",
    key: "timeline",
    question: "When do you need a clear AI plan in place?",
    options: [
      { label: "This quarter — it's urgent", value: "this_quarter" },
      { label: "In the next 3 months", value: "next_3_months" },
      { label: "Sometime this year", value: "this_year" },
      { label: "Just exploring for now", value: "exploring" },
    ],
  },

  // Stage 6 — Profile (the two ICP filters)
  {
    step: 10,
    type: "single",
    key: "experience",
    question: "How many years of professional development experience do you have?",
    options: [
      { label: "Less than 3 years", value: "lt_3" },
      { label: "3–5 years", value: "3_5" },
      { label: "5–10 years", value: "5_10" },
      { label: "10–15 years", value: "10_15" },
      { label: "15+ years", value: "15_plus" },
    ],
  },
  {
    step: 11,
    type: "single",
    key: "salary",
    question: "What's your current annual compensation?",
    subtitle: "Helps us tailor the roadmap to your level — never shared externally.",
    options: [
      { label: "0–10 Lakhs", value: "0_10" },
      { label: "10–15 Lakhs", value: "10_15" },
      { label: "15–20 Lakhs", value: "15_20" },
      { label: "20–30 Lakhs", value: "20_30" },
      { label: "30–45 Lakhs", value: "30_45" },
      { label: "45+ Lakhs", value: "45_plus" },
    ],
  },
];

const TOTAL_QUIZ_STEPS = 11;
const STEP_DIAGNOSIS = 12;
const STEP_CONTACT = 13;
const STEP_TRANSITION = 14;

const ANSWER_LABELS: Record<string, Record<string, string>> = QUESTIONS.reduce((acc, q) => {
  if (q.options) {
    acc[q.key] = Object.fromEntries(q.options.map((o) => [o.value, o.label]));
  }
  return acc;
}, {} as Record<string, Record<string, string>>);

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/HADyq7BakZrOyu15lic7/webhook-trigger/e5a21b54-2012-479a-a948-233c0c543245";

const TRAINING_URL = "/training";
const REDIRECT_DELAY = 1500;

/* ── Diagnosis Screen ───────────────────────────────────────────── */
function DiagnosisScreen({
  answers,
  onContinue,
}: {
  answers: AnswersV2;
  onContinue: () => void;
}) {
  const score = computeRiskScore({
    worry: answers.worry as WorryFrequency | undefined,
    likertVelocity: answers.likert_velocity as Likert | undefined,
    likertImplementation: answers.likert_implementation as Likert | undefined,
    likertUrgency: answers.likert_urgency as Likert | undefined,
    likertCourses: answers.likert_courses as Likert | undefined,
    costCount: (answers.costs ?? []).length,
  });
  const type = riskType({
    experience: answers.experience as ExperienceV2 | undefined,
    worry: answers.worry as WorryFrequency | undefined,
    costCount: (answers.costs ?? []).length,
    goal: answers.goal as GoalV2 | undefined,
  });
  const months = timeToPivotMonths(
    answers.timeline as TimelineV2 | undefined,
    answers.experience as ExperienceV2 | undefined,
  );
  const factor = biggestRiskFactor({
    likertVelocity: answers.likert_velocity as Likert | undefined,
    likertImplementation: answers.likert_implementation as Likert | undefined,
    likertUrgency: answers.likert_urgency as Likert | undefined,
    likertCourses: answers.likert_courses as Likert | undefined,
  });

  const compatibility = score >= 60 ? "HIGH" : score >= 40 ? "MODERATE" : "LOW";
  const severity =
    score >= 70 ? { label: "Critical", color: "#dc2626" } :
    score >= 40 ? { label: "Moderate", color: "#d97706" } :
    { label: "Low", color: "#2563eb" };

  return (
    <div className="text-center">
      <p className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-2">Your AI Career Risk Report</p>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-6">
        {type}
      </h2>

      {/* Risk score gauge */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 max-w-md mx-auto">
        <p className="text-gray-500 text-sm font-medium mb-2">AI Career Risk Score</p>
        <p className="font-display text-5xl font-extrabold mb-1" style={{ color: severity.color }}>
          {score}
          <span className="text-2xl text-gray-400">/100</span>
        </p>
        <p className="text-sm font-semibold mb-4" style={{ color: severity.color }}>
          {severity.label} risk
        </p>
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, backgroundColor: severity.color }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>Critical</span>
        </div>
      </div>

      {/* Three bullets */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 max-w-md mx-auto text-left space-y-3">
        <DiagnosisRow label="Compatibility with 30L+ AI roles" value={compatibility} />
        <DiagnosisRow label="Time-to-pivot estimate" value={`${months} months`} />
        <DiagnosisRow label="Biggest risk factor" value={factor} multiline />
      </div>

      <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
        Your personalised Frontend → AI roadmap is ready. Enter your details on the next step to watch the 28-min training.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white text-lg font-bold transition-all duration-200 hover:opacity-90 gap-2"
        style={{ backgroundColor: "#2563eb" }}
      >
        Watch the Roadmap
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function DiagnosisRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? "" : "flex items-center justify-between gap-4"}>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-gray-900 font-semibold ${multiline ? "text-sm mt-1" : "text-base"}`}>{value}</p>
    </div>
  );
}

/* ── Hope Injection Screen ──────────────────────────────────────── */
function HopeInjection({ body, headline, onContinue }: { body: string; headline: string; onContinue: () => void }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600/10 mb-5">
        <CheckCircle2 className="w-7 h-7 text-blue-500" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4 max-w-md mx-auto">
        {headline}
      </h2>
      <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">{body}</p>
      <button
        type="button"
        onClick={onContinue}
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white text-lg font-bold transition-all duration-200 hover:opacity-90 gap-2"
        style={{ backgroundColor: "#2563eb" }}
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ── Transition Screen ──────────────────────────────────────────── */
function TransitionScreen({ name, redirectUrl }: { name: string; redirectUrl: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    trackEvent("quiz_redirect_training", { page_path: window.location.pathname });
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => { window.location.href = redirectUrl; }, REDIRECT_DELAY);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [redirectUrl]);

  const firstName = name.split(" ")[0];
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
        <CheckCircle2 className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2"
          style={{ opacity: step >= 0 ? 1 : 0, transition: "opacity 0.5s" }}>
        Loading Your Roadmap{firstName ? `, ${firstName}` : ""}…
      </h2>
      <p className="text-gray-500 text-lg mb-6" style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
        28-minute video on how senior devs transition into AI
      </p>
      <div style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
        <div className="w-48 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
        <p className="text-gray-400 text-sm mt-3">Taking you to the video now…</p>
        <a href={redirectUrl} className="inline-block mt-6 text-gray-400 text-sm underline underline-offset-2 hover:text-blue-600 transition-colors">
          Click here if you're not redirected
        </a>
      </div>
    </div>
  );
}

/* ── Quiz Overlay ───────────────────────────────────────────────── */
type AnswersV2 = Record<string, string | string[] | undefined>;

function QuizOverlay({
  isOpen, currentStep, answers, contactInfo, isSubmitting, redirectUrl,
  onSelectAnswer, onToggleMultiAnswer, onContinue, onBack, onClose, onContactChange, onSubmit,
}: {
  isOpen: boolean; currentStep: number; answers: AnswersV2;
  contactInfo: { name: string; email: string; phone: string }; isSubmitting: boolean; redirectUrl: string;
  onSelectAnswer: (key: string, value: string) => void;
  onToggleMultiAnswer: (key: string, value: string) => void;
  onContinue: () => void;
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

  const question = currentStep >= 1 && currentStep <= TOTAL_QUIZ_STEPS ? QUESTIONS[currentStep - 1] : null;
  const progressPercent = currentStep <= TOTAL_QUIZ_STEPS ? (currentStep / TOTAL_QUIZ_STEPS) * 100 : 100;
  const isLikert = question?.type === "likert";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" onClick={onClose} />
      <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition-colors" aria-label="Close quiz">
        <X className="w-8 h-8" />
      </button>
      {currentStep <= TOTAL_QUIZ_STEPS && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      <div className="relative z-10 w-full max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto px-1">
        {question?.type === "single" && (
          <div className="text-center">
            {currentStep === 1 ? (
              <div className="mb-6">
                <p className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-2">Frontend → AI Readiness Check</p>
                <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
                  Answer a few quick questions to see where you stand — then watch the 28-min repositioning roadmap.
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-6 font-medium">Question {currentStep} of {TOTAL_QUIZ_STEPS}</p>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">{question.question}</h2>
            {question.subtitle && <p className="text-gray-400 text-sm mb-6">{question.subtitle}</p>}
            {!question.subtitle && <div className="mb-5" />}
            <div className="space-y-3">
              {question.options?.map((opt) => (
                <button key={opt.value} type="button" onClick={() => onSelectAnswer(question.key, opt.value)}
                  className={`w-full text-left px-6 py-4 rounded-xl text-lg font-medium transition-all duration-200 border ${
                    answers[question.key] === opt.value
                      ? "bg-blue-50 border-blue-500 text-gray-900"
                      : "bg-white border-gray-200 text-gray-900 hover:border-blue-400 hover:bg-blue-50"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLikert && question && (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-6 font-medium">Question {currentStep} of {TOTAL_QUIZ_STEPS}</p>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-gray-900 leading-snug mb-2 max-w-lg mx-auto">
              "{question.question}"
            </h2>
            <p className="text-gray-400 text-sm mb-6">Do you agree with the statement above?</p>
            <div className="space-y-3">
              {question.options?.map((opt) => (
                <button key={opt.value} type="button" onClick={() => onSelectAnswer(question.key, opt.value)}
                  className={`w-full text-left px-6 py-4 rounded-xl text-lg font-medium transition-all duration-200 border ${
                    answers[question.key] === opt.value
                      ? "bg-blue-50 border-blue-500 text-gray-900"
                      : "bg-white border-gray-200 text-gray-900 hover:border-blue-400 hover:bg-blue-50"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {question?.type === "multi" && (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-6 font-medium">Question {currentStep} of {TOTAL_QUIZ_STEPS}</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">{question.question}</h2>
            {question.subtitle && <p className="text-gray-400 text-sm mb-5">{question.subtitle}</p>}
            <div className="space-y-3">
              {question.options?.map((opt) => {
                const selected = ((answers[question.key] as string[] | undefined) ?? []).includes(opt.value);
                return (
                  <button key={opt.value} type="button" onClick={() => onToggleMultiAnswer(question.key, opt.value)}
                    className={`w-full text-left px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 border flex items-center gap-3 ${
                      selected
                        ? "bg-blue-50 border-blue-500 text-gray-900"
                        : "bg-white border-gray-200 text-gray-900 hover:border-blue-400 hover:bg-blue-50"
                    }`}>
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                    }`}>
                      {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={onContinue}
              disabled={((answers[question.key] as string[] | undefined) ?? []).length === 0}
              className="mt-6 inline-flex items-center justify-center px-8 py-4 rounded-xl text-white text-lg font-bold transition-all duration-200 hover:opacity-90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#2563eb" }}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {question?.type === "interstitial" && (
          <HopeInjection
            headline={question.question ?? ""}
            body={question.body ?? ""}
            onContinue={onContinue}
          />
        )}

        {currentStep === STEP_DIAGNOSIS && (
          <DiagnosisScreen answers={answers} onContinue={onContinue} />
        )}

        {currentStep === STEP_CONTACT && (
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                Where should we send your roadmap?
              </h2>
              <p className="text-gray-500 text-base">
                Instant access to the 28-min Frontend → AI repositioning roadmap.
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 max-w-sm mx-auto">
              <input type="text" placeholder="Full name" value={contactInfo.name}
                onChange={(e) => onContactChange("name", e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors" />
              <input type="email" placeholder="Email address" value={contactInfo.email}
                onChange={(e) => onContactChange("email", e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors" />
              <input type="tel" placeholder="Phone number" value={contactInfo.phone}
                onChange={(e) => onContactChange("phone", e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors" />
              <button type="submit" disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-xl text-white text-lg font-bold transition-all duration-200 disabled:opacity-50 inline-flex items-center justify-center gap-2 hover:opacity-90"
                style={{ backgroundColor: "#2563eb" }}>
                {isSubmitting ? "Submitting…" : "Watch the Roadmap"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        )}

        {currentStep === STEP_TRANSITION && <TransitionScreen name={contactInfo.name} redirectUrl={redirectUrl} />}

        {currentStep > 1 && currentStep < STEP_TRANSITION && question?.type !== "interstitial" && (
          <div className="text-center">
            <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page Component ─────────────────────────────────────────────── */
export default function LpV7ShortImproved() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<AnswersV2>({});
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(TRAINING_URL);
  const [quizOpenedFrom, setQuizOpenedFrom] = useState<string>("");

  useEffect(() => {
    trackEvent("page_view_lp_v7_short_improved", { page_path: window.location.pathname });
  }, []);

  const openQuiz = useCallback((source: string = "unknown") => {
    setQuizOpen(true);
    setCurrentStep(1);
    setAnswers({});
    setContactInfo({ name: "", email: "", phone: "" });
    setIsSubmitting(false);
    setQuizOpenedFrom(source);
    trackEvent("quiz_open", { cta_section: source, quiz_variant: "v7-short-improved", page_path: window.location.pathname });
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", { content_name: "LpV7ShortImproved Quiz", source });
    }
  }, []);

  const closeQuiz = useCallback(() => {
    if (currentStep < STEP_TRANSITION) {
      trackEvent("quiz_close", { last_step: currentStep, quiz_variant: "v7-short-improved", page_path: window.location.pathname });
    }
    setQuizOpen(false);
  }, [currentStep]);

  const advance = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const selectAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    trackEvent("quiz_answer", { question_key: key, answer: value, step: currentStep, quiz_variant: "v7-short-improved", page_path: window.location.pathname });
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      if (currentStep === TOTAL_QUIZ_STEPS) {
        trackEvent("quiz_completed", {
          quiz_variant: "v7-short-improved",
          page_path: window.location.pathname,
        });
      }
    }, 200);
  }, [currentStep]);

  const toggleMultiAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);

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

    const leadScore = scoreQuizLeadV2({
      experience: answers.experience as ExperienceV2 | undefined,
      salary: answers.salary as SalaryV2 | undefined,
      timeline: answers.timeline as TimelineV2 | undefined,
      goal: answers.goal as GoalV2 | undefined,
    });
    const isHot = leadScore === "hot";
    setRedirectUrl(getTrainingRedirectV2(leadScore));

    const riskScoreValue = computeRiskScore({
      worry: answers.worry as WorryFrequency | undefined,
      likertVelocity: answers.likert_velocity as Likert | undefined,
      likertImplementation: answers.likert_implementation as Likert | undefined,
      likertUrgency: answers.likert_urgency as Likert | undefined,
      likertCourses: answers.likert_courses as Likert | undefined,
      costCount: ((answers.costs as string[] | undefined) ?? []).length,
    });
    const riskTypeValue = riskType({
      experience: answers.experience as ExperienceV2 | undefined,
      worry: answers.worry as WorryFrequency | undefined,
      costCount: ((answers.costs as string[] | undefined) ?? []).length,
      goal: answers.goal as GoalV2 | undefined,
    });

    trackEvent("quiz_form_submit", {
      name: contactInfo.name, email: contactInfo.email, phone: contactInfo.phone,
      page_path: window.location.pathname,
      quiz_variant: "v7-short-improved",
      quiz_opened_from: quizOpenedFrom,
      lead_score: leadScore,
      risk_score: riskScoreValue,
      risk_type: riskTypeValue,
      ...flattenAnswersForAnalytics(answers),
    });
    trackEvent("lead_form_submit", {
      form_id: "lp-v7-short-improved-quiz",
      form_name: "LpV7ShortImproved Quiz Funnel",
      page_path: window.location.pathname,
      quiz_variant: "v7-short-improved",
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", { content_name: "LpV7ShortImproved Quiz Funnel" });
      if (isHot) {
        window.fbq("track", "CompleteRegistration", { content_name: "LpV7ShortImproved Hot Lead" });
        window.fbq("track", "InitiateCheckout", { content_name: "LpV7ShortImproved Hot Lead" });
      }
    }

    const label = (k: string) => {
      const v = answers[k];
      if (Array.isArray(v)) return v.map((x) => ANSWER_LABELS[k]?.[x] ?? x).join("; ");
      return ANSWER_LABELS[k]?.[v as string] ?? (v as string) ?? "";
    };
    const urlParams = getAllParams();

    fetch(WEBHOOK_URL, { keepalive: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contactInfo.name, email: contactInfo.email, phone: contactInfo.phone,
        quiz_source: "lp-v7-short-improved",
        quiz_variant: "v7-short-improved",
        quiz_lead_score: leadScore,
        quiz_risk_score: riskScoreValue,
        quiz_risk_type: riskTypeValue,
        quiz_opened_from: quizOpenedFrom,
        quiz_worry_frequency: label("worry"),
        quiz_likert_velocity: label("likert_velocity"),
        quiz_likert_implementation: label("likert_implementation"),
        quiz_likert_urgency: label("likert_urgency"),
        quiz_likert_courses: label("likert_courses"),
        quiz_costs: label("costs"),
        quiz_goal: label("goal"),
        quiz_timeline: label("timeline"),
        quiz_experience: label("experience"),
        quiz_salary: label("salary"),
        utm_source: urlParams.utm_source ?? "", utm_medium: urlParams.utm_medium ?? "",
        utm_campaign: urlParams.utm_campaign ?? "", utm_term: urlParams.utm_term ?? "",
        utm_content: urlParams.utm_content ?? "", utm_adname: urlParams.utm_adname ?? "",
        utm_adid: urlParams.utm_adid ?? "", utm_placement: urlParams.utm_placement ?? "",
        utm_ad_account: urlParams.utm_ad_account ?? "", utm_id: urlParams.utm_id ?? "",
        fbclid: urlParams.fbclid ?? "", gclid: urlParams.gclid ?? "",
        url_params: urlParams,
      }),
    }).catch(() => {});

    setCurrentStep(STEP_TRANSITION);
    setIsSubmitting(false);
  }, [contactInfo, answers, quizOpenedFrom]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
      <PageMeta
        title="GenAI People | Frontend Devs: AI Is Rewriting Your Role"
        description="Frontend developers with 10+ years: AI generates UI faster than you code it. Learn how to stay indispensable. Free 28-min training."
      />

      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", { cta_label: "Get the Frontend → AI Roadmap", cta_section: "sumo_bar", quiz_variant: "v7-short-improved", page_path: window.location.pathname });
          openQuiz("sumo_bar");
        }}
        className="w-full py-3 text-center cursor-pointer hover:opacity-95 transition-opacity"
        style={{ backgroundColor: "#2563eb" }}
        aria-label="Get the Frontend to AI Roadmap"
      >
        <span className="text-white font-bold text-sm sm:text-base tracking-wide">Frontend Devs Earning 15L+ — Free AI Training →</span>
      </button>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] mb-6" style={{ color: "#1a1a1a" }}>
            AI Generates UI in Seconds.{" "}
            <span style={{ color: "#2563eb" }}>What's Your Edge Now?</span>
          </h1>

          <p className="text-base sm:text-lg mb-6 leading-relaxed" style={{ color: "#444" }}>
            Pixels and components aren't your moat anymore. Product thinking is. Your 10+ years of user empathy and system design is exactly what AI product teams pay 30–70L for.
          </p>

          <div className="text-left max-w-xl mx-auto mb-6 space-y-3">
            {[
              ["Move from building UIs", " to designing AI-powered experiences"],
              ["User empathy + system thinking", " — exactly what AI product teams need"],
              ["150+ senior devs repositioned", " — same skills, without starting over"],
            ].map(([bold, rest], i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg mt-0.5" style={{ color: "#2563eb" }}>✓</span>
                <p className="text-base sm:text-lg" style={{ color: "#444" }}>
                  <span className="font-semibold" style={{ color: "#1a1a1a" }}>{bold}</span>{rest}
                </p>
              </div>
            ))}
          </div>

          {/* Video thumbnail with play button */}
          <button
            type="button"
            onClick={() => {
              trackEvent("cta_click", { cta_label: "Get the Frontend → AI Roadmap", cta_section: "video_thumbnail", quiz_variant: "v7-short-improved", page_path: window.location.pathname });
              openQuiz("video_thumbnail");
            }}
            className="group relative w-full max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden cursor-pointer"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
          >
            <img
              src="/video-thumbnail.webp"
              alt="Gen AI Roadmap for Senior Devs — Free 28-min Training"
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-16 h-12 sm:w-20 sm:h-14 group-hover:scale-110 transition-transform" viewBox="0 0 68 48">
                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000"/>
                <path d="M45 24L27 14v20" fill="white"/>
              </svg>
            </div>
          </button>

          <p className="text-base sm:text-lg mb-8" style={{ color: "#555" }}>
            This 28-min training shows the exact repositioning playbook. Free. No strings.
          </p>

          <button
            type="button"
            onClick={() => {
              trackEvent("cta_click", { cta_label: "Get the Frontend → AI Roadmap", cta_section: "cta_button", quiz_variant: "v7-short-improved", page_path: window.location.pathname });
              openQuiz("cta_button");
            }}
            className="inline-flex items-center justify-center px-12 py-5 text-xl sm:text-2xl font-extrabold text-white rounded-xl transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#2563eb", minWidth: 280 }}
          >
            Get the Frontend → AI Roadmap
          </button>

          <p className="mt-5 text-sm" style={{ color: "#999" }}>
            No credit card. No strings.
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
        contactInfo={contactInfo} isSubmitting={isSubmitting} redirectUrl={redirectUrl}
        onSelectAnswer={selectAnswer} onToggleMultiAnswer={toggleMultiAnswer}
        onContinue={advance}
        onBack={goBack} onClose={closeQuiz}
        onContactChange={handleContactChange} onSubmit={handleSubmit}
      />
    </div>
  );
}

function flattenAnswersForAnalytics(answers: AnswersV2): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(answers)) {
    if (v === undefined) continue;
    out[`q_${k}`] = Array.isArray(v) ? v.join(",") : v;
  }
  return out;
}
