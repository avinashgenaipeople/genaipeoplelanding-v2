import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step =
  | "intro"
  | "q1" | "q2" | "q3" | "q4" | "q5"
  | "lead"
  | "analyzing"
  | "results";

interface Answers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  employment: string;
}

// ─── Quiz data ──────────────────────────────────────────────────────────────────

interface QuizOption { value: string; label: string; }
interface QuizQuestion {
  id: keyof Answers;
  step: Step;
  next: Step;
  num: number;
  text: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1", step: "q1", next: "q2", num: 1,
    text: "How long have you been working as a Java developer professionally?",
    options: [
      { value: "lt3",   label: "Less than 3 years" },
      { value: "3to6",  label: "3–6 years" },
      { value: "7to12", label: "7–12 years" },
      { value: "13plus",label: "13+ years — the grind is real" },
    ],
  },
  {
    id: "q2", step: "q2", next: "q3", num: 2,
    text: "What would a successful career move look like for you in the next 12 months?",
    options: [
      { value: "title",    label: "A Senior AI Architect or ML Engineer title" },
      { value: "salary",   label: "Salary jump into the 30–70L+ range" },
      { value: "projects", label: "Working on AI products that actually ship to real users" },
      { value: "security", label: "Job security as AI reshapes my industry" },
    ],
  },
  {
    id: "q3", step: "q3", next: "q4", num: 3,
    text: "What has been your biggest obstacle when trying to break into AI so far?",
    options: [
      { value: "overload", label: "Too many frameworks & resources — no clear path" },
      { value: "time",     label: "Can't find time while managing a full-time job" },
      { value: "transfer", label: "Not sure my Java / backend skills transfer to AI" },
      { value: "apply",    label: "Tried tutorials but can't apply them to real projects" },
    ],
  },
  {
    id: "q4", step: "q4", next: "q5", num: 4,
    text: "When you really think about it — what's the real reason you haven't made the move yet?",
    options: [
      { value: "confidence", label: "Not confident enough in my AI / ML knowledge yet" },
      { value: "startover",  label: "Afraid I'll have to start over and take a pay cut" },
      { value: "timing",     label: "Waiting for the right moment or opportunity" },
      { value: "worth",      label: "Unsure if the time and investment will pay off" },
    ],
  },
  {
    id: "q5", step: "q5", next: "lead", num: 5,
    text: "If your career looks exactly the same 6 months from now — same role, same salary, same Java stack — how does that feel?",
    options: [
      { value: "fine",       label: "Completely fine — I'm satisfied where I am" },
      { value: "unsettling", label: "A bit unsettling — AI is moving fast" },
      { value: "stressful",  label: "Stressful — I can see my skills becoming less relevant" },
      { value: "urgent",     label: "Urgent — I know I need to act but don't know how" },
    ],
  },
];

const EMPLOYMENT_OPTIONS = [
  "Employed as a Java / Backend Developer",
  "Freelancer / Consultant",
  "Between Jobs",
  "Student / Fresher",
  "Other",
];

const FORM_BASE = "https://share.synamate.com/widget/form/TW7vEwm553MbqKYmfMPP";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getProgress(step: Step): number {
  const map: Record<Step, number> = {
    intro: 0, q1: 10, q2: 28, q3: 46, q4: 64, q5: 82,
    lead: 92, analyzing: 100, results: 100,
  };
  return map[step] ?? 0;
}

function getDiagnosis(answers: Answers) {
  const obstacle = answers.q3 ?? "overload";
  const urgency  = answers.q5  ?? "unsettling";

  const headlineMap: Record<string, string> = {
    overload:  "You're stuck in Information Overload — and it's costing you years.",
    time:      "You're caught in the 'someday' trap — waiting for time that never comes.",
    transfer:  "You're sitting on a hidden advantage most Java devs don't realise they own.",
    apply:     "You have the knowledge — you're missing the bridge from theory to real projects.",
  };

  const bodyMap: Record<string, string> = {
    overload:
      "You said your biggest obstacle is too many resources with no clear path. This is the most common trap for senior Java developers. You're smart enough to know you need to upskill — but every article, course, and YouTube rabbit hole pulls you in a different direction. The result: months of 'learning AI' but no closer to an actual offer. What you need isn't more information. You need a sequenced, mentor-guided system that tells you exactly what to learn and in what order.",
    time:
      "You said you can't find time while managing a full-time job. Here's the truth: you will never have more free time than you do today. The Java devs who successfully made the switch didn't wait — they found a focused 90-day system built around a demanding job. You don't need more hours in the day. You need a path that produces tangible results in the limited hours you already have.",
    transfer:
      "You said you're not sure your Java skills transfer to AI — and this is the biggest misconception holding senior devs back. System design, distributed architecture, production engineering: these are precisely what every serious AI team desperately needs, and most ML engineers never have. You're not starting from zero. You're starting from a position of enormous hidden advantage that you haven't yet been shown how to leverage.",
    apply:
      "You've tried tutorials but can't connect them to real work. This is tutorial hell — endemic in AI education. Most courses teach theory in isolation, never showing you how to integrate an LLM into a production Java service, or how to architect an AI system at enterprise scale. You don't need another 40-hour course. You need a mentor who can show you how a real AI project is scoped, built, and shipped — end to end.",
  };

  const urgencyMap: Record<string, string> = {
    urgent:      "Your sense of urgency is well-founded. The window for senior Java devs to enter AI at a premium salary is open right now — but it won't stay open forever.",
    stressful:   "Your instincts are right. Every month you stay in a pure Java role is a month the AI wave moves further ahead without you.",
    unsettling:  "That uneasy feeling is data. The developers who act on it now will be writing their own ticket in 2026 and beyond.",
    fine:        "Whether or not you're set on making the move, having a clear picture of what's possible for a Java dev like you is worth 28 minutes of your time.",
  };

  return {
    headline: headlineMap[obstacle] ?? headlineMap.overload,
    body:     bodyMap[obstacle]     ?? bodyMap.overload,
    urgency:  urgencyMap[urgency]   ?? urgencyMap.unsettling,
  };
}

function buildFormUrl(lead: LeadData): string {
  const params = new URLSearchParams(window.location.search);
  if (lead.name)  { params.set("name",  lead.name);  params.set("full_name", lead.name); }
  if (lead.email) params.set("email", lead.email);
  if (lead.phone) { params.set("phone", lead.phone); params.set("phone_number", lead.phone); }
  return `${FORM_BASE}?${params.toString()}`;
}

// ─── Dot-stepper ────────────────────────────────────────────────────────────────

function DotStepper({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            n < current  ? "w-6 bg-primary" :
            n === current ? "w-8 bg-primary" :
                            "w-4 bg-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function QuizFlow() {
  const [step, setStep]               = useState<Step>("intro");
  const [answers, setAnswers]         = useState<Answers>({});
  const [selected, setSelected]       = useState<string | null>(null);
  const [lead, setLead]               = useState<LeadData>({ name: "", email: "", phone: "", employment: "" });
  const [errors, setErrors]           = useState<Partial<Record<keyof LeadData, string>>>({});

  const progress    = getProgress(step);
  const showProgress = step !== "intro" && step !== "results";

  // Reset selected highlight on step change
  useEffect(() => { setSelected(null); }, [step]);

  // ── Option click: highlight → wait → advance ─────────────────────────────────
  const handleOption = (qId: keyof Answers, value: string, next: Step) => {
    if (selected) return;
    setSelected(value);
    trackEvent("quiz_question_answered", { question: qId, answer: value, page_path: window.location.pathname });
    setTimeout(() => {
      setAnswers((p) => ({ ...p, [qId]: value }));
      setStep(next);
    }, 320);
  };

  // ── Lead capture submit ───────────────────────────────────────────────────────
  const handleLeadSubmit = () => {
    const e: Partial<Record<keyof LeadData, string>> = {};
    if (!lead.name.trim())                         e.name       = "Name is required";
    if (!lead.email.match(/^\S+@\S+\.\S+$/))       e.email      = "Enter a valid email";
    if (lead.phone.replace(/\D/g, "").length < 10) e.phone      = "Enter a valid phone number";
    if (!lead.employment)                          e.employment = "Please select your status";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep("analyzing");

    trackEvent("lead_form_submit", { form_id: "TW7vEwm553MbqKYmfMPP", form_name: "Quiz Funnel", page_path: window.location.pathname });
    if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { currency: "INR", value: 1 });
    if (typeof window.fbq === "function")  window.fbq("track", "Lead", { content_name: "Quiz Funnel" });

    setTimeout(() => setStep("results"), 2700);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Sumo bar */}
      <div className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center shrink-0">
        <p className="text-sm font-semibold">
          Free Video: How Senior Java Devs Land 30–70L AI Architect Roles in 120 Days
        </p>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-1.5 bg-muted shrink-0 transition-opacity duration-300 ${showProgress ? "opacity-100" : "opacity-0"}`}>
        <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 md:py-16">

        {/* INTRO */}
        {step === "intro" && (
          <div key="intro" className="max-w-2xl w-full text-center space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20">
              ⚡ 2-Minute Career Diagnosis
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Are You on Track to Become an{" "}
              <span className="text-primary">AI Architect?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Answer 5 quick questions and get a personalised diagnosis of what's holding you back — plus the fastest path from Senior Java Dev to AI Architect.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />Takes 2 minutes</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />Personalised to your situation</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />Free roadmap at the end</span>
            </div>
            <button
              onClick={() => { trackEvent("quiz_started", { page_path: window.location.pathname }); setStep("q1"); }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.99]"
            >
              Start My Diagnosis <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-muted-foreground/60">150+ Java developers have already taken this quiz</p>
          </div>
        )}

        {/* QUESTIONS */}
        {QUESTIONS.map((q) => step === q.step && (
          <div key={q.step} className="max-w-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Question header */}
            <div className="flex items-center justify-between mb-7">
              <span className="text-sm font-medium text-muted-foreground">
                Question {q.num} <span className="text-muted-foreground/40">of 5</span>
              </span>
              <DotStepper current={q.num} />
            </div>

            <h2 className="font-display text-xl sm:text-2xl md:text-[1.7rem] font-bold text-foreground leading-snug mb-7">
              {q.text}
            </h2>

            <div className="grid gap-3">
              {q.options.map((opt) => {
                const isSelected = selected === opt.value;
                const isDimmed   = selected !== null && !isSelected;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleOption(q.id, opt.value, q.next)}
                    disabled={selected !== null}
                    className={`
                      w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base
                      transition-all duration-200 flex items-center gap-3.5
                      ${isSelected ? "border-primary bg-primary/10 text-primary scale-[0.992]"
                        : isDimmed  ? "border-border bg-card text-foreground/40 cursor-not-allowed"
                        : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5 hover:translate-x-0.5 cursor-pointer"}
                    `}
                  >
                    {/* Radio dot */}
                    <span className={`
                      w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"}
                    `}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* LEAD CAPTURE */}
        {step === "lead" && (
          <div key="lead" className="max-w-lg w-full animate-in fade-in slide-in-from-right-4 duration-500">

            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 text-sm font-semibold px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> Almost there — one last step
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Where should we send your{" "}
                <span className="text-primary">personalised results?</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                We'll include your diagnosis + the free 28-minute AI Architect Roadmap.
              </p>
            </div>

            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={lead.name}
                  onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors text-base ${errors.name ? "border-destructive" : "border-border focus:border-primary"}`}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={lead.email}
                  onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors text-base ${errors.email ? "border-destructive" : "border-border focus:border-primary"}`}
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={lead.phone}
                  onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors text-base ${errors.phone ? "border-destructive" : "border-border focus:border-primary"}`}
                />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Employment status */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2.5">
                  What is your current employment status?
                </label>
                <div className="grid gap-2">
                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLead((p) => ({ ...p, employment: opt }))}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium
                        transition-all duration-150 flex items-center gap-3
                        ${lead.employment === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"}
                      `}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${lead.employment === opt ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                        {lead.employment === opt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.employment && <p className="text-destructive text-xs mt-1">{errors.employment}</p>}
              </div>

            </div>

            <button
              onClick={handleLeadSubmit}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99]"
            >
              Show Me My Results <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-xs text-center text-muted-foreground/55">No spam. Unsubscribe anytime.</p>
          </div>
        )}

        {/* ANALYZING */}
        {step === "analyzing" && (
          <div key="analyzing" className="max-w-md w-full text-center space-y-7 animate-in fade-in duration-500">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-primary/10 border-t-primary/50 animate-spin [animation-direction:reverse] [animation-duration:1.4s]" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Analysing your profile…</h2>
              <p className="text-muted-foreground mt-2 text-sm">This takes just a moment</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground text-left max-w-xs mx-auto">
              <p className="flex items-center gap-2"><span className="text-primary">▶</span> Mapping your experience level</p>
              <p className="flex items-center gap-2 opacity-75"><span className="text-primary">▶</span> Identifying your specific blockers</p>
              <p className="flex items-center gap-2 opacity-50"><span className="text-primary">▶</span> Building your personalised roadmap</p>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <ResultsPage lead={lead} answers={answers} />
        )}
      </div>

      {/* Minimal footer */}
      {step !== "results" && (
        <div className="text-center py-4 text-xs text-muted-foreground/45 shrink-0">
          © {new Date().getFullYear()} AI Architect Academy · 150+ Java devs already enrolled
        </div>
      )}
    </div>
  );
}

// ─── Results Page ───────────────────────────────────────────────────────────────

function ResultsPage({ lead, answers }: { lead: LeadData; answers: Answers }) {
  const diagnosis  = getDiagnosis(answers);
  const formUrl    = buildFormUrl(lead);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const firstName  = lead.name.split(" ")[0] || "there";

  useEffect(() => {
    const handle = (e: MessageEvent) => {
      let data = e.data;
      if (typeof data === "string") { try { data = JSON.parse(data); } catch { /* ignore */ } }
      const isSubmit =
        (typeof data === "object" && data !== null &&
          (data.type === "form:submit" || data.type === "form_submitted" ||
           data.event === "form_submit" || data.action === "submit")) ||
        (typeof data === "string" && ["form:submit", "form_submitted", "submit"].includes(data));
      if (isSubmit) {
        trackEvent("quiz_synamate_submit", { page_path: window.location.pathname });
      }
    };
    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, []);

  return (
    <div className="max-w-3xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 text-sm font-bold px-4 py-1.5 rounded-full">
          <CheckCircle2 className="w-4 h-4" /> Your diagnosis is ready, {firstName}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-snug">
          Here's what's{" "}
          <span className="text-primary">actually holding you back</span>{" "}
          from your AI Architect role:
        </h2>
      </div>

      {/* Diagnosis card */}
      <div className="bg-card border border-border border-l-4 border-l-primary rounded-2xl p-6 sm:p-8 shadow-md space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
          {diagnosis.headline}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{diagnosis.body}</p>
        <p className="font-semibold text-foreground">{diagnosis.urgency}</p>
      </div>

      {/* Bridge copy */}
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">
          Watch the free 28-minute AI Architect Roadmap — Jerry walks through the exact system that solves this:
        </p>
      </div>

      {/* Synamate form (pre-filled via URL params) */}
      <div className="rounded-2xl border-2 border-primary/20 overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-center">
          <h3 className="text-xl font-bold text-white">Get Instant Access — It's Free</h3>
          <p className="text-sm text-white/90 mt-1">
            28 minutes. See exactly how senior Java devs land 30–70L roles — without starting over.
          </p>
        </div>
        <div className="relative bg-white overflow-y-auto">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3 min-h-48">
              <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading your roadmap…</p>
            </div>
          )}
          <iframe
            src={formUrl}
            className="w-full border-none"
            style={{ height: "944px" }}
            id="inline-TW7vEwm553MbqKYmfMPP"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="LFMVP Optin -Improved"
            data-height="944"
            data-layout-iframe-id="inline-TW7vEwm553MbqKYmfMPP"
            data-form-id="TW7vEwm553MbqKYmfMPP"
            title="LFMVP Optin -Improved"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
        <span>✅ 150+ Java devs already enrolled</span>
        <span>✅ No credit card required</span>
        <span>✅ Instant access</span>
        <span>✅ Free for life</span>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground/45">
        © {new Date().getFullYear()} AI Architect Academy
      </div>
    </div>
  );
}
